"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FeaturesSection from "@/components/features";
import GoogleLogin from "@/components/GoogleLogin";

export default function Home() {
  interface Project {
    project_id: number;
    score: number;
    title: string;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/best_projects", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        setProjects(data.project);
      } catch {}
    };
    fetchData();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    // Pink / fuchsia / purple orbital palette
    const orbits = [
      { radius: 100, angle: 0,   color: "#ec4899", speed: 0.0012, size: 11 },
      { radius: 160, angle: 2.1, color: "#e879f9", speed: 0.0009, size: 9  },
      { radius: 220, angle: 4.2, color: "#a855f7", speed: 0.0015, size: 7  },
      { radius: 272, angle: 1.0, color: "#f9a8d4", speed: 0.0007, size: 6  },
    ];

    let rafId: number;

    function drawRing(cx: number, cy: number, r: number, alpha: number) {
      ctx!.beginPath();
      ctx!.strokeStyle = `rgba(236,72,153,${alpha})`;
      ctx!.lineWidth = 0.5;
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.stroke();
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      orbits.forEach((o) => drawRing(cx, cy, o.radius, 0.13));

      // Center glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 58);
      grad.addColorStop(0, "rgba(236,72,153,0.5)");
      grad.addColorStop(0.5, "rgba(168,85,247,0.15)");
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fill();

      // Center disc
      ctx.beginPath();
      ctx.fillStyle = "#1a0520";
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 1.5;
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#f472b6";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CS", cx, cy);

      // Orbiting dots with glow trail
      orbits.forEach((o) => {
        o.angle += o.speed;
        const x = cx + Math.cos(o.angle) * o.radius;
        const y = cy + Math.sin(o.angle) * o.radius;

        const g = ctx.createRadialGradient(x, y, 0, x, y, o.size * 2.4);
        g.addColorStop(0, o.color + "aa");
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(x, y, o.size * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = o.color;
        ctx.arc(x, y, o.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Ambient pink glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[320px] rounded-full bg-pink-600/8 blur-[110px]" />
          <div className="absolute top-[80px] right-[10%] w-[280px] h-[280px] rounded-full bg-purple-600/6 blur-[90px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-28 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: branding */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* Brand chip */}
            <div className="inline-flex items-center gap-2 border border-pink-500/25 bg-pink-500/5 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs tracking-widest uppercase text-pink-400 font-medium">
                CollabSphere
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight">
                <span className="text-white">Where</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                  students
                </span>
                <br />
                <span className="text-white">build.</span>
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
                Connect with the right people, ship meaningful projects, and grow your portfolio — all in one place.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              {[
                { value: "2k+",  label: "Students"     },
                { value: "300+", label: "Projects"     },
                { value: "50+",  label: "Teams formed" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400">
                    {value}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 pt-1">
              <GoogleLogin />
              <button
                onClick={() => router.push("/projects")}
                className="text-sm text-zinc-400 hover:text-pink-400 transition-colors"
              >
                Browse projects →
              </button>
            </div>
          </div>

          {/* Right: canvas */}
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[340px] h-[340px] rounded-full border border-pink-500/10 animate-[spin_22s_linear_infinite]" />
              <div className="absolute w-[250px] h-[250px] rounded-full border border-fuchsia-500/8 animate-[spin_15s_linear_infinite_reverse]" />
            </div>
            <canvas
              ref={canvasRef}
              className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] relative z-10"
            />
          </div>
        </div>

        {/* Fade to section */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#09090b] pointer-events-none" />
      </section>

      {/* ── Features + Footer ─────────────────────────────── */}
      <FeaturesSection data={{ project: projects }} />
    </main>
  );
}
