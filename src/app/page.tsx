"use client";

import { useState, useRef } from "react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisView from "@/components/AnalysisView";
import HistorySidebar, {
  HistorySidebarHandle,
} from "@/components/HistorySidebar";
import { Language, LANGUAGES, Analysis, CodeReview } from "@/types";
import { Code2, Loader2, Sparkles, Menu } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [currentReviewId, setCurrentReviewId] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);

  const sidebarRef = useRef<HistorySidebarHandle>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Por favor, ingresa código para analizar");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      setAnalysis(data.review.analysis);
      setCurrentReviewId(data.review.id);

      // Refrescar el historial
      sidebarRef.current?.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al analizar el código",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewReview = () => {
    setCode("");
    setAnalysis(null);
    setError(null);
    setCurrentReviewId(undefined);
  };

  const handleSelectReview = async (review: CodeReview) => {
    try {
      const response = await fetch(`/api/reviews/${review.id}`);
      const data = await response.json();

      if (data.success) {
        setCode(data.review.original_code);
        setLanguage(data.review.language);
        setAnalysis(data.review.analysis);
        setCurrentReviewId(data.review.id);
      }
    } catch (error) {
      console.error("Error loading review:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar izquierdo - Historial */}
      {showHistory && (
        <HistorySidebar
          ref={sidebarRef}
          onSelectReview={handleSelectReview}
          currentReviewId={currentReviewId}
        />
      )}

      {/* Contenido principal (derecha) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={
                    showHistory ? "Ocultar historial" : "Mostrar historial"
                  }
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Code Review Assistant
                  </h1>
                  <p className="text-sm text-gray-600">
                    Análisis inteligente de código con IA
                  </p>
                </div>
              </div>
              {analysis && (
                <button
                  onClick={handleNewReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Nuevo Análisis
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Área de contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">
            <div className="space-y-6">
              {/* Selector de lenguaje - siempre visible */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lenguaje
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isAnalyzing}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editor de código - siempre visible */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {analysis ? "Código Analizado" : "Tu Código"}
                </label>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  readOnly={isAnalyzing || !!analysis}
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Botón de análisis - solo si no hay análisis */}
              {!analysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !code.trim()}
                  className="
            w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium 
            hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
            transition-all duration-200
            transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl
            flex items-center justify-center gap-2
          "
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analizando código...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analizar Código
                    </>
                  )}
                </button>
              )}

              {/* Vista de análisis - solo si hay análisis */}
              {analysis && (
                <AnalysisView
                  analysis={analysis}
                  reviewId={currentReviewId}
                  originalCode={code}
                  language={language}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
