import ProjectLayout from "./project-layout";
import Footerpage from '@/components/Footerpage'
import {
  CuboidIcon as Cube,
  Layers,
  RotateCcw,
  Scissors,
  MonitorSmartphone,
} from "lucide-react";


interface Project {
  project_id: number;
  score: number;
  title: string;
}
interface FeaturesSectionProps {
  data: { project: Project[] };
}
export default function FeaturesSection({ data }: FeaturesSectionProps) {
  
  return (
    <div className="w-full bg-black text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          Our Features
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-zinc-900 rounded-lg p-8 flex flex-col items-center">
            <div className="bg-zinc-800 p-4 rounded-2xl mb-6">
              <Cube className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Title</h3>
            <p className="text-zinc-400 text-center">Description</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900 rounded-lg p-8 flex flex-col items-center">
            <div className="bg-zinc-800 p-4 rounded-2xl mb-6">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Title</h3>
            <p className="text-zinc-400 text-center">Description</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900 rounded-lg p-8 flex flex-col items-center">
            <div className="bg-zinc-800 p-4 rounded-2xl mb-6">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Title</h3>
            <p className="text-zinc-400 text-center">Description</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-zinc-900 rounded-lg p-8 flex flex-col items-center">
            <div className="bg-zinc-800 p-4 rounded-2xl mb-6">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Title</h3>
            <p className="text-zinc-400 text-center">Description</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-zinc-900 rounded-lg p-8 flex flex-col items-center">
            <div className="bg-zinc-800 p-4 rounded-2xl mb-6">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Title</h3>
            <p className="text-zinc-400 text-center">Description</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-zinc-900 rounded-lg p-8 flex flex-col items-center">
            <div className="bg-zinc-800 p-4 rounded-2xl mb-6">
              <MonitorSmartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Title</h3>
            <p className="text-zinc-400 text-center">Description</p>
          </div>
        </div>
      </div>
      <ProjectLayout data={data}  />
      <Footerpage />
    </div>
  );
}