"use client"

// upon redirect to this page we are going to extract the token from the url and from there we can compare it with the token in the database
// we do this with use serach params in nextjs
import { useSearchParams } from "next/navigation"
import CardWrapper from "@/components/auth/card-wrapper"
import { FormSuccess } from "@/components/auth/form-success"
import { FormError } from "@/components/auth/form-error"
import { useEffect, useState, useCallback } from "react"
import { newVerification } from "@/actions/new-verification"

const VerifyEmailForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) {
            return;
        }

        if (!token) {
            setError("Token not found");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        newVerification(token)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                }
                if (data.success) {
                    setSuccess(data.success);
                }
            })
            .catch((error) => {
                console.error("Verification error:", error);
                setError("An unexpected error occurred. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper 
            label="Confirming your email" 
            title="Confirmation in progress..." 
            backButtonHref="/auth/login" 
            backButtonLabel="Back to login"
        >
            <div className="text-muted-foreground text-sm flex items-center justify-center w-full">
                {isLoading && <p>Please wait...</p>}
                {!isLoading && success && <FormSuccess message={success} />}
                {!isLoading && error && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
};

export default VerifyEmailForm;