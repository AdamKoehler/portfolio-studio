"use client";
// both login and register will have same seperator so i just made it once and will reuse it.
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import GithubIcon from "@/components/icons/github-icon";
import GoogleIcon from "@/components/icons/google-icon";
import { SonnerAlert } from "@/components/sonner-alert/sonner";
const domain = "https://www.3dportfol.io/";
export function OAuthSeparator() {

  const handleOAuthLogin = async (provider: string) => {

    const res = await signIn(provider, { callbackUrl: `${domain}/dashboard` });

    if (res?.error) {// error
      SonnerAlert("OAuth Login failed. Please try again.", "error");
      console.log(res.error);
    }

  };
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm text-muted-foreground font-medium leading-none text-center">
          OR
        </h4>
      </div>
      <Separator className="my-4"/>
      <div className="flex w-full items-center justify-center space-x-4">
        <Button
          onClick={() => handleOAuthLogin("google")}
          className="flex items-center justify-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-800"
        >
        <GoogleIcon/>
        </Button>

        <Separator orientation="vertical" className="h-10"/>

        <Button
          onClick={() => handleOAuthLogin("github")}
          className="flex items-center justify-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-800">
        <GithubIcon/>
        </Button>
      </div>
    </div>
  );
}