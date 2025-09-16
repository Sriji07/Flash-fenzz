"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";  // ✅ use client
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // ✅ Sign up new user
    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert("Signup error: " + error.message);
        } else {
            alert("Check your email for verification link!");
        }
    };

    // ✅ Sign in existing user
    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert("Login error: " + error.message);
        } else {
            router.push("/lobby");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Login / Sign Up</h1>

            <input
                type="email"
                className="border p-2 rounded w-64"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="border p-2 rounded w-64"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded w-64"
            >
                Login
            </button>

            <button
                onClick={handleSignup}
                className="px-4 py-2 bg-green-600 text-white rounded w-64"
            >
                Sign Up
            </button>
        </div>
    );
}
