"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FeaturesSection from "@/components/features";
import GoogleLogin from "@/components/GoogleLogin";
import { API_BASE } from "@/lib/api"

const Hero3DScene = dynamic(() => import("@/components/hero-3d-scene"), { ssr: false });

export default function Home() {
  interface Project {
    project_id: number;
    score: number;
    title: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/best_projects`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        setProjects(data.project);
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-pink-600/8 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-[5%] w-[300px] h-[300px] bg-purple-700/6 blur-[90px] rounded-full" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-16 lg:py-20 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

          {/* Left: branding & CTA — centered on mobile, left on lg */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1">

            {/* Brand chip */}
            <div className="inline-flex items-center gap-2 border border-pink-500/25 bg-pink-500/5 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs tracking-widest uppercase text-pink-400 font-medium">
                CollabSphere
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight">
              <span className="text-white">Where</span>
              <br />
              <span className="text-white">
                students
              </span>
              <br />
              <span className="text-white">build.</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xs sm:max-w-sm">
              Connect with the right people, ship meaningful projects, and grow
              your portfolio — all in one place.
            </p>

            <div className="flex justify-center lg:justify-start">
              <GoogleLogin />
            </div>
          </div>

          {/* Right: 3D scene */}
          <div className="order-1 lg:order-2 relative w-full h-[260px] sm:h-[340px] md:h-[440px] lg:h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-pink-500/8 animate-[spin_28s_linear_infinite]" />
            </div>
            <Hero3DScene />
          </div>
        </div>

        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#09090b] pointer-events-none" />
      </section>

      {/* ── Features + Footer ─────────────────────────────── */}
      <FeaturesSection data={{ project: projects }} />
    </main>
  );
}
