import React from "react";
import { set, useForm } from "react-hook-form";
import type {SubmitHandler} from "react-hook-form";
import { Button } from "../../components/atoms/Buttons";
import { FormField } from "../../components/molecules/FormField";
import Card from "../../components/atoms/Card";

type FormData = {
  username: string;
  Lastname: string;
  address: string;
  age: number;
  pangan: string;
};

function Test() {

  const [form, setFormData] = React.useState<FormData | null>(null);

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const firstSubmit: SubmitHandler<FormData> = (data) => {
    setFormData(data);
  };

  const secondSubmit: SubmitHandler<FormData> = (data) => {
    setFormData(data);
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen ">
      <div className="flex gap-3 border">
      <Card className="p-4 mb-4 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Test Card</h2>
        <p>This is a test card component.</p>
        <form onSubmit={handleSubmit(firstSubmit)} noValidate>
          <FormField
          label="Username"
          type="text"
          placeholder="Enter your username"
          variant="auth"
          {...register("username", { required: "Username is required" })}
          error={errors.username?.message}
        />

          <FormField
            label="Lastname"
            type="text"
            placeholder="Enter your Lastname"
            variant="search"
            {...register("Lastname", { required: "Lastname is required" })}
            error={errors.Lastname?.message}
          />

          <Button type="submit" label="Click Me" variant="secondary" />
        </form>
      </Card>

      <Card >
        <h2 className="text-lg font-semibold mb-2">Form Data</h2>
        {form?.username} and {form?.Lastname}
      </Card>
      </div>

      <div className="flex gap-3 border p-4">
        <form action="" onSubmit={handleSubmit(secondSubmit)} noValidate>
          <FormField
            label="Address"
            type="text"
            placeholder="Enter your Address"
            variant="auth"
            {...register("address", { required: "Address is required" })}
            error={errors.address?.message}
          />

          <FormField 
            label="age"
            type="number"
            placeholder="Enter your age"
            variant="search"
            {...register("age", { required: "age is required" })}
            error={errors.age?.message}
          />

          <Button type="submit" label="Submit Address" variant="danger" />
        </form>

        <Card >
        <h2 className="text-lg font-semibold mb-2">Age and Address</h2>
        {form?.address} and {form?.age}
      </Card>
      </div>

      <FormField 
            label="pangan"
            type="text"
            placeholder="Enter your pangan"
            variant="auth"
            {...register("pangan", { required: "pangan is required" })}
            error={errors.pangan?.message}
          />
    </div>
  );
}

export default Test;
