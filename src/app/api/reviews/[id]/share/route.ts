import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateShareToken } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const reviewId = params.id;

    console.log("=== GENERATING SHARE LINK ===");
    console.log("Review ID:", reviewId);

    // Verificar si ya tiene token
    const { data: existingReview, error: fetchError } = await supabase
      .from("code_reviews")
      .select("share_token, id")
      .eq("id", reviewId)
      .single();

    console.log("Existing review:", existingReview);
    console.log("Fetch error:", fetchError);

    if (fetchError) {
      console.error("Error fetching review:", fetchError);
      throw fetchError;
    }

    let shareToken = existingReview?.share_token;

    // Si no tiene token, generar uno nuevo
    if (!shareToken) {
      shareToken = generateShareToken();
      console.log("Generated new token:", shareToken);

      const { data: updatedReview, error: updateError } = await supabase
        .from("code_reviews")
        .update({ share_token: shareToken, is_public: true })
        .eq("id", reviewId)
        .select()
        .single();

      console.log("Update result:", updatedReview);
      console.log("Update error:", updateError);

      if (updateError) {
        console.error("Error updating share token:", updateError);
        throw updateError;
      }
    } else {
      console.log("Using existing token:", shareToken);
    }

    // Generar URL completa
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${shareToken}`;
    console.log("Share URL:", shareUrl);

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl,
    });
  } catch (error) {
    console.error("Error generating share link:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate share link" },
      { status: 500 },
    );
  }
}
