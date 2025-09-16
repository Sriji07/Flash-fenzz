import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { matchId, questionId, userId, answer } = await req.json();

        // 1. Get the question from Supabase
        const { data: question, error: qError } = await supabaseServer
            .from("match_questions")
            .select("id, correct_answer")
            .eq("id", questionId)
            .single();

        if (qError || !question) {
            return Response.json(
                { error: qError?.message || "Question not found" },
                { status: 404 }
            );
        }

        // 2. Check if answer is correct
        const isCorrect =
            question.correct_answer.trim().toLowerCase() ===
            answer.trim().toLowerCase();

        if (!isCorrect) {
            return Response.json({ correct: false });
        }

        // 3. Fetch current score of this player
        const { data: player, error: pError } = await supabaseServer
            .from("match_players")
            .select("score")
            .eq("match_id", matchId)
            .eq("user_id", userId)
            .single();

        if (pError || !player) {
            return Response.json(
                { error: pError?.message || "Player not found" },
                { status: 404 }
            );
        }

        const newScore = (player.score || 0) + 1;

        // 4. Update score
        const { error: uError } = await supabaseServer
            .from("match_players")
            .update({ score: newScore })
            .eq("match_id", matchId)
            .eq("user_id", userId);

        if (uError) {
            return Response.json({ error: uError.message }, { status: 400 });
        }

        return Response.json({ correct: true, newScore });
    } catch (err: any) {
        console.error("❌ submit-answer crashed:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
