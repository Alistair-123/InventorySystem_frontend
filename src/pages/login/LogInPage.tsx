import React, { useState } from "react";
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

type FormData = {
  personnelId: string;
  password: string;
};

function LogInPage() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setFocus,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    clearErrors();
    try {
      await login(data);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 900);
    } catch {
      setError("root", {
        type: "credentials",
        message: "Invalid User ID or password.",
      });
      setFocus("personnelId");
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden
      bg-white transition-opacity duration-700
      ${success ? "opacity-0" : "opacity-100"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="absolute inset-0 bg-no-repeat bg-center opacity-10 grayscale"
        style={{
          backgroundImage: `url(${BgImage})`,
          backgroundSize: "800px",
        }}
      />

      <img
        src={top}
        alt=""
        className="absolute top-0 right-0 w-[45%] pointer-events-none hidden md:block"
      />

      <img
        src={ground}
        alt=""
        className="absolute bottom-0 left-0 w-[45%] pointer-events-none hidden md:block"
      />

      <div className="relative z-10 flex w-full max-w-6xl px- md:px-10 animate-[fadeIn_0.8s_ease]">
        <div className="hidden md:flex flex-1 flex-col items-center justify-center">
          <img src={DICT} alt="DICT Logo" className="max-w-sm mb-1" />

          <div className="text-center leading-[0.9]">
            <div
              className="text-7xl font-extrabold tracking-tight"
              style={{ color: "rgba(19, 73, 145, 1)" }}
            >
              INVENTORY
            </div>
            <div
              className="text-7xl font-extrabold tracking-tight"
              style={{ color: "rgba(229, 32, 37, 1)" }}
            >
              SYSTEM
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}>
          <Card className="w-full max-w-md rounded-2xl shadow-x1 backdrop-blur-[5px] bg-transparent border border-gray/30 p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 animate-[slideUp_0.6s_ease]"
            >
              <h2 className="text-3xl font-semibold text-center text-gray-900">
                Welcome back!
              </h2>

              {errors.root && (
                <div className="p-3 text-sm bg-red-100 border border-red-300 text-red-700 rounded-md text-center">
                  {errors.root.message}
                </div>
              )}

              <FormField
                label="User ID"
                type="text"
                placeholder="Enter your User ID"
                variant="auth"
                {...register("personnelId", {
                  required: "User ID is required",
                })}
                error={errors.personnelId?.message}
                onFocus={() => clearErrors("root")}
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Enter your password"
                variant="auth"
                {...register("password", {
                  required: "Password is required",
                })}
                error={errors.password?.message}
                onFocus={() => clearErrors("root")}
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
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) }
            to { opacity: 1; transform: translateY(0) }
          }
        `}
      </style>
    </div>
  );
}

export default LogInPage;
