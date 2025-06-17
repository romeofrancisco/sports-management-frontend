import React from "react";

const StatCard = ({ icon: Icon, title, value, variant = "primary" }) => {
  const variants = {
    primary: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-600"
    },
    secondary: {
      border: "border-green-200", 
      bg: "bg-green-50",
      iconBg: "bg-green-500",
      textColor: "text-green-600"
    },
    accent: {
      border: "border-purple-200",
      bg: "bg-purple-50", 
      iconBg: "bg-purple-500",
      textColor: "text-purple-600"
    },
    warning: {
      border: "border-orange-200",
      bg: "bg-orange-50",
      iconBg: "bg-orange-500", 
      textColor: "text-orange-600"
    }
  };

  const style = variants[variant] || variants.primary;

  return (
    <div className={`${style.border} ${style.bg} border rounded-lg p-4 transition-colors duration-200`}>
      <div className="flex items-center gap-3">
        <div className={`${style.iconBg} p-2 rounded-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className={`text-2xl font-bold ${style.textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
