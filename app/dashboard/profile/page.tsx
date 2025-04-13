"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import UploadProfileImage from "@/components/dashboard/profile-pic-update";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="flex justify-center items-center h-screen text-xl">Not logged in</div>;
  }

  const user = session.user;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md transition duration-300 hover:shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Profile Picture */}
          <Avatar className="w-48 h-48">
            <AvatarImage src={user?.image || "/default-avatar.png"} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          {/* Upload Profile Image Component */}
          <UploadProfileImage />

          {/* User Information */}
          <h1 className="text-2xl font-semibold">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>

        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
