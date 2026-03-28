"use client";

import { useState, useRef } from "react";
import { BackButton } from "@/components/back-button"

interface WrappedProfile {
  title: string;
  description: string;
  strength: string;
  weakness: string;
  percentile: number;
  trashTalk: string;
}

export default function WrappedPage() {
  const [form, setForm] = useState({
    username: "",
    sport: "NBA",
    gamesPlayed: "50",
    bestScore: "90",
    streak: "14",
    winRate: "72",
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<WrappedProfile | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!form.username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shareToX = () => {
    if (!profile) return;
    const text = `My @Snapback_Trivia Wrapped: I'm a "${profile.title}" — top ${100 - profile.percentile}% of all players. ${profile.trashTalk} #SnapbackWrapped #buildinpublic`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Snapback Wrapped</h1>
          <p className="text-zinc-400 mt-1">
            Generate personalized stats cards that users share everywhere
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wide">
            User Stats Input
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. SportsKing23"
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Favorite Sport</label>
              <select
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              >
                <option>NBA</option>
                <option>NFL</option>
                <option>MLB</option>
                <option>NHL</option>
                <option>Soccer</option>
                <option>College Football</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Games Played</label>
              <input
                type="number"
                value={form.gamesPlayed}
                onChange={(e) => setForm({ ...form, gamesPlayed: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Best Score %</label>
              <input
                type="number"
                value={form.bestScore}
                onChange={(e) => setForm({ ...form, bestScore: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Longest Streak (days)</label>
              <input
                type="number"
                value={form.streak}
                onChange={(e) => setForm({ ...form, streak: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Win Rate %</label>
              <input
                type="number"
                value={form.winRate}
                onChange={(e) => setForm({ ...form, winRate: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading || !form.username.trim()}
            className="mt-6 w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Generating profile..." : "🏆 Generate Wrapped Card"}
          </button>
        </div>

        {loading && (
        <div className="space-y-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse"/>
            Analyzing sports knowledge profile...
            </div>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-24 rounded bg-zinc-800 animate-pulse"/>
                <div className="h-8 w-20 rounded bg-zinc-800 animate-pulse"/>
            </div>
            <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse mb-2"/>
            <div className="h-8 w-48 rounded bg-[#F5C518]/20 animate-pulse mb-3"/>
            <div className="space-y-2 mb-6">
                <div className="h-4 w-full rounded bg-zinc-800 animate-pulse"/>
                <div className="h-4 w-5/6 rounded bg-zinc-800 animate-pulse"/>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[1,2,3].map((i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-lg p-4">
                    <div className="h-8 w-12 rounded bg-zinc-800 animate-pulse mx-auto mb-2"/>
                    <div className="h-3 w-16 rounded bg-zinc-700 animate-pulse mx-auto"/>
                </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[1,2].map((i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-lg p-4">
                    <div className="h-3 w-16 rounded bg-zinc-700 animate-pulse mb-2"/>
                    <div className="h-4 w-full rounded bg-zinc-800 animate-pulse"/>
                </div>
                ))}
            </div>
            </div>
        </div>
        )}

        {profile && !loading && (
          <div>
            <div
              ref={cardRef}
              className="bg-[#161616] border border-[#F5C518] rounded-xl p-8 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded">
                    SNAPBACK
                  </div>
                  <span className="text-zinc-400 text-sm">This Week's Wrapped</span>
                </div>
                <div className="text-right">
                  <div className="text-[#F5C518] font-bold text-2xl">
                    Top {100 - profile.percentile}%
                  </div>
                  <div className="text-zinc-400 text-xs">of all players</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-zinc-400 text-sm mb-1">@{form.username}</div>
                <h2 className="text-3xl font-bold text-[#F5C518] mb-3">
                  {profile.title}
                </h2>
                <p className="text-zinc-300 leading-relaxed">{profile.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0a0a0a] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{form.gamesPlayed}</div>
                  <div className="text-zinc-500 text-xs mt-1">Games Played</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#F5C518]">{form.streak}</div>
                  <div className="text-zinc-500 text-xs mt-1">Day Streak 🔥</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{form.winRate}%</div>
                  <div className="text-zinc-500 text-xs mt-1">Win Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Strength</div>
                  <div className="text-sm text-green-400">{profile.strength}</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Work On</div>
                  <div className="text-sm text-yellow-400">{profile.weakness}</div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#262626]">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Your Trash Talk</div>
                <div className="text-sm text-white italic">"{profile.trashTalk}"</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={shareToX}
                className="flex-1 bg-black border border-[#262626] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#1a1a1a] transition"
              >
                Share to X →
              </button>
              <button
                onClick={() => setProfile(null)}
                className="border border-[#262626] text-zinc-400 px-6 py-3 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}