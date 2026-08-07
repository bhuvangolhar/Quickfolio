import { useEffect, useState, useTransition } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchProfile, updateProfile } from "../services/api";
import type { Profile } from "../services/api";
import { SkeletonHero, ErrorBlock } from "./Loader";

interface HeroProps {
  adminMode?: boolean;
}

export default function Hero({ adminMode = false }: HeroProps) {
  const { data: profile, loading, error, refetch } = useFetch(fetchProfile);

  const [editData, setEditData] = useState<Partial<Profile>>({});
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [, startTransition] = useTransition();

  // Keep local edit state synced with fetched profile data
  useEffect(() => {
    if (profile) {
      setEditData(profile);
    }
  }, [profile]);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      await updateProfile(editData);
      setStatus({ message: "Profile saved successfully!", isError: false });
      if (refetch) {
        startTransition(() => {
          refetch();
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save profile.";
      setStatus({ message: errorMsg, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  const scrollToSocials = () => {
    document.querySelector("#socials")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto py-40">
        {loading ? (
          <SkeletonHero />
        ) : error ? (
          <ErrorBlock message={error} />
        ) : profile ? (
          <>
            {adminMode ? (
              /* Admin Editor Panel */
              <div className="space-y-4 text-left w-full max-w-lg mx-auto p-6 rounded-lg border border-dashed border-cyan-400/40 bg-cyan-400/[0.04] backdrop-blur-sm">
                <div className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-semibold mb-2">
                  Edit Profile
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.role ?? ""}
                    placeholder="Role (e.g. Full Stack Developer)"
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full p-2.5 rounded bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                  <input
                    type="text"
                    value={editData.name ?? ""}
                    placeholder="Name"
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-2.5 rounded bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                  <input
                    type="text"
                    value={editData.resume ?? ""}
                    placeholder="Resume URL"
                    onChange={(e) => handleInputChange("resume", e.target.value)}
                    className="w-full p-2.5 rounded bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm"
                  />
                  <textarea
                    value={editData.bio ?? ""}
                    placeholder="Bio description"
                    rows={4}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full p-2.5 rounded bg-white/5 border border-white/15 text-white outline-none focus:border-cyan-400 text-sm resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 rounded text-sm font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                  {status && (
                    <span
                      className={`text-xs font-mono ${
                        status.isError ? "text-red-400" : "text-cyan-400"
                      }`}
                    >
                      {status.message}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Public Hero Display */
              <div className="flex flex-col items-center gap-8 animate-[fadeIn_1s_ease-out_forwards]">
                {/* Role Indicator Badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#00e5a0] shadow-[0_0_8px_#00e5a0]" />
                  <span className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400">
                    {profile.role}
                  </span>
                </div>

                {/* Main Name Heading */}
                <h1
                  className="font-bold leading-none tracking-tight text-[clamp(56px,10vw,96px)] font-serif"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {profile.name.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className={
                        i === 0
                          ? "block text-white"
                          : "block bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent"
                      }
                    >
                      {word}
                    </span>
                  ))}
                </h1>

                {/* Decorative Star Divider */}
                <div className="flex items-center gap-4 w-full max-w-xs justify-center py-2">
                  <div className="flex-1 h-px bg-cyan-400/30" />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="text-cyan-400 fill-current"
                  >
                    <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" />
                  </svg>
                  <div className="flex-1 h-px bg-cyan-400/30" />
                </div>

                {/* Bio Summary */}
                <p className="text-base md:text-lg leading-relaxed max-w-2xl font-light text-gray-300">
                  {profile.bio}
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  {profile.resume && (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-full bg-cyan-400 text-black hover:opacity-90 transition-all duration-300"
                    >
                      <span>↓ Download Resume</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={scrollToSocials}
                    className="inline-flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest uppercase rounded border border-white text-white hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300"
                  >
                    Let's Connect →
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-40">
        <div className="w-px h-10 bg-gradient-to-b from-cyan-400 to-transparent" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400">
          Swipe down
        </span>
      </div>
    </section>
  );
}