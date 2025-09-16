"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GamePage({ params }: any) {
    const { matchId } = params;

    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [user, setUser] = useState<any>(null);
    const [scoreboard, setScoreboard] = useState<any[]>([]);
    const [finished, setFinished] = useState(false);
    const [updating, setUpdating] = useState(false);

    // ✅ Load user
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();
    }, []);

    // ✅ Load questions for this match
    useEffect(() => {
        const loadQuestions = async () => {
            const { data, error } = await supabase
                .from("match_questions")
                .select("*")
                .eq("match_id", matchId)
                .order("created_at", { ascending: true });

            if (!error && data) {
                setQuestions(data);
            }
        };

        loadQuestions();
    }, [matchId]);

    // ✅ Load and subscribe to scoreboard
    useEffect(() => {
        const refreshScoreboard = async () => {
            setUpdating(true);
            const { data, error } = await supabase
                .from("match_players")
                .select("user_id, score")
                .eq("match_id", matchId)
                .order("score", { ascending: false });

            if (!error) {
                setScoreboard((prev) =>
                    data.map((player) => {
                        const prevPlayer = prev.find((p) => p.user_id === player.user_id);
                        return {
                            ...player,
                            prevScore: prevPlayer?.score || 0,
                        };
                    })
                );
            }
            setUpdating(false);
        };

        refreshScoreboard();

        const channel = supabase
            .channel("public:match_players")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "match_players" },
                () => {
                    refreshScoreboard();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [matchId]);

    // ✅ Handle answer submission with instant UI update
    const handleAnswer = async () => {
        if (!user || finished) return;

        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) return;

        // Check locally
        const isCorrect =
            answer.trim().toLowerCase() ===
            currentQuestion.correct_answer.trim().toLowerCase();

        if (isCorrect) {
            // 🔥 Optimistic local update
            setScoreboard((prev) =>
                prev.map((p) =>
                    p.user_id === user.id
                        ? { ...p, score: (p.score || 0) + 1, prevScore: p.score || 0 }
                        : p
                )
            );

            // Push to server in background
            await fetch("/api/submit-answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matchId,
                    questionId: currentQuestion.id,
                    userId: user.id,
                    answer,
                }),
            });
        }

        setAnswer("");

        // ✅ Auto-end after last question
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setFinished(true);

            // Call API to mark match as finished in DB
            await fetch("/api/end-match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId }),
            });
        }
    };

    const currentQuestion = questions[currentIndex];

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🎮 Game {matchId}</h1>

            {/* Game finished */}
            {finished ? (
                <div className=" p-6 rounded-xl text-center">
                    <h2 className="text-xl font-bold mb-2">✅ Game Finished!</h2>
                    <p className="text-gray-700">Final Scoreboard:</p>

                    <ul className="mt-4 shadow rounded-xl divide-y">
                        {scoreboard.map((player, idx) => (
                            <li
                                key={player.user_id}
                                className={`flex justify-between px-4 py-2 ${idx === 0 ? "font-bold text-yellow-500" : ""
                                    }`}
                            >
                                <span>{player.user_id.slice(0, 6)}</span>
                                <span>{player.score} pts</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="shadow rounded-xl p-6 mb-6">
                    {currentQuestion ? (
                        <>
                            <p className="font-semibold text-lg">
                                Q{currentIndex + 1}: {currentQuestion.text}
                            </p>
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="flex-1 border p-2 rounded"
                                    placeholder="Your answer..."
                                />
                                <button
                                    onClick={handleAnswer}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600">⏳ Loading questions...</p>
                    )}
                </div>
            )}

            {/* Scoreboard (live during game) */}
            {!finished && (
                <>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        🏆 Scoreboard
                        {updating && (
                            <span className="text-sm text-gray-400 animate-pulse">
                                (updating…)
                            </span>
                        )}
                    </h2>

                    <ul className="shadow rounded-xl divide-y">
                        {scoreboard.map((player, idx) => (
                            <li
                                key={player.user_id}
                                className={`flex justify-between px-4 py-2 transition-all ${idx === 0 ? "font-bold text-yellow-500" : ""
                                    }`}
                            >
                                <span>{player.user_id.slice(0, 6)}</span>
                                <span>{player.score} pts</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
