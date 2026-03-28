"use client";

import { useState } from "react";
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

export default function FeatureLabPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "validate" | "showcase">("generate");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [validation, setValidation] = useState<Validation | null>(null);

  const run = async () => {
    if (activeTab !== "showcase" && !input.trim()) return;
    setLoading(true);
    setFeatures([]);
    setValidation(null);
    try {
      const res = await fetch("/api/featurelab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, input }),
      });
      const data = await res.json();
      if (activeTab === "validate") {
        setValidation(data);
      } else {
        setFeatures(data.features || []);
      }
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

  const verdictColor = (verdict: string) => {
    if (verdict === "build") return "text-green-400";
    if (verdict === "skip") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Feature Lab</h1>
          <p className="text-zinc-400 mt-1">
            AI-powered product strategy — generate, validate, and discover features that drive growth
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#161616] border border-[#262626] rounded-xl p-1">
          {[
            { id: "generate", label: "💡 Generate Ideas" },
            { id: "validate", label: "✅ Validate Feature" },
            { id: "showcase", label: "🚀 Feature Showcase" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setFeatures([]);
                setValidation(null);
                setInput("");
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#F5C518] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 mb-8">
          {activeTab === "generate" && (
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                What growth goal do you want to achieve?
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. increase daily active users, get more social shares..."
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518] mb-4"
              />
            </div>
          )}

          {activeTab === "validate" && (
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Describe the feature you want to validate
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. A daily streak system where users earn badges for consecutive days playing..."
                rows={3}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#F5C518] mb-4 resize-none"
              />
            </div>
          )}

          {activeTab === "showcase" && (
            <p className="text-zinc-400 text-sm mb-4">
              Generate a curated list of high-impact features ready to build — specifically designed for Snapback's growth stage.
            </p>
          )}

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
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-[#F5C518] text-xl animate-pulse">
              {activeTab === "generate"
                ? "Generating feature ideas..."
                : activeTab === "validate"
                ? "Analyzing your feature..."
                : "Loading feature showcase..."}
            </div>
          </div>
        )}

        {/* Feature Results */}
        {features.length > 0 && !loading && (
          <div className="space-y-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#F5C518]/30 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{f.name}</h3>
                    {f.tagline && (
                      <p className="text-[#F5C518] text-sm mt-0.5">{f.tagline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded border ${categoryColor(f.category)}`}>
                      {f.category}
                    </span>
                    {f.priority && (
                      <span className={`text-xs px-2 py-1 rounded border ${
                        f.priority === "high"
                          ? "text-red-400 bg-red-400/10 border-red-400/20"
                          : "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                      }`}>
                        {f.priority} priority
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-zinc-400 text-sm mb-4">{f.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                      Growth Mechanism
                    </p>
                    <p className="text-sm text-zinc-300">{f.growthMechanism}</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                      Estimated Impact
                    </p>
                    <p className="text-sm text-[#F5C518] font-medium">{f.estimatedImpact}</p>
                    {f.effort && (
                      <p className="text-xs text-zinc-500 mt-1">{f.effort} effort</p>
                    )}
                    {f.buildTime && (
                      <p className="text-xs text-zinc-500 mt-1">~{f.buildTime} to build</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Validation Result */}
        {validation && !loading && (
          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-3xl font-bold uppercase ${verdictColor(validation.verdict)}`}>
                    {validation.verdict === "build"
                      ? "✓ Build It"
                      : validation.verdict === "skip"
                      ? "✗ Skip It"
                      : "⚡ Modify It"}
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">{validation.confidence}% confidence</p>
                </div>
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

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-xs text-green-400 uppercase tracking-wide mb-3">Pros</p>
                  <ul className="space-y-2">
                    {validation.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex gap-2">
                        <span className="text-green-400">✓</span>{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-xs text-red-400 uppercase tracking-wide mb-3">Cons</p>
                  <ul className="space-y-2">
                    {validation.cons.map((con, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex gap-2">
                        <span className="text-red-400">✗</span>{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-lg p-4">
                <p className="text-xs text-[#F5C518] uppercase tracking-wide mb-2">
                  Suggestion
                </p>
                <p className="text-sm text-zinc-300">{validation.suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}