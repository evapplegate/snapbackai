import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { name, sport, audience } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a sports marketing strategist for Snapback Sports, a trivia app growing from 100K to 1M users.

Create a custom influencer outreach package for:
- Influencer Name: ${name}
- Sport/Niche: ${sport}
- Audience Type: ${audience}

Return ONLY raw JSON, no markdown, no code blocks:
{
  "pageTitle": "Custom challenge page title for this influencer",
  "slug": "url-friendly-slug",
  "opportunityScore": 8,
  "fitReason": "2 sentence explanation of why this influencer is a great fit for Snapback",
  "questions": [
    {
      "question": "Personalized trivia question relevant to this influencer",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ],
  "dmDraft": "Personalized DM draft for Snapback to send. Keep it casual, genuine and under 100 words. End with [EDIT BEFORE SENDING]",
  "tweetScript": "A short tweet script the influencer could post after taking the challenge"
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
    console.error("Influencer API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}