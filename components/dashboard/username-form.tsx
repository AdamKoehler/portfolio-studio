"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usernameSchema } from "@/schema";

export function HostPortfolioForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  if (!session) {
    router.push("/"); // Redirects if user is not logged in
  }

  const userId = session?.user.id as string;

  const handleHost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod
    const validationResult = usernameSchema.safeParse({ username });

    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setError(""); // Clear previous errors

    const res = await fetch(`/api/host-portfolio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, username }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/${data.username}`); // Redirects to hosted portfolio
    } else {
      const errorData = await res.json();
      setError(errorData.message || "Error hosting portfolio.");
    }
  };

  return (
    <form onSubmit={handleHost} className="max-w-lg mx-auto mt-10 p-6 shadow-md bg-white border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Host Your Portfolio</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

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
