import Image from "next/image";
import Link from "next/link";

export default function ProjectLayout() {
  return (
    
      <main className="flex-grow py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-16 ">
          Best Featuring Projects
        </h1>
          {/* Project Card 1 */}
          <div className="bg-zinc-900 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4">Project Title</h2>
            <p className="text-zinc-400">Project info</p>
          </div>

          {/* Project Card 2 */}
          <div className="bg-zinc-900 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4">Project Title</h2>
            <p className="text-zinc-400">Project info</p>
          </div>

          {/* Project Card 3 */}
          <div className="bg-zinc-900 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4">Project Title</h2>
            <p className="text-zinc-400">Project info</p>
          </div>
        </div>
      </main>

  );
}
