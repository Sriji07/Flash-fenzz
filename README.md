# Flashcard Frenzy 🎮

A **multiplayer flashcard quiz game** built with **Next.js 15**, **Supabase (Postgres + Realtime)**, and **MongoDB (long-term leaderboard storage)**.  
Players can create or join matches, answer questions in real-time, and compete on the global leaderboard.

---

## 🚀 Features

- **Authentication** – via Supabase Auth.
- **Match System**
  - Create a new match.
  - Join existing matches via match ID.
  - Each match gets **10 random questions** (non-repeating).
- **Game Flow**
  - Players answer questions in real-time.
  - Scores update instantly via **Supabase Realtime**.
  - Match automatically ends after 10 questions.
- **Leaderboard**
  - Top 10 global players stored in **MongoDB** (highest score retained).
- **Dual Database Setup**
  - Supabase → Match lifecycle, questions, real-time sync.
  - MongoDB → Persistent leaderboard (userId + highest points).

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router, Client/Server Components, Turbopack) + TailwindCSS  
- **Backend:** Supabase (Postgres, Functions, Realtime) + MongoDB (via Mongoose)  
- **Deployment:** Vercel  
- **Auth:** Supabase Auth  

---

## 🗂 Database Design

### Supabase (Realtime Game State)

- **matches**
  ```sql
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  status TEXT DEFAULT 'waiting', -- waiting | in_progress | finished
  created_at TIMESTAMP DEFAULT now()
