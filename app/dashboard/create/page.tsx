"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Local from "./manual";
import GitHub from "./github";

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

      <div className="flex items-center justify-center gap-4 mt-10">
        <Button onClick={() => handleSelect("Local")}>Local</Button>
        <Separator className="h-6 w-px bg-muted" />
        <Button onClick={() => handleSelect("GitHub")}>GitHub</Button>
      </div>

      <div className="w-full">
        {selectedComponent === "GitHub" && <GitHub />}
        {selectedComponent === "Local" && <Local />}
      </div>
    </div>
  );
}