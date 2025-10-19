"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@/components/uploadthing-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";

interface SolutionFormProps {
  postId: string;
  postType: "image" | "video";
  onSolutionSubmit: (solution: {
    text: string;
    modelName: string;
    mediaContent: string[];
  }) => void;
}

interface Model {
  id: string;
  name: string;
  category: "text-to-image" | "text-to-video" | "image-to-video";
  description?: string;
}

const MODELS: Model[] = [
  // Text-to-image models
  { id: "nano-banana", name: "Nano Banana", category: "text-to-image" },
  { id: "seedream", name: "Seedream 4.0", category: "text-to-image" },
  
  // Text-to-video models
  // { id: "minimax-t2v", name: "Minimax Hailuo 02", category: "text-to-video" },
  // { id: "seedance-v1-lite-t2v", name: "Seedance 1.0 Lite", category: "text-to-video" },
  
  // Image-to-video models
  // { id: "kling-2.5-turbo", name: "Kling 2.5 Turbo", category: "image-to-video" },
  // { id: "minimax-hailuo-02-video", name: "Minimax Hailuo 02", category: "image-to-video" },
  // { id: "veo-3", name: "Veo 3", category: "image-to-video" },
  { id: "wan-25-fast", name: "Wan 2.5 Fast", category: "image-to-video" },
];

// Using our server-side proxy instead of direct API calls

export function SolutionForm({ postId, postType, onSolutionSubmit }: SolutionFormProps) {
  const [text, setText] = useState("");
  const [modelName, setModelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filter available models based on post type
  useEffect(() => {
    let filteredModels: Model[] = [];
    
    if (postType === "image") {
      // For image posts, only show text-to-image models
      filteredModels = MODELS.filter(model => model.category === "text-to-image");
    } else if (postType === "video") {
      // For video posts, show both text-to-video and image-to-video models
      filteredModels = MODELS.filter(model => 
        model.category === "text-to-video" || model.category === "image-to-video"
      );
    }
    
    setAvailableModels(filteredModels);
  }, [postType]);

  // Update selected model when modelName changes
  useEffect(() => {
    const model = availableModels.find(m => m.id === modelName);
    setSelectedModel(model || null);
  }, [modelName, availableModels]);


  const handleUploadComplete = (res: any) => {
    if (res) {
      const urls = res.map((file: any) => file.url);
      setUploadedFiles(prev => [...prev, ...urls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !modelName.trim()) return;

    setIsSubmitting(true);
    try {
      if (!selectedModel) {
        throw new Error("Selected model not found");
      }

      // Call external API to generate solution based on model category
      let generatedContent = text; // Default to user input
      let generatedImages: string[] = [];

      // Use unified generation endpoint for all model types
      const response = await fetch("/api/external-api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel.id,
          prompt: text,
          images: uploadedFiles,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate content: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.contentUrl) {
        generatedImages = [result.contentUrl];
        generatedContent = `Prompt: ${text}`;
      } else {
        throw new Error("No content URL returned from API");
      }

      // Save the solution to our database
      const solutionResponse = await fetch("/api/solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          text: generatedContent,
          modelName: selectedModel.name,
          mediaContent: generatedImages.length > 0 ? generatedImages : uploadedFiles,
        }),
      });

      if (!solutionResponse.ok) {
        throw new Error("Failed to save solution to database");
      }

      const savedSolution = await solutionResponse.json();
      
          // Call the parent callback with the saved solution
          onSolutionSubmit({
            text: savedSolution.text,
            modelName: savedSolution.modelName,
            mediaContent: savedSolution.mediaContent,
          });
          
          // Reset form
          setText("");
          setModelName("");
          setUploadedFiles([]);
          setApiError(null);
          
          // Refresh the page to show the new solution
          window.location.reload();
    } catch (error) {
      console.error("Failed to submit solution:", error);
      setApiError(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Submit Your Solution
        </CardTitle>
        <CardDescription>
          Share your prompt engineering solution with the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-select">AI model to use</Label>
                <Select value={modelName} onValueChange={setModelName} required>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select a ${postType} generation model`} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <span className="font-medium">{model.name}</span>   
                        <span className="text-xs text-muted-foreground">
                          {model.category}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution-text">Prompt</Label>
                <Textarea
                  id="solution-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe your prompt"
                  rows={4}
                  required
                />
              </div>

          {/* Show media upload only for image-to-video models */}
          {selectedModel?.category === "image-to-video" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Input Images (Required)</Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error) => console.error("Upload error:", error)}
                    className="w-full h-auto bg-transparent hover:bg-muted/50 border-0 text-muted-foreground hover:text-foreground transition-colors"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Click to upload or drag and drop images here
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Images up to 4MB each
                  </p>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Uploaded Images ({uploadedFiles.length})</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedFiles([])}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group bg-muted rounded-lg overflow-hidden">
                          <div className="aspect-video relative">
                            <img
                              src={file}
                              alt={`Input image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-muted-foreground truncate">
                              Image {index + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {apiError && (
            <div className="p-3 border border-destructive rounded-md bg-destructive/10">
              <p className="text-sm text-destructive">{apiError}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              isSubmitting || 
              !text.trim() || 
              !modelName.trim() || 
              (selectedModel?.category === "image-to-video" && uploadedFiles.length === 0)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {selectedModel?.category === "text-to-image" 
                  ? "Generating Image..." 
                  : selectedModel?.category === "text-to-video"
                  ? "Generating Video..."
                  : selectedModel?.category === "image-to-video"
                  ? "Generating Video from Images..."
                  : "Generating Content..."
                }
              </>
            ) : (
              "Submit Solution"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
