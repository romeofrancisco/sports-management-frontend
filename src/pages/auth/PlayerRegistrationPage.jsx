import React from "react";
import { SignupForm } from "./form/SignupForm";
import perpetual_logo from "/perpetual_logo_small.png";

const PlayerRegistrationPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Form Section - scrollable */}
      <div className="lg:mr-[38%] xl:mr-[33%] min-h-[calc(100vh-64px)] flex flex-col justify-center">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-lg py-8">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Section - fixed on scroll */}
      <div className="bg-primary fixed top-0 right-0 bottom-0 w-[38%] xl:w-[33%] hidden lg:grid place-items-center">
        <img
          src={perpetual_logo}
          alt="Image"
          className="object-cover w-[70%] dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default PlayerRegistrationPage;
