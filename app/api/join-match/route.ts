import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { matchId, userId } = await req.json();
        console.log("👥 join-match:", matchId, "user:", userId);

        // First check if the user is already in the match
        const { data: existingPlayer } = await supabaseServer
            .from("match_players")
            .select("*")
            .eq("match_id", matchId)
            .eq("user_id", userId)
            .maybeSingle();

        if (existingPlayer) {
            // Already joined, just return
            return Response.json({ player: existingPlayer });
        }

        // Otherwise insert
        const { data: player, error } = await supabaseServer
            .from("match_players")
            .insert([{ match_id: matchId, user_id: userId, score: 0 }])
            .select()
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json({ player });
    } catch (err: any) {
        console.error("❌ join-match crashed:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
