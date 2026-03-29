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

CRITICAL — ALL projected download numbers must be calculated using these verified industry benchmarks. Never fabricate growth numbers. Every projection must cite the benchmark it is based on:

INFLUENCER BENCHMARKS:
- Micro-influencer post (10K–100K followers): 1–2% conversion to app install from link in bio
- Mid-tier influencer post (100K–1M followers): 0.8–1.5% conversion, 3–5% engagement rate
- One mid-tier post at 200K reach = est. 1,600–3,000 new downloads
- Influencer story swipe-up CTR: 1–3%

VIRAL / SHARING BENCHMARKS:
- Shareable card mechanic (e.g. Wrapped): 2–5% of active users share organically
- Each share reaches avg 150–300 followers; 1–3% of viewers convert to download
- Net viral coefficient from share mechanic: 0.03–0.15 new downloads per active user
- Wordle-style personal challenge link: 15–25% of recipients install the app

PUSH NOTIFICATION BENCHMARKS:
- Sports app average push open rate: 4–7%
- Personalized push open rate: 8–12%
- Push-to-session conversion: 60–75% of opens start a session

RETENTION BENCHMARKS:
- Industry average D7 retention for casual games: 20–30%
- Streak mechanic improves D7 retention by 15–25 percentage points (Duolingo data)
- D30 retention improvement from daily habit loop: 10–20 percentage points

APP STORE OPTIMIZATION BENCHMARKS:
- ASO keyword optimization: 10–20% increase in organic search installs
- Screenshot/icon A/B test: 5–15% improvement in conversion from store page visit to install

COMMUNITY / REDDIT BENCHMARKS:
- Well-targeted r/fantasyfootball or r/nba post: 500–5,000 clicks if it hits front page
- Conversion from Reddit click to install: 3–8%

Use these benchmarks to calculate projectedNewDownloads for each week and totalProjectedDownloads.
Show your math in the expectedImpact field — e.g. "5 mid-tier posts × 200K avg reach × 1.2% conversion = ~12,000 new downloads"

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
          "expectedImpact": "Calculation: [benchmark used] × [inputs] = [projected result]"
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