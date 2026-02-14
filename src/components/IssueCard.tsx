"use client";

import { Issue } from "@/types";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Code,
  GitCompare,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import CodeComparison from "./CodeComparison";

interface IssueCardProps {
  issue: Issue;
  originalCode?: string;
  language?: string;
  index?: number;
}

export default function IssueCard({
  issue,
  originalCode,
  language,
  index = 0,
}: IssueCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showInlineComparison, setShowInlineComparison] = useState(true); // Inline por default
  const [showModalComparison, setShowModalComparison] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const severityConfig = {
    critical: {
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      label: "Crítico",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      label: "Advertencia",
    },
    suggestion: {
      icon: Info,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "Sugerencia",
    },
  };

  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  const getCodeContext = (code: string, lineNumber?: number) => {
    if (!lineNumber || !code) return code;

    const lines = code.split("\n");
    const start = Math.max(0, lineNumber - 3);
    const end = Math.min(lines.length, lineNumber + 2);

    return lines.slice(start, end).join("\n");
  };

  const canCompare = originalCode && language && issue.suggestedCode;

  return (
    <>
      <div
        className={`
          border ${config.border} ${config.bg} rounded-lg p-4
          transition-all duration-500 transform
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-semibold ${config.color} uppercase`}
              >
                {config.label}
              </span>
              {issue.line && (
                <span className="text-xs text-gray-500">
                  Línea {issue.line}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>

            <p className="text-sm text-gray-700 mb-3">{issue.description}</p>

            {issue.concept && (
              <div className="mb-3 p-2 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">💡 Concepto:</span>{" "}
                  {issue.concept}
                </p>
              </div>
            )}

            {issue.suggestedCode && (
              <div className="space-y-3">
                {/* Botones de control */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    {showCode ? "Ocultar código" : "Ver código"}
                  </button>

                  {canCompare && showCode && (
                    <button
                      onClick={() =>
                        setShowInlineComparison(!showInlineComparison)
                      }
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      <GitCompare className="w-4 h-4" />
                      {showInlineComparison
                        ? "Ocultar comparación"
                        : "Ver comparación"}
                    </button>
                  )}

                  {canCompare && showCode && (
                    <button
                      onClick={() => setShowModalComparison(true)}
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      <GitCompare className="w-4 h-4" />
                      Pantalla completa
                    </button>
                  )}
                </div>

                {/* Código y comparación */}
                {showCode && (
                  <div className="space-y-3">
                    {/* Comparación inline */}
                    {showInlineComparison && canCompare ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Código original */}
                        <div>
                          <div className="bg-red-50 px-3 py-1 rounded-t border border-b-0 border-red-200">
                            <p className="text-xs font-semibold text-red-700">
                              Original
                            </p>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded-b text-xs overflow-x-auto border border-red-200">
                            <code className="block whitespace-pre-wrap break-words">
                              {getCodeContext(originalCode, issue.line)}
                            </code>
                          </pre>
                        </div>

                        {/* Código sugerido */}
                        <div>
                          <div className="bg-green-50 px-3 py-1 rounded-t border border-b-0 border-green-200">
                            <p className="text-xs font-semibold text-green-700">
                              Sugerido
                            </p>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded-b text-xs overflow-x-auto border border-green-200">
                            <code className="block whitespace-pre-wrap break-words">
                              {issue.suggestedCode}
                            </code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      /* Solo código sugerido si la comparación está oculta */
                      <div>
                        <div className="bg-gray-700 px-3 py-1 rounded-t">
                          <p className="text-xs font-semibold text-gray-100">
                            Código Sugerido
                          </p>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-b text-xs overflow-x-auto">
                          <code className="block whitespace-pre-wrap break-words">
                            {issue.suggestedCode}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de comparación en pantalla completa */}
      {showModalComparison && canCompare && (
        <CodeComparison
          originalCode={getCodeContext(originalCode, issue.line)}
          suggestedCode={issue.suggestedCode!}
          language={language}
          onClose={() => setShowModalComparison(false)}
        />
      )}
    </>
  );
}
