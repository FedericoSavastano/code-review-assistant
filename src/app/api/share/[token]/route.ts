import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const params = await context.params;
    const token = params.token;

    const { data: review, error } = await supabase
      .from("code_reviews")
      .select("*")
      .eq("share_token", token)
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
    console.error("Error fetching shared review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch review" },
      { status: 500 },
    );
  }
}
