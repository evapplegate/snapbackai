import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { sport, audienceSize, platform, contentStyle } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are an influencer marketing strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Find 8 real sports influencers or media accounts that match these criteria:
- Sport/niche: ${sport}
- Audience size: ${audienceSize}
- Platform preference: ${platform}
- Content style fit: ${contentStyle}

Focus on mid-tier and micro influencers (5K–1M followers) who have high engagement rates and audiences that would genuinely enjoy a sports trivia challenge. Include a mix of individual creators and media accounts.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "topPick": "One sentence identifying the single best creator and why",
  "creators": [
    {
      "name": "Creator or account name",
      "platform": "Primary platform(s)",
      "followers": "Follower count estimate",
      "engagementRate": "Estimated engagement rate e.g. 4.2%",
      "sport": "Their sport focus",
      "demographics": "Audience demographics — age, gender, interests",
      "whyTheyFit": "2 sentences explaining why this creator is ideal for Snapback",
      "contentStyle": "How they create content"
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
    console.error("Influencer Search API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}