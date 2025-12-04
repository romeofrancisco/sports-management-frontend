import React from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import GoogleOneTap from "../components/GoogleOneTap";
import { Link } from "react-router";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: login, isPending: isLoginPending } = useLogin();

  const isPending = isLoginPending;

  const onSubmit = (formData) => {
    login(formData);
  };

  return (
    <>
      {/* Google One Tap - shows automatically as overlay */}
      <GoogleOneTap />

      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-5 py-20 md:px-10 md:py-26 bg-muted/40"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-destructive text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please
                    wait...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <p className="text-sm text-muted-foreground px-6 text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          <div className="bg-primary hidden dark:brightness-75 md:block content-center place-items-center">
            <img src="/perpetual_logo.png" alt="UPHSD LOGO" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginForm;
