"use client";

import SpinnerMorph from "./spinner-morph";

interface PageLoaderProps {
  size?: number;
  fullScreen?: boolean;
  className?: string;
}

export function PageLoader({ size = 80, fullScreen = false, className }: PageLoaderProps) {
  const wrapper = fullScreen
    ? "h-screen flex items-center justify-center bg-background"
    : "flex items-center justify-center py-16";

  return (
    <div className={`${wrapper} ${className ?? ""}`}>
      <SpinnerMorph size={size} rotateDur="2s" morphDur="6s" />
    </div>
  );
}

export function SectionLoader({ size = 56 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center h-32">
      <SpinnerMorph size={size} rotateDur="2s" morphDur="6s" />
    </div>
  );
}
