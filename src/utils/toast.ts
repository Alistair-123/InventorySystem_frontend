import { toast, Bounce } from "react-toastify";

const baseOptions = {
  position: "top-right" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "light" as const,
  transition: Bounce,
};

export const toastSuccess = (message: string) =>
  toast.success(message, baseOptions);

export const toastError = (message: string) =>
  toast.error(message, baseOptions);

export const toastInfo = (message: string) =>
  toast.info(message, baseOptions);

export const toastWarning = (message: string) =>
  toast.warning(message, baseOptions);
