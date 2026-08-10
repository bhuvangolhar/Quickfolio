import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  resetExperiences,
} from "../services/api";
import type { Experience } from "../services/api";
import { SkeletonExperienceCard, ErrorBlock } from "./Loader";

interface ExperienceProps {
  adminMode?: boolean;
}

const circleGlowStyles = `
  @keyframes circlePulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4), inset 0 0 0 1px rgba(34, 211, 238, 0.5);
    }
    50% {
      box-shadow: 0 0 20px 8px rgba(34, 211, 238, 0.6), inset 0 0 0 1px rgba(34, 211, 238, 0.5);
    }
  }
  .circle-glow {
    animation: circlePulse 3s ease-in-out infinite;
  }
`;

export default function ExperienceSection({ adminMode = false }: ExperienceProps) {
  const { data: experiences, loading, error, refetch } = useFetch(fetchExperiences);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Experience>>({});
  const [status, setStatus] = useState<string>("");

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setEditData({ ...exp });
  };

  const refreshData = async () => {
    if (refetch) {
      await refetch();
    } else {
      window.location.reload();
    }
  };

  const handleSave = async (id: number) => {
    try {
      await updateExperience(id, editData);
      setStatus("Saved!");
      setEditingId(null);
      await refreshData();
    } catch {
      setStatus("Save failed.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      setStatus("Deleted!");
      await refreshData();
    } catch (e: unknown) {
      const errorMsg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : e instanceof Error
          ? e.message
          : "Delete failed.";
      setStatus(`Delete failed: ${errorMsg}`);
    }
  };

  const handleAdd = async () => {
    try {
      await createExperience({
        date_range: "2024 - Present",
        role: "New Role",
        company: "Company Name",
        location: "Location",
        view: "",
        tech_stack: "Tech1, Tech2, Tech3",
        description: "▸ Responsibility 1\n▸ Responsibility 2\n▸ Responsibility 3",
        order: experiences?.length || 0,
      });
      setStatus("Added!");
      await refreshData();
    } catch {
      setStatus("Add failed.");
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset to 3 default experience cards? This will delete ALL current experiences!")) return;
    try {
      await resetExperiences();
      setStatus("Reset to defaults!");
      await refreshData();
    } catch {
      setStatus("Reset failed.");
    }
  };

  // Tech stack form helpers
  const techList = editData.tech_stack ? editData.tech_stack.split(",").map((t) => t.trim()) : [""];

  const handleTechChange = (index: number, value: string) => {
    const updated = [...techList];
    updated[index] = value;
    setEditData((prev) => ({
      ...prev,
      tech_stack: updated.filter((t) => t.trim()).join(", "),
    }));
  };

  const handleAddTech = () => {
    if (techList.length < 5) {
      setEditData((prev) => ({
        ...prev,
        tech_stack: [...techList, ""].join(", "),
      }));
    }
  };

  const handleRemoveTech = (index: number) => {
    const updated = techList.filter((_, idx) => idx !== index);
    setEditData((prev) => ({
      ...prev,
      tech_stack: updated.join(", "),
    }));
  };

  if (error) return <ErrorBlock message={error} />;

  return (
    <section id="experience" className="relative min-h-screen overflow-hidden bg-[#0a0e17] py-32">
      <style>{circleGlowStyles}</style>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-16 h-px bg-orange-500" />
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-cyan-400">
            EXPERIENCE
          </span>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Where I've made
            <br />
            an impact
          </h2>
        </div>

        {/* Admin Controls */}
        {adminMode && !loading && (
          <div className="mb-8 flex gap-4 items-center flex-wrap">
            <button
              type="button"
              onClick={handleAdd}
              className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400 transition-colors"
            >
              + Add Experience
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-orange-500 text-black font-semibold rounded hover:bg-orange-400 transition-colors"
            >
              Reset to 3 Defaults
            </button>
            {status && <span className="text-cyan-300 text-sm">{status}</span>}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="relative">
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-cyan-500/20 hidden md:block" />
            <div className="space-y-12">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="relative">
                  <div className="hidden md:block absolute left-[20px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cyan-500/90 border border-cyan-500/50 z-20" />
                  <div className="md:ml-32">
                    <SkeletonExperienceCard />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Timeline Content */
          <div className="relative">
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-cyan-500/20 hidden md:block" />

            <div className="space-y-12">
              {experiences?.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="circle-glow absolute left-[20px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cyan-500/90 border border-cyan-500/50 z-20 hidden md:block" />

                  <div className="md:ml-32 group">
                    {editingId === exp.id && adminMode ? (
                      /* Edit Mode Form */
                      <div className="bg-slate-900/50 border-2 border-dashed border-cyan-400 rounded-lg p-6 space-y-4">
                        <input
                          type="text"
                          value={editData.date_range ?? ""}
                          placeholder="Date Range (e.g., MAY 2025 - PRESENT)"
                          onChange={(e) =>
                            setEditData((d) => ({ ...d, date_range: e.target.value }))
                          }
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-cyan-400 text-sm font-mono outline-none focus:border-cyan-400"
                        />
                        <input
                          type="text"
                          value={editData.role ?? ""}
                          placeholder="Role Title"
                          onChange={(e) =>
                            setEditData((d) => ({ ...d, role: e.target.value }))
                          }
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-xl font-bold outline-none focus:border-cyan-400"
                        />
                        <input
                          type="text"
                          value={editData.company ?? ""}
                          placeholder="Company Name"
                          onChange={(e) =>
                            setEditData((d) => ({ ...d, company: e.target.value }))
                          }
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-gray-400 outline-none focus:border-cyan-400"
                        />
                        <input
                          type="text"
                          value={editData.location ?? ""}
                          placeholder="Location"
                          onChange={(e) =>
                            setEditData((d) => ({ ...d, location: e.target.value }))
                          }
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-gray-500 text-sm outline-none focus:border-cyan-400"
                        />
                        <input
                          type="text"
                          value={editData.view ?? ""}
                          placeholder="View Link (optional URL)"
                          onChange={(e) =>
                            setEditData((d) => ({ ...d, view: e.target.value }))
                          }
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-gray-500 text-sm outline-none focus:border-cyan-400"
                        />

                        {/* Dynamic Tech Stack Input */}
                        <div className="space-y-2">
                          <label className="text-cyan-400 text-sm font-semibold">
                            Tech Stack (Max 5)
                          </label>
                          {techList.map((tech, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                type="text"
                                value={tech}
                                placeholder={`Technology ${i + 1}`}
                                onChange={(e) => handleTechChange(i, e.target.value)}
                                className="flex-1 p-2 rounded border border-white/20 bg-slate-900 text-cyan-300 text-sm outline-none focus:border-cyan-400"
                              />
                              {techList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTech(i)}
                                  className="px-3 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 text-sm"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}

                          {techList.length < 5 && (
                            <button
                              type="button"
                              onClick={handleAddTech}
                              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm rounded hover:bg-cyan-500/30 border border-cyan-400/30"
                            >
                              + Add Tech ({techList.length}/5)
                            </button>
                          )}
                        </div>

                        <textarea
                          value={editData.description ?? ""}
                          placeholder="Description (use ▸ for bullet points)"
                          rows={6}
                          onChange={(e) =>
                            setEditData((d) => ({ ...d, description: e.target.value }))
                          }
                          className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                        />
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleSave(exp.id)}
                            className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Read-Only View Card */
                      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                        <div className="text-xs font-mono tracking-[0.2em] uppercase text-cyan-400 mb-4">
                          {exp.date_range}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>

                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <p className="text-gray-300 font-medium">{exp.company}</p>
                            {exp.location && (
                              <>
                                <span className="text-gray-600">•</span>
                                <p className="text-gray-500 text-sm">{exp.location}</p>
                              </>
                            )}
                            {exp.view && (
                              <>
                                <span className="text-gray-600">•</span>
                                <a
                                  href={exp.view}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 text-sm hover:text-cyan-300"
                                >
                                  View
                                </a>
                              </>
                            )}
                          </div>

                          {/* Tech Stack Pills */}
                          {exp.tech_stack && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {exp.tech_stack.split(",").map((tech, i, arr) => (
                                <span key={i} className="flex items-center gap-2">
                                  <span className="text-cyan-400 text-sm font-medium px-3 py-1 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                                    {tech.trim()}
                                  </span>
                                  {i < arr.length - 1 && (
                                    <span className="text-cyan-400/50">•</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Description Lines */}
                        <div className="space-y-3">
                          {exp.description?.split("\n").map((line, i) => {
                            const trimmed = line.trim();
                            const isBullet = trimmed.startsWith("▸");
                            return (
                              <div
                                key={i}
                                className="flex items-start gap-3 text-gray-400 leading-relaxed"
                              >
                                {isBullet ? (
                                  <>
                                    <span className="text-cyan-400 mt-1">▸</span>
                                    <span>{trimmed.replace("▸", "").trim()}</span>
                                  </>
                                ) : (
                                  <span className="pl-6">{line}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Admin Action Buttons */}
                        {adminMode && (
                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={() => handleEdit(exp)}
                              className="px-4 py-2 border border-cyan-400/50 text-cyan-400 text-sm rounded hover:bg-cyan-400/10 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(exp.id)}
                              className="px-4 py-2 border border-red-400/50 text-red-400 text-sm rounded hover:bg-red-400/10 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!experiences || experiences.length === 0) && !loading && !adminMode && (
          <div className="text-center py-20 text-gray-500">
            No experience entries yet.
          </div>
        )}
      </div>
    </section>
  );
}