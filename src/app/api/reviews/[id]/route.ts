import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Await params en Next.js 15
    const params = await context.params;
    const reviewId = params.id;

    console.log("Fetching review:", reviewId);

    const { data: review, error } = await supabase
      .from("code_reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch review" },
      { status: 500 },
    );
  }
}
