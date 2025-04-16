import React from "react";
import { ClipLoader } from "react-spinners";

const ContentLoading = () => {
  return (
    <div className="w-full h-full content-center text-center ">
      <ClipLoader size={25} color="var(--primary)" />
    </div>
  );
};

export default ContentLoading;
