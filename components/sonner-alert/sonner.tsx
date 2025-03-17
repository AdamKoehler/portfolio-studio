"use client";

import { toast } from "react-toastify";
import { LucideCheck } from "lucide-react"; // Success icon
import { LucideX } from "lucide-react"; // Error icon
import { Button } from "@/components/ui/button"; // Assuming you want a button too

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export function SonnerAlert(message: string, type: "error" | "success") {
  const Icon = type === "error" ? LucideX : LucideCheck; // Icon based on type
  const options = {
    description: message,
    position: "bottom-right" as Position,
    duration: 6000, // How long it stays visible
    icon: <Icon className="text-white" />, // Add icon to the notification
    action: (
      <Button variant="link" className="text-white">
        Dismiss
      </Button>
    ),
  };

  // Trigger the toast to show on the screen
  if (type === "error") {
    toast.error('Error: ' + message, options);
  } else {
    toast.success('Success: ' + message, options);
  }


  // Render something on the page
  return (
    <div className={`alert-box ${type === "error" ? "bg-red-500" : "bg-green-500"} p-4 rounded-md flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <Icon className="text-white" />
        <span className="text-white">{message}</span>
      </div>
      <Button className="text-white">Dismiss</Button>
    </div>
  );
};
