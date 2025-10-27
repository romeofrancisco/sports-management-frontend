import React from "react";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Breadcrumbs = ({ path, onNavigate }) => {
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

        {path.map((folder, index) => (
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
