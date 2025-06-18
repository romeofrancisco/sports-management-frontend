import React from "react";

const MetricStatBox = ({ title, value, variant = "primary" }) => {
  const variants = {
    primary: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600"
    },
    secondary: {
      bg: "bg-green-50", 
      border: "border-green-200",
      text: "text-green-600"
    }
  };

  const style = variants[variant] || variants.primary;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4`}>
      <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
      <p className={`text-2xl font-bold ${style.text}`}>{value}</p>
    </div>
  );
};

export default MetricStatBox;
