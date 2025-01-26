"use client"

import CardWrapper from "@/components/auth/card-wrapper"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {RegisterFormSchema} from "@/schema"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import z from "zod"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { OAuthSeparator } from "@/components/auth/seperator"
//import { useRouter } from "next/router";
//const router = useRouter();


const RegisterForm = () => {
  const [loading, setLoading] = useState(false); // starting state is false, changes upon button click
  const form = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    }})

  const { pending } = useFormStatus();
  const onSubmit = (data: z.infer<typeof RegisterFormSchema>) => {
    setLoading(true); // set loading to true
    console.log(data) // currently it sends data to browser for test
    // TODO: check backend for existing user with email, if new user, send data to backend
    // TODO: if user already exists, show error message and redirect to login
  };

  return (
    <CardWrapper
    label = "Create an account"
    title = "Register"
    backButtonHref = "/auth/login"
    backButtonLabel = "Already have an account? Login here">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-center">Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Required"
                  className={`formInput w-full border text-center
                  ${form.formState.errors.name ? 'border-destructive' : 'border-success'}`}/>
                </FormControl>
                <FormMessage className="text-center"/>
              </FormItem >
            )}
            />

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-center">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="user@email.com"
                  className={`formInput w-full border text-center
                  ${form.formState.errors.email ? 'border-destructive' : 'border-success'}`}/>
                </FormControl>
                <FormMessage className="text-center"/>
              </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-center">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="******"
                  className={`formInput w-full border text-center
                  ${form.formState.errors.password ? 'border-destructive' : 'border-success'}`}/>
                </FormControl>
                <FormMessage className="text-center"/>
              </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-center">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="******"
                  className={`formInput w-full border text-center
                  ${form.formState.errors.confirmPassword ? 'border-destructive' : 'border-success'}`}/>
                </FormControl>
                <FormMessage className="text-center"/>
              </FormItem>
            )}
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={pending}>{loading ? "Loading..." : "Register"}</Button>
          <OAuthSeparator/>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default RegisterForm