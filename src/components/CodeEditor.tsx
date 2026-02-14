"use client";

import Editor from "@monaco-editor/react";
import { Language } from "@/types";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
}: CodeEditorProps) {
  // Mapeo de nuestros lenguajes a los IDs de Monaco
  const monacoLanguageMap: Record<Language, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    go: "go",
    rust: "rust",
    cpp: "cpp",
    csharp: "csharp",
    php: "php",
    ruby: "ruby",
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height="400px"
        language={monacoLanguageMap[language]}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly,
          padding: { top: 16, bottom: 16 },
          cursorBlinking: "smooth",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
