import { connectMongo, Leaderboard } from "@/lib/mongo";

export async function GET() {
    try {
        await connectMongo();

        const topPlayers = await Leaderboard.find()
            .sort({ highestPoints: -1 })
            .limit(10)
            .lean();

        return Response.json({ leaderboard: topPlayers });
    } catch (err: any) {
        console.error("❌ leaderboard API crashed:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
