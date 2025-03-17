"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SonnerAlert } from "@/components/sonner-alert/sonner";

export default function Delete() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Prevent redirecting before session is loaded
    if (status === "loading") return <p>Loading...</p>;

    // If user is not logged in, redirect to home page
    if (!session) {
        router.push("/");
        return null;
    }

    const userID = session.user.id;
    console.log("User ID:", userID);

    if (!userID) return <p>Error: Unable to fetch user ID</p>;

    async function deletePortfolio() {
        const confirmDelete = confirm("Are you sure you want to delete your portfolio? This action cannot be undone.");
        if (!confirmDelete) return; // if user declines to delete, we can return here and skip the rest

        try {
            const response = await fetch(`/api/delete-portfolio?userId=${userID}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/"); // Redirect after deletion
            } else {
                SonnerAlert("Failed to delete portfolio", "error");
            }
        } catch (error) {
            SonnerAlert("Error deleting portfolio:" + error, "error");
        }
    }

    return (
        <div className="pt-20 min-h-screen min-w-screen bg-gradient-to-br from-[#a4a4a4] via-[#ac4242] to-[#000000]">
            <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10">
                <CardTitle className="text-center mb-4">Delete Portfolio</CardTitle>
                <CardDescription className="text-center mb-4">By proceeding you agree to delete your portfolio and all data associated with it, including user data.</CardDescription>
                <div className="flex items-center justify-center">
                    <Button variant="destructive" onClick={deletePortfolio}>Delete</Button>
                </div>
            </Card>
        </div>
    );
}
