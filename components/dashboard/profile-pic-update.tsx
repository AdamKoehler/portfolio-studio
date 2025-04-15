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
    console.log("Upload result:", result);
    
    const secureUrl = typeof result.info === 'string' ? result.info : result.info?.secure_url;
    console.log("Secure URL:", secureUrl);
    
    if (secureUrl) {
      setIsUploading(true);
      try {
        // Instead of updating the entire session, just update the image
        await update({
          user: {
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
    } else {
      console.error("No secure URL found in upload result");
      SonnerAlert("Failed to get image URL. Please try again.", "error");
    }
  }, [update]);

  return (
    <div className="flex flex-col items-center gap-4">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_UPLOAD_PRESET}
        onSuccess={handleUpload}
        onError={(error) => {
          console.error("Cloudinary upload error:", error);
          SonnerAlert("Upload failed. Please try again.", "error");
        }}
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