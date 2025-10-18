"use client";

import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import { ourFileRouter } from "@/lib/uploadthing";

export const UploadButton = generateUploadButton<typeof ourFileRouter>();
export const UploadDropzone = generateUploadDropzone<typeof ourFileRouter>();

export function UploadThingProviderWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
