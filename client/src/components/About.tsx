import { useEffect, useState, useTransition } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchAbout, updateAbout } from "../services/api";
import type { About as AboutType } from "../services/api";
import { SkeletonHero, ErrorBlock } from "./Loader";

interface AboutProps {
  adminMode?: boolean;
}

export default function About({ adminMode = false }: AboutProps) {
  const { data: about, loading, error, refetch } = useFetch(fetchAbout);

  const [editData, setEditData] = useState<Partial<AboutType>>({});
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [, startTransition] = useTransition();

  // Populate local admin form state when data arrives
  useEffect(() => {
    if (about) {
      setEditData(about);
    }
  }, [about]);

  const handleInputChange = (field: keyof AboutType, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      await updateAbout(editData);
      setStatus({ message: "About section saved successfully!", isError: false });
      if (refetch) {
        startTransition(() => {
          refetch();
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save changes.";
      setStatus({ message: errorMsg, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper array to render stat cards systematically
  const statsArray = [
    { value: about?.stat1_value, label: about?.stat1_label },
    { value: about?.stat2_value, label: about?.stat2_label },
    { value: about?.stat3_value, label: about?.stat3_label },
    { value: about?.stat4_value, label: about?.stat4_label },
  ].filter((stat) => Boolean(stat.value));

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0e17]"
    >
      {/* Background Geometry & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Cyan Ambient Glow */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        {/* Decorative Vertical Accent Line */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full py-32 relative z-10">
        <div className="transition-all duration-700 ease-out">
          {loading ? (
            <SkeletonHero />
          ) : error ? (
            <ErrorBlock message={error} />
          ) : about ? (
            <div className="space-y-16">
              {adminMode ? (
                /* Admin Editor Mode */
                <div className="space-y-6 border border-dashed border-cyan-400/60 p-6 rounded-lg bg-slate-950/40 backdrop-blur-sm">
                  <div className="text-xs font-semibold tracking-widest uppercase text-cyan-300">
                    Edit About Section
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editData.section ?? ""}
                      placeholder="Section label (e.g., 01 - ABOUT)"
                      onChange={(e) => handleInputChange("section", e.target.value)}
                      className="w-full p-2.5 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 text-sm"
                    />
                    <input
                      type="text"
                      value={editData.heading ?? ""}
                      placeholder="Heading"
                      onChange={(e) => handleInputChange("heading", e.target.value)}
                      className="w-full p-2.5 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>

                  <textarea
                    value={editData.subtitle ?? ""}
                    placeholder="Subtitle"
                    rows={2}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    className="w-full p-2.5 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 text-sm"
                  />

                  <textarea
                    value={editData.description ?? ""}
                    placeholder="Description"
                    rows={6}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full p-2.5 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 text-sm"
                  />

                  {/* Code Block Fields */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs font-semibold text-cyan-300 mb-3">
                      Terminal Mockup Configuration
                    </div>
                    <input
                      type="text"
                      value={editData.code_filename ?? ""}
                      placeholder="Filename (e.g., config.json)"
                      onChange={(e) => handleInputChange("code_filename", e.target.value)}
                      className="w-full p-2.5 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 font-mono text-xs mb-3"
                    />
                    <textarea
                      value={editData.code_content ?? ""}
                      placeholder="Code content for terminal..."
                      rows={8}
                      onChange={(e) => handleInputChange("code_content", e.target.value)}
                      className="w-full p-2.5 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  {/* Stat Cards Fields */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs font-semibold text-cyan-300 mb-3">
                      Stat Cards
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={editData.stat1_value ?? ""}
                          placeholder="Stat 1 Value (e.g., 10+)"
                          onChange={(e) => handleInputChange("stat1_value", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400 mb-2"
                        />
                        <input
                          type="text"
                          value={editData.stat1_label ?? ""}
                          placeholder="Stat 1 Label"
                          onChange={(e) => handleInputChange("stat1_label", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={editData.stat2_value ?? ""}
                          placeholder="Stat 2 Value"
                          onChange={(e) => handleInputChange("stat2_value", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400 mb-2"
                        />
                        <input
                          type="text"
                          value={editData.stat2_label ?? ""}
                          placeholder="Stat 2 Label"
                          onChange={(e) => handleInputChange("stat2_label", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={editData.stat3_value ?? ""}
                          placeholder="Stat 3 Value"
                          onChange={(e) => handleInputChange("stat3_value", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400 mb-2"
                        />
                        <input
                          type="text"
                          value={editData.stat3_label ?? ""}
                          placeholder="Stat 3 Label"
                          onChange={(e) => handleInputChange("stat3_label", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={editData.stat4_value ?? ""}
                          placeholder="Stat 4 Value"
                          onChange={(e) => handleInputChange("stat4_value", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400 mb-2"
                        />
                        <input
                          type="text"
                          value={editData.stat4_label ?? ""}
                          placeholder="Stat 4 Label"
                          onChange={(e) => handleInputChange("stat4_label", e.target.value)}
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition-colors disabled:opacity-50 text-sm"
                    >
                      {isSaving ? "Saving..." : "Save About Section"}
                    </button>
                    {status && (
                      <span
                        className={`text-xs ${
                          status.isError ? "text-red-400" : "text-cyan-300"
                        }`}
                      >
                        {status.message}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Public View Mode */
                <>
                  {/* Section Label */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-px bg-orange-500" />
                    <span className="text-sm font-mono tracking-[0.25em] uppercase text-cyan-400">
                      {about.section || "ME"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-16">
                    {/* Left Column: Text Content */}
                    <div className="space-y-8">
                      <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white tracking-tight">
                        {about.heading}
                      </h2>

                      {about.subtitle && (
                        <p className="text-cyan-400/80 text-lg leading-relaxed font-light">
                          {about.subtitle}
                        </p>
                      )}

                      {about.description && (
                        <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                          {about.description}
                        </p>
                      )}
                    </div>

                    {/* Right Column: Code Window Mockup */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="relative w-full max-w-md group">
                        {/* Terminal Window Container */}
                        <div className="bg-slate-900/90 rounded-lg border border-cyan-500/40 overflow-hidden shadow-2xl hover:border-cyan-500/60 hover:shadow-cyan-500/30 transition-all duration-300">
                          {/* Window Bar Header */}
                          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                            <span className="ml-2 text-[10px] font-mono text-gray-500">
                              {about.code_filename || "config.json"}
                            </span>
                          </div>

                          {/* Code Display Area */}
                          <div className="p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {about.code_content ? (
                              about.code_content.split("\n").map((line, idx) => {
                                const trimmed = line.trim();
                                if (trimmed.startsWith("//")) {
                                  return (
                                    <div key={idx} className="text-gray-600 italic">
                                      {line}
                                    </div>
                                  );
                                }
                                if (line.includes('"') && line.includes(":")) {
                                  const parts = line.split(":");
                                  return (
                                    <div key={idx}>
                                      <span className="text-cyan-400">{parts[0]}</span>
                                      <span className="text-gray-500">:</span>
                                      <span className="text-green-400">
                                        {parts.slice(1).join(":")}
                                      </span>
                                    </div>
                                  );
                                }
                                if (line.includes('"')) {
                                  return (
                                    <div key={idx} className="text-green-400">
                                      {line}
                                    </div>
                                  );
                                }
                                return (
                                  <div key={idx} className="text-gray-500">
                                    {line}
                                  </div>
                                );
                              })
                            ) : (
                              <span className="text-gray-600">// No code content provided</span>
                            )}
                          </div>
                        </div>

                        {/* Hover Ambient Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 blur-2xl opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Stat Cards Grid */}
                  {statsArray.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                      {statsArray.map((stat, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-slate-900/60 border border-cyan-500/40 rounded-lg p-6 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden"
                        >
                          <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                            {stat.value}
                          </div>
                          <div className="text-xs uppercase tracking-wider text-gray-500 font-light">
                            {stat.label}
                          </div>
                          <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                          <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg blur -z-10 transition-opacity duration-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}