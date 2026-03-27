import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function GET() {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a sports intelligence analyst for Snapback Sports, a trivia app growing from 100K to 1M users.

Generate a morning sports briefing with 3 big sports stories relevant right now.
For each story identify the audience segments who would care most and trivia angles.

Return ONLY raw JSON, no markdown, no code blocks, no backticks:
{
  "date": "Today",
  "stories": [
    {
      "headline": "string",
      "summary": "2-3 sentence summary of the story",
      "sport": "NBA",
      "urgency": "high",
      "audienceSegments": ["NBA fans", "Fantasy players"],
      "triviaAngles": ["angle 1", "angle 2"]
    }
  ]
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
    console.error("Brief API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}