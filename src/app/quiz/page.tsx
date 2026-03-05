import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuizClient from "@/components/quiz/QuizClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Kuis – Qawaid AI",
    description: "Uji pemahamanmu tentang Nahwu dan Sharaf dengan soal pilihan ganda yang dibuat oleh AI.",
};

export default async function QuizPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/login");
    }

    return (
        <main>
            <QuizClient />
        </main>
    );
}
