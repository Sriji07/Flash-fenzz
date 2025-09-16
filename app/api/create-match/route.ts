import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        console.log("📩 create-match called by user:", userId);

        // 1. Create match
        const { data: match, error: matchError } = await supabaseServer
            .from("matches")
            .insert([{ created_by: userId, status: "waiting" }])
            .select()
            .single();

        if (matchError || !match) {
            return Response.json(
                { error: matchError?.message || "Could not create match" },
                { status: 400 }
            );
        }

        // 2. Auto-add creator to match_players
        await supabaseServer
            .from("match_players")
            .insert([{ match_id: match.id, user_id: userId, score: 0 }]);

        // 3. Pick 10 random questions from your Supabase `questions` table
        const { data: randomQuestions, error: fetchError } = await supabaseServer
            .from("questions")
            .select("*")
            .order("RANDOM()") // Postgres way
            .limit(10);

        if (fetchError || !randomQuestions) {
            return Response.json(
                { error: fetchError?.message || "No questions found" },
                { status: 400 }
            );
        }

        // 4. Insert them into match_questions
        await supabaseServer.from("match_questions").insert(
            randomQuestions.map((q) => ({
                match_id: match.id,
                question_id: q.id,
                text: q.text,
                correct_answer: q.correct_answer,
            }))
        );

        // 5. Mark match as ready
        await supabaseServer
            .from("matches")
            .update({ status: "in_progress" })
            .eq("id", match.id);

        return Response.json({ match });
    } catch (err: any) {
        console.error("❌ create-match API crashed:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
