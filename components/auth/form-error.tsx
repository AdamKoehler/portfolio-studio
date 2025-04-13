import { SonnerAlert } from "@/components/sonner-alert/sonner";

interface FormSuccessProps {
  message?: string;
}

export const FormError = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <>
    {SonnerAlert("Request failed", "error")}
    </>
  );
};