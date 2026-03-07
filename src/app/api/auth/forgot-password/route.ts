import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // For security, always return success even if user not found
        if (!user) {
            return NextResponse.json({ message: "If your email is registered, you will receive a reset link shortly." });
        }

        const resetToken = await generatePasswordResetToken(email);

        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken.token}`;

        await resend.emails.send({
            from: "Qawaid AI <onboarding@resend.dev>",
            to: email,
            subject: "Reset your Qawaid AI password",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Reset Your Password</h2>
                    <p>Click the link below to reset your password for Qawaid AI. This link expires in 1 hour.</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        });

        return NextResponse.json({ message: "If your email is registered, you will receive a reset link shortly." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
