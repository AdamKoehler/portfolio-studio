"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Local from "./manual";
import GitHub from "./github";
import { Card } from "@/components/ui/card";

export default function CreatePage() {
  const [selectedComponent, setSelectedComponent] = useState<"GitHub" | "Local" | null>(null);

  const handleSelect = (component: "GitHub" | "Local") => {
    setSelectedComponent(component);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-20"></div>

      <h1 className="text-3xl font-bold">Create a Portfolio</h1>
      <h2 className="text-muted-foreground">
        Import projects from GitHub, or manually enter project details.
      </h2>

      <div className="w-full">
      <div className="flex w-full mt-20 justify-center">
        <h1>Step 1.</h1>
        <h1 className="text-muted-foreground">Add as many projects as you want</h1>
      </div>
      <div className="flex items-center justify-center gap-4 mt-10">
        <Button variant={selectedComponent === "Local" ? "default" : "secondary"} onClick={() => handleSelect("Local")}>Local</Button>
        <Separator className="h-6 w-px bg-muted" />
        <Button variant={selectedComponent === "GitHub" ? "default" : "secondary"} onClick={() => handleSelect("GitHub")}>GitHub</Button>
      </div>
        {selectedComponent === "GitHub" && <GitHub />}
        {selectedComponent === "Local" && <Local />}
      </div>
      <div className="flex w-full mt-20 justify-center">
        <h1>Step 2.</h1>
        <h1 className="text-muted-foreground">Select a theme</h1>
      </div>
      <Card className="w-1/2 h-1/2" />
      <div className="flex w-full mt-20 justify-center">
        <h1>Step 3.</h1>
        <h1 className="text-muted-foreground">Preview and host your portfolio</h1>
      </div>
      <Button className="flex items-center justify-center" onClick={() => console.log("preview")} >Preview</Button>
    </div>
  );
}