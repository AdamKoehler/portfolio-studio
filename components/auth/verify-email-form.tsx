"use client"

// upon redirect to this page we are going to extract the token from the url and from there we can compare it with the token in the database
// we do this with use serach params in nextjs
import { useSearchParams } from "next/navigation"
import CardWrapper from "./card-wrapper"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import { useEffect, useState, useCallback } from "react"
import { newVerification } from "@/actions/new-verification"

const VerifyEmailForm = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback (() => {
        if (success || error) {
            return
        }
        if (!token) {
            setError("Token not found")
        }
        if (token) {// server action is called here if token is ready
            newVerification(token).then((data) => {
                if (data.error) {
                    setError(data.error)
                }
                if (data.success) {
                    setSuccess(data.success)
                }
            }).catch((error) => {
                console.log(error)
                setError("See console log for error details")
            }) 
        }
    }, [token, success, error])

    useEffect(() => { // upon page load we will run onSubmit to check if the token is valid or set messages
        onSubmit();
    }, [])
  return (
    <CardWrapper label="Confirming your email" title="Confirmation in progress..." backButtonHref="/auth/login" backButtonLabel="Back to login">
        <div className="text-muted-foreground text-sm flex items-center justify-center w-full">
            {!success && !error && <p>Please wait...</p>}
            <FormSuccess message={success} />
            {!success && <FormError message={error} />}            
        </div>
    </CardWrapper>
  )
}

export default VerifyEmailForm