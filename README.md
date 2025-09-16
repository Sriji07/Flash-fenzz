# Flashcard Frenzy 🎮



A **multiplayer flashcard quiz game** built with **Next.js 15**, **Supabase (Postgres + Realtime)**, and **MongoDB (Leaderboard)**.

Players can create or join matches, answer questions in real-time, and compete on the leaderboard.



---



## 🚀 Features



- 🔐 Authentication via Supabase Auth

- 🎲 Create & Join Matches

- 🎯 Random 10 questions per match (non-repeating)

- ⚡ Real-time updates with Supabase Realtime

- 🏆 Global Leaderboard stored in MongoDB

- 🗄 Hybrid DB Setup: Supabase (game state) + MongoDB (long-term scores)



---



## 🛠 Tech Stack



- **Frontend:** Next.js 15 (App Router, TailwindCSS)

- **Backend:** Supabase (Postgres, Functions, Realtime)

- **Database:** MongoDB (Leaderboard)

- **Auth:** Supabase Auth

- **Deployment:** Vercel



---



## 🗂 Database Design



### Supabase Tables



#### `matches`

```sql

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

created_by UUID NOT NULL,

status TEXT DEFAULT 'waiting', -- waiting | in_progress | finished

created_at TIMESTAMP DEFAULT now()

match_players

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

match_id UUID REFERENCES matches(id) ON DELETE CASCADE,

user_id UUID NOT NULL,

score INT DEFAULT 0,

UNIQUE (match_id, user_id)

match_questions

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

match_id UUID REFERENCES matches(id) ON DELETE CASCADE,

question_id UUID,

text TEXT NOT NULL,

correct_answer TEXT NOT NULL,

created_at TIMESTAMP DEFAULT now()



MongoDB Collections

Leaderboard

{

userId: string,

highestPoints: number

}
```


⚡ Setup Guide

1. Clone the repo

git clone https://github.com/Sriji07/Flash-fenzz.git

cd Flash-fenzz

2. Install dependencies

npm install

3. Setup environment variables

Create a .env.local file in project root:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

MONGODB_URI=your-mongodb-uri



📊 Database Setup

Seed Questions into MongoDB

One-time seeding script:

npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seedQuestions.ts

Supabase SQL

Run these in Supabase SQL Editor:

-- Matches
```sql

create table matches (

id uuid primary key default gen_random_uuid(),

created_by uuid not null,

status text default 'waiting',

created_at timestamp default now()

);



-- Players

create table match_players (

id uuid primary key default gen_random_uuid(),

match_id uuid references matches(id) on delete cascade,

user_id uuid not null,

score int default 0,

unique (match_id, user_id)

);



-- Questions per match

create table match_questions (

id uuid primary key default gen_random_uuid(),

match_id uuid references matches(id) on delete cascade,

question_id uuid,

text text not null,

correct_answer text not null,

created_at timestamp default now()

);



-- Function for random 10 non-repeating questions

create or replace function random_questions(limit_count int)

returns setof questions as $$

select * from questions order by random() limit limit_count;

$$ language sql;
```


## ▶️ Run Locally

```bash
npm run dev
```

Visit → [http://localhost:3000](http://localhost:3000)


---

## ☁️ Deploy to Vercel

1. Push code to GitHub  
2. Import repo in Vercel  
3. Add Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `MONGODB_URI`, etc.)  
4. Set build command:  

```bash
next build --no-lint
```

5. Deploy 🎉


---

## 🔗 API Endpoints

### Create Match
**POST** `/api/create-match`  
Body:  
```json
{ "userId": "<uuid>" }
```

### Join Match
**POST** `/api/join-match`  
Body:  
```json
{ "matchId": "<uuid>", "userId": "<uuid>" }
```

### Submit Answer
**POST** `/api/submit-answer`  
Body:  
```json
{ "matchId": "<uuid>", "questionId": "<uuid>", "userId": "<uuid>", "answer": "foo" }
```

### End Match
**POST** `/api/end-match`  
Body:  
```json
{ "matchId": "<uuid>" }
```

### Leaderboard
**GET** `/api/leaderboard`  


---

## 📜 License

MIT License © 2025


