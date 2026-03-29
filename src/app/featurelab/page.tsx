"use client";

import { useState, useEffect } from "react";
import { BackButton } from "@/components/back-button";

interface Feature {
  name: string;
  description: string;
  growthMechanism: string;
  priority?: string;
  effort?: string;
  estimatedImpact: string;
  category: string;
  tagline?: string;
  buildTime?: string;
}

interface ShipyardItem extends Feature {
  id: string;
  status: "idea" | "in-review" | "ready-to-ship";
  savedAt: string;
  notes?: string;
}

interface Validation {
  verdict: string;
  confidence: number;
  summary: string;
  pros: string[];
  cons: string[];
  suggestion: string;
  growthScore: number;
  retentionScore: number;
  viralScore: number;
}

const DEMO_GENERATE_FEATURES: Feature[] = [
  {
    name: "Snapback Streaks",
    tagline: "Make consistency addictive",
    description:
      "Users earn a daily streak for every day they complete a trivia round. Streaks are visible on their profile and can be shared as cards. Losing a streak triggers a push notification with a 'Streak Shield' rescue mechanic.",
    growthMechanism:
      "Duolingo's streak system drives 50% of their DAU. A streak tied to a rescue mechanic creates daily re-engagement loops — users who would churn after missing a day instead come back to protect their streak.",
    priority: "high",
    effort: "low",
    estimatedImpact: "+28% DAU",
    category: "retention",
  },
  {
    name: "Rivalry Mode",
    tagline: "Challenge a specific friend",
    description:
      "Send a personal head-to-head trivia challenge to any friend via a deep link. They play the same 5 questions, results are compared side-by-side, winner gets a shareable 'W' card with trash talk included.",
    growthMechanism:
      "Personal challenges from a trusted friend are the highest-converting acquisition mechanic in mobile gaming. Wordle's entire growth was built on this model — one share creates on average 1.3 new downloads.",
    priority: "high",
    effort: "low",
    estimatedImpact: "+22% new users via referral",
    category: "viral",
  },
  {
    name: "Daily Sports Debate",
    tagline: "One question. Two sides. Your verdict.",
    description:
      "Every morning, one AI-generated sports debate question drops — 'LeBron or Jordan?', 'Messi or Ronaldo?' Users pick a side, answer 3 supporting trivia questions, then see how the world voted.",
    growthMechanism:
      "Sports debate content is the most-shared category on every platform. The global vote results create a daily social moment — users screenshot and post their stance, driving organic discovery at zero cost.",
    priority: "high",
    effort: "low",
    estimatedImpact: "+18% DAU",
    category: "viral",
  },
  {
    name: "Fan IQ Leaderboard",
    tagline: "Prove you're the biggest fan in your city",
    description:
      "A real-time leaderboard ranking users by sport and geography — 'Top NBA fan in Chicago', 'Top NFL fan in Texas'. Monthly resets keep competition fresh. Top 3 per city get a shareable badge.",
    growthMechanism:
      "Geographic competition makes winning personally meaningful. City-level badges are highly shareable and create communities of local rivalry — organic word-of-mouth in exactly the markets Snapback needs.",
    priority: "medium",
    effort: "medium",
    estimatedImpact: "+15% retention",
    category: "retention",
  },
  {
    name: "Prediction League",
    tagline: "Pick games. Earn points. Beat your friends.",
    description:
      "Before each game day, users make predictions on outcomes. After games resolve, correct predictions earn trivia coins redeemable for power-ups. Weekly prediction leaderboards per sport.",
    growthMechanism:
      "Sports prediction is a proven retention driver — 60M fantasy sports players are already conditioned to this habit. Adding a prediction layer keeps users opening the app on game days regardless of whether they have time to play full rounds.",
    priority: "medium",
    effort: "medium",
    estimatedImpact: "+20% weekly active users",
    category: "engagement",
  },
];

