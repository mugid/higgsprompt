import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://higgsfield-swe-hackathon.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const { product } = await request.json();

    if (!product || !product.name || !product.description) {
      return NextResponse.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/ad_ideas/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: {
          name: product.name,
          description: product.description,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to generate ideas: ${response.status} ${response.statusText} - ${errorText}` },
        { status: response.status }
      );
    }

    const ideas = await response.json();
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error generating ideas:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
