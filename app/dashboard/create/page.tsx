"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Local from "./manual";
import GitHub from "./github";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function CreatePage() {
  const router = useRouter();
  const { data: session } = useSession();
    if (!session) {
      router.push("/"); // ensures users are logged in
    }
  const userId = session?.user.id as string;
  async function handleClick(input: number) {
    let theme: string;
    switch (input) {
      case 1:
        theme = "space";
        break;
      case 2:
        theme = "ocean";
        break;
      case 3:
        theme = "forest";
        break;
      default:
        theme = "space";
    }
  
    try {
      const response = await fetch(`/api/create-portfolio?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      });
    
      const data = await response.json();
      if (data.error) {
        alert("Error creating portfolio:" + response.toString());
      } else {
        console.log("Portfolio created successfully:");
        // on success of portfolio document creation users will be redirected to preview(update) before hosting
        router.push("/dashboard/update");
      }
    } catch (error) {
      console.log("Error creating portfolio:", error);
    }
  }
  
  const [selectedComponent, setSelectedComponent] = useState<"GitHub" | "Local" | null>(null);

  const handleSelect = (component: "GitHub" | "Local") => {
    setSelectedComponent(component);
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-[#232323] via-[#52a96f] to-[#5ea5f6]">
      <div className="w-full mt-20"></div>

      <h1 className="text-3xl font-bold">Create a Portfolio</h1>
      <h2 className="text-black">
        Import projects from GitHub, or manually enter project details.
      </h2>

      <div className="w-full">
        <div className="flex flex-col w-full mt-20 justify-center text-center">
          <h1 className="text-3xl font-bold">Step 1.</h1>
          <h2 className="text-2xl text-black">Add as many projects as you want</h2>
        </div>
      <div className="flex items-center justify-center gap-4 mt-10">
        <Button className="shadow-black" variant={selectedComponent === "Local" ? "default" : "secondary"} onClick={() => handleSelect("Local")}>Local</Button>
        <Separator className="h-6 w-px bg-muted" />
        <Button className="shadow-black" variant={selectedComponent === "GitHub" ? "default" : "secondary"} onClick={() => handleSelect("GitHub")}>GitHub</Button>
      </div>
        {selectedComponent === "GitHub" && <GitHub />}
        {selectedComponent === "Local" && <Local />}
      </div>
      <div className="flex flex-col w-full mt-20 justify-center text-center">
          <h1 className="text-3xl font-bold">Step 2.</h1>
          <h1 className="text-2xl">Select a theme and start editing your portfolio details</h1>
          <Card className="mt-4 max-w-sm w-full mx-auto shadow-lg shadow-black rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <CardTitle className="mb-4">Space</CardTitle>
              <img
                src="https://images.unsplash.com/photo-1640984756059-7303641db7cd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="h-30 w-full object-cover rounded-t-lg mb-2"
              /> {/* free to use unlicensed image from paman0744 via unsplash https://images.unsplash.com/photo-1464925257126-6450e871c667?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D*/}
              <Button className="mt-4 shadow-black" onClick={() =>handleClick(1)}>Select</Button>
            </CardContent>
          </Card>
          <Card className="mt-4 max-w-sm w-full mx-auto shadow-lg shadow-black rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <CardTitle className="mb-4">Ocean</CardTitle>
              <img
                src="https://images.unsplash.com/photo-1464925257126-6450e871c667?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="h-30 w-full object-cover rounded-t-lg mb-2"
              /> {/* free to use unlicensed image from jeremybishop via unsplash */}
              <Button className="mt-4 shadow-black" onClick={() =>handleClick(2)}>Select</Button>
            </CardContent>
          </Card>
          <Card className="mt-4 mb-8 max-w-sm w-full mx-auto shadow-lg shadow-black rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <CardTitle className="mb-4">Forest</CardTitle>
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="h-30 w-full object-cover rounded-t-lg mb-2"
              /> {/* free to use unlicensed image from sebastian_unrau via unsplash */}
              <Button className="mt-4 shadow-black" onClick={() =>handleClick(3)}>Select</Button>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}