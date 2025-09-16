"use client";

import { useEffect, useState } from "react";

export default function GamePage({ params }: any) {
    const { matchId } = use(params);
    const [match, setMatch] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/review?matchId=${matchId}`);
            const data = await res.json();
            setMatch(data.match);
        };
        fetchData();
    }, [matchId]);

    if (!match) return <p>Loading review...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Match Review: {match.matchId}</h1>

            <h2 className="mt-4 text-xl">Players</h2>
            <ul>
                {match.players.map((p: any, i: number) => (
                    <li key={i}>
                        {p.username}: {p.finalScore}
                    </li>
                ))}
            </ul>

            <h2 className="mt-4 text-xl">Questions</h2>
            <ul>
                {match.questions.map((q: any, i: number) => (
                    <li key={i}>
                        {q.questionText} → {q.correctAnswer} (Answered by: {q.answeredBy})
                    </li>
                ))}
            </ul>
        </div>
    );
}
function use(params: any): { matchId: any; } {
    throw new Error("Function not implemented.");
}

