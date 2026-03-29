"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button";

interface Trend {
  sport: string;
  headline: string;
  relevanceScore: number;
  triviaAngles: string[];
  suggestedAction: string;
}

const DEMO_TRENDS: Trend[] = [
  {
    sport: "NBA",
    headline: "Victor Wembanyama Drops 42 Pts + 12 Blocks in Historic Performance",
    relevanceScore: 10,
    triviaAngles: [
      "Most blocks in a 40+ point game since Hakeem Olajuwon",
      "Only 3rd player ever to average 2+ blocks and 25+ PPG",
      "Youngest player to reach 1,000 career blocks",
    ],
    suggestedAction:
      "Launch a 'Wemby Trivia Blitz' push notification tonight — high virality window, estimated 2–3x normal open rate based on Twitter volume.",
  },
  {
    sport: "College Basketball",
    headline: "March Madness Final Four Set — All #1 Seeds Survive Elite Eight",
    relevanceScore: 10,
    triviaAngles: [
      "Only the 4th time all #1 seeds reached the Final Four since 1979",
      "Combined point differential of Final Four teams in tournament: +187",
      "3 of 4 coaches have never won a national title",
    ],
    suggestedAction:
      "Run a bracket challenge push blast now — Final Four content drives peak engagement. Generate a 10-question March Madness trivia game in Game Studio.",
  },
  {
    sport: "MLB",
    headline: "Shohei Ohtani Hits Walk-Off Grand Slam on Opening Day 2026",
    relevanceScore: 9,
    triviaAngles: [
      "First Opening Day walk-off grand slam since Carlton Fisk in 1981",
      "Ohtani's 4th career walk-off — all in clutch situations",
      "Dodgers' largest Opening Day crowd in 20 years: 56,000+",
    ],
    suggestedAction:
      "Opening Day content has a 48-hour virality window. Send to Influencer Kit — great moment for creator outreach.",
  },
  {
    sport: "NFL",
    headline: "NFL Draft Trade Rumors: 3 Teams Bidding for the #1 Overall Pick",
    relevanceScore: 8,
    triviaAngles: [
      "Highest reported trade offer for #1 pick in NFL history",
      "Last team to trade up for #1 and win Super Bowl within 3 years",
      "QB prospects in this class compared to 1983 and 2004 classes",
    ],
    suggestedAction:
      "Draft season is peak engagement for NFL fans. Build a 'Draft IQ' trivia series in Game Studio — run it as a daily push through draft night.",
  },
  {
    sport: "Soccer",
    headline: "Lionel Messi Announces Final MLS Season — Retirement Set for End of 2026",
    relevanceScore: 9,
    triviaAngles: [
      "Messi's MLS stats vs his Barcelona peak numbers",
      "Inter Miami attendance growth since Messi arrival: +340%",
      "All-time MLS records Messi currently holds or is approaching",
    ],
    suggestedAction:
      "Messi retirement content will dominate social for weeks. Create a 'GOAT Debate' trivia pack — high shareability, strong influencer challenge candidate.",
  },
  {
    sport: "NHL",
    headline: "Connor McDavid Posts 5-Point Night, Closes in on All-Time Points Record",
    relevanceScore: 8,
    triviaAngles: [
      "McDavid's points-per-game rate vs Gretzky's record-setting seasons",
      "Last player to score 5+ points in a single playoff game",
      "Oilers' current Stanley Cup odds vs last 5 years",
    ],
    suggestedAction:
      "Hockey fans are underserved in trivia apps — McDavid milestones are a breakout moment. Build an 'NHL Legends' game to capture this audience.",
  },
  {
    sport: "Golf",
    headline: "Scottie Scheffler Wire-to-Wire at The Masters, Completes Back-to-Back",
    relevanceScore: 8,
    triviaAngles: [
      "Last player to win back-to-back Masters before Scheffler",
      "Scheffler's world ranking streak at #1 — how it compares to Tiger",
      "Augusta scoring records broken this week",
    ],
    suggestedAction:
      "Golf is high-income, highly engaged. A Masters trivia pack timed to the tournament close will convert well — launch today before the news cycle moves on.",
  },
  {
    sport: "MMA",
    headline: "Jon Jones vs Stipe Miocic 2 Announced — Heavyweight Title on the Line",
    relevanceScore: 7,
    triviaAngles: [
      "Jones' record as a heavyweight vs light heavyweight career",
      "Greatest heavyweight title defenses in UFC history",
      "Miocic's path back — knockouts and finish methods",
    ],
    suggestedAction:
      "Combat sports fans are mobile-first and highly social. Run a fight prediction trivia challenge in the Influencer Kit to build hype pre-event.",
  },
  {
    sport: "WNBA",
    headline: "Caitlin Clark Named League MVP in Unanimous Vote — Record Season Complete",
    relevanceScore: 9,
    triviaAngles: [
      "Clark's rookie records broken vs all-time WNBA records",
      "Attendance and viewership growth driven by Clark's debut season",
      "Last unanimous MVP in WNBA history before Clark",
    ],
    suggestedAction:
      "Clark content outperforms across every demographic. A 'Caitlin Clark IQ Test' trivia game will drive downloads — highest priority Game Studio build this week.",
  },
  {
    sport: "Tennis",
    headline: "Carlos Alcaraz Wins Roland Garros — 3rd Grand Slam Before Age 23",
    relevanceScore: 7,
    triviaAngles: [
      "Youngest players to win 3+ Grand Slams and how Alcaraz compares",
      "Head-to-head record vs Djokovic on clay",
      "Spanish players with multiple Roland Garros titles",
    ],
    suggestedAction:
      "Grand Slam windows are 2-week engagement spikes. A 'Grand Slam Legends' trivia game covering all 4 majors will have long shelf life beyond this tournament.",
  },
];

export default function PulsePage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Trend | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    setSelected(null);
    setTrends([]);
    setIsDemo(false);

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
            if (json.chunk) fullText += json.chunk;
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

  const loadDemo = () => {
    setSelected(null);
    setLoading(false);
    setIsDemo(true);
    setTrends(DEMO_TRENDS);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Snapback Pulse</h1>
            {isDemo && (
              <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-1">
            Real-time sports trend intelligence for your team
          </p>
        </div>

        {/* Config card — matches Game Studio layout */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchTrends}
              disabled={loading}
              className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Scanning trends..." : "⚡ Scan Trends Now"}
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
          <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              Scanning live sports data...
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-[#161616] border border-[#262626] rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-16 rounded bg-[#F5C518]/20 animate-pulse" />
                    <div
                      className="h-4 rounded bg-zinc-800 animate-pulse"
                      style={{ width: `${180 + i * 30}px` }}
                    />
                  </div>
                  <div className="h-4 w-10 rounded bg-zinc-800 animate-pulse" />
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
              onClick={() =>
                setSelected(
                  selected?.headline === trend.headline ? null : trend
                )
              }
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
                      window.location.href =
                        "/generator?topic=" +
                        encodeURIComponent(trend.headline);
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