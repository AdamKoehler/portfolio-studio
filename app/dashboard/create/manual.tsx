"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SonnerAlert } from "@/components/sonner-alert/sonner";


export default function Local({ onAddSuccess }: { onAddSuccess: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Project Information</h2>
        <LocalForm onAddSuccess={onAddSuccess} />
      </CardContent>
    </Card>
  );
}

const LocalForm: React.FC<{ onAddSuccess: () => void }> = ({ onAddSuccess }) => {
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: ""
  });

  const saveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // save changes to form by updating state when input changes
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    
    try { // userid is grabbed from session on the server side with this api call
      const response = await fetch("/api/post-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          project: {
            Title: formData.title,
            Description: formData.description,
            URL: formData.url
          } 
        }),
      });
  
      if (!response.ok) {
        SonnerAlert("Failed to create project:", "error");
        console.error("Failed to create project:", response.statusText);
        return;
      }
  
      SonnerAlert("Project created successfully.", "success");
      onAddSuccess(); // update parent component to refresh the page
    } catch (error) {
      SonnerAlert("Error creating project", "error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        type="text"
        name="title"
        placeholder="Project Title"
        value={formData.title}
        onChange={saveChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Project Description"
        value={formData.description}
        onChange={saveChange}
        required
      />
      <Input
        type="string"
        name="url"
        placeholder="Project URL"
        value={formData.url}
        onChange={saveChange}
      />
      <Button type="submit" className="w-full">Add</Button>
    </form>
  );
};
