import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
    backButtonLabel: string
    backButtonHref: string
}
const BackButton = ( {backButtonLabel, backButtonHref} : BackButtonProps) => {
  return (
    <div>
        <Button variant="link" className="font-normal w-full " size="sm" asChild>
            <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
    </div>
  )
}

export default BackButton