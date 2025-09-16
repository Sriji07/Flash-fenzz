"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LobbyPage() {
    const [matchId, setMatchId] = useState("");
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // ✅ Auth listener → updates user in real time
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleCreateMatch = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        const res = await fetch("/api/create-match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
        });

        const data = await res.json();
        if (data.match?.id) {
            router.push(`/game/${data.match.id}`);
        } else if (data.error) {
            alert("Error: " + data.error);
        }
    };

    const handleJoinMatch = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        console.log("User ID sending:", user.id);

        const res = await fetch("/api/join-match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matchId, userId: user.id }),
        });

        const data = await res.json();
        if (data.player) {
            router.push(`/game/${matchId}`);
        } else if (data.error) {
            alert("Error: " + data.error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-10">
            <h1 className="text-3xl font-bold">Game Lobby 🎮</h1>

            {user ? (
                <>
                    <p className="text-gray-700">Logged in as: {user.email}</p>

                    <button
                        onClick={handleCreateMatch}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Create Match
                    </button>

                    <div className="flex gap-2">
                        <input
                            className="border p-2 rounded"
                            placeholder="Enter Match ID"
                            value={matchId}
                            onChange={(e) => setMatchId(e.target.value)}
                        />
                        <button
                            onClick={handleJoinMatch}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Join
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-600">Please log in to join or create matches.</p>
            )}
        </div>
    );
}
