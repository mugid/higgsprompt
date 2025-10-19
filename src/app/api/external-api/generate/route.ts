import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://higgsfield-swe-hackathon.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const { model, prompt, images } = await request.json();

    if (!model || !prompt) {
      return NextResponse.json(
        { error: "Model and prompt are required" },
        { status: 400 }
      );
    }

    // Determine the generation type based on model
    const isImageModel = model === "nano-banana" || model === "seedream";
    const isImageToVideoModel = model === "wan-25-fast";
    const isTextToVideoModel = model.includes("kling") || model.includes("minimax") || model.includes("seedance") || model.includes("veo");
    
    let endpoint = "";
    let requestBody = {};

    if (isImageModel) {
      // Use text-to-image endpoint for image models
      endpoint = `${API_BASE_URL}/text-to-image/generate`;
      requestBody = {
        model: model,
        params: {
          model: model,
          prompt: prompt,
          input_images: [],
          aspect_ratio: "1:1",
        },
      };
    } else if (isImageToVideoModel) {
      // Use image-to-video endpoint for image-to-video models
      endpoint = `${API_BASE_URL}/image-to-video/generate`;
      requestBody = {
        model: model,
        params: {
          model: model,
          prompt: prompt,
          input_image: {
            image_url: images && images.length > 0 ? images[0] : "",
          },
          aspect_ratio: "16:9",
        },
      };
    } else if (isTextToVideoModel) {
      // Use text-to-video endpoint for video models
      endpoint = `${API_BASE_URL}/text-to-video/text-to-video/generate`;
      requestBody = {
        model: model,
        params: {
          model: model,
          prompt: prompt,
          input_images: [],
          aspect_ratio: "16:9",
          resolution: "720",
          duration: 5, // Required parameter for text-to-video (5 or 10 seconds)
        },
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported model type" },
        { status: 400 }
      );
    }


    // Submit job to external API
    const submitResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error(`Submit failed for model ${model}:`, errorText);
      return NextResponse.json(
        { error: `Failed to submit generation job: ${submitResponse.status} ${submitResponse.statusText} - ${errorText}` },
        { status: submitResponse.status }
      );
    }

    const submitResult = await submitResponse.json();
    const jobSetId = submitResult.job_set_id;

    if (!jobSetId) {
      return NextResponse.json(
        { error: "No job set ID returned from API" },
        { status: 500 }
      );
    }

    // Get the generated content using the appropriate wait endpoint
    let waitUrl = "";
    let timeout = 30000; // Default 30s for images
    
    if (isImageToVideoModel) {
      waitUrl = `${API_BASE_URL}/image-to-video/jobs/${jobSetId}/wait-video`;
      timeout = 60000; // 60s for video
    } else if (isTextToVideoModel) {
      waitUrl = `${API_BASE_URL}/text-to-video/jobs/${jobSetId}/wait-video`;
      timeout = 60000; // 60s for video
    } else {
      waitUrl = `${API_BASE_URL}/text-to-image/jobs/${jobSetId}/wait-image`;
      timeout = 30000; // 30s for images
    }
    
    const waitResponse = await fetch(waitUrl, {
      method: "GET",
      signal: AbortSignal.timeout(timeout),
    });

    if (!waitResponse.ok) {
      const errorText = await waitResponse.text();
      return NextResponse.json(
        { error: `Generation failed: ${waitResponse.status} ${waitResponse.statusText} - ${errorText}` },
        { status: waitResponse.status }
      );
    }

    // Get the content URL from the response
    let contentUrl = waitResponse.url; // Default to redirect URL
    
    try {
      // Check if response is binary (video/image) or text
      const contentType = waitResponse.headers.get('content-type');
      
      if (contentType && (contentType.includes('video/') || contentType.includes('image/'))) {
        // For binary content, use the redirect URL
        contentUrl = waitResponse.url;
      } else {
        // For text content, try to parse as URL
        const responseText = await waitResponse.text();
        if (responseText && (responseText.startsWith('http://') || responseText.startsWith('https://'))) {
          contentUrl = responseText;
        }
      }
    } catch (e) {
      // Use redirect URL if parsing fails
    }
    
    return NextResponse.json({
      success: true,
      contentUrl,
      jobSetId,
      prompt,
      model,
      type: (isImageToVideoModel || isTextToVideoModel) ? "video" : "image",
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
