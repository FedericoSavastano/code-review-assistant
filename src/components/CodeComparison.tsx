"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

// Importar dinámicamente para evitar problemas de SSR
const ReactDiffViewer = dynamic(() => import("react-diff-viewer-continued"), {
  ssr: false,
});

interface CodeComparisonProps {
  originalCode: string;
  suggestedCode: string;
  language: string;
  onClose: () => void;
}

export default function CodeComparison({
  originalCode,
  suggestedCode,
  language,
  onClose,
}: CodeComparisonProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparación de Código
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Diff Viewer */}
        <div className="flex-1 overflow-auto">
          <ReactDiffViewer
            oldValue={originalCode}
            newValue={suggestedCode}
            splitView={true}
            leftTitle="Código Original"
            rightTitle="Código Sugerido"
            styles={{
              variables: {
                light: {
                  diffViewerBackground: "#fff",
                  diffViewerColor: "#212529",
                  addedBackground: "#e6ffed",
                  addedColor: "#24292e",
                  removedBackground: "#ffeef0",
                  removedColor: "#24292e",
                  wordAddedBackground: "#acf2bd",
                  wordRemovedBackground: "#fdb8c0",
                  addedGutterBackground: "#cdffd8",
                  removedGutterBackground: "#ffdce0",
                  gutterBackground: "#f6f8fa",
                  gutterBackgroundDark: "#f3f4f6",
                  highlightBackground: "#fffbdd",
                  highlightGutterBackground: "#fff5b1",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
