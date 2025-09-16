"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<any[]>([]);


    useEffect(() => {
        fetch("/api/leaderboard")
            .then((res) => res.json())
            .then((data) => setLeaders(data.leaderboard || []));
    }, []);



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>

            {leaders.length === 0 ? (
                <p className="text-gray-600">No scores yet. Play a match!</p>
            ) : (
                <ol className="space-y-2">
                    {leaders.map((player, i) => (
                        <li
                            key={player.userId}
                            className="flex justify-between border-b pb-2"
                        >
                            <span>
                                {i + 1}. {player.userId}
                            </span>
                            <span className="font-semibold">{player.highestPoints} pts</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
