"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button";

interface Action {
  tool: string;
  action: string;
  expectedImpact: string;
}

interface Week {
  week: number;
  theme: string;
  goals: string[];
  actions: Action[];
  kpi: string;
  projectedNewDownloads: number;
}

interface Campaign {
  campaignName: string;
  summary: string;
  projectedGrowth: number;
  weeks: Week[];
  totalProjectedDownloads: number;
  keyInsight: string;
}

const FOCUS_AREAS = [
  "Content & Social",
  "Influencer Outreach",
  "App Features",
  "Community Growth",
  "User Retention",
  "Viral Mechanics",
];

const toolColors: Record<string, string> = {
  "Snapback Pulse": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Daily Brief": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Game Studio": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Influencer Kit": "text-rose-400 bg-rose-400/10 border-rose-400/20",
  "Feature Lab": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Snapback Wrapped": "text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]/20",
};

export default function CampaignPage() {
  const [currentDownloads, setCurrentDownloads] = useState("100000");
  const [targetDownloads, setTargetDownloads] = useState("1000000");
  const [timeframe, setTimeframe] = useState("90");
  const [focusAreas, setFocusAreas] = useState<string[]>([
    "Content & Social",
    "Influencer Outreach",
    "Viral Mechanics",
  ]);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const toggleFocus = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const generate = async () => {
    setLoading(true);
    setCampaign(null);
    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentDownloads: Number(currentDownloads),
          targetDownloads: Number(targetDownloads),
          timeframe: Number(timeframe),
          focusAreas,
        }),
      });
      const data = await res.json();
      setCampaign(data);
      setExpandedWeek(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Campaign Planner</h1>
          <p className="text-zinc-400 mt-1">
            AI-generated growth campaigns — week by week actions to hit your download target
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Current Downloads</label>
              <input
                type="number"
                value={currentDownloads}
                onChange={(e) => setCurrentDownloads(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Target Downloads</label>
              <input
                type="number"
                value={targetDownloads}
                onChange={(e) => setTargetDownloads(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Timeframe (days)</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm text-zinc-400 mb-3 block">Focus Areas</label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleFocus(area)}
                  className={`text-sm px-3 py-2 rounded-lg border transition ${
                    focusAreas.includes(area)
                      ? "bg-[#F5C518] text-black border-[#F5C518] font-medium"
                      : "border-[#262626] text-zinc-400 hover:border-[#F5C518] hover:text-[#F5C518]"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || focusAreas.length === 0}
            className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Building your campaign..." : "📋 Generate Campaign Plan"}
          </button>
        </div>

        {loading && (
        <div className="space-y-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse"/>
            Building your growth campaign...
            </div>
            <div className="bg-[#161616] border border-[#F5C518]/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                <div className="h-7 w-64 rounded bg-zinc-800 animate-pulse mb-2"/>
                <div className="h-4 w-full rounded bg-zinc-800 animate-pulse"/>
                <div className="h-4 w-4/5 rounded bg-zinc-800 animate-pulse mt-1"/>
                </div>
                <div className="h-10 w-24 rounded bg-[#F5C518]/20 animate-pulse"/>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-4">
                <div className="h-3 w-20 rounded bg-zinc-700 animate-pulse mb-2"/>
                <div className="h-4 w-full rounded bg-zinc-700 animate-pulse"/>
            </div>
            </div>
            {[1,2,3,4].map((i) => (
            <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-[#F5C518]/20 animate-pulse"/>
                    <div>
                    <div className="h-5 w-48 rounded bg-zinc-800 animate-pulse mb-2"/>
                    <div className="h-3 w-32 rounded bg-zinc-700 animate-pulse"/>
                    </div>
                </div>
                <div className="h-6 w-16 rounded bg-[#F5C518]/20 animate-pulse"/>
                </div>
            </div>
            ))}
        </div>
        )}

        {campaign && !loading && (
          <div>
            <div className="bg-[#161616] border border-[#F5C518]/30 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{campaign.campaignName}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{campaign.summary}</p>
                </div>
                <div className="text-right">
                  <div className="text-[#F5C518] font-bold text-2xl">
                    {formatNumber(campaign.totalProjectedDownloads)}
                  </div>
                  <div className="text-zinc-500 text-xs">projected downloads</div>
                </div>
              </div>
              <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-lg p-4">
                <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Key Insight</p>
                <p className="text-sm text-zinc-300">{campaign.keyInsight}</p>
              </div>
            </div>

            <div className="space-y-3">
              {campaign.weeks.map((week) => (
                <div
                  key={week.week}
                  className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                    className="w-full flex items-center justify-between p-5 hover:bg-[#1a1a1a] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-[#F5C518] text-black font-bold text-sm w-10 h-10 rounded-lg flex items-center justify-center">
                        W{week.week}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{week.theme}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{week.kpi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[#F5C518] font-bold">+{formatNumber(week.projectedNewDownloads)}</p>
                        <p className="text-xs text-zinc-500">new downloads</p>
                      </div>
                      <span className="text-zinc-400">{expandedWeek === week.week ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {expandedWeek === week.week && (
                    <div className="px-5 pb-5 border-t border-[#262626]">
                      <div className="pt-4 mb-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Goals</p>
                        <div className="flex flex-wrap gap-2">
                          {week.goals.map((goal, i) => (
                            <span key={i} className="text-xs bg-[#1f1f1f] text-zinc-300 px-3 py-1.5 rounded-lg">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Actions</p>
                      <div className="space-y-3">
                        {week.actions.map((action, i) => (
                          <div key={i} className="bg-[#0a0a0a] rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded border ${toolColors[action.tool] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"}`}>
                                {action.tool}
                              </span>
                            </div>
                            <p className="text-sm text-white mb-1">{action.action}</p>
                            <p className="text-xs text-zinc-500">→ {action.expectedImpact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}