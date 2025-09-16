import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        console.log("📩 create-match called by user:", userId);

        // 1. Create the match
        const { data: match, error: matchError } = await supabaseServer
            .from("matches")
            .insert([{ created_by: userId, status: "waiting" }])
            .select()
            .single();

        if (matchError || !match) {
            console.error("❌ Error creating match:", matchError?.message);
            return Response.json(
                { error: matchError?.message || "Could not create match" },
                { status: 400 }
            );
        }

        // 2. Insert creator into match_players
        await supabaseServer
            .from("match_players")
            .insert([{ match_id: match.id, user_id: userId, score: 0 }]);

        // 3. Fetch 10 random questions from Supabase function
        const { data: randomQuestions, error: fetchError } = await supabaseServer.rpc(
            "random_questions",
            { limit_count: 10 }
        );

        if (fetchError || !randomQuestions) {
            console.error("❌ Error fetching random questions:", fetchError?.message);
            return Response.json(
                { error: fetchError?.message || "Could not fetch questions" },
                { status: 400 }
            );
        }

        // 4. Insert them into match_questions
        await supabaseServer.from("match_questions").insert(
            randomQuestions.map((q: { id: any; text: any; correct_answer: any; }) => ({
                match_id: match.id,
                question_id: q.id,
                text: q.text,
                correct_answer: q.correct_answer,
            }))
        );

        // 5. Update match status to in_progress
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
