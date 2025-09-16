"use client";

import { supabase } from "@/lib/supabaseClient";  // ✅ use client
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
    };

    return (
        <>
            {/* Global Header */}
            <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Flashcard Frenzy 🎴</h1>
                <nav className="flex gap-4 items-center">
                    <Link href="/" className="hover:underline">Home</Link>
                    <Link href="/lobby" className="hover:underline">Lobby</Link>
                    <Link href="/leaderboard" className="hover:underline">
                        Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <span className="text-sm">Hi, {user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </header>

            <main className="p-6">{children}</main>
        </>
    );
}
