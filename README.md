# 🔍 Code Review Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> AI-powered code analysis tool that identifies bugs, security vulnerabilities, and code smells in 10+ programming languages with detailed explanations and suggested fixes.

[🚀 Live Demo](https://code-review-assistant-federicosavastano.vercel.app/)

---

## ✨ Features

### 🎯 Core Functionality

- **Multi-language Support**: Analyzes JavaScript, TypeScript, Python, Java, Go, Rust, C++, C#, PHP, and Ruby
- **Intelligent Bug Detection**: Identifies logic errors, edge cases, and potential runtime issues
- **Security Analysis**: Detects vulnerabilities like SQL injection, XSS, insecure dependencies
- **Performance Insights**: Highlights inefficient algorithms and resource-heavy operations
- **Code Smells**: Identifies anti-patterns and violations of best practices

### 💡 Smart Features

- **Severity Classification**:
  - 🔴 **Critical**: Bugs that break functionality
  - 🟡 **Warning**: Security, performance, or maintainability concerns
  - 🔵 **Suggestion**: Best practices and code improvements

- **Contextual Suggestions**: Each issue includes:
  - Line number and surrounding code context
  - Detailed explanation of the problem
  - Suggested fix with corrected code
  - Learning resources and concepts

- **Visual Code Comparison**:
  - Inline side-by-side diff view
  - Full-screen modal with syntax highlighting
  - Toggle between original and suggested code

### 🤝 Collaboration

- **Shareable Reviews**: Generate public links to share analyses with your team
- **Persistent History**: Access all previous code reviews with search functionality
- **Export Options**: Download analysis as JSON or copy to clipboard

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code engine)
- **Diff Viewer**: [react-diff-viewer-continued](https://github.com/praneshr/react-diff-viewer)

### Backend

- **API**: Next.js API Routes (serverless)
- **AI Model**: [Groq](https://groq.com/) (Llama 3.3 70B)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Ready for Supabase Auth integration

### DevOps

- **Hosting**: [Vercel](https://vercel.com/)
- **CI/CD**: Automatic deployments via Vercel
- **Monitoring**: Vercel Analytics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A [Groq API key](https://console.groq.com/)
- A [Supabase project](https://supabase.com/)

### 1. Clone the repository

```bash

```
