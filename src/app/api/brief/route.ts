import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function GET() {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        } as never
      ],
      messages: [
        {
          role: "user",
          content: `Search the web for the 3 biggest sports news stories from today or the last 24 hours.
For each story generate a summary, audience segments, and trivia angles for Snapback Sports.

Return ONLY raw JSON, no markdown, no code blocks:
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

    const textBlock = message.content.find(block => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No text response" }, { status: 500 });
    }

    const text = textBlock.text.trim();
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