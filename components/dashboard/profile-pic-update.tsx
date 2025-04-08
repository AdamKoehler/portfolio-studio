"use client";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { SonnerAlert } from "@/components/sonner-alert/sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const UploadProfileImage = ({ profileOwner }: { profileOwner: string}) => {
    const userId = profileOwner;
    const router = useRouter();
    const { data: session, update } = useSession();
    const [imageKey, setImageKey] = useState(0);

    // Debug the session update
    useEffect(() => {
        console.log("Session updated:", session?.user?.image);
    }, [session]);

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
            
            // Fetch the latest user data
            const userResponse = await fetch(`/api/user/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userResponse.json();
            
            // Update the session with the latest user data
            await update({
                ...session,
                user: {
                    ...session?.user,
                    image: userData.image
                }
            });
            
            // Force a page refresh
            window.location.reload();
            
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