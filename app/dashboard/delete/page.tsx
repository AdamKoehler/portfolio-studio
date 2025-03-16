"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Delete() {
    const { data: session } = useSession();
    const router = useRouter();


    if (!session) {
        router.push("/"); // ensures users are logged in before attempting to delete anything
    }
    
    const userID = session?.user.id as string; // session will be populated if this code is reached
    
    async function deletePortfolio(userID: string) {
        const response =confirm("Are you sure you want to delete your portfolio? This action cannot be undone.");
        if (response === false) {
            deletePortfolio(userID); // recursive call so if user clicks cancel it will just regenerate the page instead of deleting
        }
        try {
            const response = await fetch(`/api/delete-portfolio?userId=${userID}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/"); // user is redirected to home page where they will have to create account again
            }
        } catch (error) {
            console.error("Error deleting portfolio:", error);
        }
    }

    return (
        <div className="pt-20 min-h-screen min-w-screen bg-gradient-to-br from-[#a4a4a4] via-[#ac4242] to-[#000000]">
            <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10">
                <CardTitle className="text-center mb-4">Delete Portfolio</CardTitle>
                <CardDescription className="text-center mb-4">By proceeding you agree to delete your portfolio and all data associated with it, including user data.</CardDescription>
                <div className="flex items-center justify-center">
                    <Button variant="destructive" onClick={() => deletePortfolio(userID)}>Delete</Button>
                </div>
            </Card>
        </div>
    );
}