import { SonnerAlert } from "@/components/sonner-alert/sonner";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  return (
    <>
    {SonnerAlert(message || "Request failed", "error")}
    </>
  );
};