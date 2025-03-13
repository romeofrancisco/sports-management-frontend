import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-screen h-screen bg-background content-center text-center">
      <ClipLoader size={35} color="var(--primary)" />
    </div>
  );
};

export default Loading;
