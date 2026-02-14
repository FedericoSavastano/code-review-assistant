import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { data: reviews, error } = await supabase
      .from("code_reviews")
      .select("id, created_at, language, analysis")
      .order("created_at", { ascending: false })
      .limit(20); // Últimas 20 reviews

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
