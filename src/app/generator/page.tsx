"use client";

import { useSearchParams } from "next/navigation";
import { BackButton } from "@/components/back-button"
import { useState, Suspense } from "react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  fact: string;
  approved: boolean;
}

interface Game {
  title: string;
  description: string;
  emoji: string;
  questions: Question[];
}

function GeneratorPage() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [difficulty, setDifficulty] = useState("Pro");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const generateGame = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGame(null);
    try {
      const res = await fetch("/api/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, count }),
      });
      const data = await res.json();
      const questions = data.questions.map((q: Question) => ({
        ...q,
        approved: false,
      }));
      setGame({ ...data, questions });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleApprove = (i: number) => {
    if (!game) return;
    const updated = [...game.questions];
    updated[i].approved = !updated[i].approved;
    setGame({ ...game, questions: updated });
  };

  const approveAll = () => {
    if (!game) return;
    const updated = game.questions.map((q) => ({ ...q, approved: true }));
    setGame({ ...game, questions: updated });
  };

  const exportGame = () => {
    if (!game) return;
    const approved = game.questions.filter((q) => q.approved);
    const exportData = { ...game, questions: approved };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${game.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
  };

  const approvedCount = game?.questions.filter((q) => q.approved).length || 0;

  return (
    <div className="min-h-screen bg-[rgb(10,10,10)] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Game Studio</h1>
          <p className="text-zinc-400 mt-1">
            Generate, review, and export trivia games in minutes
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. NBA Finals history, NFL Draft legends..."
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-zinc-400 mb-2 block">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                >
                  <option>Rookie</option>
                  <option>Pro</option>
                  <option>Legend</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm text-zinc-400 mb-2 block">
                  Questions
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C518]"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateGame}
              disabled={loading || !topic.trim()}
              className="bg-[#F5C518] text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Generating game..." : "🎮 Generate Game"}
            </button>
          </div>
        </div>

        {loading && (
        <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] animate-pulse"/>
            Building your trivia game...
            </div>
            {[1,2,3,4,5].map((i) => (
            <div key={i} className="bg-[#161616] border border-[#262626] rounded-xl p-5">
                <div className="h-5 w-3/4 rounded bg-zinc-800 animate-pulse mb-4"/>
                <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="h-10 rounded bg-zinc-800 animate-pulse"/>
                <div className="h-10 rounded bg-zinc-800 animate-pulse"/>
                <div className="h-10 rounded bg-zinc-800 animate-pulse"/>
                <div className="h-10 rounded bg-zinc-800 animate-pulse"/>
                </div>
                <div className="h-3 w-2/3 rounded bg-zinc-700 animate-pulse"/>
            </div>
            ))}
        </div>
        )}

        {game && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {game.emoji} {game.title}
                </h2>
                <p className="text-zinc-400 text-sm mt-1">{game.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={approveAll}
                  className="text-sm border border-[#F5C518] text-[#F5C518] px-4 py-2 rounded-lg hover:bg-[#F5C518]/10 transition"
                >
                  Approve All
                </button>
                <button
                  onClick={exportGame}
                  disabled={approvedCount === 0}
                  className="text-sm bg-[#F5C518] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  Export {approvedCount > 0 ? `(${approvedCount})` : ""} →
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {game.questions.map((q, i) => (
                <div
                  key={i}
                  className={`bg-[#161616] border rounded-xl p-5 transition ${
                    q.approved
                      ? "border-[#F5C518]"
                      : "border-[#262626]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-white mb-3">
                        {i + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
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
                      <p className="text-xs text-zinc-500 italic">
                        💡 {q.fact}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleApprove(i)}
                        className={`text-sm px-3 py-2 rounded-lg font-medium transition ${
                          q.approved
                            ? "bg-[#F5C518] text-black"
                            : "border border-[#262626] text-zinc-400 hover:border-[#F5C518] hover:text-[#F5C518]"
                        }`}
                      >
                        {q.approved ? "✓ Approved" : "Approve"}
                      </button>
                      <button
                        onClick={() => setPreviewIndex(previewIndex === i ? null : i)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition"
                      >
                        {previewIndex === i ? "Hide" : "Preview"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneratorPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]"/>}>
      <GeneratorPage />
    </Suspense>
  )
}