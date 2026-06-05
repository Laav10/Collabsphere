"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);

    // ── Central glowing sphere ──────────────────────────────
    const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x1a0520,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Wireframe shell
    const wireGeo = new THREE.SphereGeometry(0.74, 18, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Outer glow ring (flat disc)
    const glowGeo = new THREE.RingGeometry(0.76, 1.3, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // ── Orbital rings (tilted like an atom) ─────────────────
    const ringDefs = [
      { tiltX: 0,        tiltZ: 0,          color: 0xec4899, orbitR: 2.0, speed:  0.0014, dotSize: 0.10, dotColor: 0xf472b6 },
      { tiltX: Math.PI/3, tiltZ: Math.PI/6, color: 0xe879f9, orbitR: 2.2, speed: -0.0011, dotSize: 0.085, dotColor: 0xd946ef },
      { tiltX: -Math.PI/4, tiltZ: Math.PI/4, color: 0xa855f7, orbitR: 2.5, speed: 0.0009, dotSize: 0.075, dotColor: 0xc084fc },
    ];

    const ringGroups: {
      group: THREE.Group;
      dot: THREE.Mesh;
      orbitR: number;
      speed: number;
      angle: number;
    }[] = [];

    ringDefs.forEach((def) => {
      const group = new THREE.Group();
      group.rotation.x = def.tiltX;
      group.rotation.z = def.tiltZ;
      scene.add(group);

      // The ring itself
      const rGeo = new THREE.TorusGeometry(def.orbitR, 0.007, 8, 128);
      const rMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.3,
      });
      group.add(new THREE.Mesh(rGeo, rMat));

      // Orbiting dot
      const dGeo = new THREE.SphereGeometry(def.dotSize, 10, 10);
      const dMat = new THREE.MeshBasicMaterial({ color: def.dotColor });
      const dot = new THREE.Mesh(dGeo, dMat);
      group.add(dot);

      // Dot glow (slightly larger transparent sphere)
      const glowDotGeo = new THREE.SphereGeometry(def.dotSize * 2.8, 10, 10);
      const glowDotMat = new THREE.MeshBasicMaterial({
        color: def.dotColor,
        transparent: true,
        opacity: 0.15,
      });
      const glowDot = new THREE.Mesh(glowDotGeo, glowDotMat);
      dot.add(glowDot);

      ringGroups.push({ group, dot, orbitR: def.orbitR, speed: def.speed, angle: Math.random() * Math.PI * 2 });
    });

    // ── Floating particles ──────────────────────────────────
    const pCount = 180;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.8 + Math.random() * 2.2;
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.028,
      transparent: true,
      opacity: 0.55,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Connection lines between dots ───────────────────────
    // Updated each frame
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.12,
    });
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(ringGroups.length * 2 * 3);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(connectionLines);

    // ── Mouse parallax ──────────────────────────────────────
    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // ── Animate ─────────────────────────────────────────────
    let rafId: number;
    const start = performance.now();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = (performance.now() - start) / 1000;

      wire.rotation.y = t * 0.12;
      wire.rotation.x = t * 0.07;
      glow.rotation.z = t * 0.08;

      // Move each orbiting dot
      const dotWorldPos: THREE.Vector3[] = [];
      ringGroups.forEach((r) => {
        r.angle += r.speed;
        r.dot.position.set(
          Math.cos(r.angle) * r.orbitR,
          0,
          Math.sin(r.angle) * r.orbitR
        );
        const wp = new THREE.Vector3();
        r.dot.getWorldPosition(wp);
        dotWorldPos.push(wp);
      });

      // Update connection lines (pair each dot to every other)
      let li = 0;
      for (let a = 0; a < dotWorldPos.length; a++) {
        for (let b = a + 1; b < dotWorldPos.length; b++) {
          linePositions[li++] = dotWorldPos[a].x;
          linePositions[li++] = dotWorldPos[a].y;
          linePositions[li++] = dotWorldPos[a].z;
          linePositions[li++] = dotWorldPos[b].x;
          linePositions[li++] = dotWorldPos[b].y;
          linePositions[li++] = dotWorldPos[b].z;
        }
      }
      // Resize buffer if needed and flag update
      const needed = li;
      const buf = lineGeo.attributes.position as THREE.BufferAttribute;
      if (buf.array.length < needed) {
        const newArr = new Float32Array(needed);
        lineGeo.setAttribute("position", new THREE.BufferAttribute(newArr, 3));
      }
      for (let i = 0; i < needed; i++) {
        (lineGeo.attributes.position as THREE.BufferAttribute).array[i] = linePositions[i];
      }
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      lineGeo.setDrawRange(0, needed / 3);

      // Camera parallax
      camera.position.x += (mx * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (my * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize ──────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
