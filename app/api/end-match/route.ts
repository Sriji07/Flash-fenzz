import { supabaseServer } from "@/lib/supabase";
import { connectMongo, Leaderboard } from "@/lib/mongo";

export async function POST(req: Request) {
    try {
        const { matchId } = await req.json();
        console.log("🏁 Ending match:", matchId);

        // 1. Get final scores from Supabase
        const { data: players, error: playersError } = await supabaseServer
            .from("match_players")
            .select("user_id, score")
            .eq("match_id", matchId);

        if (playersError || !players) {
            console.error("❌ Error fetching players:", playersError?.message);
            return Response.json(
                { error: "Could not fetch match players" },
                { status: 400 }
            );
        }

        // 2. Update leaderboard in MongoDB
        await connectMongo();

        for (const player of players) {
            await Leaderboard.updateOne(
                { userId: player.user_id },
                {
                    $max: { highestPoints: player.score }, // only update if higher
                    $set: { lastPlayedAt: new Date() },    // add timestamp
                },
                { upsert: true }
            );
        }

        // 3. Mark match as finished in Supabase
        const { error: updateError } = await supabaseServer
            .from("matches")
            .update({ status: "finished" })
            .eq("id", matchId);

        if (updateError) {
            console.error("❌ Error updating match:", updateError.message);
            return Response.json({ error: updateError.message }, { status: 400 });
        }

        // 4. Return final scores + sorted leaderboard
        const leaderboard = await Leaderboard.find()
            .sort({ highestPoints: -1 })
            .limit(10)
            .lean();

        return Response.json({ success: true, players, leaderboard });
    } catch (err: any) {
        console.error("❌ end-match crashed:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
