"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="bg-emerald-800 dark:bg-emerald-950 text-white shadow-md border-b border-transparent dark:border-emerald-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-wider font-arabic">
                            قواعد AI
                        </Link>
                        {session && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`${pathname === "/dashboard"
                                        ? "border-emerald-300 text-white"
                                        : "border-transparent text-emerald-100 hover:border-emerald-300 hover:text-white"
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/analyze"
                                    className={`${pathname === "/analyze"
                                        ? "border-emerald-300 text-white"
                                        : "border-transparent text-emerald-100 hover:border-emerald-300 hover:text-white"
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Analyze
                                </Link>
                                <Link
                                    href="/quiz"
                                    className={`${pathname === "/quiz"
                                        ? "border-emerald-300 text-white"
                                        : "border-transparent text-emerald-100 hover:border-emerald-300 hover:text-white"
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Kuis
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">{session.user?.name}</span>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="bg-emerald-700 dark:bg-emerald-800 hover:bg-emerald-600 dark:hover:bg-emerald-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    href="/login"
                                    className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
