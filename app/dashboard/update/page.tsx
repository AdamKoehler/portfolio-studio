"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { HostPortfolioForm } from "@/components/dashboard/username-form";
import { SonnerAlert } from "@/components/sonner-alert/sonner";
import { UploadProjectImage } from "@/app/dashboard/update/Project-Images";

export type ProjectType = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  imageURL: string | null;
};

type PortfolioType = {
  aboutMe: string;
  github: string;
  linkedin: string;
  projects: ProjectType[];
};

export default function EditPortfolio() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/"); // if user isnt logged in redirect to landing page
  }
  const userId = session?.user.id as string;
  const [formData, setFormData] = useState<PortfolioType>({
    aboutMe: "",
    github: "",
    linkedin: "",
    projects: [], // these start empty upon render and are populated once fetch is successful
  });
  
  const [hasSaved, setHasSaved] = useState(false); // we are going to assume the user hasnt saved yet before clicking host 
  const [hasProjects, setHasProjects] = useState(false);
  // we also assume the userhas no projects, so this means user can host or save portfolio in our update tab unless theyve visited the create tab
  // this is just done by disabling the buttons
  const [hasChanged, setHasChanged] = useState(false);
  
  useEffect(() => {
    if (!userId) return;
    async function fetchPortfolio() {
      try {
        const res = await fetch(`/api/get-portfolio?userId=${userId}`);
        const responseData = await res.json();
    
        if (!responseData.success || !responseData.portfolio) {
          return;
        }
    
        const portfolioData = responseData.portfolio;
    
        if (!portfolioData.projects) {
          portfolioData.projects = []; // Ensure projects array is always present
          setHasProjects(false);  // No projects
          return;
      } else {
        setHasProjects(true);  // Projects exist
      }
        setFormData(portfolioData);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      }
    }
    fetchPortfolio();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasChanged(true);
  };

  const handleProjectChange = (index: number, key: string, value: string) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev){
        return { aboutMe: "", github: "", linkedin: "", projects: [] };
      }
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [key]: value };
      return { ...prev, projects: updatedProjects };
    });
  };

  async function deleteProject(projectId: string) {
    if (!formData) return;
    try {
    const response = await fetch (`/api/delete-project?userId=${userId}&projectId=${projectId}`, {
      method: "DELETE",
    });
    if (response.ok || response.status === 200) {
      const updatedProjects = formData.projects.filter((project) => project.id !== projectId);
      setFormData({ ...formData, projects: updatedProjects });
      SonnerAlert("Project deleted successfully.", "success");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    SonnerAlert("Error deleting project.", "error");
  }
}

  const handleSave = async () => {
    if (!formData) return;
    const res = await fetch(`/api/update-portfolio?userId=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setHasChanged(false);
      setHasSaved(true);
    } else {
      SonnerAlert("Error updating portfolio." + res.statusText, "error");
    }
  };

  return (
    <div className="pt-20 pb-10 min-h-screen w-full bg-gradient-to-br from-[#90bdf1] via-[#57be79] to-[#faa8a8]">
    <div className="p-4 max-w-4xl mx-auto shadow-md border rounded-lg bg-white">
      <h1 className="text-3xl font-bold mb-6">Edit Portfolio</h1>
      <div className="space-y-6">
      
        <div>
          <Label className="block font-medium mb-2">About Me:</Label>
          <Textarea name="aboutMe" value={formData.aboutMe ?? ""} onChange={handleChange} />
        </div>
        <h2 className="text-xl font-bold mb-6">Social Links</h2>
        <div>
          <Label className="block font-medium mb-2">GitHub:</Label>
          <Input type="text" name="github" value={formData.github ?? ""} onChange={handleChange} />
        </div>

        <div>
          <Label className="block font-medium mb-2">LinkedIn:</Label>
          <Input type="text" name="linkedin" value={formData.linkedin ?? ""} onChange={handleChange} />
        </div>
      </div>

      <Separator className="my-6" />

      <h2 className="text-xl font-bold mb-6">Projects</h2>
      <div className="space-y-4">
      {formData?.projects?.length > 0 ? (
        formData.projects.map((project, index) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>Project {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="block font-medium mb-2">Project Title:</Label>
                <Input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                />
              </div>
              <div>
                <Label className="block font-medium mb-2">Project Description:</Label>
                <Textarea
                  value={project.description ?? ""}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                />
              </div>
              <div>
                <Label className="block font-medium mb-2">Project URL:</Label>
                <Input
                  type="text"
                  value={project.url}
                  onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                />
              </div>
              <div>
                <Label className="block font-medium mb-2">Project Image:</Label>
                <UploadProjectImage projectOwner={userId} projectID={project.id} /> {/* this will display the UI, save image to cloudinary and update the image url in the database */}
              </div>
              <Button variant={"destructive"} onClick={() => deleteProject(project.id)}>Remove Project</Button>
            </CardContent>
          </Card>
          ))
        ) : (
        <p>No projects found. Navigate to the create tab to get started.</p>
      )}
      </div>
      <p>Note: You can change user image by clicking on user icon</p>
      <Button onClick={handleSave} className="mt-6 w-full" disabled={!(hasProjects && hasChanged)}>Save Changes</Button>
      {hasSaved && <HostPortfolioForm/> } {/* This component displays the username form and upon submission calls the api to create a new page for the user*/}
      </div>
      
    </div>
  );
}