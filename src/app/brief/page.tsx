"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button";

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

const DEMO_BRIEF: Brief = {
  date: "Sunday, March 29, 2026",
  stories: [
    {
      headline: "March Madness Elite Eight: Duke and Michigan Advance to Final Four in Overtime Thrillers",
      summary:
        "Duke edged Gonzaga 78–76 on a buzzer-beating three-pointer, while Michigan outlasted Tennessee in double overtime to set up a highly anticipated Final Four matchup. Both games drew record streaming numbers, making this the most-watched Elite Eight weekend in ESPN history.",
      sport: "College Basketball",
      urgency: "high",
      audienceSegments: ["College sports fans", "Bracket participants", "18–34 male", "March Madness casuals"],
      triviaAngles: [
        "Duke's all-time buzzer-beater record in NCAA Tournament play",
        "Last time two Big Ten teams reached the Final Four in the same year",
        "Michigan's overtime record in March Madness since 2010",
      ],
    },
    {
      headline: "Victor Wembanyama surges to #1 in MVP Race",
      summary:
        "The San Antonio Spurs center surged to #1 in MVP race today, averaging 28.4 points, 12.1 rebounds, and 4.6 blocks per game. His historic defensive metrics have drawn comparisons to peak Hakeem Olajuwon and prompted the league to explore new statistical categories.",
      sport: "NBA",
      urgency: "high",
      audienceSegments: ["NBA fans", "Fantasy basketball players", "Gen Z sports fans", "International audience"],
      triviaAngles: [
        "Youngest unanimous MVP winners in NBA history — how Wemby compares",
        "Players who led the league in both scoring and blocks in the same season",
        "San Antonio Spurs MVP history: Duncan, Robinson, and now Wembanyama",
      ],
    },
    {
      headline: "MLB Opening Weekend: Record 14 Home Runs Hit Across 5 Games on Saturday",
      summary:
        "The 2026 MLB season opened with an offensive explosion, including Shohei Ohtani's walk-off grand slam and Aaron Judge's 500th career home run in pinstripes. Commissioner Manfred cited the new strike zone adjustments as a key factor in the early power surge.",
      sport: "MLB",
      urgency: "medium",
      audienceSegments: ["MLB fans", "Baseball history buffs", "Fantasy baseball players", "Ohtani followers"],
      triviaAngles: [
        "Players who hit their 500th career home run on Opening Day",
        "Most home runs hit across all games on a single Opening Weekend — all-time record",
        "Ohtani's walk-off grand slam vs other legendary Opening Day moments in Dodgers history",
      ],
    },
  ],
};

export default function BriefPage() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const fetchBrief = async () => {
    setLoading(true);
    setIsDemo(false);
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

  const loadDemo = () => {
    setLoading(false);
    setIsDemo(true);
    setBrief(DEMO_BRIEF);
  };

  const urgencyColor = (urgency: string) => {
    if (urgency === "high") return "text-red-400 bg-red-400/10 border-red-400/20";
    if (urgency === "medium") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-green-400 bg-green-400/10 border-green-400/20";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Daily Brief</h1>
            {isDemo && (
              <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-1">
            Sports intelligence to inform today's decisions
          </p>
        </div>

        {/* Config card — matches Game Studio / Pulse layout */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchBrief}
              disabled={loading}
              className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Generating brief..." : "📰 Generate Today's Brief"}
            </button>
            <button
              onClick={loadDemo}
              disabled={loading}
              className="w-full border border-[#F5C518] text-[#F5C518] font-bold px-6 py-3 rounded-lg hover:bg-[#F5C518]/10 transition disabled:opacity-50"
            >
              ⚡ Demo
            </button>
          </div>
        </div>

        {loading && (
          <div className="space-y-6">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              Scanning today's sports news...
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-6 w-20 rounded bg-[#F5C518]/20 animate-pulse" />
                  <div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" />
                </div>
                <div className="h-6 w-3/4 rounded bg-zinc-800 animate-pulse mb-3" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-4/6 rounded bg-zinc-800 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#1f1f1f] rounded-lg p-3 space-y-2">
                    <div className="h-3 w-16 rounded bg-zinc-700 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-6 w-20 rounded bg-zinc-700 animate-pulse" />
                      <div className="h-6 w-20 rounded bg-zinc-700 animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-[#1f1f1f] rounded-lg p-3 space-y-2">
                    <div className="h-3 w-16 rounded bg-zinc-700 animate-pulse" />
                    <div className="h-4 w-full rounded bg-zinc-700 animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-zinc-700 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
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
                  onClick={() =>
                    (window.location.href =
                      "/generator?topic=" + encodeURIComponent(story.headline))
                  }
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