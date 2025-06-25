import React from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UniversityPageHeader = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
  buttonClassName = "w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl",
  buttonSize = "default",
  showOnlineStatus = false,
  showUniversityColors = false,
  showBackButton = false,
  backButtonText = "Back",
  backButtonPath = null,
  onBackClick = null,
  teamLogo = null, // Team logo to replace university logo
  teamName = null, // Team name for alt text
  children, // For custom right-side content
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl p-3 md:p-4 lg:p-6 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 relative overflow-hidden">
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          {/* University Logo with enhanced styling */}
          <div className="flex-shrink-0 relative">
            {" "}
            {/* Back Button above logo with proper z-index and enhanced interactivity */}
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="relative z-20 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-all duration-200 mb-1 group cursor-pointer bg-transparent border-none p-1 rounded-md hover:bg-primary/10 active:scale-95"
                type="button"
                aria-label={backButtonText}
              >
                <ArrowLeft className="h-3 w-3 group-hover:translate-x-[-2px] transition-transform duration-200" />
                <span className="font-medium">{backButtonText}</span>
              </button>
            )}{" "}
            {teamLogo ? (
              // Team logo without background and border, larger size
              <img
                src={teamLogo}
                alt={teamName ? `${teamName} logo` : "Team logo"}
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
              />
            ) : (
              // University logo with original styling
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-60"></div>
                <div className="relative bg-card p-1.5 sm:p-2 rounded-lg shadow-lg border-2 border-secondary/30">
                  <img
                    src="/UPHSD-logo.png"
                    alt="University of Perpetual Help System DALTA"
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
                  />
                </div>
              </>
            )}
          </div>
          <div className="sm:border-l-2 sm:border-primary/40 sm:pl-3 md:pl-4 lg:pl-6">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gradient break-words">
              {title}
            </h1>
            <p className="text-foreground mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
              {subtitle || "University of Perpetual Help System DALTA"}
            </p>
            {description && (
              <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {/* Right side content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-6 mt-4 lg:mt-0">
          {/* Custom children content */}
          {children}

          {/* Action Button */}
          {buttonText && onButtonClick && (
            <Button
              onClick={onButtonClick}
              className={buttonClassName}
              size={buttonSize}
            >
              {ButtonIcon && <ButtonIcon className="mr-2 h-4 w-4" />}
              {buttonText}
            </Button>
          )}

          {/* Online Status */}
          {showOnlineStatus && (
            <div className="flex items-center gap-2 md:gap-3 bg-card/80 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border-2 border-secondary/30 shadow-lg">
              <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse shadow-sm"></div>
              <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                {user?.role?.includes("Admin")
                  ? "System Online"
                  : "Dashboard Active"}
              </span>
            </div>
          )}

          {/* Enhanced University Colors Indicator */}
          {showUniversityColors && (
            <div className="flex gap-2 items-center bg-card/80 backdrop-blur-md rounded-full px-2 md:px-3 py-2 border-2 border-primary/30 shadow-lg">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-md border border-white/30"></div>
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-md border border-white/30"></div>
              <span className="text-xs font-semibold text-muted-foreground ml-1 whitespace-nowrap">
                UPHSD
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityPageHeader;
