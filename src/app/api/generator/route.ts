import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { topic, difficulty, count } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a trivia game designer for Snapback Sports, a sports trivia app.
Generate a complete trivia game about: ${topic}
Difficulty: ${difficulty}
Number of questions: ${count}

Return ONLY raw JSON, no markdown, no code blocks, no backticks:
{
  "title": "Game title here",
  "description": "One sentence description",
  "emoji": "🏀",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "fact": "Interesting fact about the answer"
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
    console.error("Generator API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}