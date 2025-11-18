import React, { useState, useEffect } from "react";
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
  const [resendTimer, setResendTimer] = useState(0);
  const RESEND_COOLDOWN = 60; // 60 seconds

  // Check for existing cooldown on component mount
  useEffect(() => {
    const lastSent = localStorage.getItem('forgotPasswordLastSent');
    if (lastSent) {
      const timeElapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      const remainingTime = RESEND_COOLDOWN - timeElapsed;
      
      if (remainingTime > 0) {
        setResendTimer(remainingTime);
      } else {
        localStorage.removeItem('forgotPasswordLastSent');
      }
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            localStorage.removeItem('forgotPasswordLastSent');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = (data) => {
    if (resendTimer > 0) return; // Prevent sending if cooldown is active
    
    forgotPassword(data);
    // Set cooldown timer
    setResendTimer(RESEND_COOLDOWN);
    localStorage.setItem('forgotPasswordLastSent', Date.now().toString());
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
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isPending || resendTimer > 0}
            >
              {isPending 
                ? "Sending..." 
                : resendTimer > 0 
                  ? `Resend in ${resendTimer}s` 
                  : "Send Reset Link"
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
