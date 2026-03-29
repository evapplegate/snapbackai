"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button";

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

interface Creator {
  name: string;
  platform: string;
  followers: string;
  engagementRate: string;
  sport: string;
  demographics: string;
  whyTheyFit: string;
  contentStyle: string;
}

interface SearchResult {
  creators: Creator[];
  topPick: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_KIT: InfluencerKit = {
  pageTitle: "Pat McAfee's Ultimate NFL IQ Challenge",
  slug: "pat-mcafee-nfl-iq",
  opportunityScore: 10,
  fitReason:
    "Pat McAfee commands one of the most engaged sports audiences on the internet — 3M+ YouTube subscribers and a fanbase that skews exactly toward Snapback's 18–34 male core demographic. His audience already loves trivia-style debates and hot takes, making a custom Snapback challenge a natural fit that won't feel like an ad.",
  questions: [
    {
      question: "Pat McAfee played for which NFL team during his entire 8-year career?",
      options: ["New England Patriots", "Indianapolis Colts", "Pittsburgh Steelers", "Green Bay Packers"],
      correct: 1,
    },
    {
      question: "Which punter record did McAfee break in his first Pro Bowl season?",
      options: ["Most punts in a season", "Highest gross average in AFC history", "Longest punt in Super Bowl history", "Most punts downed inside the 20"],
      correct: 1,
    },
    {
      question: "Before ESPN, Pat McAfee's show was independently distributed on which platform first?",
      options: ["Twitch", "Barstool Sports", "YouTube / his own network", "SiriusXM"],
      correct: 2,
    },
    {
      question: "McAfee is known for his weekly segment with which Green Bay Packers quarterback?",
      options: ["Jordan Love", "Aaron Rodgers", "Brett Favre", "Matt Flynn"],
      correct: 1,
    },
    {
      question: "Which college did Pat McAfee attend before being drafted by the Colts?",
      options: ["Penn State", "Ohio State", "West Virginia", "Michigan"],
      correct: 2,
    },
  ],
  dmDraft:
    "Hey Pat — huge fan of the show. We're building Snapback Sports into the #1 trivia app for NFL fans and we built a custom 'Pat McAfee NFL IQ Challenge' specifically for your audience. Your fans would absolutely destroy it (or embarrass themselves trying). Zero cost, takes 10 min to post — happy to send the full kit. Worth a look? [EDIT BEFORE SENDING]",
  tweetScript:
    "I just took the Snapback Sports NFL IQ Challenge and honestly some of these questions are HARD. Think you know more about the NFL than me? Prove it 👇 snapbacksports.com/challenge/pat-mcafee-nfl-iq",
};

const DEMO_SEARCH: SearchResult = {
  topPick: "Overtime on YouTube — 10M+ subscribers, 18–24 skewing audience, extremely high engagement on sports trivia and challenge content. Best single partnership Snapback could make at this stage.",
  creators: [
    {
      name: "Overtime",
      platform: "YouTube / Instagram",
      followers: "10M+ YouTube, 8M Instagram",
      engagementRate: "4.2%",
      sport: "Multi-Sport",
      demographics: "18–24 male, heavily Gen Z, urban",
      whyTheyFit: "Overtime's audience is exactly Snapback's ideal user — young, sports-obsessed, mobile-first. Their challenge and trivia content consistently hits 1M+ views. A Snapback collab would feel native to their brand.",
      contentStyle: "High-energy challenge videos, player comparisons, viral moments",
    },
    {
      name: "House of Highlights",
      platform: "Instagram / TikTok",
      followers: "27M Instagram, 9M TikTok",
      engagementRate: "2.8%",
      sport: "NBA / Multi-Sport",
      demographics: "18–30 male, NBA-heavy, extremely engaged",
      whyTheyFit: "Largest sports highlight account on Instagram. NBA audience perfectly overlaps with Snapback's highest-performing content. A trivia challenge post here could reach 5–10M people organically.",
      contentStyle: "Highlight clips, player reaction, fan debate",
    },
    {
      name: "Josiah Johnson (KingJosiah54)",
      platform: "TikTok / X",
      followers: "2.1M TikTok, 800K X",
      engagementRate: "6.1%",
      sport: "NBA",
      demographics: "18–28 male, NBA obsessed, extremely vocal",
      whyTheyFit: "One of the most engaged NBA micro-influencers online. His audience genuinely cares about sports IQ and debates — a Snapback challenge would fit perfectly and his 6%+ engagement rate means real conversions.",
      contentStyle: "Hot takes, NBA trivia, debate-style content",
    },
    {
      name: "NFL Draft Bible",
      platform: "X / YouTube",
      followers: "450K X, 120K YouTube",
      engagementRate: "5.3%",
      sport: "NFL Draft / College Football",
      demographics: "22–38 male, serious football fans, draft enthusiasts",
      whyTheyFit: "Extremely targeted NFL Draft audience that Snapback has zero content for right now. High engagement rate means posts actually get seen. A custom Draft IQ challenge would be highly relevant to their audience.",
      contentStyle: "Prospect analysis, draft rankings, scouting breakdowns",
    },
    {
      name: "Swish Cultures",
      platform: "Instagram / TikTok",
      followers: "1.8M Instagram, 600K TikTok",
      engagementRate: "3.9%",
      sport: "NBA",
      demographics: "18–28 male, sneaker and culture crossover",
      whyTheyFit: "NBA lifestyle audience that bridges sports and culture — broader reach than pure sports accounts. Their audience is aspirational and competitive, making trivia challenges a natural fit.",
      contentStyle: "NBA culture, lifestyle, player fashion and personality",
    },
    {
      name: "The Ringer NFL",
      platform: "X / Podcast",
      followers: "320K X, 500K podcast listeners",
      engagementRate: "4.7%",
      sport: "NFL",
      demographics: "25–40 male, highly educated, analytical",
      whyTheyFit: "Older, more analytical NFL audience with high disposable income. They love testing their football knowledge and will engage seriously with a well-crafted NFL IQ challenge.",
      contentStyle: "Analysis, rankings, podcast clips, data-driven takes",
    },
    {
      name: "Ballislife",
      platform: "YouTube / Instagram",
      followers: "5.2M YouTube, 4.1M Instagram",
      engagementRate: "3.2%",
      sport: "Basketball",
      demographics: "16–26 male, hoops-obsessed, grassroots",
      whyTheyFit: "Massive grassroots basketball audience that skews younger than most NBA accounts. High volume of followers means even at 3% engagement, a sponsored post reaches 120K+ people actively.",
      contentStyle: "Streetball, pickup games, player highlights, challenges",
    },
    {
      name: "Fantasy Footballers Podcast",
      platform: "Podcast / X",
      followers: "800K X, 1.2M podcast listeners",
      engagementRate: "5.8%",
      sport: "Fantasy Football",
      demographics: "24–40 male, competitive, data-driven",
      whyTheyFit: "60M Americans play fantasy football and this is their #1 media source. A custom Fantasy GM IQ challenge would be the most relevant Snapback content their audience has ever seen.",
      contentStyle: "Fantasy advice, player analysis, weekly rankings",
    },
  ],
};

export default function InfluencerPage() {
  const [activeTab, setActiveTab] = useState<"find" | "build">("find");

  // Find tab state
  const [searchForm, setSearchForm] = useState({
    sport: "NBA",
    audienceSize: "100K–1M",
    platform: "Any",
    contentStyle: "Trivia and challenges",
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isDemoSearch, setIsDemoSearch] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  // Build Kit tab state
  const [form, setForm] = useState({ name: "", sport: "NBA", audience: "Sports fans aged 18-35" });
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<InfluencerKit | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDemoKit, setIsDemoKit] = useState(false);

  const runSearch = async () => {
    setSearchLoading(true);
    setSearchResult(null);
    setIsDemoSearch(false);
    try {
      const res = await fetch("/api/influencer-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchForm),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadDemoSearch = () => {
    setSearchLoading(false);
    setIsDemoSearch(true);
    setSearchResult(DEMO_SEARCH);
  };

  const generateKitFromCreator = async (creator: Creator) => {
    setGeneratingFor(creator.name);
    setForm({ name: creator.name, sport: creator.sport.split("/")[0].trim(), audience: creator.demographics });
    setActiveTab("build");
    setKit(null);
    setIsDemoKit(false);
    setLoading(true);
    try {
      const res = await fetch("/api/influencer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: creator.name, sport: creator.sport, audience: creator.demographics }),
      });
      const data = await res.json();
      setKit(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setGeneratingFor(null);
    }
  };

  const generate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    setKit(null);
    setIsDemoKit(false);
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

  const loadDemoKit = () => {
    setLoading(false);
    setIsDemoKit(true);
    setKit(DEMO_KIT);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Influencer Kit</h1>
          <p className="text-zinc-400 mt-1">
            Find the right creators and build custom outreach packages in minutes
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#161616] border border-[#262626] rounded-xl p-1">
          {[
            { id: "find", label: "🔍 Find Creators" },
            { id: "build", label: "🎯 Build Kit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id ? "bg-[#F5C518] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Find Creators ── */}
        {activeTab === "find" && (
          <>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Sport / Niche</label>
                  <select
                    value={searchForm.sport}
                    onChange={(e) => setSearchForm({ ...searchForm, sport: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                  >
                    <option>NBA</option>
                    <option>NFL</option>
                    <option>MLB</option>
                    <option>NHL</option>
                    <option>Soccer</option>
                    <option>College Football</option>
                    <option>College Basketball</option>
                    <option>Multi-Sport</option>
                    <option>Fantasy Sports</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Audience Size</label>
                  <select
                    value={searchForm.audienceSize}
                    onChange={(e) => setSearchForm({ ...searchForm, audienceSize: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                  >
                    <option>5K–50K (Nano)</option>
                    <option>50K–100K (Micro)</option>
                    <option>100K–1M (Mid-tier)</option>
                    <option>1M+ (Macro)</option>
                    <option>Any</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Platform</label>
                  <select
                    value={searchForm.platform}
                    onChange={(e) => setSearchForm({ ...searchForm, platform: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                  >
                    <option>Any</option>
                    <option>TikTok</option>
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>X (Twitter)</option>
                    <option>Podcast</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Content Style</label>
                  <select
                    value={searchForm.contentStyle}
                    onChange={(e) => setSearchForm({ ...searchForm, contentStyle: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                  >
                    <option>Trivia and challenges</option>
                    <option>Hot takes and debate</option>
                    <option>Stats and analysis</option>
                    <option>Highlights and moments</option>
                    <option>Fantasy sports</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={runSearch}
                  disabled={searchLoading}
                  className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {searchLoading ? "Finding creators..." : "🔍 Find Creators"}
                </button>
                <button
                  onClick={loadDemoSearch}
                  disabled={searchLoading}
                  className="w-full border border-[#F5C518] text-[#F5C518] font-bold px-6 py-3 rounded-lg hover:bg-[#F5C518]/10 transition disabled:opacity-50"
                >
                  ⚡ Demo
                </button>
              </div>
            </div>

            {searchLoading && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
                  Finding creators...
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse mb-2" />
                        <div className="h-4 w-32 rounded bg-zinc-700 animate-pulse" />
                      </div>
                      <div className="h-8 w-16 rounded bg-[#F5C518]/20 animate-pulse" />
                    </div>
                    <div className="h-4 w-full rounded bg-zinc-800 animate-pulse mb-2" />
                    <div className="h-4 w-4/5 rounded bg-zinc-800 animate-pulse mb-4" />
                    <div className="h-9 w-36 rounded bg-zinc-800 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {searchResult && !searchLoading && (
              <div className="space-y-4">
                {isDemoSearch && (
                  <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-4">
                    <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Top Pick</p>
                    <p className="text-sm text-zinc-300">{searchResult.topPick}</p>
                  </div>
                )}
                {searchResult.creators.map((creator, i) => (
                  <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#F5C518]/30 transition">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{creator.name}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{creator.platform} · {creator.followers}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[#F5C518] font-bold text-sm">{creator.engagementRate}</p>
                        <p className="text-xs text-zinc-500">engagement</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Why They Fit</p>
                        <p className="text-sm text-zinc-300">{creator.whyTheyFit}</p>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Demographics</p>
                        <p className="text-sm text-zinc-300">{creator.demographics}</p>
                      </div>
                    </div>

                    <div className="bg-[#1f1f1f] rounded-lg p-3 mb-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Content Style</p>
                      <p className="text-sm text-zinc-300">{creator.contentStyle}</p>
                    </div>

                    <button
                      onClick={() => generateKitFromCreator(creator)}
                      disabled={generatingFor === creator.name}
                      className="bg-[#F5C518] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition text-sm disabled:opacity-50"
                    >
                      {generatingFor === creator.name ? "Generating..." : "🎯 Generate Kit →"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Tab 2: Build Kit ── */}
        {activeTab === "build" && (
          <>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Influencer Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Pat McAfee, Shannon Sharpe..."
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Sport / Niche</label>
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
                    <label className="text-sm text-zinc-400 mb-2 block">Audience Type</label>
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
                  className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {loading ? "Building influencer kit..." : "🎯 Generate Influencer Kit"}
                </button>
                <button
                  onClick={loadDemoKit}
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
                  Building influencer kit for {form.name}...
                </div>
                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-64 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-8 w-16 rounded bg-[#F5C518]/20 animate-pulse" />
                  </div>
                  <div className="h-4 w-full rounded bg-zinc-800 animate-pulse mb-2" />
                  <div className="h-4 w-4/5 rounded bg-zinc-800 animate-pulse mb-4" />
                  <div className="h-10 w-full rounded bg-zinc-800 animate-pulse" />
                </div>
                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                  <div className="h-4 w-32 rounded bg-zinc-700 animate-pulse mb-4" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-[#0a0a0a] rounded-lg p-4 mb-3">
                      <div className="h-5 w-3/4 rounded bg-zinc-800 animate-pulse mb-3" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-9 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-9 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-9 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-9 rounded bg-zinc-800 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {kit && !loading && (
              <div className="space-y-6">
                {isDemoKit && (
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Demo</span>
                  </div>
                )}

                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{kit.pageTitle}</h2>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-zinc-400 text-sm hidden sm:block">Opportunity Score</span>
                      <span className="bg-[#F5C518] text-black font-bold px-3 py-1 rounded-lg">
                        {kit.opportunityScore}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm mb-3">{kit.fitReason}</p>
                  <div className="bg-[#0a0a0a] rounded-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-zinc-500 text-sm truncate">
                      snapbacksports.com/challenge/{kit.slug}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`snapbacksports.com/challenge/${kit.slug}`, "url")}
                      className="text-[#F5C518] text-xs hover:underline shrink-0 ml-2"
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
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">DM Draft</h3>
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
          </>
        )}
      </div>
    </div>
  );
}