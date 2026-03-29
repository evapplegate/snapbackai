"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button";

interface Notification {
  tone: string;
  message: string;
  predictedOpenRate: string;
  bestSendTime: string;
  reasoning: string;
}

interface PushKit {
  headline: string;
  sport: string;
  goal: string;
  notifications: Notification[];
  abTestRecommendation: string;
  winnerPrediction: string;
}

const DEMO_KIT: PushKit = {
  headline: "Victor Wembanyama drops 42 points and 12 blocks in playoff opener",
  sport: "NBA",
  goal: "Start a trivia round",
  notifications: [
    {
      tone: "Hype",
      message: "🔥 42 PTS. 12 BLK. Wemby just broke the internet. How well do you know the alien? Test your NBA IQ now →",
      predictedOpenRate: "11.2%",
      bestSendTime: "Within 30 min of game end (~10:30 PM EST)",
      reasoning: "Hype tone peaks within the first hour after a major sports moment. Emoji-led notifications outperform text-only by 28% for sports apps. Open rate based on: sports app average (6%) × recency multiplier (1.6) × emoji boost (1.17).",
    },
    {
      tone: "Trivia Hook",
      message: "🧠 Only 4% of fans can answer this Wembanyama question. Can you? Play now and prove it →",
      predictedOpenRate: "13.4%",
      bestSendTime: "Next morning, 8:00–9:00 AM EST",
      reasoning: "Curiosity-gap notifications consistently outperform direct CTAs. '4%' specificity drives higher open rates than vague challenges. Morning delivery catches commute window. Open rate based on: personalized push benchmark (8–12%) × curiosity-gap multiplier (1.2).",
    },
    {
      tone: "FOMO",
      message: "⏰ Everyone's talking about Wemby's historic night. Don't be the only one who can't pass the trivia challenge →",
      predictedOpenRate: "9.8%",
      bestSendTime: "Next morning, 7:00–8:00 AM EST",
      reasoning: "FOMO messaging performs best when a cultural moment is still trending. Works especially well for 25–34 demographic. Open rate based on: sports app average (6%) × social proof multiplier (1.4) × morning send boost (1.17).",
    },
    {
      tone: "Challenge",
      message: "🏆 Wemby Challenge unlocked. 5 questions. 60 seconds. Think you're an NBA expert? Prove it →",
      predictedOpenRate: "10.5%",
      bestSendTime: "Lunch window, 12:00–1:00 PM EST next day",
      reasoning: "Challenge framing drives the highest completion rates of any push tone (62% session completion vs 41% average). Time-boxed challenges reduce friction. Open rate based on: mid-tier personalized push (9%) × challenge completion lift (1.17).",
    },
    {
      tone: "Personalized",
      message: "Hey NBA fan — Wemby just had the greatest defensive game in playoff history. Your expert opinion is needed →",
      predictedOpenRate: "14.1%",
      bestSendTime: "Next morning, 8:30 AM EST — segmented to NBA fans only",
      reasoning: "Personalized pushes segmented by sport interest outperform broadcast pushes by 35–50%. Direct address ('Hey NBA fan') increases open rate by ~20%. Open rate based on: personalized benchmark (12%) × segmentation lift (1.18). Highest predicted performer.",
    },
  ],
  abTestRecommendation: "A/B test Trivia Hook vs Personalized on a 50/50 split of your NBA fan segment. Send Trivia Hook at 8:00 AM and Personalized at 8:30 AM. Measure open rate and session start rate (not just opens) — session starts are the metric that matters for DAU.",
  winnerPrediction: "Personalized tone — segmented to NBA fans with direct address. Predicted 14.1% open rate, highest session-start conversion based on industry data for sports apps with engaged user bases.",
};

export default function PushPage() {
  const [form, setForm] = useState({
    headline: "",
    sport: "NBA",
    goal: "Start a trivia round",
  });
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<PushKit | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const generate = async () => {
    if (!form.headline.trim()) return;
    setLoading(true);
    setKit(null);
    setIsDemo(false);
    try {
      const res = await fetch("/api/push", {
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

  const loadDemo = () => {
    setLoading(false);
    setIsDemo(true);
    setKit(DEMO_KIT);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const toneColors: Record<string, string> = {
    Hype: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "Trivia Hook": "text-purple-400 bg-purple-400/10 border-purple-400/20",
    FOMO: "text-red-400 bg-red-400/10 border-red-400/20",
    Challenge: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Personalized: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Push Intelligence</h1>
            {isDemo && (
              <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-1">
            Generate high-converting push notifications tied to real sports moments
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Today's Sports Story
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Wembanyama drops 42 points in playoff opener..."
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Sport</label>
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
                  <option>College Basketball</option>
                  <option>College Football</option>
                  <option>Multi-Sport</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Goal</label>
                <select
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                >
                  <option>Start a trivia round</option>
                  <option>Open the app</option>
                  <option>Share a challenge</option>
                  <option>Download now</option>
                </select>
              </div>
            </div>
            <button
              onClick={generate}
              disabled={loading || !form.headline.trim()}
              className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Generating notifications..." : "🔔 Generate Push Notifications"}
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
          <div className="space-y-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              Generating push notification variants...
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-24 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-6 w-16 rounded bg-[#F5C518]/20 animate-pulse" />
                </div>
                <div className="h-16 w-full rounded bg-zinc-800 animate-pulse mb-3" />
                <div className="h-4 w-2/3 rounded bg-zinc-700 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {kit && !loading && (
          <div className="space-y-6">
            {/* Notifications */}
            <div className="space-y-4">
              {kit.notifications.map((n, i) => (
                <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#F5C518]/30 transition">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${toneColors[n.tone] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"}`}>
                      {n.tone}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Predicted open rate</span>
                      <span className="text-[#F5C518] font-bold text-sm">{n.predictedOpenRate}</span>
                    </div>
                  </div>

                  {/* Notification preview */}
                  <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4 border border-[#262626]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded bg-[#F5C518] flex items-center justify-center text-xs">⚡</div>
                      <span className="text-xs text-zinc-500 font-medium">Snapback Sports</span>
                      <span className="text-xs text-zinc-600 ml-auto">now</span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{n.message}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#1f1f1f] rounded-lg p-3">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Best Send Time</p>
                      <p className="text-sm text-zinc-300">{n.bestSendTime}</p>
                    </div>
                    <div className="bg-[#1f1f1f] rounded-lg p-3">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Reasoning</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{n.reasoning}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(n.message, `notif-${i}`)}
                    className="text-sm bg-[#F5C518] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                  >
                    {copied === `notif-${i}` ? "Copied!" : "Copy Notification →"}
                  </button>
                </div>
              ))}
            </div>

            {/* A/B Test Recommendation */}
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
                A/B Test Recommendation
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4 bg-[#0a0a0a] rounded-lg p-4">
                {kit.abTestRecommendation}
              </p>
              <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-lg p-4">
                <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Predicted Winner</p>
                <p className="text-sm text-zinc-300">{kit.winnerPrediction}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}