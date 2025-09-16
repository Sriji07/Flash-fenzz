"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";  // ✅ use client

export default function HomePage() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const checkSupabase = async () => {
      const { data, error } = await supabase.from("matches").select("*").limit(1);
      if (error) {
        console.error(error);
        setStatus("❌ Supabase connection failed: " + error.message);
      } else {
        console.log("Supabase data:", data);
        setStatus("✅ Supabase connected successfully!");
      }
    };
    checkSupabase();

  }, []);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Flashcard Frenzy 🎴</h1>
      <p className="text-gray-600 text-lg text-center max-w-md">
        Compete with friends in real-time flashcard battles. First correct
        answer wins the point, and scores update instantly.
      </p>

      <button
        onClick={() => router.push("/lobby")}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Enter Lobby
      </button>
    </div>
  );
}
