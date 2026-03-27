import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { username, sport, gamesPlayed, bestScore, streak, winRate } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a sports personality analyst for Snapback Sports.
Generate a personalized sports knowledge profile based on these stats:
- Username: ${username}
- Favorite Sport: ${sport}
- Games Played: ${gamesPlayed}
- Best Score: ${bestScore}%
- Longest Streak: ${streak} days
- Win Rate: ${winRate}%

Return ONLY raw JSON, no markdown, no code blocks:
{
  "title": "Creative sports knowledge title e.g. NBA Historian",
  "description": "2 sentence personalized description of their sports knowledge",
  "strength": "Their biggest strength as a sports fan",
  "weakness": "A fun weakness to work on",
  "percentile": 85,
  "trashTalk": "A fun competitive trash talk line for sharing"
}`
        }
      ]
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Not text" }, { status: 500 });
    }

    const text = content.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "No JSON found" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);

  } catch (err) {
    console.error("Wrapped API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}