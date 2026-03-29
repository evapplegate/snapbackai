import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { headline, sport, goal } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a mobile growth strategist for Snapback Sports, a sports trivia app growing from 100K to 1M downloads.

Generate 5 push notification variants for this sports moment:
- Story: ${headline}
- Sport: ${sport}
- Goal: ${goal}

The 5 tones must be exactly: Hype, Trivia Hook, FOMO, Challenge, Personalized

For each notification:
- Write a push notification under 100 characters that drives the goal
- Predict open rate using these verified benchmarks:
  * Sports app average push open rate: 4–7%
  * Personalized/segmented push: 8–12%
  * Curiosity-gap (trivia hook): multiply baseline by 1.2
  * Emoji-led notifications: multiply by 1.17
  * FOMO/social proof: multiply baseline by 1.4
  * Challenge framing: multiply baseline by 1.17
  * Hype tied to breaking moment (within 1hr): multiply by 1.6
- Show the calculation in the reasoning field
- Recommend the best send time based on sports event timing and user behavior data

Also provide an A/B test recommendation and predict the winning tone.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "headline": "string",
  "sport": "string",
  "goal": "string",
  "notifications": [
    {
      "tone": "Hype",
      "message": "Push notification text under 100 characters",
      "predictedOpenRate": "11.2%",
      "bestSendTime": "Specific time and day recommendation",
      "reasoning": "Calculation: [benchmark] × [multipliers] = [result]"
    }
  ],
  "abTestRecommendation": "Which two tones to A/B test, when to send each, and what metric to measure",
  "winnerPrediction": "Which tone will win and why, with predicted open rate"
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
    console.error("Push API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}