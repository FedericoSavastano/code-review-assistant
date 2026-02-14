"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { CodeReview } from "@/types";
import HistoryItem from "./HistoryItem";
import { History, Loader2 } from "lucide-react";

interface HistorySidebarProps {
  onSelectReview: (review: CodeReview) => void;
  currentReviewId?: string;
}

export interface HistorySidebarHandle {
  refresh: () => void;
}

const HistorySidebar = forwardRef<HistorySidebarHandle, HistorySidebarProps>(
  ({ onSelectReview, currentReviewId }, ref) => {
    const [reviews, setReviews] = useState<CodeReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();

        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchReviews();
    }, []);

    // Exponer la función refresh al componente padre
    useImperativeHandle(ref, () => ({
      refresh: fetchReviews,
    }));

    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 h-full overflow-y-auto flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Historial</h2>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-8 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No hay reviews aún
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => (
              <HistoryItem
                key={review.id}
                review={review}
                onClick={() => onSelectReview(review)}
                isActive={review.id === currentReviewId}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

HistorySidebar.displayName = "HistorySidebar";

export default HistorySidebar;
