"use client";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";

interface Project {
  project_id: number;
  score: number;
  title: string;
}

interface FeaturesSectionProps {
  data: { project: Project[] };
}

const topThree = [
  { Icon: LooksOneIcon,  color: "#facc15" }, // gold
  { Icon: LooksTwoIcon,  color: "#94a3b8" }, // silver
  { Icon: Looks3Icon,    color: "#fb923c" }, // bronze
];

export default function ProjectLayout({ data }: FeaturesSectionProps) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-16 bg-zinc-950/50">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 sm:mb-10 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
              <EmojiEventsIcon style={{ fontSize: 22, color: "#f472b6" }} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Top Featuring Projects
            </h2>
            <p className="text-zinc-500 text-sm mt-0.5">
              Highest-rated projects from the community
            </p>
          </div>
        </div>

        {/* Project cards */}
        <div className="space-y-3">
          {data.project.map((proj, index) => {
            const rank = topThree[index];
            return (
              <div
                key={proj.project_id}
                className="group bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Rank indicator */}
                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    {rank ? (
                      <rank.Icon style={{ fontSize: 28, color: rank.color }} />
                    ) : (
                      <span className="text-zinc-500 font-bold text-base">{index + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-pink-300 transition-colors truncate">
                      {proj.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Project #{proj.project_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 bg-zinc-800/80 border border-zinc-700 rounded-full px-3 py-1">
                  <TrendingUpIcon style={{ fontSize: 16, color: "#f472b6" }} />
                  <span className="text-xs sm:text-sm font-semibold text-pink-400">
                    {proj.score.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}

          {data.project.length === 0 && (
            <div className="text-center py-14 text-zinc-500">
              <EmojiEventsIcon style={{ fontSize: 40, opacity: 0.25, color: "#f472b6" }} />
              <p className="text-sm mt-3">No projects yet. Be the first to ship something great.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
