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
          content: `Search the web for the 5 most trending sports news stories from today or the last 24 hours.
For each story generate a relevance score, trivia angles, and a suggested action for Snapback Sports.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "trends": [
    {
      "sport": "NBA",
      "headline": "Short headline here",
      "relevanceScore": 9,
      "triviaAngles": ["angle 1", "angle 2", "angle 3"],
      "suggestedAction": "Brief suggestion for Snapback team"
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
    console.error("Pulse API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}