"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usernameSchema } from "@/schema";
import { SonnerAlert } from "@/components/sonner-alert/sonner";

export function HostPortfolioForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");

  if (!session) {
    router.push("/"); // Redirects if user is not logged in
  }

  const userId = session?.user.id as string;

  // List of reserved terms that cannot be used as usernames
  // because domainname/reservedTerm could cause issues with routing
  const reservedTerms = [
    "dashboard", "api", "auth", "login", "register", "delete", "/", "profile", "create", "update", "username",
    "admin", "about", "contact", "help", "support", "terms", "privacy", "settings", "account", "logout",
    "search", "explore", "home", "index", "main", "default", "error", "404", "500", "403", "401",
    "assets", "images", "img", "css", "js", "static", "public", "private", "secure", "auth", "oauth",
    "callback", "redirect", "return", "success", "failure", "error", "warning", "info", "debug", "test",
    "beta", "alpha", "staging", "production", "dev", "development", "prod", "production", "live", "demo", "URL_SAFE_USERNAME"
  ];

  const handleHost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username is in reserved terms
    if (reservedTerms.includes(username.toLowerCase())) {
      SonnerAlert(`"${username}" is a reserved term and cannot be used as a username.`, "error");
      return;
    }

    // Validate using Zod
    const validationResult = usernameSchema.safeParse({ username });

    if (!validationResult.success) {
      // Display the first validation error message
      const errorMessage = validationResult.error?.errors[0]?.message || "Please enter a valid username";
      SonnerAlert(errorMessage, "error");
      return;
    }

    // Check for empty username
    if (!username || username.trim() === "") {
      SonnerAlert("Username cannot be empty", "error");
      return;
    }
    // if we havent returned by now, then the username is valid but validation isnt done yet
    // did as much validation on the client side as possible to avoid unnecessary api calls and save server resources
    // the api route will handle if the username already exists and does not belong to the user
    const res = await fetch(`/api/host-portfolio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, username }),
    });

    if (res.ok) {
      const data = await res.json();
      SonnerAlert("Portfolio hosted successfully!", "success");
      router.push(`/${data.username}`); // Redirects to hosted portfolio
    } else {
      const errorData = await res.json();
      if (res.status === 409) {
        SonnerAlert("This username is already taken. Please choose another one.", "error");
      } else {
        SonnerAlert(errorData.message || "Error hosting portfolio.", "error");
      }
    }
  };

  return (
    <form onSubmit={handleHost} className="max-w-lg mx-auto mt-10 p-6 shadow-md bg-white border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Host Your Portfolio</h1>

      <label className="block font-medium mb-2 text-center">Choose a url safe Username:</label>
      <Input className="text-center"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={
          session?.user.name
            ?.toLowerCase()
            .replace(/ /g, "_")
            .replace(/[^a-z0-9_]/g, "")
            .replace(/_{2,}/g, "_")
            .replace(/_$/, "")
            .replace(/^_/, "") || "URL_SAFE_USERNAME"
        }
        required
      />

      <Button type="submit" className="mt-4 w-full">Host</Button>
    </form>
  );
}
