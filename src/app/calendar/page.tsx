"use client";

import { useState } from "react";
import { BackButton } from "@/components/back-button";

interface Post {
  day: number;
  platform: "X" | "Instagram" | "TikTok" | "Reddit";
  contentType: string;
  caption: string;
  hashtags: string[];
  postTime: string;
  format: string;
  cta: string;
  sportsFocus: string;
}

interface ContentCalendar {
  month: string;
  strategy: string;
  posts: Post[];
}

const PLATFORM_COLORS: Record<string, string> = {
  X:         "bg-zinc-700 text-white border-zinc-600",
  Instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  TikTok:    "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Reddit:    "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const PLATFORM_DOT: Record<string, string> = {
  X:         "bg-zinc-400",
  Instagram: "bg-pink-400",
  TikTok:    "bg-cyan-400",
  Reddit:    "bg-orange-400",
};

const DEMO_CALENDAR: ContentCalendar = {
  month: "April 2026",
  strategy: "April is anchored by MLB Opening Month, NBA Playoffs, and NFL Draft. The strategy rotates platforms daily — Reddit for organic community reach, X for real-time sports moments, TikTok for Gen Z acquisition, and Instagram for brand-building. Every post drives to a specific Snapback trivia game or challenge.",
  posts: [
    { day: 1,  platform: "Reddit",    contentType: "Community Post",    sportsFocus: "MLB",              caption: "It's Opening Day — how well do you actually know your team's roster? Take the Snapback MLB IQ test and find out 👇",                                         hashtags: ["#MLB", "#OpeningDay", "#BaseballTrivia"],       postTime: "12:00 PM EST", format: "Text post with app link in comments", cta: "Link in comments — don't self-promo in title" },
    { day: 2,  platform: "X",         contentType: "Hot Take Poll",     sportsFocus: "NBA",              caption: "Unpopular opinion: Wemby is already better than prime KD. Agree or disagree? Test your NBA IQ →",                                                           hashtags: ["#NBA", "#Wembanyama", "#NBATwitter"],           postTime: "7:00 PM EST", format: "Poll + link", cta: "Quote tweet with your take" },
    { day: 3,  platform: "TikTok",    contentType: "Trivia Challenge",  sportsFocus: "Multi-Sport",      caption: "POV: You think you're a sports expert. Answer these 5 questions without looking anything up 👀 #sportsquiz",                                                hashtags: ["#SportsTrivia", "#SportsTok", "#QuizTok"],      postTime: "6:00 PM EST", format: "Talking head or text-on-screen, 30 sec", cta: "Comment your score" },
    { day: 4,  platform: "Instagram", contentType: "Stat Card",         sportsFocus: "NBA Playoffs",     caption: "The NBA Playoffs are here. How deep is your basketball knowledge? Swipe to test yourself with today's hardest question 🏀",                                  hashtags: ["#NBAPlayoffs", "#Basketball", "#SportsQuiz"],   postTime: "5:00 PM EST", format: "Carousel — question on slide 1, answer on slide 2", cta: "Save this post and share your score" },
    { day: 5,  platform: "X",         contentType: "Trending Moment",   sportsFocus: "NBA Playoffs",     caption: "That game last night 👀 Only real fans knew that was coming. Prove you're a real fan →",                                                                     hashtags: ["#NBAPlayoffs", "#NBA", "#Snapback"],            postTime: "9:00 AM EST", format: "React to last night's biggest moment", cta: "Retweet if you called it" },
    { day: 6,  platform: "Reddit",    contentType: "Trivia Thread",     sportsFocus: "NFL Draft",        caption: "NFL Draft is 2 weeks away — how well do you know this year's prospects? [Quiz in comments]",                                                                 hashtags: ["#NFLDraft", "#NFL", "#FootballTrivia"],         postTime: "10:00 AM EST", format: "Text post — build hype with a trivia thread", cta: "Drop your draft grade in comments" },
    { day: 7,  platform: "TikTok",    contentType: "This or That",      sportsFocus: "Multi-Sport",      caption: "This or That: Sports edition 🏆 LeBron or Jordan? Manning or Brady? Snapback or… actually there's only one answer for trivia 😤",                          hashtags: ["#ThisOrThat", "#SportsDebate", "#SportsTok"],   postTime: "7:00 PM EST", format: "Fast-cut this-or-that format, 15 sec", cta: "Duet this with your answers" },
    { day: 8,  platform: "Instagram", contentType: "Weekly Recap",      sportsFocus: "Multi-Sport",      caption: "Week 1 of April in sports was WILD. Here's what happened — and here's the trivia to prove you were paying attention 👇",                                    hashtags: ["#WeeklyRecap", "#Sports", "#SportsApp"],        postTime: "11:00 AM EST", format: "Recap carousel — 5 slides, one story per slide", cta: "Tag a friend who missed the action" },
    { day: 9,  platform: "X",         contentType: "Engagement Bait",   sportsFocus: "NBA Playoffs",     caption: "Name a player eliminated in the first round that you genuinely didn't see coming. I'll start: [answer]. Snapback has a quiz for this 👇",                    hashtags: ["#NBAPlayoffs", "#NBA"],                         postTime: "8:00 PM EST", format: "Conversational thread starter", cta: "Reply with your answer" },
    { day: 10, platform: "Reddit",    contentType: "Community Post",    sportsFocus: "College Basketball", caption: "March Madness is over but the debates aren't. Who had the best tournament run of the past 10 years? [Trivia to back your claim]",                         hashtags: ["#CollegeBasketball", "#MarchMadness"],          postTime: "2:00 PM EST", format: "Discussion post with trivia link", cta: "Make your case with stats" },
    { day: 11, platform: "TikTok",    contentType: "Myth Busting",      sportsFocus: "NFL",              caption: "Things NFL fans believe that are actually myths 🧵 #1: The Super Bowl always has a great halftime show",                                                    hashtags: ["#NFL", "#FootballFacts", "#SportsMyths"],       postTime: "6:00 PM EST", format: "List format, text on screen, 45 sec", cta: "Comment a sports myth you believed" },
    { day: 12, platform: "Instagram", contentType: "Feature Spotlight", sportsFocus: "Multi-Sport",      caption: "Did you know Snapback has 9 AI-powered tools to help you dominate sports trivia? Here's what you're probably not using 👇",                                hashtags: ["#Snapback", "#SportsApp", "#SportsTech"],       postTime: "4:00 PM EST", format: "Feature walkthrough carousel", cta: "Download link in bio" },
    { day: 13, platform: "X",         contentType: "NFL Draft Preview",  sportsFocus: "NFL Draft",       caption: "NFL Draft is in 5 days. Hot take: this is the most talented QB class since 2004. Agree? Disagree? Take the draft IQ quiz first →",                         hashtags: ["#NFLDraft2026", "#NFL", "#QBClass"],            postTime: "12:00 PM EST", format: "Opinion + link", cta: "RT if you agree" },
    { day: 14, platform: "Reddit",    contentType: "Draft Thread",      sportsFocus: "NFL Draft",        caption: "NFL Draft IQ test — how well do you actually know the top prospects? [Results will surprise you]",                                                           hashtags: ["#NFLDraft", "#NFL"],                            postTime: "9:00 AM EST", format: "Trivia thread with results graphic", cta: "Post your score" },
    { day: 15, platform: "TikTok",    contentType: "Draft Day Hype",    sportsFocus: "NFL Draft",        caption: "NFL Draft week 🚨 Every team's biggest need in 10 seconds — how many did you know? #NFLDraft",                                                              hashtags: ["#NFLDraft", "#NFL", "#FootballTok"],            postTime: "5:00 PM EST", format: "Fast facts countdown, 30 sec", cta: "Comment your team's pick prediction" },
    { day: 16, platform: "Instagram", contentType: "Draft Day",         sportsFocus: "NFL Draft",        caption: "NFL Draft Day. The biggest night in football before the season starts. How well do you know draft history? Test yourself 🏈",                               hashtags: ["#NFLDraft2026", "#NFL", "#Football"],           postTime: "7:00 PM EST", format: "Story series — live quiz format", cta: "Answer in Stories before picks are announced" },
    { day: 17, platform: "X",         contentType: "Draft Reactions",   sportsFocus: "NFL Draft",        caption: "Hot take thread: grades for every Round 1 pick. Agree with our AI grades? Take the draft reaction quiz →",                                                  hashtags: ["#NFLDraft", "#DraftDay", "#NFL"],               postTime: "11:00 PM EST", format: "Live reaction thread during draft", cta: "QT with your grade" },
    { day: 18, platform: "Reddit",    contentType: "Post-Draft",        sportsFocus: "NFL",              caption: "Now that Round 1 is done — who won the draft? Here's our AI analysis + a quiz to see if you agree",                                                        hashtags: ["#NFLDraft", "#NFL"],                            postTime: "10:00 AM EST", format: "Analysis post with quiz link", cta: "Upvote if your team won the draft" },
    { day: 19, platform: "TikTok",    contentType: "MLB Hot Streak",    sportsFocus: "MLB",              caption: "This MLB player is on an absolute TEAR right now 🔥 How much do you know about them? 5 questions, let's go",                                               hashtags: ["#MLB", "#BaseballTok", "#HotStreak"],           postTime: "6:00 PM EST", format: "Player spotlight, 30 sec", cta: "Comment your score" },
    { day: 20, platform: "Instagram", contentType: "Milestone Post",    sportsFocus: "NBA Playoffs",     caption: "NBA Playoffs Round 2 is set. Which matchup are you most hyped for? Quiz yourself on every team still standing 🏆",                                          hashtags: ["#NBAPlayoffs", "#NBA", "#Basketball"],          postTime: "3:00 PM EST", format: "Bracket graphic + quiz CTA", cta: "Tag who you think wins it all" },
    { day: 21, platform: "X",         contentType: "Weekly Hot Take",   sportsFocus: "Multi-Sport",      caption: "Weekly hot take: the best athlete alive right now isn't LeBron, Messi, or Mahomes. Fight me. Quiz link to back it up →",                                  hashtags: ["#HotTake", "#Sports", "#GOAT"],                 postTime: "7:00 PM EST", format: "Controversial statement + link", cta: "QT with your GOAT" },
    { day: 22, platform: "Reddit",    contentType: "Community Quiz",    sportsFocus: "NBA",              caption: "Serious question for r/nba: can you name every Finals MVP since 2000 without googling? [Quiz to test yourself]",                                            hashtags: ["#NBA", "#NBAHistory", "#Trivia"],               postTime: "1:00 PM EST", format: "Quiz challenge post", cta: "No googling — post your score" },
    { day: 23, platform: "TikTok",    contentType: "Comparison",        sportsFocus: "Multi-Sport",      caption: "Ranking every major sport by how hard the trivia is 👀 You will be humbled by hockey",                                                                     hashtags: ["#SportsRanking", "#SportsTrivia", "#SportsTok"],postTime: "5:00 PM EST", format: "Tier list format, 45 sec", cta: "Comment if you disagree" },
    { day: 24, platform: "Instagram", contentType: "User Spotlight",    sportsFocus: "Multi-Sport",      caption: "Our users are wild 🤯 Someone just scored a perfect 10/10 on the Legend difficulty NBA quiz. Think you can match it?",                                     hashtags: ["#Challenge", "#Snapback", "#SportsQuiz"],       postTime: "4:00 PM EST", format: "Score card graphic + challenge CTA", cta: "Screenshot your score and tag us" },
    { day: 25, platform: "X",         contentType: "NBA Playoffs",      sportsFocus: "NBA Playoffs",     caption: "NBA Playoffs are getting SERIOUS. Predict the winner of tonight's game — our AI gives you 3 trivia clues to help →",                                       hashtags: ["#NBAPlayoffs", "#NBA", "#Prediction"],          postTime: "6:00 PM EST", format: "Pre-game prediction post", cta: "Drop your prediction" },
    { day: 26, platform: "Reddit",    contentType: "Weekend Quiz",      sportsFocus: "Multi-Sport",      caption: "Weekend sports quiz — 10 questions across 5 sports. What's your score? [No spoilers in comments please]",                                                  hashtags: ["#SportsQuiz", "#Weekend", "#Trivia"],           postTime: "11:00 AM EST", format: "Weekend engagement post", cta: "Spoiler-free scores only" },
    { day: 27, platform: "TikTok",    contentType: "History Lesson",    sportsFocus: "NFL",              caption: "The most underrated NFL Draft pick of the last 20 years — and it's not who you think 🤯 #NFL #NFLDraft",                                                  hashtags: ["#NFL", "#NFLHistory", "#FootballFacts"],        postTime: "7:00 PM EST", format: "Story format with reveal, 30 sec", cta: "Comment who you thought it was" },
    { day: 28, platform: "Instagram", contentType: "Month Recap",       sportsFocus: "Multi-Sport",      caption: "April in sports was genuinely unhinged. MLB drama, NBA Playoffs, NFL Draft — here's the full recap + the trivia to prove you were watching 👀",             hashtags: ["#AprilSports", "#MonthRecap", "#Sports"],       postTime: "12:00 PM EST", format: "Month recap carousel, 8 slides", cta: "Save this — it's a banger" },
    { day: 29, platform: "X",         contentType: "Month Stats",       sportsFocus: "Multi-Sport",      caption: "April stats drop: our users answered 2.3M trivia questions this month. The most missed question? [Thread] →",                                              hashtags: ["#Snapback", "#SportsTrivia", "#MonthlyStats"],  postTime: "10:00 AM EST", format: "Stats thread with engagement hook", cta: "RT if you missed this question too" },
    { day: 30, platform: "Reddit",    contentType: "May Preview",       sportsFocus: "Multi-Sport",      caption: "April's done. May brings NBA Conference Finals, MLB heating up, and Preakness Stakes. Here's your sports calendar for May + a quiz on each →",             hashtags: ["#MayPreview", "#Sports", "#NBAPlayoffs"],       postTime: "2:00 PM EST", format: "Preview post with quiz links", cta: "Save this — you'll need it" },
  ],
};

export default function CalendarPage() {
  const [form, setForm] = useState({
    sports: "NBA, NFL, MLB, College Basketball",
    contentStyle: "Trivia challenges and hot takes",
    upcomingEvents: "NBA Playoffs, NFL Draft, MLB Opening Month",
  });
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<ContentCalendar | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = async () => {
    if (!form.sports.trim()) return;
    setLoading(true);
    setCalendar(null);
    setIsDemo(false);
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setCalendar(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setLoading(false);
    setIsDemo(true);
    setCalendar(DEMO_CALENDAR);
    setExpandedWeek(1);
  };

  const copyCaption = (post: Post) => {
    navigator.clipboard.writeText(`${post.caption}\n\n${post.hashtags.join(" ")}`);
    setCopied(post.day);
    setTimeout(() => setCopied(null), 2000);
  };

  const weeks = calendar ? [
    { label: "Week 1", posts: calendar.posts.filter(p => p.day <= 7) },
    { label: "Week 2", posts: calendar.posts.filter(p => p.day >= 8 && p.day <= 14) },
    { label: "Week 3", posts: calendar.posts.filter(p => p.day >= 15 && p.day <= 21) },
    { label: "Week 4", posts: calendar.posts.filter(p => p.day >= 22 && p.day <= 30) },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
            {isDemo && (
              <span className="bg-[#F5C518] text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-1">
            30-day social media posting schedule across X, Instagram, TikTok, and Reddit
          </p>
        </div>

        {/* Config card */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Sports Focus Areas</label>
              <input
                type="text"
                value={form.sports}
                onChange={(e) => setForm({ ...form, sports: e.target.value })}
                placeholder="e.g. NBA, NFL, MLB, College Basketball..."
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Content Style</label>
                <select
                  value={form.contentStyle}
                  onChange={(e) => setForm({ ...form, contentStyle: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                >
                  <option>Trivia challenges and hot takes</option>
                  <option>Stats and history</option>
                  <option>Debate and engagement</option>
                  <option>Highlights and moments</option>
                  <option>Mix of everything</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Upcoming Events</label>
                <input
                  type="text"
                  value={form.upcomingEvents}
                  onChange={(e) => setForm({ ...form, upcomingEvents: e.target.value })}
                  placeholder="e.g. NBA Playoffs, NFL Draft..."
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
                />
              </div>
            </div>
            <button
              onClick={generate}
              disabled={loading || !form.sports.trim()}
              className="w-full bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Building your calendar..." : "📅 Generate 30-Day Calendar"}
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
              Building your 30-day content calendar...
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-16 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" />
                </div>
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="flex items-center gap-3 py-2 border-b border-[#262626] last:border-0">
                    <div className="h-6 w-6 rounded bg-zinc-800 animate-pulse shrink-0" />
                    <div className="h-4 w-20 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-4 flex-1 rounded bg-zinc-800 animate-pulse" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {calendar && !loading && (
          <div className="space-y-6">
            {/* Strategy banner */}
            <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-4">
              <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-1">Monthly Strategy</p>
              <p className="text-sm text-zinc-300">{calendar.strategy}</p>
            </div>

            {/* Platform legend + view toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                {Object.entries(PLATFORM_DOT).map(([p, dot]) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                    <span className="text-xs text-zinc-400">{p}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-1 bg-[#161616] border border-[#262626] rounded-lg p-1">
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${view === "list" ? "bg-[#F5C518] text-black" : "text-zinc-400 hover:text-white"}`}
                >
                  ☰ List
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${view === "grid" ? "bg-[#F5C518] text-black" : "text-zinc-400 hover:text-white"}`}
                >
                  ⊞ Grid
                </button>
              </div>
            </div>

            {/* ── LIST VIEW ── */}
            {view === "list" && (
              <div className="space-y-3">
                {weeks.map((week, wi) => (
                  <div key={wi} className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedWeek(expandedWeek === wi + 1 ? 0 : wi + 1)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a1a] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F5C518] text-black font-bold text-xs w-8 h-8 rounded-lg flex items-center justify-center">
                          W{wi + 1}
                        </div>
                        <span className="font-medium text-white">{week.label}</span>
                        <div className="flex gap-1">
                          {week.posts.map((p) => (
                            <div key={p.day} className={`h-2 w-2 rounded-full ${PLATFORM_DOT[p.platform]}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-zinc-400 text-sm">{expandedWeek === wi + 1 ? "▲" : "▼"}</span>
                    </button>

                    {expandedWeek === wi + 1 && (
                      <div className="border-t border-[#262626] divide-y divide-[#262626]">
                        {week.posts.map((post) => (
                          <div key={post.day} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-zinc-500 text-xs font-bold w-6">D{post.day}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${PLATFORM_COLORS[post.platform]}`}>
                                  {post.platform}
                                </span>
                                <span className="text-xs text-zinc-500 hidden sm:block">{post.contentType}</span>
                              </div>
                              <span className="text-xs text-zinc-600 shrink-0">{post.postTime}</span>
                            </div>
                            <p className="text-sm text-zinc-300 mb-2 leading-relaxed">{post.caption}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.hashtags.map((h, i) => (
                                <span key={i} className="text-xs text-zinc-500 bg-[#1f1f1f] px-2 py-0.5 rounded">{h}</span>
                              ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                              <div className="bg-[#0a0a0a] rounded-lg p-2">
                                <p className="text-xs text-zinc-600 mb-0.5">Format</p>
                                <p className="text-xs text-zinc-400">{post.format}</p>
                              </div>
                              <div className="bg-[#0a0a0a] rounded-lg p-2">
                                <p className="text-xs text-zinc-600 mb-0.5">CTA</p>
                                <p className="text-xs text-zinc-400">{post.cta}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => copyCaption(post)}
                              className="text-xs bg-[#F5C518] text-black font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition"
                            >
                              {copied === post.day ? "Copied!" : "Copy Caption →"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── GRID VIEW ── */}
            {view === "grid" && (
              <div className="bg-[#161616] border border-[#262626] rounded-xl p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="text-center text-xs text-zinc-600 font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Offset — April 2026 starts on Wednesday (index 2) */}
                  {[0, 1].map((i) => <div key={`empty-${i}`} className="aspect-square" />)}
                  {calendar.posts.map((post) => (
                    <button
                      key={post.day}
                      onClick={() => setExpandedDay(expandedDay === post.day ? null : post.day)}
                      className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 transition ${
                        expandedDay === post.day
                          ? "border-[#F5C518] bg-[#F5C518]/10"
                          : "border-[#262626] hover:border-[#F5C518]/50 bg-[#0a0a0a]"
                      }`}
                    >
                      <span className="text-xs text-zinc-400 font-medium">{post.day}</span>
                      <div className={`h-2 w-2 rounded-full ${PLATFORM_DOT[post.platform]}`} />
                    </button>
                  ))}
                </div>

                {/* Expanded day detail */}
                {expandedDay && (() => {
                  const post = calendar.posts.find(p => p.day === expandedDay);
                  if (!post) return null;
                  return (
                    <div className="mt-4 border-t border-[#262626] pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-white font-bold">Day {post.day}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${PLATFORM_COLORS[post.platform]}`}>
                          {post.platform}
                        </span>
                        <span className="text-xs text-zinc-500">{post.contentType}</span>
                        <span className="text-xs text-zinc-600 ml-auto">{post.postTime}</span>
                      </div>
                      <p className="text-sm text-zinc-300 mb-2 leading-relaxed">{post.caption}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((h, i) => (
                          <span key={i} className="text-xs text-zinc-500 bg-[#1f1f1f] px-2 py-0.5 rounded">{h}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        <div className="bg-[#0a0a0a] rounded-lg p-2">
                          <p className="text-xs text-zinc-600 mb-0.5">Format</p>
                          <p className="text-xs text-zinc-400">{post.format}</p>
                        </div>
                        <div className="bg-[#0a0a0a] rounded-lg p-2">
                          <p className="text-xs text-zinc-600 mb-0.5">CTA</p>
                          <p className="text-xs text-zinc-400">{post.cta}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyCaption(post)}
                        className="text-xs bg-[#F5C518] text-black font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition"
                      >
                        {copied === post.day ? "Copied!" : "Copy Caption →"}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}