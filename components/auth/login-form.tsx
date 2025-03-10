"use client"

import { LoginFormSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import CardWrapper from '@/components/auth/card-wrapper'
import z from "zod"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '@/components/ui/input'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import { OAuthSeparator } from '@/components/auth/seperator'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'


export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })


  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    setLoading(true);
    setError(""); // Reset error
    
    // now we can attempt to sign in the user using next-auth credentials provider
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess("Login successful");
      setLoading(false);
      // Redirect to the dashboard
      router.push("/dashboard");
    }
  } 
  
 
const { pending } = useFormStatus();

  return (
    <CardWrapper
    label = "Login to your account"
    title = "Login"
    backButtonHref = "/auth/register"
    backButtonLabel = "Don't have an account? Register here"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field}
                  className={`formInput w-full border text-center
                  ${form.formState.errors.email ? 'border-destructive' : 'border-success'}`}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field}
                  className={`formInput w-full border text-center
                  ${form.formState.errors.password ? 'border-destructive' : 'border-success'}`}// input border color visual validation
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          </div>
          <FormSuccess message={success}/>
          <FormError message={error}/>
          <Button type="submit" className="w-full mt-4" disabled={pending}>
            {loading ? "Loading...":"Login"}
          </Button>
          <OAuthSeparator/>
        </form>
      </Form>
    </CardWrapper>)
}

export default LoginForm