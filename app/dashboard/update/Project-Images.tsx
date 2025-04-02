"use client";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { SonnerAlert } from "@/components/sonner-alert/sonner";

export const UploadProjectImage = ({ projectOwner, projectID }: { projectOwner: string, projectID: string}) => {
    const userId = projectOwner;
    const projectId = projectID;
  return (
    <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PROJECT_UPLOAD_PRESET}
        options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
        onSuccess={async (result) => {
        try {
            if (!result.info) {
                SonnerAlert("Image upload failed", "error");
                return;
            }

            const imageUrl = (result.info as any).secure_url;
            SonnerAlert("Image stored on cloud", "success");

            // Store the image URL in the database
            const response = await fetch("/api/project-images", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                userId,
                projectId,
                imageUrl,
                }),
            });

            if (!response.ok) {
                SonnerAlert("Image upload failed", "error");
                throw new Error(`Failed to update project image: ${response.statusText}`);
            }
            SonnerAlert("Project image updated", "success");
            } catch (error) {
            console.error("Error updating project image:", error);
            SonnerAlert("An error occurred while uploading", "error");
            }
        }}>
        {({ open }) => (
        <Button
            className="w-full"
            onClick={() => open?.()}
            size="lg"
        >
            Upload Image
        </Button>
        )}
    </CldUploadWidget>
  )
}