import React from "react";
import { Button } from "@/components/ui/button";

const PageHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  descriptionIcon: DescriptionIcon,
  buttonText, 
  buttonIcon: ButtonIcon, 
  onButtonClick,
  buttonClassName = "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-2.5"
}) => {
  return (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-card via-secondary/8 to-primary/8 rounded-xl p-4 md:p-6 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 shadow-lg">
                <Icon className="h-8 w-8 text-primary" />
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground font-medium mt-1 flex items-center gap-2">
                  {DescriptionIcon && <DescriptionIcon className="h-4 w-4" />}
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {buttonText && onButtonClick && (
            <Button
              onClick={onButtonClick}
              className={buttonClassName}
              size="default"
            >
              {ButtonIcon && <ButtonIcon className="mr-2 h-4 w-4" />}
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
