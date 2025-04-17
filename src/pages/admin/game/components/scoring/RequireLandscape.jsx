import React from "react";
import landscape from "@/assets/landscape.webm";

const RequireLandscape = () => {
  return (
    <div className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center text-center p-4">
      <video width="200" height="200" autoPlay loop muted>
        <source src={landscape} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <p className="text-foreground text-xl md:text-2xl">
        Please rotate your device to landscape mode for the best experience.
      </p>
    </div>
  );
};

export default RequireLandscape;
