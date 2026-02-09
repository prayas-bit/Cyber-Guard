import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to get authenticated user from Request
async function getUser(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

app.get("/make-server-05209d75/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign Up Route
app.post("/make-server-05209d75/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase credentials in environment");
        return c.json({ error: "Server misconfiguration: Missing credentials" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name || email.split('@')[0] },
      email_confirm: true
    });

    if (error) {
      console.error("Supabase Auth Error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (err) {
    console.error("Unexpected error in signup:", err);
    return c.json({ error: err.message || "Internal Server Error" }, 500);
  }
});

// Get User Progress
app.get("/make-server-05209d75/progress", async (c) => {
  try {
    const user = await getUser(c.req);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const progress = await kv.get(`progress:${user.id}`) || {};
    return c.json(progress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    return c.json({ error: "Failed to fetch progress" }, 500);
  }
});

// Update Progress & Leaderboard
app.post("/make-server-05209d75/progress", async (c) => {
  try {
    const user = await getUser(c.req);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { moduleId, score } = await c.req.json();
    
    // 1. Update User Progress
    const progressKey = `progress:${user.id}`;
    const currentProgress: any = await kv.get(progressKey) || {};
    
    // Update if score is better or didn't exist
    if (!currentProgress[moduleId] || score > currentProgress[moduleId]) {
      currentProgress[moduleId] = score;
      await kv.set(progressKey, currentProgress);

      // 2. Update Leaderboard
      const totalScore = Object.values(currentProgress).reduce((a: any, b: any) => a + b, 0);
      const userName = user.user_metadata?.name || "Anonymous";
      
      const leaderboardKey = "leaderboard";
      let leaderboard: any[] = (await kv.get(leaderboardKey) as any[]) || [];
      
      // Remove existing entry for this user
      leaderboard = leaderboard.filter(entry => entry.userId !== user.id);
      
      // Add new entry
      leaderboard.push({
        userId: user.id,
        name: userName,
        totalScore: totalScore,
        lastUpdated: new Date().toISOString()
      });
      
      // Sort and limit
      leaderboard.sort((a, b) => b.totalScore - a.totalScore);
      leaderboard = leaderboard.slice(0, 50); // Top 50
      
      await kv.set(leaderboardKey, leaderboard);
    }

    return c.json({ success: true, progress: currentProgress });
  } catch (err) {
    console.error("Error updating progress:", err);
    return c.json({ error: "Failed to update progress" }, 500);
  }
});

// Get Leaderboard
app.get("/make-server-05209d75/leaderboard", async (c) => {
  try {
    const leaderboard = await kv.get("leaderboard") || [];
    return c.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

Deno.serve(app.fetch);
