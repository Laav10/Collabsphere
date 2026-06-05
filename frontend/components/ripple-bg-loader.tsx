"use client";

import dynamic from "next/dynamic";

const PageRippleBg = dynamic(() => import("./page-ripple-bg"), { ssr: false });

export default function RippleBgLoader() {
  return <PageRippleBg />;
}
