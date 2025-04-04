"use client";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { SonnerAlert } from "@/components/sonner-alert/sonner";
import { useRouter } from "next/navigation";

export const UploadProfileImage = ({ profileOwner }: { profileOwner: string}) => {
    const userId = profileOwner;
    const router = useRouter();

  return (
    <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_UPLOAD_PRESET}
        options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, folder: 'profiles'}}
        onSuccess={async (result) => {
        try {
            if (!result.info) {
                SonnerAlert("Image upload failed", "error");
                return;
            }

            const imageUrl = (result.info as any).secure_url;
            SonnerAlert("Image stored on cloud", "success");

            // Store the image URL in the database
            const response = await fetch("/api/profile-images", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                userId,
                imageUrl,
                }),
            });

            if (!response.ok) {
                SonnerAlert("Image upload failed", "error");
                throw new Error(`Failed to update project image: ${response.statusText}`);
            }

            SonnerAlert("Profile image updated", "success");
            router.refresh();
            } catch (error) {
            console.error("Error updating project image:", error);
            SonnerAlert("An error occurred while uploading", "error");
            }
        }}>
        {({ open }) => (
        <Button
            className="w-full"
            onClick={() => open?.()}
            size="sm"
            variant="secondary"
        >
            Change Image
        </Button>
        )}
    </CldUploadWidget>
  )
}