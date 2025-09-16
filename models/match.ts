import mongoose, { Schema } from "mongoose";

const MatchSchema = new Schema({
    matchId: { type: String, required: true },
    players: [
        {
            userId: String,
            username: String,
            finalScore: Number,
        },
    ],
    questions: [
        {
            qId: String,
            questionText: String,
            correctAnswer: String,
            answeredBy: String,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite in dev
export default mongoose.models.Match || mongoose.model("Match", MatchSchema);
