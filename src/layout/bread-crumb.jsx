import React from "react";
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const BreadCrumb = () => {
  const location = useLocation();
  // Get the pathname from location
  const pathName = location.pathname;

  // Split the pathname and get the first path segment
  const firstSegment = pathName.split("/")[1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="text-foreground">
          {firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1)}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
