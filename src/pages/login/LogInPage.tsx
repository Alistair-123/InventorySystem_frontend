import { useState } from "react";
import top from "../../assets/Top.png";
import ground from "../../assets/Ground.png";
import BgImage from "../../assets/logos1.png";
import DICT from "../../assets/DictLongLogo.png";
import { FormField } from "../../components/molecules/FormField";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Card from "../../components/atoms/Card";
import { useAuth } from "../../context/UseAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import pinasimage from "@/assets/bagongpinas.png"
import place from "@/assets/pace.png"
import Rizal from "@/assets/rizal.png"
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
      navigate("/dashboard");
      } catch (error: any) {
  const message = error?.response?.data?.message || "Invalid User ID or password.";
  setError("root", {
    type: "server",
    message,
  });
  // ❌ remove this line — it focuses the input which clears the error
  // setFocus("personnelId"); 
}
  };

  return (
    <div
      className={`h-screen w-full flex bg-white transition-opacity duration-700 ${success ? "opacity-0" : "opacity-100"
        }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* LEFT SIDE */}
      <div className="w-130 h-full flex flex-col  bg-gray-50  px-16 ">

        {/* LOGO AT VERY TOP */}
        <div className="pt-10 ">
          <img
            src={DICT}
            alt="DICT Logo"
            className="h-25 object-contain"
          />
        </div>

        {/* FORM CENTERED PERFECTLY */}
        <div className="flex-1 flex items-center justify-center relative">
          <Card className=" mb-20">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="text-center space-y-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  Sign In
                </h2>
                <p className="text-sm text-gray-500">
                  Access the Inventory Management System
                </p>
              </div>

              {errors.root && (
                <div className="px-4 py-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium">
                  {errors.root.message}
                </div>
              )}

              <Input
                type="text"
                placeholder="Enter your User ID"
                {...register("personnelId", {
                  required: "User ID is required",
                })}
                onFocus={() => clearErrors("root")}
                className="p-4"
              />

              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
                onFocus={() => clearErrors("root")}
                className="p-4"
              />

              <Button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full mt-2"
              >
                {isSubmitting || authLoading
                  ? "Authenticating..."
                  : "Sign In"}
              </Button>
            </form>
          </Card>
        </div>
        
        <img src={ground} alt="" className="absolute bottom-0 left-0 w-140"/>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full h-full relative items-center justify-center overflow-hidden flex flex-col">
        <img src={top} alt="" className=" -top-3.5 right-0  w-180 absolute z-20" />
                
               <img 
  src={place} 
  alt=""  
  className="absolute inset-0 w-full h-full object-cover opacity-20"
/>
        <div className="w-3/4 space-y-4 z-20">

          <h1 className="text-4xl font-extrabold italic 
                 bg-gradient-to-br from-red-600 to-blue-700 
                 bg-clip-text text-transparent">
            DICT - R7
          </h1>



          <h2 className="text-7xl font-extrabold 
                 bg-gradient-to-br from-red-600 to-blue-700 
                 bg-clip-text text-transparent leading-tight italic">
            INVENTORY AND ASSET MANAGEMENT
            <hr className="border-0" />
            SYSTEM
          </h2>
              
        </div>

                  {/* <img src={Rizal} alt="" className="absolute -right-20 bottom-0 w-120"/> */}
        <div className="absolute w-40 h-18 flex gap-6 left-10 bottom-10">
          <img src={pinasimage} alt="" />
          <img src={BgImage} alt="" />
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
