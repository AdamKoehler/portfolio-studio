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
import { OAuthSeparator } from '@/components/auth/seperator'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
const router = useRouter();


const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async(data: z.infer<typeof LoginFormSchema>) => {
    setLoading(true); // set loading to true
    //console.log(data) // currently it sends data to browser for test
    
    // okay now that we have data, we can send it to backend where next auth can create a session
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      if (result?.error) {
        alert(result.error);
      }
      else { // no errors we can then redirect to dashboard
        router.push("/dashboard")
      }
    }
    catch (error) {
      console.log(error)
    }
  };
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
          <Button type="submit" className="w-full mt-4" disabled={pending}>
            {loading ? "Loading...":"Login"}
          </Button>
          <OAuthSeparator />
        </form>
      </Form>
    </CardWrapper>)
}

export default LoginForm