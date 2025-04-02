interface Project {
  project_id: number;
  score: number;
  title: string;
}

interface FeaturesSectionProps {
  data: { project: Project[] };
}

export default function ProjectLayout({ data }: FeaturesSectionProps) {
  return (
    <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-16">
          Best Featuring Projects
        </h1>

        {data.project.map((proj) => (
          <div key={proj.project_id} className="bg-zinc-900 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4">{proj.title}</h2>
            <p className="text-zinc-400">Score: {proj.score.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}