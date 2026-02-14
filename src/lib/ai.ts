// import Anthropic from "@anthropic-ai/sdk";
// import { Analysis, Language } from "@/types";

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY!,
// });

// export async function analyzeCode(
//   code: string,
//   language: Language,
// ): Promise<Analysis> {
//   const prompt = `Eres un experto code reviewer. Analiza el siguiente código ${language} y proporciona un análisis detallado.

// Debes responder ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks) con esta estructura exacta:

// {
//   "issues": [
//     {
//       "severity": "critical" | "warning" | "suggestion",
//       "line": número de línea (opcional),
//       "title": "Título corto del problema",
//       "description": "Explicación detallada del problema y por qué importa",
//       "suggestedCode": "Código corregido (opcional)",
//       "concept": "Concepto o patrón relacionado para aprender más (opcional)"
//     }
//   ],
//   "summary": "Resumen general del análisis en 2-3 oraciones",
//   "overallScore": número del 0-100 (calidad general del código)
// }

// Enfócate en:
// 1. Bugs y errores de lógica (severity: critical)
// 2. Problemas de performance y seguridad (severity: warning)
// 3. Mejoras de legibilidad y buenas prácticas (severity: suggestion)

// Código a analizar:

// \`\`\`${language}
// ${code}
// \`\`\`

// Responde SOLO con el JSON, sin texto adicional:`;

//   const message = await anthropic.messages.create({
//     model: "claude-sonnet-4-20250514",
//     max_tokens: 2048,
//     messages: [
//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//   });

//   const textBlock = message.content.find((block) => block.type === "text");
//   if (!textBlock || !("text" in textBlock)) {
//     throw new Error("No response from AI");
//   }

//   let responseText = textBlock.text;

//   // Limpiar la respuesta por si Claude envuelve el JSON en markdown
//   responseText = responseText
//     .replace(/```json\n?/g, "")
//     .replace(/```\n?/g, "")
//     .trim();

//   try {
//     const analysis: Analysis = JSON.parse(responseText);
//     return analysis;
//   } catch (error) {
//     console.error("Error parsing AI response:", responseText);
//     throw new Error("Failed to parse AI response");
//   }
// }

// CON GROQ

import Groq from "groq-sdk";
import { Analysis, Language } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function analyzeCode(
  code: string,
  language: Language,
): Promise<Analysis> {
  const prompt = `Eres un experto code reviewer. Analiza el siguiente código ${language} y proporciona un análisis detallado.

Debes responder ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks, sin explicaciones adicionales) con esta estructura exacta:

{
  "issues": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "line": número de línea (opcional),
      "title": "Título corto del problema",
      "description": "Explicación detallada del problema y por qué importa",
      "suggestedCode": "Código corregido (opcional)",
      "concept": "Concepto o patrón relacionado para aprender más (opcional)"
    }
  ],
  "summary": "Resumen general del análisis en 2-3 oraciones",
  "overallScore": número del 0-100 (calidad general del código)
}

Enfócate en:
1. Bugs y errores de lógica (severity: critical)
2. Problemas de performance y seguridad (severity: warning)
3. Mejoras de legibilidad y buenas prácticas (severity: suggestion)

Código a analizar:

\`\`\`${language}
${code}
\`\`\`

IMPORTANTE: Responde SOLO con el JSON válido, sin texto antes ni después:`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // Modelo gratis y potente
    messages: [
      {
        role: "system",
        content:
          "Eres un experto code reviewer. Siempre respondes con JSON válido, sin markdown ni texto adicional.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3, // Más determinístico
    max_tokens: 2048,
  });

  const responseText = completion.choices[0]?.message?.content || "";

  if (!responseText) {
    throw new Error("No response from AI");
  }

  // Limpiar la respuesta
  let cleanedText = responseText.trim();

  // Eliminar markdown si existe
  cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  // Buscar el JSON dentro del texto (por si hay texto extra)
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanedText = jsonMatch[0];
  }

  try {
    const analysis: Analysis = JSON.parse(cleanedText);

    // Validar que tenga la estructura esperada
    if (!analysis.issues || !Array.isArray(analysis.issues)) {
      throw new Error("Invalid analysis structure");
    }

    return analysis;
  } catch (error) {
    console.error("Error parsing AI response:");
    console.error("Raw response:", responseText);
    console.error("Cleaned text:", cleanedText);
    console.error("Parse error:", error);

    // Fallback: devolver análisis vacío pero válido
    return {
      issues: [],
      summary:
        "No se pudo analizar el código correctamente. Por favor, intenta de nuevo.",
      overallScore: 0,
    };
  }
}
