"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Feature3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Central wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    const innerGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x701a75,
      transparent: true,
      opacity: 0.12,
    });
    const innerIco = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerIco);

    // Node network — floating points connected to centre
    const nodeCount = 6;
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];
    const lineObjects: THREE.Line[] = [];

    const nodeColors = [0xf472b6, 0xe879f9, 0xc084fc, 0xd946ef, 0xa855f7, 0xf9a8d4];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const r = 2.6;
      const pos = new THREE.Vector3(
        Math.cos(angle) * r,
        Math.sin(angle) * r * 0.6,
        (Math.random() - 0.5) * 1.5
      );
      nodePositions.push(pos);

      // Sphere node
      const sGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const sMat = new THREE.MeshBasicMaterial({ color: nodeColors[i] });
      const sphere = new THREE.Mesh(sGeo, sMat);
      sphere.position.copy(pos);
      nodeGroup.add(sphere);
      nodeMeshes.push(sphere);

      // Line from node to center
      const linePts = [pos.clone(), new THREE.Vector3(0, 0, 0)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeColors[i],
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      nodeGroup.add(line);
      lineObjects.push(line);
    }

    // Floating particles
    const particleCount = 120;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 10;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animate
    let rafId: number;
    const startTime = performance.now();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;
      ico.rotation.x = t * 0.12;
      ico.rotation.y = t * 0.18;
      innerIco.rotation.x = -t * 0.1;
      innerIco.rotation.y = -t * 0.14;

      // Orbit nodes
      nodeGroup.rotation.y = t * 0.08;
      nodeGroup.rotation.x = Math.sin(t * 0.05) * 0.2;

      // Bob nodes slightly
      nodeMeshes.forEach((mesh, i) => {
        mesh.position.y = nodePositions[i].y + Math.sin(t * 0.8 + i) * 0.12;
      });

      // Camera parallax
      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
