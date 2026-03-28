import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { currentDownloads, targetDownloads, timeframe, focusAreas } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8096,
      messages: [
        {
          role: "user",
          content: `You are a growth strategist for Snapback Sports, a sports trivia app.

Current downloads: ${currentDownloads}
Target downloads: ${targetDownloads}
Timeframe: ${timeframe} days. Generate exactly 4 weeks maximum regardless of timeframe. Keep each week concise — max 3 actions per week.
Focus areas: ${focusAreas.join(", ")}

Generate a detailed week-by-week growth campaign plan to hit the target.
Be specific about which Snapback Intelligence tools to use each week.
Available tools: Snapback Pulse, Daily Brief, Game Studio, Influencer Kit, Feature Lab, Snapback Wrapped.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "campaignName": "Campaign name",
  "summary": "2 sentence overview of the strategy",
  "projectedGrowth": 250000,
  "weeks": [
    {
      "week": 1,
      "theme": "Week theme",
      "goals": ["goal 1", "goal 2"],
      "actions": [
        {
          "tool": "Snapback Pulse",
          "action": "Specific action to take",
          "expectedImpact": "What this achieves"
        }
      ],
      "kpi": "Key metric to track this week",
      "projectedNewDownloads": 5000
    }
  ],
  "totalProjectedDownloads": 250000,
  "keyInsight": "One sentence strategic insight"
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
    console.error("Campaign API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}