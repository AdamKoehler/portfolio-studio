"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-gray-200">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/auth/register" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-6" />
            </div>
            Portfolio Studio
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <h1 className="text-2xl font-bold tracking-tight ">
              Welcome to Portfolio Studio
            </h1>
            <Separator className="my-4" />
            <p className="text-muted-foreground text-center">Sign in to your account</p>
            <Button className="w-full" variant="default" onClick={() => router.push("/auth/login")}>Login</Button>
            <Separator className="my-4" />
            <p className="text-muted-foreground text-center">Don't have an account?</p>
            <Button className="w-full" variant="secondary" onClick={() => router.push("/auth/register")}>Register</Button>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
  <img
    // Photo by Alessandro Bianchi on Unsplash
    src="https://images.unsplash.com/photo-1529310399831-ed472b81d589?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Light"
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
    <h2 className="text-3xl font-bold text-white overflow-hidden whitespace-nowrap border-r-4 border-primary pr-2 animate-typewriter">
      Create your portfolio in minutes
    </h2>
  </div>
</div>
    </div>
  )
}
