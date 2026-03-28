import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  // Return cached result if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return Response.json(cache.data);
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 2048,
          stream: true,
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
            } as never
          ],
          messages: [
            {
              role: "user",
              content: `Search the web for the 5 most trending sports news stories from today or the last 24 hours.
Use these exact sport names only: NBA, NFL, MLB, NHL, Soccer, College Basketball, Golf, Tennis, MMA, WNBA.
For each story generate a relevance score, trivia angles, and a suggested action for Snapback Sports.

Return ONLY raw JSON, no markdown, no code blocks:
{
  "trends": [
    {
      "sport": "NBA",
      "headline": "Short headline here",
      "relevanceScore": 9,
      "triviaAngles": ["angle 1", "angle 2", "angle 3"],
      "suggestedAction": "Brief suggestion for Snapback team"
    }
  ]
}`
            }
          ]
        });

        let fullText = "";

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`)
            );
          }
        }

        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          cache = { data: parsed, timestamp: Date.now() };
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, full: fullText })}\n\n`)
        );
        controller.close();

      } catch (err) {
        console.error("Pulse streaming error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
        );
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}