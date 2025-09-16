// app/api/next-question/route.ts
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { matchId, text, correctAnswer } = await req.json();

        // Insert into match_questions (not questions!)
        const { data, error } = await supabaseServer
            .from("match_questions")
            .insert([
                {
                    match_id: matchId,
                    text,
                    correct_answer: correctAnswer,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("❌ Supabase error (match_questions):", error.message);
            return Response.json({ error: error.message }, { status: 400 });
        }

        // Realtime will auto-broadcast this INSERT to all subscribers
        return Response.json({ question: data });
    } catch (err: any) {
        console.error("❌ next-question API crashed:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
