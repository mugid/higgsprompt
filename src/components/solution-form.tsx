"use client";

import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/components/uploadthing-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText } from "lucide-react";

interface SolutionFormProps {
  postId: string;
  onSolutionSubmit: (solution: {
    text: string;
    modelName: string;
    mediaContent: string[];
  }) => void;
}

const AI_MODELS = [
  "GPT-4",
  "GPT-3.5",
  "Claude-3",
  "Claude-2",
  "Gemini Pro",
  "Llama 2",
  "PaLM 2",
  "Other"
];

export function SolutionForm({ postId, onSolutionSubmit }: SolutionFormProps) {
  const [text, setText] = useState("");
  const [modelName, setModelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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
      onSolutionSubmit({
        text,
        modelName,
        mediaContent: uploadedFiles,
      });
      
      // Reset form
      setText("");
      setModelName("");
      setUploadedFiles([]);
    } catch (error) {
      console.error("Failed to submit solution:", error);
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
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Submit Your Solution
        </CardTitle>
        <CardDescription>
          Share your prompt engineering solution with the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="solution-text">Solution Description</Label>
            <Textarea
              id="solution-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your prompt engineering approach and solution..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-select">AI Model Used</Label>
            <Select value={modelName} onValueChange={setModelName} required>
              <SelectTrigger>
                <SelectValue placeholder="Select the AI model you used" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Media Content (Optional)</Label>
            <div className="space-y-2">
              <UploadButton
                endpoint="mediaUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error) => console.error("Upload error:", error)}
                className="w-full"
              />
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Uploaded files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !text.trim() || !modelName.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
