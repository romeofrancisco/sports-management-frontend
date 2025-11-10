import React from "react";
import PasswordForm from "./form/PasswordForm";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ResetPassword = () => {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background p-6 md:p-10">
      <Card className="w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm mode="reset" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
