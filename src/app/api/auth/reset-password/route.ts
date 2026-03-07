import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/lib/tokens";
import { z } from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = resetPasswordSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: (parseResult as any).error.errors[0].message }, { status: 400 });
        }

        const { token, password } = parseResult.data;

        const existingToken = await getPasswordResetTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        const hasExpired = new Date(existingToken.expires).getTime() < new Date().getTime();

        if (hasExpired) {
            return NextResponse.json({ error: "Token has expired" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: existingToken.email }
        });

        if (!user) {
            return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { password_hash: hashedPassword }
            }),
            prisma.passwordResetToken.delete({
                where: { id: existingToken.id }
            })
        ]);

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}
