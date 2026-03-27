"use client";

import { useState } from "react";

interface Story {
  headline: string;
  summary: string;
  sport: string;
  urgency: "high" | "medium" | "low";
  audienceSegments: string[];
  triviaAngles: string[];
}

interface Brief {
  date: string;
  stories: Story[];
}

export default function BriefPage() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBrief = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brief");
      const data = await res.json();
      setBrief(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const urgencyColor = (urgency: string) => {
    if (urgency === "high") return "text-red-400 bg-red-400/10 border-red-400/20";
    if (urgency === "medium") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-green-400 bg-green-400/10 border-green-400/20";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Daily Brief</h1>
            <p className="text-zinc-400 mt-1">
              Sports intelligence to inform today's decisions
            </p>
          </div>
          <button
            onClick={fetchBrief}
            disabled={loading}
            className="bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Generating brief..." : "📰 Generate Today's Brief"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-[#F5C518] text-xl animate-pulse">
              Scanning sports world for today's top stories...
            </div>
          </div>
        )}

        {!loading && !brief && (
          <div className="text-center py-20 text-zinc-500">
            Hit "Generate Today's Brief" to get your morning sports intelligence
          </div>
        )}

        {brief && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <span>📅</span>
              <span>Snapback Intelligence Brief — {brief.date}</span>
            </div>

            {brief.stories.map((story, i) => (
              <div
                key={i}
                className="bg-[#161616] border border-[#262626] rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded">
                      {story.sport}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${urgencyColor(story.urgency)}`}>
                      {story.urgency} priority
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {story.headline}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {story.summary}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1f1f1f] rounded-lg p-3">
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                      Audience
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {story.audienceSegments.map((seg, j) => (
                        <span
                          key={j}
                          className="text-xs bg-[#262626] text-zinc-300 px-2 py-1 rounded"
                        >
                          {seg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#1f1f1f] rounded-lg p-3">
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                      Trivia Angles
                    </p>
                    <div className="flex flex-col gap-1">
                      {story.triviaAngles.map((angle, j) => (
                        <span key={j} className="text-xs text-zinc-300">
                          → {angle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = "/generator?topic=" + encodeURIComponent(story.headline)}
                  className="mt-4 text-sm bg-[#F5C518] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                >
                  → Send to Game Studio
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}