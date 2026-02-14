import { NextRequest, NextResponse } from "next/server";
import { analyzeCode } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { Language } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { success: false, message: "Code and language are required" },
        { status: 400 },
      );
    }

    console.log("Analyzing code...");
    console.log("Language:", language);
    console.log("Code length:", code.length);

    // Analizar con IA
    const analysis = await analyzeCode(code, language as Language);

    console.log("Analysis complete:", analysis);

    // Guardar en Supabase
    const { data: review, error } = await supabase
      .from("code_reviews")
      .insert({
        language,
        original_code: code,
        analysis,
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Review saved:", review.id);

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, message: "Analysis failed" },
      { status: 500 },
    );
  }
}
