"use client";

import { Analysis } from "@/types";
import IssueCard from "./IssueCard";
import { CheckCircle2, Share2, Check } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

interface AnalysisViewProps {
  analysis: Analysis;
  reviewId?: string;
  originalCode?: string;
  language?: string;
}

export default function AnalysisView({
  analysis,
  reviewId,
  originalCode,
  language,
}: AnalysisViewProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const criticalCount = analysis.issues.filter(
    (i) => i.severity === "critical",
  ).length;
  const warningCount = analysis.issues.filter(
    (i) => i.severity === "warning",
  ).length;
  const suggestionCount = analysis.issues.filter(
    (i) => i.severity === "suggestion",
  ).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bueno";
    if (score >= 40) return "Necesita mejoras";
    return "Crítico";
  };

  const handleShare = async () => {
    if (!reviewId) return;

    setIsGeneratingLink(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/share`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setShareUrl(data.shareUrl);
        await copyToClipboard(data.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error generating share link:", error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Score y resumen */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Análisis Completado
            </h2>
            {analysis.overallScore !== undefined && (
              <div className="flex items-baseline gap-2">
                <div
                  className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}
                >
                  {analysis.overallScore}
                </div>
                <div className="text-sm text-gray-600">
                  {getScoreLabel(analysis.overallScore)}
                </div>
              </div>
            )}
          </div>

          {/* Botón compartir */}
          {reviewId && (
            <button
              onClick={handleShare}
              disabled={isGeneratingLink}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Compartir
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{analysis.summary}</p>

        {shareUrl && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">
              Link copiado al portapapeles:
            </p>
            <p className="text-sm text-blue-800 font-mono break-all">
              {shareUrl}
            </p>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">{criticalCount} críticos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">{warningCount} advertencias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">{suggestionCount} sugerencias</span>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Problemas Encontrados ({analysis.issues.length})
        </h3>
        {analysis.issues.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-green-800 font-medium">
              ¡No se encontraron problemas!
            </p>
            <p className="text-green-600 text-sm mt-1">El código se ve bien</p>
          </div>
        ) : (
          analysis.issues.map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              originalCode={originalCode}
              language={language}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
