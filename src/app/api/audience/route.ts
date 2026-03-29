import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    let prompt = "";

    if (type === "analyze") {
      prompt = `You are an audience analytics strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

The team describes their engagement: "${body.input}"

Analyze this and return a structured intelligence report.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "topPerformers": [
    {
      "sport": "NBA",
      "status": "strong",
      "explanation": "2-3 sentences explaining why this is performing well with specific observations",
      "recommendation": "Specific action to double down on this strength"
    }
  ],
  "underperformers": [
    {
      "sport": "MLB",
      "status": "weak",
      "explanation": "2-3 sentences explaining the underperformance with a hypothesis for why",
      "recommendation": "Specific action to fix this"
    }
  ],
  "contentGaps": [
    "Specific sport or content type that is missing and why it matters — with audience size context"
  ],
  "priorityList": [
    "1. Most important action with brief reason",
    "2. Second priority",
    "3. Third priority",
    "4. Fourth priority",
    "5. Fifth priority"
  ]
}`;

    } else if (type === "communities") {
      prompt = `You are an audience growth strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Find the best online communities for:
- Sport focus: ${body.sport}
- Target audience: ${body.demographics}
- Content style: ${body.contentStyle}

Return 8 specific, real online communities with detailed guidance for each.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "topOpportunity": "One sentence identifying the single best community and why",
  "communities": [
    {
      "name": "r/nba",
      "platform": "Reddit",
      "size": "7.2M members",
      "engagementLevel": "high",
      "fitScore": 9,
      "sportsFocus": "NBA",
      "demographics": "18-34 male, stats-obsessed",
      "recommendedApproach": "Specific tactical advice for how to show up in this community authentically",
      "allowsPromo": false
    }
  ]
}`;

    } else if (type === "opportunity") {
      // Summarize inputs to keep prompt tight and avoid JSON truncation
      const topSports = body.analysis?.topPerformers?.map((s: {sport: string}) => s.sport).join(", ") || "";
      const weakSports = body.analysis?.underperformers?.map((s: {sport: string}) => s.sport).join(", ") || "";
      const gaps = body.analysis?.contentGaps?.slice(0, 2).join("; ") || "";
      const topCommunities = body.communities?.communities?.slice(0, 4).map((c: {name: string, size: string}) => `${c.name} (${c.size})`).join(", ") || "";

      prompt = `You are an audience growth strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Engagement summary: Top sports: ${topSports}. Underperforming: ${weakSports}. Key gaps: ${gaps}.
Top communities identified: ${topCommunities}.

Generate a focused Opportunity Map. Be concise — max 20 words per field.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "headline": "One sentence summarizing the biggest insight",
  "gaps": [
    {
      "sport": "NBA",
      "internalGap": "One sentence — what's underperforming internally",
      "externalOpportunity": "One sentence — what's available externally",
      "community": "One sentence — specific action connecting gap to community"
    }
  ],
  "actionList": [
    {
      "action": "One specific action to take this week",
      "expectedReach": "e.g. 5 posts × 200K reach × 1.2% = ~12,000 downloads",
      "priority": "high"
    }
  ],
  "weeklyTarget": "One sentence — what executing these actions should produce"
}

Generate exactly 3 gaps and exactly 4 actions. Keep every field under 30 words.`;
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
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
    console.error("Audience API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}