const DEMO_VALIDATION: Validation = {
  verdict: "build",
  confidence: 91,
  summary:
    "Snapback Wrapped is an exceptionally high-priority build for a sports trivia app at the 100K download stage. Personalized shareable stats cards are proven to generate outsized organic reach — Spotify Wrapped generated over 400M social posts in its first year, and that mechanic is directly replicable in the sports trivia context.",
  pros: [
    "Turns every existing user into a marketing channel — zero additional ad spend required",
    "Personalized content dramatically outperforms generic content in share rates (3–5x by industry data)",
    "Creates a cultural moment Snapback can own annually, building brand identity alongside growth",
    "Low build complexity relative to impact — core mechanic is stat aggregation + card design",
  ],
  cons: [
    "Requires meaningful usage data to be impressive — new users with 1-2 games played will have weak cards",
    "Timing matters: a mid-year launch won't have the same urgency as a year-end or season-end release",
  ],
  suggestion:
    "Tie the first Wrapped release to a specific sports milestone — NBA Playoffs, NFL Draft, or March Madness — rather than a calendar year-end. This gives even newer users a defined window of stats to showcase and creates urgency to share before the moment passes.",
  growthScore: 9,
  retentionScore: 7,
  viralScore: 10,
};

const DEMO_SHOWCASE_FEATURES: Feature[] = [
  {
    name: "Snapback Wrapped",
    tagline: "Turn every user into a marketer",
    description:
      "Personalized stats cards showing each user's sports IQ title, best scores, streaks, and top sport. Designed to be screenshotted and shared across all platforms.",
    growthMechanism:
      "Every share exposes Snapback to the user's entire social network. One coordinated Wrapped moment can generate millions of impressions overnight at zero cost.",
    estimatedImpact: "+30% new users",
    category: "viral",
    buildTime: "3 days",
  },
  {
    name: "Hot Take Mode",
    tagline: "Sports debates meet trivia",
    description:
      "AI generates a controversial sports take. Users vote agree or disagree, answer 5 trivia questions that challenge their position, then see global results.",
    growthMechanism:
      "Sports debate content is the most viral category on every platform. Shareable results with global percentages create daily social moments that drive organic discovery.",
    estimatedImpact: "+20% new users",
    category: "viral",
    buildTime: "3 days",
  },
  {
    name: "Second Screen Mode",
    tagline: "Play along while you watch",
    description:
      "Users select a live game they're watching. AI serves contextual trivia about the matchup and players between plays and at halftime.",
    growthMechanism:
      "Live sports is the last thing people watch in real time. Owning the second screen means a daily engaged audience every game night across every sport.",
    estimatedImpact: "+20% session frequency",
    category: "engagement",
    buildTime: "5 days",
  },
  {
    name: "Fantasy Bridge",
    tagline: "Trivia about your actual roster",
    description:
      "Users input their fantasy team and get trivia questions specifically about their players. Results include fantasy-specific trash talk for opponents.",
    growthMechanism:
      "60M+ Americans play fantasy sports. Zero trivia apps serve this audience directly — one well-placed post in r/fantasyfootball could drive tens of thousands of downloads.",
    estimatedImpact: "+15% new users",
    category: "acquisition",
    buildTime: "2 days",
  },
  {
    name: "Push Notification Trivia",
    tagline: "One question. Every morning.",
    description:
      "A single high-quality trivia question delivered as a push notification each morning tied to the biggest sports story of the day. Answer directly from the notification.",
    growthMechanism:
      "Micro-habit formation — a single daily question is the lowest-friction engagement possible. Answerable from the lock screen means engagement happens even when users wouldn't open the app.",
    estimatedImpact: "+35% D30 retention",
    category: "retention",
    buildTime: "2 days",
  },
  {
    name: "Clip Trivia",
    tagline: "Watch a clip. Answer questions.",
    description:
      "AI generates trivia questions based on sports highlight clips. Users watch 15 seconds then answer questions about what they just saw.",
    growthMechanism:
      "Video-based trivia is native to how Gen Z consumes sports. Every viral sports moment becomes an acquisition funnel — clips are shareable content by definition.",
    estimatedImpact: "+25% Gen Z users",
    category: "engagement",
    buildTime: "7 days",
  },
];

