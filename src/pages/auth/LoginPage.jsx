import React from "react";
import LoginForm from "@/pages/auth/form/LoginForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
