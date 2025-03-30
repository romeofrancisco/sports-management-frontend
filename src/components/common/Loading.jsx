import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full h-full bg-background/50 content-center text-center absolute left-0 right-0 top-0 bottom-0 ">
      <ClipLoader size={35} color="var(--primary)" />
    </div>
  );
};

export default Loading;
