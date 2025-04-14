"use client";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { SonnerAlert } from "@/components/sonner-alert/sonner";
import { Button } from "@/components/ui/button";

const UploadProfileImage = () => {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (result: CloudinaryUploadWidgetResults) => {
    const secureUrl = typeof result.info === 'string' ? result.info : result.info?.secure_url;
    
    if (secureUrl) {
      setIsUploading(true);
      try {
        const response = await fetch("/api/user/update-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: secureUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        await update({
          ...session,
          user: {
            ...session?.user,
            image: secureUrl,
          },
        });
        
        SonnerAlert("Profile picture updated successfully!", "success");
      } catch (error) {
        console.error("Error updating profile:", error);
        SonnerAlert("Failed to update profile picture. Please try again.", "error");
      } finally {
        setIsUploading(false);
      }
    }
  }, [session, update]);

  return (
    <div className="flex flex-col items-center gap-4">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_UPLOAD_PRESET}
        onSuccess={handleUpload}
        options={{
          folder: 'profiles',
          maxFiles: 1,
          resourceType: "image",
          sources: ["local", "url", "camera"],
          cropping: true,
          croppingAspectRatio: 1,
          clientAllowedFormats: ["image"],
          maxImageFileSize: 2000000, // 2mb
        }}
      >
        {({ open }) => (
          <Button
            onClick={() => open()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Change Profile Picture"}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}

export default UploadProfileImage;