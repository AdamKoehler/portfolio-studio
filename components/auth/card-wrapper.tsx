"use client"
import {Card, CardContent, CardHeader, CardFooter} from "@/components/ui/card"
import AuthHeader from "./auth-header"
import BackButton from "./back-button"
interface CardWrapperProps {
    label: string;
    title: string;
    backButtonHref: string;
    backButtonLabel: string;
    children ?: React.ReactNode
}
const CardWrapper = ({label, title, backButtonHref, backButtonLabel, children}: CardWrapperProps) => {
  return (
    <Card className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto shadow-md">
        <CardHeader>
            <AuthHeader label={label} title={title} />
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        <CardFooter>
            <BackButton backButtonLabel={backButtonLabel} backButtonHref={backButtonHref}/>
        </CardFooter>
    </Card>
  )
}

export default CardWrapper