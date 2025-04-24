'use client'

import Image from 'next/image'
import { Portfolio } from '@/app/types/portfolio'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SonnerAlert } from '@/components/sonner-alert/sonner'

type IntroductionScreenProps = {
  portfolio: Portfolio
  onStart: () => void
}

// Email form schema
const contactSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(5, { message: "Message must be at least 5 characters" }),
})

type ContactFormData = z.infer<typeof contactSchema>

export const IntroductionScreen = ({ portfolio, onStart }: IntroductionScreenProps) => {
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize the form with react-hook-form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  })

  // Handle form submission
  const handleSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true)
      
      // Make API request to send email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromEmail: data.email,
          message: data.message,
          toUsername: portfolio.ownerUsername || '',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Show success message
      SonnerAlert('Message sent successfully!', 'success')
      
      // Reset form and hide it
      form.reset()
      setShowContactForm(false)
    } catch (error) {
      console.error('Error sending message:', error)
      SonnerAlert('Failed to send message. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  
  const handleViews = async () => {
    try {
      await fetch('/api/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: portfolio.owner.name,
        }),
      });
      
      onStart();
    } catch (error) {
      onStart();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-10">
      <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
        {portfolio.owner.image && (
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
            <Image
              src={portfolio.owner.image}
              alt="Profile"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png'; // You'll need to add this image to your public folder
              }}
            />
          </div>
        )}
        <h1 className="text-4xl font-bold">Welcome to My Portfolio</h1>
        {portfolio.aboutMe && (
          <p className="text-xl text-gray-300">{portfolio.aboutMe}</p>
        )}
        <div className="flex justify-center space-x-4">
          {portfolio.github && (
            <a
              href={portfolio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub
            </a>
          )}
          {portfolio.linkedin && (
            <a
              href={portfolio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              LinkedIn
            </a>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleViews}
            className="bg-green-600 hover:bg-green-700"
          >
            Explore My Projects
          </Button>
          <Button
            onClick={() => setShowContactForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Contact Me
          </Button>
        </div>
        
        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-gray-900 text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Send a Message</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register('email')}
                    className="bg-gray-800 border-gray-700"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    {...form.register('message')}
                    className="bg-gray-800 border-gray-700 min-h-[120px]"
                  />
                  {form.formState.errors.message && (
                    <p className="text-red-500 text-sm">{form.formState.errors.message.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}