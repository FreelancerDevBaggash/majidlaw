// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .onUploadComplete(({ file }) => {
      console.log("File uploaded:", file.ufsUrl);
      return { uploadedBy: "team-member-form" };
    }),
    blogImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .onUploadComplete(({ file }) => {
      console.log("File uploaded:", file.ufsUrl);
      return { uploadedBy: "post-photo" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
