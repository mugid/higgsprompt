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
    const isImageToVideoModel = model === "kling-2.5-turbo" || model === "minimax-hailuo-02-video" || model === "veo-3" || model === "wan-25-fast";
    const isTextToVideoModel = model === "minimax-t2v" || model === "seedance-v1-lite-t2v";
    
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
      endpoint = `${API_BASE_URL}/text-to-video/generate`;
      requestBody = {
        model: model,
        params: {
          model: model,
          prompt: prompt,
          input_images: [],
          aspect_ratio: "16:9",
          resolution: "768",
          duration: 6,
          "enable_prompt_optimizier": true
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
      let errorText = "";
      try {
        // For text-to-video, don't try to parse as text since it might be binary
        if (isTextToVideoModel) {
          errorText = `Submit failed: ${submitResponse.status} ${submitResponse.statusText}`;
        } else {
          errorText = await submitResponse.text();
        }
      } catch (e) {
        errorText = `Submit failed: ${submitResponse.status} ${submitResponse.statusText}`;
      }
      console.error(`Submit failed for model ${model}:`, errorText);
      return NextResponse.json(
        { error: `Failed to submit generation job: ${submitResponse.status} ${submitResponse.statusText} - ${errorText}` },
        { status: submitResponse.status }
      );
    }

    let submitResult;
    let contentUrl = "";
    
    try {
      // For text-to-video, use the same approach as image-to-video (job-based)
      if (isTextToVideoModel) {
        submitResult = await submitResponse.json();
      } else {
        submitResult = await submitResponse.json();
      }
    } catch (e) {
      console.error("Failed to parse submit response:", e);
      return NextResponse.json(
        { error: `Failed to parse generation job response: ${e instanceof Error ? e.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
    
    const jobSetId = submitResult.job_set_id;

    if (!jobSetId) {
      return NextResponse.json(
        { error: "No job set ID returned from API" },
        { status: 500 }
      );
    }

 
    let waitUrl = "";
    let timeout = 30000; // Default 30s for images
    
    if (isImageToVideoModel || isTextToVideoModel) {
      // Use the same wait endpoint for both image-to-video and text-to-video
      waitUrl = `${API_BASE_URL}/image-to-video/jobs/${jobSetId}/wait-video`;
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
      let errorText = "";
      try {
        // For text-to-video, don't try to parse as text since it might be binary
        if (isTextToVideoModel) {
          errorText = `Generation failed: ${waitResponse.status} ${waitResponse.statusText}`;
        } else {
          errorText = await waitResponse.text();
        }
      } catch (e) {
        errorText = `Generation failed: ${waitResponse.status} ${waitResponse.statusText}`;
      }
      return NextResponse.json(
        { error: `Generation failed: ${waitResponse.status} ${waitResponse.statusText} - ${errorText}` },
        { status: waitResponse.status }
      );
    }

    // Get the content URL from the response
    contentUrl = waitResponse.url; // Default to redirect URL
    
    // For video models (both image-to-video and text-to-video), the API returns a 307 redirect to the video URL
    // We should use the final URL after following redirects
    if (isImageToVideoModel || isTextToVideoModel) {
      contentUrl = waitResponse.url;
    } else {
      try {
        // Check if response is binary (video/image) or text
        const contentType = waitResponse.headers.get('content-type');
        
        if (contentType && (contentType.includes('video/') || contentType.includes('image/'))) {
          // For binary content, use the redirect URL
          contentUrl = waitResponse.url;
        } else {
          // For text content, try to parse as URL
          try {
            const responseText = await waitResponse.text();
            if (responseText && (responseText.startsWith('http://') || responseText.startsWith('https://'))) {
              contentUrl = responseText;
            }
          } catch (textError) {
            // If text parsing fails, use the redirect URL
            console.log("Text parsing failed, using redirect URL:", textError);
          }
        }
      } catch (e) {
        // Use redirect URL if parsing fails
        console.log("Using redirect URL due to parsing error:", e);
      }
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
