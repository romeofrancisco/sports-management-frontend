import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              required
              {...register("email")}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
