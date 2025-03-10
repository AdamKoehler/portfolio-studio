"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const clientGatekeep = () => {
const { data: session, status } = useSession();
const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin"); // Redirect if not authenticated
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return <p className="hidden"> {session?.user?.name} </p>
}

export default clientGatekeep