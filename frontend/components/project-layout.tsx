import { Trophy, TrendingUp } from "lucide-react";

interface Project {
  project_id: number;
  score: number;
  title: string;
}

interface FeaturesSectionProps {
  data: { project: Project[] };
}

const medals = ["🥇", "🥈", "🥉"];

export default function ProjectLayout({ data }: FeaturesSectionProps) {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Top Featuring Projects
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Highest-rated projects from the community
            </p>
          </div>
        </div>

        {/* Project Cards */}
        <div className="space-y-4">
          {data.project.map((proj, index) => (
            <div
              key={proj.project_id}
              className="group bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
            >
              <div className="flex items-center gap-5">
                <span className="text-2xl w-8 text-center flex-shrink-0">
                  {medals[index] ?? (
                    <span className="text-zinc-500 font-bold text-lg">
                      {index + 1}
                    </span>
                  )}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Project #{proj.project_id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 bg-zinc-800/80 border border-zinc-700 rounded-full px-4 py-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">
                  {proj.score.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {data.project.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No projects yet. Be the first to ship something great.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
