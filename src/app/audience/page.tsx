"use client";

import { useState, useEffect } from "react";
import { BackButton } from "@/components/back-button";
import { useRouter } from "next/navigation";

interface SportInsight {
  sport: string;
  status: "strong" | "weak" | "opportunity";
  explanation: string;
  recommendation: string;
}

interface EngagementAnalysis {
  topPerformers: SportInsight[];
  underperformers: SportInsight[];
  contentGaps: string[];
  priorityList: string[];
}

interface Community {
  name: string;
  platform: string;
  size: string;
  engagementLevel: "high" | "medium" | "low";
  fitScore: number;
  sportsFocus: string;
  demographics: string;
  recommendedApproach: string;
  allowsPromo: boolean;
}

interface CommunityResult {
  communities: Community[];
  topOpportunity: string;
}

interface OpportunityAction {
  action: string;
  expectedReach: string;
  priority: "high" | "medium";
}

interface OpportunityGap {
  sport: string;
  internalGap: string;
  externalOpportunity: string;
  community: string;
}

interface OpportunityMap {
  headline: string;
  gaps: OpportunityGap[];
  actionList: OpportunityAction[];
  weeklyTarget: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_ANALYSIS: EngagementAnalysis = {
  topPerformers: [
    {
      sport: "NBA",
      status: "strong",
      explanation: "NBA content drives 41% of all daily sessions despite being only 28% of total content. Completion rates are 73% — significantly above the 52% app average. Users who play NBA trivia return 2.3x more often than users who only play other sports.",
      recommendation: "Double NBA content output immediately. This is your anchor sport — every week needs at least 2 new NBA trivia games and 1 NBA-tied push notification.",
    },
    {
      sport: "College Basketball",
      status: "strong",
      explanation: "March Madness content spiked DAU by 34% over 3 weeks. College basketball users have the highest share rate in the app — 1 in 8 players shares a result externally.",
      recommendation: "Build a year-round college basketball content calendar, not just March. Conference tournaments, recruiting season, and preseason rankings all drive engagement.",
    },
    {
      sport: "NFL",
      status: "strong",
      explanation: "NFL has the broadest demographic reach — highest engagement from users 25–45. Draft season content outperforms regular season by 2x.",
      recommendation: "Lean into NFL calendar moments: Draft, training camp, Week 1, playoff runs. Don't let NFL go dark in the offseason.",
    },
  ],
  underperformers: [
    {
      sport: "MLB",
      status: "weak",
      explanation: "MLB has the lowest completion rate in the app at 38%. Users start MLB trivia games but abandon them at the halfway point. Difficulty calibration appears off.",
      recommendation: "Audit MLB question difficulty. Too many questions reference pre-2000 stats. Rebuild MLB content around active players and current storylines.",
    },
    {
      sport: "NHL",
      status: "weak",
      explanation: "NHL represents 8% of content but only 3% of sessions. The audience exists during playoffs but there's no consistent engagement between windows.",
      recommendation: "Stop creating general NHL content. Create highly specific content around playoff matchups and individual star players.",
    },
  ],
  contentGaps: [
    "College Football — zero content despite being the #2 most searched sports term in the US. Massive untapped audience that overlaps directly with your existing NFL users.",
    "WNBA — Caitlin Clark drove record viewership in 2024–2025. Zero WNBA content means you're missing a fast-growing demographic of younger female sports fans.",
    "Sports History — users in exit surveys frequently mention wanting 'classic moments' and 'all-time legends' content.",
    "Fantasy Sports crossover — 60M fantasy players in the US. None of your content is designed for fantasy sports audiences specifically.",
  ],
  priorityList: [
    "1. Build 3 new NBA games this week — your highest-ROI content investment",
    "2. Add College Football content immediately — zero cost, massive audience",
    "3. Fix MLB difficulty calibration — easy retention win on existing content",
    "4. Launch WNBA content tied to Caitlin Clark — high virality window",
    "5. Deprioritize NHL until playoff season — focus budget on higher-return sports",
  ],
};

const DEMO_COMMUNITIES: CommunityResult = {
  topOpportunity: "r/nba on Reddit — 7M members, extremely high engagement, and sports trivia content consistently reaches the front page. One well-crafted post tied to a trending NBA moment could drive 2,000–8,000 app installs in 48 hours.",
  communities: [
    {
      name: "r/nba",
      platform: "Reddit",
      size: "7.2M members",
      engagementLevel: "high",
      fitScore: 10,
      sportsFocus: "NBA",
      demographics: "18–34 male, highly engaged, trivia and stats obsessed",
      recommendedApproach: "Post a 'How well do you know [trending player]?' trivia challenge tied to the biggest story of the week. Don't link the app directly — let curiosity drive organic searches.",
      allowsPromo: false,
    },
    {
      name: "r/fantasyfootball",
      platform: "Reddit",
      size: "2.1M members",
      engagementLevel: "high",
      fitScore: 9,
      sportsFocus: "NFL / Fantasy",
      demographics: "25–40 male, highly data-driven, competitive",
      recommendedApproach: "Build a 'Fantasy Football IQ Test' trivia game and post it here during draft season or Week 1. Fantasy players love proving they know more than others.",
      allowsPromo: false,
    },
    {
      name: "r/collegebasketball",
      platform: "Reddit",
      size: "1.4M members",
      engagementLevel: "high",
      fitScore: 9,
      sportsFocus: "College Basketball",
      demographics: "18–28 male, passionate, highly seasonal",
      recommendedApproach: "Post March Madness trivia challenges during tournament season. Time your posts to Elite Eight and Final Four weekends.",
      allowsPromo: false,
    },
    {
      name: "Sports Trivia Discord Network",
      platform: "Discord",
      size: "~180K combined across top 5 servers",
      engagementLevel: "high",
      fitScore: 8,
      sportsFocus: "Multi-Sport",
      demographics: "16–30, highly competitive, daily active users",
      recommendedApproach: "Reach out to server admins directly and offer to run a weekly trivia night using Snapback games.",
      allowsPromo: true,
    },
    {
      name: "NBA Twitter / X Community",
      platform: "X (Twitter)",
      size: "Estimated 4M+ active NBA accounts",
      engagementLevel: "high",
      fitScore: 9,
      sportsFocus: "NBA",
      demographics: "18–35, extremely reactive to live moments, high share rate",
      recommendedApproach: "Post Wemby/LeBron/Curry trivia challenges within 30 minutes of major in-game moments. NBA Twitter moves fast — you have a 2-hour window.",
      allowsPromo: true,
    },
    {
      name: "r/cfb (College Football)",
      platform: "Reddit",
      size: "1.1M members",
      engagementLevel: "high",
      fitScore: 8,
      sportsFocus: "College Football",
      demographics: "18–35 male, extremely passionate, regional loyalty is strong",
      recommendedApproach: "Post a 'CFB IQ Test by Conference' challenge — fans will argue about which conference is smartest, driving comments and visibility.",
      allowsPromo: false,
    },
    {
      name: "Fantasy Sports Facebook Groups",
      platform: "Facebook",
      size: "~500K combined across major groups",
      engagementLevel: "medium",
      fitScore: 7,
      sportsFocus: "Fantasy Sports",
      demographics: "28–45, slightly older than Reddit, disposable income",
      recommendedApproach: "Offer a free 'pre-season trivia challenge' for the group. Older demographic responds to email-style outreach rather than cold posts.",
      allowsPromo: true,
    },
    {
      name: "Bleacher Report App Community",
      platform: "App / Push",
      size: "50M+ downloads",
      engagementLevel: "medium",
      fitScore: 7,
      sportsFocus: "Multi-Sport",
      demographics: "18–40 broad sports fan",
      recommendedApproach: "Use Bleacher Report's trending content as a signal for what trivia topics to build. If it's trending on BR, build a Snapback trivia game around it the same day.",
      allowsPromo: false,
    },
  ],
};

const DEMO_OPPORTUNITY: OpportunityMap = {
  headline: "Your NBA and College Basketball content is your strongest asset — but you're only reaching a fraction of the communities where those fans live. College Football is your single biggest untapped opportunity.",
  gaps: [
    {
      sport: "NBA",
      internalGap: "Strong performance but content output is too low — only 2–3 games per week can't serve a community that wants daily engagement.",
      externalOpportunity: "r/nba alone has 7.2M members. You're reaching none of them organically.",
      community: "r/nba — post weekly trivia challenge tied to top trending player",
    },
    {
      sport: "College Football",
      internalGap: "Zero content despite being one of your users' most requested sports in exit surveys.",
      externalOpportunity: "r/cfb has 1.1M passionate members and zero sports trivia apps targeting them.",
      community: "r/cfb — launch with a 'CFB IQ by Conference' challenge to spark debate",
    },
    {
      sport: "MLB",
      internalGap: "38% completion rate — content exists but users are abandoning it. Difficulty is miscalibrated.",
      externalOpportunity: "MLB Opening Day 2026 is this week — peak interest moment being completely missed.",
      community: "r/baseball — post an Opening Day trivia challenge to capture the seasonal spike",
    },
    {
      sport: "Fantasy Sports",
      internalGap: "No fantasy-specific content despite 60M fantasy players in the US being your ideal demographic.",
      externalOpportunity: "r/fantasyfootball (2.1M members) and Facebook fantasy groups are wide open.",
      community: "r/fantasyfootball — build a 'Fantasy GM IQ Test' and post during draft season",
    },
  ],
  actionList: [
    {
      action: "Post a Wembanyama trivia challenge on r/nba this week tied to his MVP announcement",
      expectedReach: "Est. 20,000–80,000 views if it gains traction. 1–3% conversion = 200–2,400 new downloads",
      priority: "high",
    },
    {
      action: "Build 2 College Football trivia games in Game Studio and post to r/cfb",
      expectedReach: "Est. 5,000–15,000 views. 3–5% Reddit-to-install conversion = 150–750 new downloads",
      priority: "high",
    },
    {
      action: "Fix MLB question difficulty — audit 20 hardest questions and replace with current-player content",
      expectedReach: "Improves MLB completion rate from 38% to est. 55–60%. Retains users already in app.",
      priority: "high",
    },
    {
      action: "Reach out to top 3 Sports Trivia Discord server admins — offer free weekly trivia night",
      expectedReach: "Est. 180K combined Discord members. Organic channel that requires zero ad spend.",
      priority: "medium",
    },
    {
      action: "Launch WNBA content tied to Caitlin Clark — build 1 game in Game Studio this week",
      expectedReach: "Clark content currently has 10–15x normal engagement on sports platforms. High virality window.",
      priority: "medium",
    },
  ],
  weeklyTarget: "Execute the top 3 actions this week. Conservative estimate: 500–3,500 new downloads from organic community posts alone — zero ad spend required.",
};

const OPPORTUNITY_STEPS = [
  "Combining engagement data...",
  "Mapping internal gaps to external communities...",
  "Calculating reach estimates...",
  "Building action list...",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AudiencePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"analyze" | "communities" | "opportunity">("analyze");
  const [analysisInput, setAnalysisInput] = useState("");
  const [communityForm, setCommunityForm] = useState({
    sport: "NBA",
    demographics: "Sports fans aged 18-35",
    contentStyle: "Trivia and stats",
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EngagementAnalysis | null>(null);
  const [communities, setCommunities] = useState<CommunityResult | null>(null);
  const [opportunity, setOpportunity] = useState<OpportunityMap | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [opportunityStep, setOpportunityStep] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading && activeTab === "opportunity") {
      setOpportunityStep(0);
      interval = setInterval(() => {
        setOpportunityStep((s) => (s < OPPORTUNITY_STEPS.length - 1 ? s + 1 : s));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading, activeTab]);

  const generateOpportunity = async () => {
    setActiveTab("opportunity");
    setLoading(true);
    try {
      const res = await fetch("/api/audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "opportunity", analysis, communities }),
      });
      const data = await res.json();
      // Guard against malformed response
      if (data.gaps && data.actionList) {
        setOpportunity(data);
      } else {
        console.error("Opportunity response missing required fields", data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setLoading(true);
    setIsDemo(false);
    try {
      const res = await fetch("/api/audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "analyze", input: analysisInput }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runCommunities = async () => {
    setLoading(true);
    setIsDemo(false);
    try {
      const res = await fetch("/api/audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "communities", ...communityForm }),
      });
      const data = await res.json();
      setCommunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setLoading(false);
    setIsDemo(true);
    if (activeTab === "analyze") {
      setAnalysis(DEMO_ANALYSIS);
    } else if (activeTab === "communities") {
      setCommunities(DEMO_COMMUNITIES);
    } else {
      setAnalysis(DEMO_ANALYSIS);
      setCommunities(DEMO_COMMUNITIES);
      setOpportunity(DEMO_OPPORTUNITY);
    }
  };

  const statusColor = (status: string) => {
    if (status === "strong") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (status === "weak") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]/20";
  };

  const engagementColor = (level: string) => {
    if (level === "high") return "text-emerald-400";
    if (level === "medium") return "text-yellow-400";
    return "text-red-400";
  };

  const platformIcon = (platform: string) => {
    if (platform === "Reddit") return "🟠";
    if (platform === "Discord") return "🟣";
    if (platform.includes("X") || platform.includes("Twitter")) return "⚫";
    if (platform === "Facebook") return "🔵";
    return "⚪";
  };

  const opportunityTabReady = (analysis && communities) || isDemo;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Audience Intelligence</h1>
            {isDemo && (
              <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-1">
            Discover where your best users are — and where the next ones are hiding
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#161616] border border-[#262626] rounded-xl p-1">
          {[
            { id: "analyze", label: "📊 Engagement" },
            { id: "communities", label: "🌐 Communities" },
            { id: "opportunity", label: opportunityTabReady ? "🗺️ Opportunity ✓" : "🗺️ Opportunity" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2.5 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === tab.id ? "bg-[#F5C518] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Engagement Analyzer ── */}
        {activeTab === "analyze" && (
          <>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
              <div className="mb-4">
                <label className="text-sm text-zinc-400 mb-2 block">
                  Describe what's working and what isn't in your app
                </label>
                <textarea
                  value={analysisInput}
                  onChange={(e) => setAnalysisInput(e.target.value)}
                  placeholder="e.g. NBA content gets a lot of plays, MLB feels slow, users seem to drop off on harder questions..."
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518] resize-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={runAnalysis}
                  disabled={loading || !analysisInput.trim()}
                  className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "📊 Analyze My Engagement"}
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

            {loading && <SkeletonLoader />}

            {analysis && !loading && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Top Performers</h2>
                  <div className="space-y-3">
                    {analysis.topPerformers.map((s, i) => (
                      <SportCard key={i} insight={s} statusColor={statusColor} router={router} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Needs Attention</h2>
                  <div className="space-y-3">
                    {analysis.underperformers.map((s, i) => (
                      <SportCard key={i} insight={s} statusColor={statusColor} router={router} />
                    ))}
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Content Gaps</h3>
                  <div className="space-y-3">
                    {analysis.contentGaps.map((gap, i) => (
                      <div key={i} className="flex gap-3 bg-[#0a0a0a] rounded-lg p-3">
                        <span className="text-[#F5C518] shrink-0">→</span>
                        <p className="text-sm text-zinc-300">{gap}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-[#F5C518] uppercase tracking-wide mb-4">Focus Here First</h3>
                  <div className="space-y-2">
                    {analysis.priorityList.map((item, i) => (
                      <p key={i} className="text-sm text-zinc-300">{item}</p>
                    ))}
                  </div>
                </div>

                {!communities && (
                  <button
                    onClick={() => setActiveTab("communities")}
                    className="w-full border border-[#262626] text-zinc-400 font-bold px-6 py-3 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
                  >
                    Next: Find Your Communities →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Tab 2: Community Finder ── */}
        {activeTab === "communities" && (
          <>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Sport Focus</label>
                  <select
                    value={communityForm.sport}
                    onChange={(e) => setCommunityForm({ ...communityForm, sport: e.target.value })}
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
                    <option>Fantasy Sports</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Target Audience</label>
                    <select
                      value={communityForm.demographics}
                      onChange={(e) => setCommunityForm({ ...communityForm, demographics: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                    >
                      <option>Sports fans aged 18-35</option>
                      <option>Sports fans aged 25-45</option>
                      <option>Fantasy sports players</option>
                      <option>College students</option>
                      <option>General sports fans</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Content Style</label>
                    <select
                      value={communityForm.contentStyle}
                      onChange={(e) => setCommunityForm({ ...communityForm, contentStyle: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                    >
                      <option>Trivia and stats</option>
                      <option>Hot takes and debates</option>
                      <option>Highlights and moments</option>
                      <option>Fantasy and predictions</option>
                      <option>History and records</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={runCommunities}
                  disabled={loading}
                  className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {loading ? "Finding communities..." : "🌐 Find My Communities"}
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

            {loading && <SkeletonLoader />}

            {communities && !loading && (
              <div className="space-y-4">
                <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-4">
                  <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Top Opportunity</p>
                  <p className="text-sm text-zinc-300">{communities.topOpportunity}</p>
                </div>

                {communities.communities.map((c, i) => (
                  <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#F5C518]/30 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{platformIcon(c.platform)}</span>
                        <div>
                          <h3 className="font-bold text-white">{c.name}</h3>
                          <p className="text-xs text-zinc-500">{c.platform} · {c.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[#F5C518] font-bold text-sm">{c.fitScore}/10</span>
                        <span className={`text-xs font-medium ${engagementColor(c.engagementLevel)}`}>
                          {c.engagementLevel}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Demographics</p>
                        <p className="text-sm text-zinc-300">{c.demographics}</p>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Promo Allowed</p>
                        <p className={`text-sm font-medium ${c.allowsPromo ? "text-emerald-400" : "text-yellow-400"}`}>
                          {c.allowsPromo ? "✓ Direct promotion ok" : "⚠ Organic only"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#1f1f1f] rounded-lg p-3 mb-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Recommended Approach</p>
                      <p className="text-sm text-zinc-300">{c.recommendedApproach}</p>
                    </div>

                    <button
                      onClick={() => router.push("/influencer")}
                      className="text-sm border border-[#262626] text-zinc-400 px-4 py-2 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
                    >
                      → Find influencers in this community
                    </button>
                  </div>
                ))}

                {analysis && !opportunity && (
                  <button
                    onClick={generateOpportunity}
                    className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
                  >
                    🗺️ Generate Opportunity Map →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Tab 3: Opportunity Map ── */}
        {activeTab === "opportunity" && (
          <>
            {/* Not ready yet */}
            {!opportunity && !loading && (
              <div className="text-center py-20 space-y-4">
                {opportunityTabReady ? (
                  <>
                    <p className="text-zinc-400 text-sm">Both layers complete. Ready to generate your map.</p>
                    <button
                      onClick={generateOpportunity}
                      className="bg-[#F5C518] text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition"
                    >
                      🗺️ Generate Opportunity Map
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-500 text-sm">Complete both Engagement and Community tabs to unlock your Opportunity Map.</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        onClick={() => setActiveTab("analyze")}
                        className={`text-sm px-4 py-2 rounded-lg border transition ${
                          analysis ? "border-emerald-400/30 text-emerald-400" : "border-[#262626] text-zinc-400 hover:border-[#F5C518] hover:text-[#F5C518]"
                        }`}
                      >
                        {analysis ? "✓ Engagement done" : "1. Run Engagement Analysis"}
                      </button>
                      <button
                        onClick={() => setActiveTab("communities")}
                        className={`text-sm px-4 py-2 rounded-lg border transition ${
                          communities ? "border-emerald-400/30 text-emerald-400" : "border-[#262626] text-zinc-400 hover:border-[#F5C518] hover:text-[#F5C518]"
                        }`}
                      >
                        {communities ? "✓ Communities done" : "2. Find Communities"}
                      </button>
                    </div>
                    <button
                      onClick={loadDemo}
                      className="border border-[#F5C518] text-[#F5C518] font-bold px-6 py-3 rounded-lg hover:bg-[#F5C518]/10 transition"
                    >
                      ⚡ Demo
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step-by-step loader */}
            {loading && (
              <div className="space-y-4 py-8">
                <div className="text-center mb-6">
                  <p className="text-[#F5C518] font-medium text-sm mb-1">Building your Opportunity Map</p>
                  <p className="text-zinc-500 text-xs">This combines both analyses — takes about 15 seconds</p>
                </div>
                {OPPORTUNITY_STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= opportunityStep ? "opacity-100" : "opacity-20"}`}>
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      i < opportunityStep ? "bg-emerald-400" : i === opportunityStep ? "bg-[#F5C518] animate-pulse" : "bg-zinc-700"
                    }`} />
                    <p className={`text-sm ${i === opportunityStep ? "text-white" : i < opportunityStep ? "text-emerald-400" : "text-zinc-600"}`}>
                      {step}
                    </p>
                    {i < opportunityStep && <span className="text-emerald-400 text-xs ml-auto">✓</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {opportunity && !loading && (
              <div className="space-y-6">
                <div className="bg-[#161616] border border-[#F5C518]/30 rounded-xl p-6">
                  <p className="text-lg font-bold text-white leading-relaxed">{opportunity.headline}</p>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Gap Analysis</h2>
                  <div className="space-y-3">
                    {opportunity.gaps.map((gap, i) => (
                      <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded">
                            {gap.sport}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div className="bg-[#0a0a0a] rounded-lg p-3">
                            <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Internal Gap</p>
                            <p className="text-sm text-zinc-300">{gap.internalGap}</p>
                          </div>
                          <div className="bg-[#0a0a0a] rounded-lg p-3">
                            <p className="text-xs text-emerald-400 uppercase tracking-wide mb-1">External Opportunity</p>
                            <p className="text-sm text-zinc-300">{gap.externalOpportunity}</p>
                          </div>
                        </div>
                        <div className="bg-[#F5C518]/10 rounded-lg p-3">
                          <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Action</p>
                          <p className="text-sm text-zinc-300">{gap.community}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">This Week's Actions</h2>
                  <div className="space-y-3">
                    {opportunity.actionList.map((action, i) => (
                      <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded border ${
                            action.priority === "high"
                              ? "text-red-400 bg-red-400/10 border-red-400/20"
                              : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                          }`}>
                            {action.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-white mb-2">{action.action}</p>
                        <p className="text-xs text-zinc-500">→ {action.expectedReach}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <button
                            onClick={() => router.push("/generator")}
                            className="text-xs border border-[#262626] text-zinc-400 px-3 py-1.5 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
                          >
                            Build in Game Studio
                          </button>
                          <button
                            onClick={() => router.push("/campaign")}
                            className="text-xs border border-[#262626] text-zinc-400 px-3 py-1.5 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
                          >
                            Add to Campaign
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-6">
                  <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-2">Weekly Target</p>
                  <p className="text-sm text-zinc-300">{opportunity.weeklyTarget}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function SportCard({ insight, statusColor, router }: {
  insight: SportInsight;
  statusColor: (s: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="bg-[#161616] border border-[#262626] rounded-xl p-5 hover:border-[#F5C518]/30 transition">
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded">
          {insight.sport}
        </span>
        <span className={`text-xs px-2 py-1 rounded border ${statusColor(insight.status)}`}>
          {insight.status === "strong" ? "✓ Strong" : insight.status === "weak" ? "Needs work" : "Opportunity"}
        </span>
      </div>
      <p className="text-sm text-zinc-400 mb-3">{insight.explanation}</p>
      <div className="bg-[#0a0a0a] rounded-lg p-3 mb-3">
        <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Recommendation</p>
        <p className="text-sm text-zinc-300">{insight.recommendation}</p>
      </div>
      <button
        onClick={() => router.push("/generator")}
        className="text-xs border border-[#262626] text-zinc-400 px-3 py-1.5 rounded-lg hover:border-[#F5C518] hover:text-[#F5C518] transition"
      >
        → Build content in Game Studio
      </button>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse" />
        Analyzing...
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-16 rounded bg-[#F5C518]/20 animate-pulse" />
            <div className="h-6 w-20 rounded bg-zinc-800 animate-pulse" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full rounded bg-zinc-800 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-zinc-800 animate-pulse" />
          </div>
          <div className="h-16 w-full rounded bg-zinc-800 animate-pulse" />
        </div>
      ))}
    </div>
  );
}