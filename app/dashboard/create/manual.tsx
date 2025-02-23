"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function Local() {
  return (
      <LocalForm />
  )
}
    const LocalForm: React.FC = () => {
        const [formData, setFormData] = useState({
          title: "",
          description: "",
          image: null as File | null,
          url: ""
        });
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData({ ...formData, [name]: value });
        };
      
        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            setFormData({ ...formData, image: e.target.files[0] });
          }
        };
      
        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          console.log("Submitted data:", formData);
        };
      
        return (
          <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Project Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  type="text" 
                  name="title" 
                  placeholder="Project Title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                />
                <Textarea 
                  name="description" 
                  placeholder="Project Description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
                <Input 
                  type="url" 
                  name="url" 
                  placeholder="Project URL" 
                  value={formData.url} 
                  onChange={handleChange} 
                />
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </CardContent>
          </Card>
        );
      };
