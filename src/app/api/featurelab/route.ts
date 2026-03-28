import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { type, input } = await request.json();

    let prompt = "";

    if (type === "generate") {
      prompt = `You are a product strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

The team has this growth goal: "${input}"

Generate 5 creative, specific feature ideas that would help achieve this goal.
Each idea should be realistic to build and directly drive app growth.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "features": [
    {
      "name": "Feature name",
      "description": "2 sentence description of what it does",
      "growthMechanism": "Exactly how this drives downloads or retention",
      "priority": "high",
      "effort": "low",
      "estimatedImpact": "e.g. +15% DAU",
      "category": "retention"
    }
  ]
}`;
    } else if (type === "validate") {
      prompt = `You are a product strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Evaluate this feature idea: "${input}"

Analyze it honestly against growth metrics for a sports trivia app.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "verdict": "build",
  "confidence": 85,
  "summary": "2 sentence verdict summary",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "suggestion": "One specific suggestion to make this feature stronger",
  "growthScore": 8,
  "retentionScore": 7,
  "viralScore": 6
}`;
    } else if (type === "showcase") {
      prompt = `You are a product strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Generate a list of 6 ready-to-build feature concepts that would have the highest impact on growth.
Think creatively — these should be specific to a sports trivia app and genuinely innovative.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "features": [
    {
      "name": "Feature name",
      "tagline": "One punchy line",
      "description": "2 sentence description",
      "growthMechanism": "How it drives downloads",
      "estimatedImpact": "e.g. +20% new users",
      "category": "viral",
      "buildTime": "2 days"
    }
  ]
}`;
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
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
    console.error("Feature Lab API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}