// ❌ Wrong (only works inside Next.js build)
// import { connectMongo, Question } from "@/lib/mongo";

// ✅ Correct (works with ts-node too)
import { connectMongo, Question } from "../lib/mongo";

async function seed() {
    await connectMongo();

    const questions = [
        { text: "What is 2 + 2?", correctAnswer: "4", category: "Math" },
        { text: "Capital of France?", correctAnswer: "Paris", category: "Geography" },
        { text: "Who wrote Hamlet?", correctAnswer: "Shakespeare", category: "Literature" },
        { text: "Speed of light in m/s?", correctAnswer: "299792458", category: "Science" },
        { text: "What planet is known as the Red Planet?", correctAnswer: "Mars", category: "Science" },
        { text: "Largest mammal?", correctAnswer: "Blue Whale", category: "Biology" },
        { text: "What is 10 * 10?", correctAnswer: "100", category: "Math" },
        { text: "Chemical symbol for water?", correctAnswer: "H2O", category: "Chemistry" },
        { text: "Fastest land animal?", correctAnswer: "Cheetah", category: "Biology" },
        { text: "Square root of 64?", correctAnswer: "8", category: "Math" },
    ];

    await Question.insertMany(questions);
    console.log("✅ 10 questions inserted into MongoDB");
    process.exit(0);
}

seed();
