import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { sports, contentStyle, upcomingEvents } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8096,
      messages: [
        {
          role: "user",
          content: `You are a social media strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Generate a 30-day social media content calendar for next month.
Sports focus: ${sports}
Content style: ${contentStyle}
Upcoming events to build around: ${upcomingEvents}

Rules:
- Rotate platforms across the month: X, Instagram, TikTok, Reddit
- Each day gets exactly 1 post on 1 platform
- Tie content to real sports moments and the upcoming events listed
- Every post should drive toward app downloads or engagement
- Keep captions under 200 characters
- Keep hashtags arrays to exactly 3 items
- Keep format and cta fields under 15 words each

Return ONLY raw JSON, no markdown, no code blocks:
{
  "month": "Month Year",
  "strategy": "2-3 sentence overview of the monthly content strategy",
  "posts": [
    {
      "day": 1,
      "platform": "Reddit",
      "contentType": "Community Post",
      "sportsFocus": "NBA",
      "caption": "Post caption here",
      "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
      "postTime": "12:00 PM EST",
      "format": "Text post with link in comments",
      "cta": "Drop your score below"
    }
  ]
}

Generate exactly 30 posts, one per day (day 1 through day 30).`
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
    console.error("Calendar API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}