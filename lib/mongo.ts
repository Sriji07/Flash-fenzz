import mongoose, { Schema, models, model } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
let isConnected = false;

export const connectMongo = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
};

// --- Question Bank (all flashcards) ---
const questionSchema = new Schema({
    text: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    category: { type: String, default: "General" },
});
export const Question = models.Question || model("Question", questionSchema);

// --- Leaderboard (userId + highest score) ---
const leaderboardSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    highestPoints: { type: Number, default: 0 },
});
export const Leaderboard =
    models.Leaderboard || model("Leaderboard", leaderboardSchema);
