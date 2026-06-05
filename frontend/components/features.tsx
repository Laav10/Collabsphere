"use client";

import dynamic from "next/dynamic";
import ProjectLayout from "./project-layout";
import Footerpage from "@/components/Footerpage";

// MUI icons
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
      <section className="py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <p className="text-xs tracking-[0.25em] uppercase text-pink-500/70 mb-4 font-medium">
            What you get
          </p>
          <h2 className="text-4xl md:text-[3.25rem] font-bold leading-tight mb-4">
            Built for student
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
              builders.
            </span>
          </h2>
          <p className="text-zinc-400 max-w-md mb-16 leading-relaxed">
            Every feature on CollabSphere is designed around one thing — helping
            students ship real work with real teams.
          </p>

          <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

            {/* Feature cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, description, accent, bg, border }) => (
                <div
                  key={title}
                  className="group relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                  }}
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
                    <Icon style={{ fontSize: 28 }} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-1.5">{title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D scene */}
            <div className="relative h-[440px] lg:h-[560px] rounded-3xl overflow-hidden border border-pink-900/40 bg-zinc-950/60 sticky top-8">
              <Feature3DScene />
              {/* pulse dot only, no "Live" text */}
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
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
