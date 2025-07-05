import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB" } })
    .middleware(async ({ req }) => {
      const { userId } = getAuth(req);
      if (!userId) throw new Error("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("📸 File URL:", file.url); // ✅ use `file.url` not `ufsUrl`
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
