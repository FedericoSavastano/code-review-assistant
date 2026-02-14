"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import AnalysisView from "@/components/AnalysisView";
import { CodeReview, Language } from "@/types";
import { Code2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SharedReviewPage() {
  const params = useParams();
  const token = params.token as string;

  const [review, setReview] = useState<CodeReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReview();
  }, [token]);

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/share/${token}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Review not found");
      }

      setReview(data.review);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load review");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando review...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-600 font-medium mb-2">
              Review no encontrado
            </p>
            <p className="text-red-500 text-sm">
              {error || "Este review no existe o ya no está disponible."}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Code Review Compartido
                </h1>
                <p className="text-sm text-gray-600">
                  Análisis de código con IA
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Crear tu propio análisis
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Info del review */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Lenguaje</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {review.language}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Fecha</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(review.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
          </div>

          {/* Código original */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Código Analizado
            </h2>
            <CodeEditor
              value={review.original_code}
              onChange={() => {}}
              language={review.language as Language}
              readOnly={true}
            />
          </div>

          {/* Análisis */}
          {review.analysis && (
            <AnalysisView
              analysis={review.analysis}
              originalCode={review.original_code}
              language={review.language}
            />
          )}
        </div>
      </div>
    </div>
  );
}
