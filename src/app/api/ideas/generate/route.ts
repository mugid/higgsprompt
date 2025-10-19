import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://higgsfield-swe-hackathon.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const { product, company_words } = await request.json();

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
        company_words: company_words || "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to generate ideas: ${response.status} ${response.statusText} - ${errorText}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log("Ideas API response:", responseData);
    
    // Handle different response formats
    let ideasText = "";
    if (typeof responseData === "string") {
      ideasText = responseData;
    } else if (responseData.text) {
      ideasText = responseData.text;
    } else if (responseData.ideas) {
      ideasText = responseData.ideas;
    } else if (responseData.content) {
      ideasText = responseData.content;
    } else if (Array.isArray(responseData)) {
      ideasText = responseData.join("\n");
    } else {
      // If it's an object, try to extract meaningful text
      ideasText = JSON.stringify(responseData, null, 2);
    }
    
    return NextResponse.json({ ideas: ideasText });
  } catch (error) {
    console.error("Error generating ideas:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
