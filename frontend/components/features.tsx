"use client";

import dynamic from "next/dynamic";
import ProjectLayout from "./project-layout";
import Footerpage from "@/components/Footerpage";

import GroupsIcon from "@mui/icons-material/Groups";
import ExploreIcon from "@mui/icons-material/Explore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TimelineIcon from "@mui/icons-material/Timeline";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ForumIcon from "@mui/icons-material/Forum";

const Feature3DScene = dynamic(() => import("./feature-3d-scene"), { ssr: false });

interface Project {
  project_id: number;
  score: number;
  title: string;
}
interface FeaturesSectionProps {
  data: { project: Project[] };
}

const features = [
  {
    icon: GroupsIcon,
    title: "Team Collaboration",
    description: "Find peers who complement your skills. Form real teams and ship projects from idea to launch.",
    accent: "#f472b6",
    bg: "rgba(244,114,182,0.07)",
    border: "rgba(244,114,182,0.2)",
  },
  {
    icon: ExploreIcon,
    title: "Project Discovery",
    description: "Browse student projects across every domain. Join one that excites you, or post your own.",
    accent: "#e879f9",
    bg: "rgba(232,121,249,0.07)",
    border: "rgba(232,121,249,0.2)",
  },
  {
    icon: AutoAwesomeIcon,
    title: "Skill Matching",
    description: "Smart matching surfaces teammates based on your stack, interests, and bandwidth.",
    accent: "#c084fc",
    bg: "rgba(192,132,252,0.07)",
    border: "rgba(192,132,252,0.2)",
  },
  {
    icon: TimelineIcon,
    title: "Progress Tracking",
    description: "Milestones, contributions, team alignment — lightweight and always in sync.",
    accent: "#f9a8d4",
    bg: "rgba(249,168,212,0.06)",
    border: "rgba(249,168,212,0.18)",
  },
  {
    icon: WorkspacePremiumIcon,
    title: "Portfolio Building",
    description: "Every project you ship lives on your profile. Let your work speak to recruiters.",
    accent: "#d946ef",
    bg: "rgba(217,70,239,0.07)",
    border: "rgba(217,70,239,0.2)",
  },
  {
    icon: ForumIcon,
    title: "Community Hub",
    description: "Discussions, feedback, knowledge sharing — with a network of student builders worldwide.",
    accent: "#a855f7",
    bg: "rgba(168,85,247,0.07)",
    border: "rgba(168,85,247,0.2)",
  },
] as const;

export default function FeaturesSection({ data }: FeaturesSectionProps) {
  return (
    <div className="w-full bg-[#09090b] text-white">

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Header — centered on mobile */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left mb-10 sm:mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-pink-500/70 mb-3 font-medium">
              What you get
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-bold leading-tight mb-3">
              Built for student{" "}
              <span className="text-white">builders.</span>
            </h2>
            <p className="text-zinc-400 max-w-md leading-relaxed text-sm sm:text-base">
              Every feature on CollabSphere is designed around one thing — helping
              students ship real work with real teams.
            </p>
          </div>

          {/* Cards + 3D side-by-side on lg, stacked below */}
          <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-10 items-start">

            {/* Feature cards — 1 col on xs, 2 col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map(({ icon: Icon, title, description, accent, bg, border }) => (
                <div
                  key={title}
                  className="group relative rounded-2xl p-5 sm:p-6 flex flex-col gap-3 sm:gap-4 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: bg, border: `1px solid ${border}` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${accent}22`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <span
                    className="transition-transform duration-300 group-hover:scale-110 w-fit"
                    style={{ color: accent }}
                  >
                    <Icon style={{ fontSize: 26 }} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{title}</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D scene — hidden on xs, shown on sm+, sticky only on lg */}
            <div className="hidden sm:block relative h-[300px] md:h-[400px] lg:h-[560px] rounded-3xl overflow-hidden border border-pink-900/40 bg-zinc-950/60 lg:sticky lg:top-8">
              <Feature3DScene />
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectLayout data={data} />
      <Footerpage />
    </div>
  );
}
