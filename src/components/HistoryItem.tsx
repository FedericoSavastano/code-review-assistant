"use client";

import { CodeReview } from "@/types";
import { Clock, Code2, TrendingUp } from "lucide-react";

interface HistoryItemProps {
  review: CodeReview;
  onClick: () => void;
  isActive: boolean;
}

export default function HistoryItem({
  review,
  onClick,
  isActive,
}: HistoryItemProps) {
  const date = new Date(review.created_at);
  const timeAgo = getTimeAgo(date);

  const score = review.analysis?.overallScore || 0;
  const issuesCount = review.analysis?.issues.length || 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg border transition-all duration-200
        transform hover:scale-[1.02] hover:shadow-md
        ${
          isActive
            ? "bg-blue-50 border-blue-200 shadow-sm ring-2 ring-blue-100"
            : "bg-white border-gray-200 hover:border-gray-300"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Code2
            className={`w-4 h-4 transition-colors ${isActive ? "text-blue-600" : "text-gray-600"}`}
          />
          <span
            className={`text-sm font-medium capitalize transition-colors ${isActive ? "text-blue-900" : "text-gray-900"}`}
          >
            {review.language}
          </span>
        </div>
        <span
          className={`text-lg font-bold transition-all ${getScoreColor(score)}`}
        >
          {score}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {issuesCount} issues
        </div>
      </div>
    </button>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString("es-AR");
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}
