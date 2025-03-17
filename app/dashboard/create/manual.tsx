"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SonnerAlert } from "@/components/sonner-alert/sonner";


export default function Local() {
  return (
    <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Project Information</h2>
        <LocalForm />
      </CardContent>
    </Card>
  );
}

const LocalForm: React.FC = () => { // local form component with default values
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

  const submit = async (formData: React.FormEvent <HTMLFormElement>) => {
    formData.preventDefault();
    const form = formData.target as HTMLFormElement;
    const data = {
      Title: form.title,
      Description: form.description.value,
      URL: form.url.value,
    };
    try {
      const response = await fetch("/api/post-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project: data }),
      });
  
      if (!response.ok) {
        console.error("Failed to create project:", response.status, response.statusText);
        return;
      }
  
      SonnerAlert("Project created successfully.", "success");
    } catch (error) {
      SonnerAlert(`Error creating project: ${error}`, "error");
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
