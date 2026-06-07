export function formatScore(score: number | null): string {
  if (score === null) return "N/A";
  return `${Math.round(score)}/100`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k XP`;
  return `${xp} XP`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-orange-100 text-orange-700",
    expert: "bg-red-100 text-red-700",
  };
  return colors[difficulty] ?? "bg-gray-100 text-gray-700";
}
