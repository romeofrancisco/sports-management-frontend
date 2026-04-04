import React from "react";

const ClickableChartArea = ({
  onOpen,
  enabled = true,
  className = "",
  label = "Open chart summary",
  children,
}) => {
  const handleKeyDown = (event) => {
    if (!enabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      onClick={enabled ? onOpen : undefined}
      onKeyDown={handleKeyDown}
      role={enabled ? "button" : undefined}
      tabIndex={enabled ? 0 : undefined}
      aria-label={enabled ? label : undefined}
      className={`${enabled ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default ClickableChartArea;
