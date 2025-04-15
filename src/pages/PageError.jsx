import React from "react";

const PageError = ({ status, error }) => {
  return (
    <div className="size-full text-center content-center">
      <h1 className="text-8xl font-bold text-muted-foreground">{status || 500}</h1>
      <p className="text-3xl font-semibold">{error || "Unknown Error"}</p>
    </div>
  );
};

export default PageError;
