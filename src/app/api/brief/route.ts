import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

async function fetchESPNNews() {
  const urls = [
    "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news",
    "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news",
    "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news",
  ];

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        return data.articles?.slice(0, 2).map((a: {headline: string, description: string}) => ({
          headline: a.headline,
          description: a.description,
        })) || [];
      } catch {
        return [];
      }
    })
  );

  return results.flat();
}

export async function GET() {
  try {
    const articles = await fetchESPNNews();

    const newsContext = articles
      .map((a, i) => `${i + 1}. ${a.headline}: ${a.description}`)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a sports intelligence analyst for Snapback Sports, a trivia app growing from 100K to 1M users.

Here are today's real sports headlines:
${newsContext}

Generate a morning briefing with the 3 most interesting stories from this list.
For each story identify audience segments and trivia angles.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "date": "Today",
  "stories": [
    {
      "headline": "string",
      "summary": "2 sentence summary",
      "sport": "NBA",
      "urgency": "high",
      "audienceSegments": ["segment 1", "segment 2", "segment 3"],
      "triviaAngles": ["angle 1", "angle 2", "angle 3"]
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