const PRESET_FEATURES: ShipyardItem[] = [
  {
    id: "wrapped",
    name: "Snapback Wrapped",
    tagline: "Turn every user into a marketer",
    description: "Personalized weekly stats cards showing each user's sports knowledge title, best scores, streaks, and strengths. Designed to be shared on all social platforms.",
    growthMechanism: "Every share exposes Snapback to the user's entire social network — a coordinated viral moment that could generate millions of impressions overnight.",
    estimatedImpact: "+30% new users",
    category: "viral",
    buildTime: "3 days",
    status: "ready-to-ship",
    savedAt: new Date().toISOString(),
  },
  {
    id: "streak-wars",
    name: "Streak Wars",
    tagline: "Make consistency competitive",
    description: "Users build daily streaks and challenge friends to streak battles. Longest streak at the end of the week wins. Streak data is shareable.",
    growthMechanism: "Daily streaks create habit loops — Duolingo proved this drives 3x retention improvement. Competitive streaks add a social layer that drives new user referrals.",
    estimatedImpact: "+25% DAU",
    category: "retention",
    buildTime: "4 days",
    status: "in-review",
    savedAt: new Date().toISOString(),
  },
  {
    id: "hot-take",
    name: "Hot Take Mode",
    tagline: "Sports debates meet trivia",
    description: "AI generates a controversial but defensible sports take. User votes agree or disagree, then answers 5 trivia questions that challenge their position. Results are shareable.",
    growthMechanism: "Sports debate content is the most viral category on every platform. Shareable results with global agree/disagree percentages create social moments that drive discovery.",
    estimatedImpact: "+20% new users",
    category: "viral",
    buildTime: "3 days",
    status: "in-review",
    savedAt: new Date().toISOString(),
  },
  {
    id: "fantasy-bridge",
    name: "Fantasy Bridge",
    tagline: "Trivia for your fantasy roster",
    description: "Users input their fantasy team roster and get trivia questions specifically about their players. Results are shareable with fantasy-specific trash talk.",
    growthMechanism: "60M+ Americans play fantasy sports — zero sports trivia apps serve this audience directly. One well-placed post in r/fantasyfootball could drive tens of thousands of downloads.",
    estimatedImpact: "+15% new users",
    category: "acquisition",
    buildTime: "2 days",
    status: "idea",
    savedAt: new Date().toISOString(),
  },
  {
    id: "clip-trivia",
    name: "Clip Trivia",
    tagline: "Watch a clip. Answer questions.",
    description: "AI generates trivia questions based on sports highlight clips. Users watch a 15-second clip then answer questions about what they saw.",
    growthMechanism: "Video-based trivia is completely native to how Gen Z consumes sports. Clips themselves are shareable content — every viral sports moment becomes an acquisition funnel.",
    estimatedImpact: "+25% Gen Z users",
    category: "engagement",
    buildTime: "7 days",
    status: "idea",
    savedAt: new Date().toISOString(),
  },
  {
    id: "second-screen",
    name: "Second Screen Mode",
    tagline: "Play along while you watch",
    description: "User selects the game they're watching live. AI generates contextual trivia about the matchup, players, and history — served between plays and at halftime.",
    growthMechanism: "Live sports is the last thing people watch in real time. Becoming the go-to second screen app means a daily engaged audience every game night across every sport.",
    estimatedImpact: "+20% session frequency",
    category: "engagement",
    buildTime: "5 days",
    status: "idea",
    savedAt: new Date().toISOString(),
  },
  {
    id: "rivalry-mode",
    name: "Rivalry Mode",
    tagline: "Challenge a specific friend",
    description: "Send a personal head-to-head trivia challenge to a specific friend. They play the same questions, results get compared. Winner gets bragging rights.",
    growthMechanism: "Personal challenges from a trusted friend are the highest-converting acquisition mechanic that exists. Wordle grew entirely on this model.",
    estimatedImpact: "+18% new users via referral",
    category: "viral",
    buildTime: "3 days",
    status: "idea",
    savedAt: new Date().toISOString(),
  },
];

