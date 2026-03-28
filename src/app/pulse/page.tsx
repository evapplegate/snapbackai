"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button"

interface Trend {
  sport: string;
  headline: string;
  relevanceScore: number;
  triviaAngles: string[];
  suggestedAction: string;
}

export default function PulsePage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Trend | null>(null);
  const [streamText, setStreamText] = useState("");

  const fetchTrends = async () => {
  setLoading(true);
  setSelected(null);
  setTrends([]);

  try {
    const res = await fetch("/api/pulse");
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      setTrends(data.trends || []);
      setLoading(false);
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n").filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const json = JSON.parse(line.replace("data: ", ""));

          if (json.chunk) {
            fullText += json.chunk;
          }

          if (json.done) {
            const match = fullText.match(/\{[\s\S]*\}/);
            if (match) {
              const data = JSON.parse(match[0]);
              setTrends(data.trends || []);
            }
            setLoading(false);
          }
        } catch {
          continue;
        }
      }
    }
  } catch (e) {
    console.error(e);
    setLoading(false);
  }
}; 

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Snapback Pulse</h1>
            <p className="text-zinc-400 mt-1">
              Real-time sports trend intelligence for your team
            </p>
          </div>
          <button
            onClick={fetchTrends}
            disabled={loading}
            className="bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Scanning trends..." : "⚡ Scan Trends Now"}
          </button>
        </div>

        {loading && (
        <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse"/>
            Scanning live sports data...
            </div>
            {[1,2,3,4,5].map((i) => (
            <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-16 rounded bg-[#F5C518]/20 animate-pulse"/>
                    <div className="h-4 rounded bg-zinc-800 animate-pulse" 
                    style={{width: `${180 + i * 30}px`}}/>
                </div>
                <div className="h-4 w-10 rounded bg-zinc-800 animate-pulse"/>
                </div>
            </div>
            ))}
        </div>
        )}

        {!loading && trends.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Hit "Scan Trends Now" to see what's trending in sports right now
          </div>
        )}

        <div className="grid gap-4">
          {trends.map((trend, i) => (
            <div
              key={i}
              onClick={() => setSelected(selected?.headline === trend.headline ? null : trend)}
              className="bg-[#161616] border border-[#262626] hover:border-[#F5C518] rounded-xl p-6 cursor-pointer transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded">
                    {trend.sport}
                  </span>
                  <h3 className="font-semibold text-white">{trend.headline}</h3>
                </div>
                <div className="text-[#F5C518] font-bold text-sm">
                  {trend.relevanceScore}/10
                </div>
              </div>

              {selected?.headline === trend.headline && (
                <div className="mt-4 border-t border-[#262626] pt-4">
                  <p className="text-sm text-zinc-400 mb-3">
                    <span className="text-white font-medium">Trivia angles: </span>
                    {trend.triviaAngles.join(" · ")}
                  </p>
                  <div className="bg-[#1f1f1f] rounded-lg p-3">
                    <p className="text-sm text-[#F5C518] font-medium">
                      Suggested action:
                    </p>
                    <p className="text-sm text-zinc-300 mt-1">
                      {trend.suggestedAction}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = "/generator?topic=" + encodeURIComponent(trend.headline);
                    }}
                    className="mt-3 text-sm bg-[#F5C518] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                  >
                    → Send to Game Studio
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}