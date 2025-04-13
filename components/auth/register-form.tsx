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
import {register} from "@/actions/register";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { OAuthSeparator } from "./seperator"

const domain = "https://portfolio-studio-kappa.vercel.app/"; // trailing slash here

const RegisterForm = () => {
  const [loading, setLoading] = useState(false); // starting state is false, changes upon button click
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const form = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    }})

  const { pending } = useFormStatus();
  const onSubmit = async (data: z.infer<typeof RegisterFormSchema>) => {
    setLoading(true)
    register(data).then((res) => {
      if (res.error) {
          setError(res.error)
          setLoading(false)
      } 
      if (res.success) {
          setSuccess(res.success)
          setLoading(false)
      }
    })
  }

  return (
    <CardWrapper
    label = "Create an account"
    title = "Register"
    backButtonHref = "/auth/login"
    backButtonLabel = "Already have an account? Login here">
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)(e);
        }} className="space-y-6">
          <div className="space-y-4">
            
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-center">Username</FormLabel>
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
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button type="submit" className="w-full mt-4" disabled={pending}>{loading ? "Loading..." : "Register"}</Button>
          <OAuthSeparator/>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default RegisterForm