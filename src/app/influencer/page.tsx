"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button"

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface InfluencerKit {
  pageTitle: string;
  slug: string;
  opportunityScore: number;
  fitReason: string;
  questions: Question[];
  dmDraft: string;
  tweetScript: string;
}

export default function InfluencerPage() {
  const [form, setForm] = useState({
    name: "",
    sport: "NBA",
    audience: "Sports fans aged 18-35",
  });
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<InfluencerKit | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    setKit(null);
    try {
      const res = await fetch("/api/influencer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setKit(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Influencer Kit</h1>
          <p className="text-zinc-400 mt-1">
            Build custom challenge pages and outreach for any sports creator
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Influencer Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pat McAfee, Shannon Sharpe..."
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Sport / Niche
                </label>
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
                  <option>Multi-Sport</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Audience Type
                </label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                >
                  <option>Sports fans aged 18-35</option>
                  <option>Fantasy sports players</option>
                  <option>Sports bettors</option>
                  <option>College sports fans</option>
                  <option>General sports fans</option>
                </select>
              </div>
            </div>
            <button
              onClick={generate}
              disabled={loading || !form.name.trim()}
              className="bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Building influencer kit..." : "🎯 Generate Influencer Kit"}
            </button>
          </div>
        </div>

        {loading && (
        <div className="space-y-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse"/>
            Building influencer kit for {form.name}...
            </div>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-64 rounded bg-zinc-800 animate-pulse"/>
                <div className="h-8 w-16 rounded bg-[#F5C518]/20 animate-pulse"/>
            </div>
            <div className="h-4 w-full rounded bg-zinc-800 animate-pulse mb-2"/>
            <div className="h-4 w-4/5 rounded bg-zinc-800 animate-pulse mb-4"/>
            <div className="h-10 w-full rounded bg-zinc-800 animate-pulse"/>
            </div>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
            <div className="h-4 w-32 rounded bg-zinc-700 animate-pulse mb-4"/>
            {[1,2,3,4,5].map((i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-lg p-4 mb-3">
                <div className="h-5 w-3/4 rounded bg-zinc-800 animate-pulse mb-3"/>
                <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 rounded bg-zinc-800 animate-pulse"/>
                    <div className="h-9 rounded bg-zinc-800 animate-pulse"/>
                    <div className="h-9 rounded bg-zinc-800 animate-pulse"/>
                    <div className="h-9 rounded bg-zinc-800 animate-pulse"/>
                </div>
                </div>
            ))}
            </div>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
            <div className="h-4 w-24 rounded bg-zinc-700 animate-pulse mb-4"/>
            <div className="space-y-2">
                <div className="h-4 w-full rounded bg-zinc-800 animate-pulse"/>
                <div className="h-4 w-5/6 rounded bg-zinc-800 animate-pulse"/>
                <div className="h-4 w-4/6 rounded bg-zinc-800 animate-pulse"/>
            </div>
            </div>
        </div>
        )}

        {kit && !loading && (
          <div className="space-y-6">
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{kit.pageTitle}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm">Opportunity Score</span>
                  <span className="bg-[#F5C518] text-black font-bold px-3 py-1 rounded-lg">
                    {kit.opportunityScore}/10
                  </span>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-3">{kit.fitReason}</p>
              <div className="bg-[#0a0a0a] rounded-lg px-4 py-2 flex items-center justify-between">
                <span className="text-zinc-500 text-sm">
                  snapbacksports.com/challenge/{kit.slug}
                </span>
                <button
                  onClick={() => copyToClipboard(`snapbacksports.com/challenge/${kit.slug}`, "url")}
                  className="text-[#F5C518] text-xs hover:underline"
                >
                  {copied === "url" ? "Copied!" : "Copy URL"}
                </button>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">
                Custom Challenge Questions
              </h3>
              <div className="space-y-4">
                {kit.questions.map((q, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-lg p-4">
                    <p className="font-medium text-white mb-3">
                      {i + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`text-sm px-3 py-2 rounded-lg ${
                            j === q.correct
                              ? "bg-[#F5C518]/20 text-[#F5C518] border border-[#F5C518]/30"
                              : "bg-[#1f1f1f] text-zinc-400"
                          }`}
                        >
                          {j === q.correct ? "✓ " : ""}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                  DM Draft
                </h3>
                <span className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-2 py-1 rounded">
                  Edit before sending
                </span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 bg-[#0a0a0a] rounded-lg p-4">
                {kit.dmDraft}
              </p>
              <button
                onClick={() => copyToClipboard(kit.dmDraft, "dm")}
                className="bg-[#F5C518] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition text-sm"
              >
                {copied === "dm" ? "Copied!" : "Copy DM →"}
              </button>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
                Influencer Tweet Script
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 bg-[#0a0a0a] rounded-lg p-4 italic">
                "{kit.tweetScript}"
              </p>
              <button
                onClick={() => copyToClipboard(kit.tweetScript, "tweet")}
                className="border border-[#262626] text-zinc-400 px-4 py-2 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition text-sm"
              >
                {copied === "tweet" ? "Copied!" : "Copy Tweet →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}