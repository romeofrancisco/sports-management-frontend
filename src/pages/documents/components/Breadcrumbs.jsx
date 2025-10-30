import React from "react";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const Breadcrumbs = ({ path, onNavigate }) => {
  const isMobile = useIsMobile();
  
  // Show ellipsis if there are more than 3 items in the path (desktop) or more than 1 item (mobile)
  const maxVisibleItems = isMobile ? 1 : 3;
  const showEllipsis = path.length > maxVisibleItems;
  const hiddenItems = showEllipsis ? path.slice(1, isMobile ? -1 : -2) : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {path.length === 0 ? (
            <BreadcrumbPage className="flex items-center gap-0.5">
              /
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              onClick={() => onNavigate(-1)}
              className="cursor-pointer flex items-center gap-0.5"
            >
              /
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {showEllipsis && path.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => onNavigate(0)}
                className="cursor-pointer"
              >
                {path[0].name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((folder, index) => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={() => onNavigate(index + 1)}
                      className="cursor-pointer"
                    >
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            {path.slice(isMobile ? -1 : -2).map((folder, index) => {
              const actualIndex = path.length - (isMobile ? 1 : 2) + index;
              return (
                <React.Fragment key={folder.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {actualIndex === path.length - 1 ? (
                      <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => onNavigate(actualIndex)}
                        className="cursor-pointer"
                      >
                        {folder.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </>
        )}

        {!showEllipsis &&
          path.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === path.length - 1 ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => onNavigate(index)}
                    className="cursor-pointer"
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
