import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building, Calendar, CheckCircle } from "lucide-react";
import Facilities from "./Facilities";
import Reservations from "./Reservations";
import Approval from "./Approval";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const FacilityReservation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useRolePermissions();

  const getCurrentPage = () => {
    if (currentPath.includes("/facilities")) return "facilities";
    if (currentPath.includes("/reservations")) return "reservations";
    if (currentPath.includes("/approvals")) return "approvals";
    return "reservations"; // default
  };

  const currentPage = getCurrentPage();

  const navigationItems = [
    {
      key: "reservations",
      label: "Reservations",
      path: "/facility-reservation/reservations",
      description: "View reservations",
      icon: Calendar,
    },
    {
      key: "facilities",
      label: "Facilities",
      path: "/facility-reservation/facilities",
      description: "Manage facilities",
      icon: Building,
    },
    {
      key: "approvals",
      label: "Approvals",
      path: "/facility-reservation/approvals",
      description: "Approve reservations",
      icon: CheckCircle,
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case "facilities":
        return <Facilities />;
      case "reservations":
        return <Reservations />;
      case "approvals":
        return <Approval />;
      default:
        return <Facilities />;
    }
  };

  return (
    <div className="container mx-auto p-1 md:p-6 space-y-6">
      <UniversityPageHeader
        title="Facility Reservation"
        subtitle={isAdmin() ? "Facility Management" : "Reserve a Facility"}
        description={
          isAdmin()
            ? "Manage facilities and approve reservation requests."
            : "Browse and reserve available facilities on campus."
        }
      />

      {/* Navigation Links */}
      <div>
        <nav className="border-b border-border">
          <div className="flex space-x-2 sm:space-x-3 overflow-x-auto scrollbar-hide">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "group inline-flex items-center py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200",
                    currentPage === item.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <IconComponent
                    className={cn(
                      "mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-colors duration-200",
                      currentPage === item.key
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default FacilityReservation;
