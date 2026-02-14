export type Severity = "critical" | "warning" | "suggestion";

export interface Issue {
  severity: Severity;
  line?: number;
  title: string;
  description: string;
  suggestedCode?: string;
  concept?: string;
}

export interface Analysis {
  issues: Issue[];
  summary: string;
  overallScore?: number; // 0-100
}

export interface CodeReview {
  id: string;
  created_at: string;
  language: string;
  original_code: string;
  analysis: Analysis | null;
  user_id?: string;
  is_public: boolean;
}

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "rust"
  | "cpp"
  | "csharp"
  | "php"
  | "ruby";

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
];
