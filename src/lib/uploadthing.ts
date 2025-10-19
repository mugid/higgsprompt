import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // You can add authentication logic here if needed
      return { userId: "anonymous" };
    })
        .onUploadComplete(async ({ metadata, file }) => {
          // This code RUNS ON YOUR SERVER after upload
          return { uploadedBy: metadata.userId };
        }),

  mediaUploader: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "16MB", maxFileCount: 3 }
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      return { userId: "anonymous" };
    })
        .onUploadComplete(async ({ metadata, file }) => {
          // This code RUNS ON YOUR SERVER after upload
          return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
