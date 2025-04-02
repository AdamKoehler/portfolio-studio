import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent } from "@/components/ui/card";
import { SonnerAlert } from "@/components/sonner-alert/sonner";

export default function GitHub() {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  

  const toggleRepoSelection = (repoId: number) => {
    setSelectedRepos((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(repoId)) {
        updated.delete(repoId);
      } else {
        updated.add(repoId);
      }
      return new Set(updated);
    });
  };

const fetchRepositories = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      //console.log("Rate Limit Remaining:", response.headers.get("X-RateLimit-Remaining"));
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  const handleImport = async () => {
    const selectedRepoIds = Array.from(selectedRepos);
  
    try {
      const response = await fetch("/api/import-repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repositories: selectedRepoIds,
        }),
      });
  
      if (!response.ok) {
        SonnerAlert(`Error importing repositories, response: ${response.status}`, "error");
        return;
      }
  
      const data = await response.json();
      SonnerAlert(`Repositories imported successfully.`, "success");
    } catch (error) {
      SonnerAlert(`${error}`, "error");
    }
  };
  return (
    <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg">
        <CardContent>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">Get GitHub Repositories</h2>
        <Input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-3 text-center"
        />
        <Button onClick={fetchRepositories} className="w-full py-2">
          Fetch Repositories
        </Button>
        {repositories.length > 0 && (
          <ul className="mt-4 w-full text-center border-t pt-3">
            {repositories.map((repo: any) => (
              <li key={repo.id} className="flex items-center">
                <Toggle
                  className="w-full my-1"
                  pressed={selectedRepos.has(repo.id)}
                  onPressedChange={() => toggleRepoSelection(repo.id)}
                >
                  {repo.name}
                </Toggle>
              </li>
            ))}
            <li>
              <Button className="w-full py-2 mt-3" onClick={handleImport}> {/*this sends the selected repos to the backend as an array of repoIDs*/}
                Import
              </Button>
            </li>
          </ul>
        )}
      </div>
    </CardContent>
    </Card>
  );
}