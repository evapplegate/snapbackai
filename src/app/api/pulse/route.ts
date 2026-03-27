import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function GET() {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a sports trend analyst for Snapback Sports.
You MUST return ONLY raw JSON with no markdown, no code blocks, no backticks.
Generate 5 trending sports topics right now.
Raw JSON only:
{
  "trends": [
    {
      "sport": "NBA",
      "headline": "Short headline here",
      "relevanceScore": 9,
      "triviaAngles": ["angle 1", "angle 2", "angle 3"],
      "suggestedAction": "Brief suggestion"
    }
  ]
}`
        }
      ]
    });

    const content = message.content[0];
    console.log("Claude response:", JSON.stringify(content));

    if (content.type !== "text") {
      return NextResponse.json({ error: "Not text" }, { status: 500 });
    }

    const text = content.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in:", text);
      return NextResponse.json({ error: "No JSON" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}