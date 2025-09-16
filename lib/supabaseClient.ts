// @lib/supabaseClient.ts

"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ Client-side client for React components (auth UI, lobby, etc.)
export const supabase = createClient(supabaseUrl, supabaseKey);
