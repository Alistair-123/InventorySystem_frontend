import React from "react";
import top from "../../assets/Top.png";
import ground from "../../assets/Ground.png";
import BgImage from "../../assets/logos.png";
import DICT from "../../assets/DictLongLogo.png";
import { FormField } from "../../components/molecules/FormField";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../components/atoms/Buttons";
import Card from "../../components/atoms/Card";
import { useAuth } from "../../context/UseAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
type FormData = {
  personnelId: string;
  password: string;
};


function LogInPage() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setFocus,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    clearErrors(); // Clear any previous server/global errors

    try {
      await login(data);
      toast.success("Login successful!"); // Optional positive feedback
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);

      // Network error (no response)
      if (!error.response) {
        setError("root", {
          type: "network",
          message: "Network error. Please check your connection and try again.",
        });
        toast.error("No connection. Please try later.");
        return;
      }

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || "";

      switch (status) {
        case 400:
        case 401:
          // Generic message for invalid credentials
          setError("root", {
            type: "credentials",
            message: serverMessage || "Invalid User ID or password. Please try again.",
          });
          // Optionally focus the first field for retry
          setFocus("personnelId");
          break;

        case 403:
          setError("root", {
            type: "forbidden",
            message: "Account access denied. Contact support.",
          });
          break;

        case 429:
          setError("root", {
            type: "rateLimit",
            message: serverMessage || "Too many attempts. Account locked temporarily. Try again later.",
          });
          break;

        case 500:
        default:
          setError("root", {
            type: "server",
            message: "Server error. Please try again later.",
          });
          toast.error("Unexpected error occurred.");
          break;
      }
    }
  };

  const handleInputFocus = () => clearErrors("root");
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-white">
      {/* Background pattern */}
      <div
        className="absolute top-0 left-1/4 w-1/2 h-full inset-0 bg-cover bg-center filter grayscale opacity-20"
        style={{ backgroundImage: `url(${BgImage})` }}
      />

      {/* Top right decoration */}
      <img
        src={top}
        alt=""
        className="absolute top-0 right-0 w-2/4 h-auto pointer-events-none"
      />

      {/* Main content container */}
      <div className="relative z-10 flex min-w-screen h-screen max-w-5xl mx-auto justify-between ">
        {/* Left side - Branding */}
        <div className="flex-1 flex flex-col items-center justify-center ">
          <img src={DICT} alt="DICT Logo" className="w-full max-w-sm mb-6" />
          <p className="font-black ml-20">
            <span
              className="text-7xl "
              style={{ color: "rgba(19, 73, 145, 1)" }}
            >
              {" "}
              INVENTORY
            </span>
            <br />
            <span
              className="text-7xl"
              style={{ color: "rgba(229, 32, 37, 1)" }}
            >
              SYSTEM
            </span>
          </p>
        </div>

        {/* Right side - Login form */}
       <Card className="flex-1 flex items-center justify-center rounded-md p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col justify-center gap-4 h-3/4 w-full max-w-md border border-gray-300 bg-white rounded-2xl p-8"
      >
        <h2 className="text-4xl font-med mb-4 text-center">Welcome back!</h2>

        {/* Global/Server Error Display */}
        {errors.root && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {errors.root.message}
          </div>
        )}

        <FormField
          label="User ID"
          type="text"
          placeholder="Enter your User ID"
          variant="auth"
          {...register("personnelId", { required: "User ID is required" })}
          error={errors.personnelId?.message}
          onFocus={handleInputFocus}
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          variant="auth"
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
          onFocus={handleInputFocus}
        />

        <Button
          type="submit"
          label={isSubmitting || authLoading ? "Logging in..." : "Login"}
          variant="secondary"
          disabled={isSubmitting || authLoading}
        />
      </form>
    </Card>
      </div>

      {/* Bottom left decoration */}
      <img
        src={ground}
        alt=""
        className="absolute bottom-0 left-0 w-2/4 h-auto pointer-events-none"
      />
    </div>
  );
}

export default LogInPage;
