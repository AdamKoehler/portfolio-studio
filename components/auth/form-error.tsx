import { SonnerAlert } from "@/components/sonner-alert/sonner";


export const FormError = () => {
  return (
    <>
    {SonnerAlert("Request failed", "error")}
    </>
  );
};