export default function FeatureLabPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "validate" | "showcase" | "shipyard">("generate");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [validation, setValidation] = useState<Validation | null>(null);
  const [shipyard, setShipyard] = useState<ShipyardItem[]>(PRESET_FEATURES);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(PRESET_FEATURES.map((f) => f.id)));
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shipyard");
    if (saved) {
      const parsed = JSON.parse(saved);
      setShipyard(parsed);
      setSavedIds(new Set(parsed.map((f: ShipyardItem) => f.id)));
    } else {
      localStorage.setItem("shipyard", JSON.stringify(PRESET_FEATURES));
    }
  }, []);

  const loadDemo = () => {
    setLoading(false);
    setIsDemo(true);
    if (activeTab === "generate") {
      setValidation(null);
      setFeatures(DEMO_GENERATE_FEATURES);
    } else if (activeTab === "validate") {
      setFeatures([]);
      setValidation(DEMO_VALIDATION);
    } else if (activeTab === "showcase") {
      setValidation(null);
      setFeatures(DEMO_SHOWCASE_FEATURES);
    }
  };

  const saveToShipyard = (feature: Feature) => {
    const id = feature.name.toLowerCase().replace(/\s+/g, "-");
    if (savedIds.has(id)) return;
    const item: ShipyardItem = { ...feature, id, status: "idea", savedAt: new Date().toISOString() };
    const updated = [...shipyard, item];
    setShipyard(updated);
    setSavedIds(new Set([...savedIds, id]));
    localStorage.setItem("shipyard", JSON.stringify(updated));
  };

  const updateStatus = (id: string, status: ShipyardItem["status"]) => {
    const updated = shipyard.map((f) => (f.id === id ? { ...f, status } : f));
    setShipyard(updated);
    localStorage.setItem("shipyard", JSON.stringify(updated));
  };

  const updateNote = (id: string, notes: string) => {
    const updated = shipyard.map((f) => (f.id === id ? { ...f, notes } : f));
    setShipyard(updated);
    localStorage.setItem("shipyard", JSON.stringify(updated));
  };

  const removeFromShipyard = (id: string) => {
    if (PRESET_FEATURES.find((f) => f.id === id)) return;
    const updated = shipyard.filter((f) => f.id !== id);
    const newIds = new Set(savedIds);
    newIds.delete(id);
    setShipyard(updated);
    setSavedIds(newIds);
    localStorage.setItem("shipyard", JSON.stringify(updated));
  };

  const run = async () => {
    if (activeTab !== "showcase" && !input.trim()) return;
    setLoading(true);
    setIsDemo(false);
    setFeatures([]);
    setValidation(null);
    try {
      const res = await fetch("/api/featurelab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, input }),
      });
      const data = await res.json();
      if (activeTab === "validate") setValidation(data);
      else setFeatures(data.features || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = (cat: string) => {
    if (cat === "viral") return "text-pink-400 bg-pink-400/10 border-pink-400/20";
    if (cat === "retention") return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (cat === "acquisition") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (cat === "engagement") return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  };

  const statusLabel = (status: string) => {
    if (status === "ready-to-ship") return "🚀 Ready to Ship";
    if (status === "in-review") return "🔍 In Review";
    return "💡 Idea";
  };

  const verdictColor = (verdict: string) => {
    if (verdict === "build") return "text-green-400";
    if (verdict === "skip") return "text-red-400";
    return "text-yellow-400";
  };

  const shipyardByStatus = {
    "ready-to-ship": shipyard.filter((f) => f.status === "ready-to-ship"),
    "in-review": shipyard.filter((f) => f.status === "in-review"),
    idea: shipyard.filter((f) => f.status === "idea"),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Feature Lab</h1>
            {isDemo && (
              <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-1">
            AI-powered product strategy — generate, validate, discover, and ship features that drive growth
          </p>
        </div>

        {/* Tabs — text-xs on mobile so 4 labels fit */}
        <div className="flex gap-1 mb-8 bg-[#161616] border border-[#262626] rounded-xl p-1">
          {[
            { id: "generate", label: "💡 Generate" },
            { id: "validate", label: "✅ Validate" },
            { id: "showcase", label: "🚀 Showcase" },
            { id: "shipyard", label: `⚓ Shipyard (${shipyard.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setFeatures([]);
                setValidation(null);
                setInput("");
                setIsDemo(false);
              }}
              className={`flex-1 py-2.5 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === tab.id ? "bg-[#F5C518] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== "shipyard" && (
          <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
            {activeTab === "generate" && (
              <div className="mb-4">
                <label className="text-sm text-zinc-400 mb-2 block">
                  What growth goal do you want to achieve?
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. increase daily active users, get more social shares..."
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
                />
              </div>
            )}
            {activeTab === "validate" && (
              <div className="mb-4">
                <label className="text-sm text-zinc-400 mb-2 block">
                  Describe the feature you want to validate
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. A daily streak system where users earn badges for consecutive days playing..."
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518] resize-none"
                />
              </div>
            )}
            {activeTab === "showcase" && (
              <p className="text-zinc-400 text-sm mb-4">
                Generate a curated list of high-impact features ready to build — specifically designed for Snapback's growth stage.
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={run}
                disabled={loading || (activeTab !== "showcase" && !input.trim())}
                className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {loading
                  ? "Analyzing..."
                  : activeTab === "generate"
                  ? "💡 Generate Feature Ideas"
                  : activeTab === "validate"
                  ? "✅ Validate This Feature"
                  : "🚀 Show Me What to Build"}
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
        )}

        {loading && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              {activeTab === "generate" ? "Generating feature ideas..." : activeTab === "validate" ? "Analyzing your feature..." : "Loading feature showcase..."}
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="h-6 w-48 rounded bg-zinc-800 animate-pulse mb-2" />
                    <div className="h-4 w-32 rounded bg-[#F5C518]/20 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-6 w-20 rounded bg-zinc-800 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-4/5 rounded bg-zinc-800 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="h-3 w-24 rounded bg-zinc-700 animate-pulse mb-2" />
                    <div className="h-4 w-full rounded bg-zinc-700 animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-zinc-700 animate-pulse mt-1" />
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="h-3 w-24 rounded bg-zinc-700 animate-pulse mb-2" />
                    <div className="h-5 w-24 rounded bg-[#F5C518]/20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {features.length > 0 && !loading && (
          <div className="space-y-4">
            {features.map((f, i) => {
              const id = f.name.toLowerCase().replace(/\s+/g, "-");
              const isSaved = savedIds.has(id);
              return (
                <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#F5C518]/30 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{f.name}</h3>
                      {f.tagline && <p className="text-[#F5C518] text-sm mt-0.5">{f.tagline}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-xs px-2 py-1 rounded border ${categoryColor(f.category)}`}>
                        {f.category}
                      </span>
                      {f.priority && (
                        <span className={`text-xs px-2 py-1 rounded border hidden sm:inline ${
                          f.priority === "high" ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                        }`}>
                          {f.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">{f.description}</p>
                  {/* ↓ stacks on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0a0a0a] rounded-lg p-3">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Growth Mechanism</p>
                      <p className="text-sm text-zinc-300">{f.growthMechanism}</p>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-lg p-3">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Estimated Impact</p>
                      <p className="text-sm text-[#F5C518] font-medium">{f.estimatedImpact}</p>
                      {f.effort && <p className="text-xs text-zinc-500 mt-1">{f.effort} effort</p>}
                      {f.buildTime && <p className="text-xs text-zinc-500 mt-1">~{f.buildTime} to build</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => saveToShipyard(f)}
                    disabled={isSaved}
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition ${
                      isSaved ? "bg-green-400/10 text-green-400 border border-green-400/20 cursor-default" : "bg-[#F5C518] text-black hover:bg-yellow-400"
                    }`}
                  >
                    {isSaved ? "⚓ Saved to Shipyard" : "+ Save to Shipyard"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {validation && !loading && (
          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <div className={`text-3xl font-bold uppercase ${verdictColor(validation.verdict)}`}>
                    {validation.verdict === "build" ? "✓ Build It" : validation.verdict === "skip" ? "✗ Skip It" : "⚡ Modify It"}
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">{validation.confidence}% confidence</p>
                </div>
                {/* scores — 3 cols, small enough to stay as-is */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Growth", score: validation.growthScore },
                    { label: "Retention", score: validation.retentionScore },
                    { label: "Viral", score: validation.viralScore },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#0a0a0a] rounded-lg p-3">
                      <div className="text-xl font-bold text-[#F5C518]">{s.score}/10</div>
                      <div className="text-xs text-zinc-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-zinc-300 text-sm mb-6">{validation.summary}</p>
              {/* ↓ pros/cons stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-xs text-green-400 uppercase tracking-wide mb-3">Pros</p>
                  <ul className="space-y-2">
                    {validation.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex gap-2">
                        <span className="text-green-400 shrink-0">✓</span>{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-xs text-red-400 uppercase tracking-wide mb-3">Cons</p>
                  <ul className="space-y-2">
                    {validation.cons.map((con, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex gap-2">
                        <span className="text-red-400 shrink-0">✗</span>{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-lg p-4">
                <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-2">Suggestion</p>
                <p className="text-sm text-zinc-300">{validation.suggestion}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shipyard" && (
          <div className="space-y-8">
            <div className="bg-[#161616] border border-[#F5C518]/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{shipyard.length} features in pipeline</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {shipyardByStatus["ready-to-ship"].length} ready · {shipyardByStatus["in-review"].length} in review · {shipyardByStatus["idea"].length} ideas
                </p>
              </div>
              <div className="text-[#F5C518] text-2xl">⚓</div>
            </div>

            {(["ready-to-ship", "in-review", "idea"] as const).map(
              (status) =>
                shipyardByStatus[status].length > 0 && (
                  <div key={status}>
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">
                      {statusLabel(status)} ({shipyardByStatus[status].length})
                    </h2>
                    <div className="space-y-4">
                      {shipyardByStatus[status].map((f) => (
                        <div key={f.id} className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#F5C518]/30 transition">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-white">{f.name}</h3>
                              {f.tagline && <p className="text-[#F5C518] text-sm mt-0.5">{f.tagline}</p>}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border shrink-0 ml-2 ${categoryColor(f.category)}`}>
                              {f.category}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-sm mb-4">{f.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#0a0a0a] rounded-lg p-3">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Growth Mechanism</p>
                              <p className="text-sm text-zinc-300">{f.growthMechanism}</p>
                            </div>
                            <div className="bg-[#0a0a0a] rounded-lg p-3">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Estimated Impact</p>
                              <p className="text-sm text-[#F5C518] font-medium">{f.estimatedImpact}</p>
                              {f.buildTime && <p className="text-xs text-zinc-500 mt-1">~{f.buildTime} to build</p>}
                            </div>
                          </div>
                          {editingNote === f.id ? (
                            <div className="mb-4">
                              <textarea
                                defaultValue={f.notes || ""}
                                onBlur={(e) => { updateNote(f.id, e.target.value); setEditingNote(null); }}
                                placeholder="Add notes for your dev team..."
                                rows={2}
                                autoFocus
                                className="w-full bg-[#0a0a0a] border border-[#F5C518]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none resize-none"
                              />
                            </div>
                          ) : (
                            f.notes && (
                              <div className="mb-4 bg-[#0a0a0a] rounded-lg p-3">
                                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes</p>
                                <p className="text-sm text-zinc-300">{f.notes}</p>
                              </div>
                            )
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={f.status}
                              onChange={(e) => updateStatus(f.id, e.target.value as ShipyardItem["status"])}
                              className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F5C518]"
                            >
                              <option value="idea">💡 Idea</option>
                              <option value="in-review">🔍 In Review</option>
                              <option value="ready-to-ship">🚀 Ready to Ship</option>
                            </select>
                            <button
                              onClick={() => setEditingNote(editingNote === f.id ? null : f.id)}
                              className="text-sm border border-[#262626] text-zinc-400 px-3 py-2 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
                            >
                              {f.notes ? "Edit Notes" : "+ Add Notes"}
                            </button>
                            {!PRESET_FEATURES.find((p) => p.id === f.id) && (
                              <button
                                onClick={() => removeFromShipyard(f.id)}
                                className="text-sm border border-red-400/20 text-red-400 px-3 py-2 rounded-lg hover:bg-red-400/10 transition ml-auto"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}