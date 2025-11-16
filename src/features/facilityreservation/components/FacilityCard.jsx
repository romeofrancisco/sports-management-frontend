import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import FacilityActions from "./FacilityActions";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Button } from "@/components/ui/button";
import FacilityAddEditReservationDialog from "./FacilityAddEditReservationDialog";

const FacilityCard = ({ facility, onCreate, onEdit, onDelete }) => {
  const { isAdmin } = useRolePermissions();

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="bg-card min-h-[420px] flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-950">
        <img
          src={
            facility.image ||
            "https://res.cloudinary.com/dzebi1atl/image/upload/v1763285456/assets/facility_placeholder_vkotox.svg"
          }
          alt={facility.name}
          width={600}
          height={400}
          className="w-full h-64 object-cover dark:brightness-50"
          style={{ aspectRatio: "600/400", objectFit: "cover" }}
        />
        <div className="flex flex-col justify-between flex-1 h p-4 space-y-1">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-xl font-semibold line-clamp-1">
                {facility.name}
              </h3>
              <Badge variant="outline" className="text-[11px] h-5 px-1">
                {facility.capacity} Capacity
              </Badge>
            </div>
            {facility.location && (
              <p className="text-muted-foreground text-xs flex items-center gap-0.5 line-clamp-1">
                <MapPin className="size-4" />
                {facility.location}
              </p>
            )}
            {facility.description && (
              <p className="text-muted-foreground text-[13px] mt-1 line-clamp-2">
                {facility.description}
              </p>
            )}
          </div>
          <FacilityAddEditReservationDialog facility={facility}>
            <Button className="w-full">Reserve</Button>
          </FacilityAddEditReservationDialog>
        </div>
      </div>

      {isAdmin() && (
        <div className="absolute top-1 right-1">
          <FacilityActions
            facility={facility}
            onCreate={() => onCreate && onCreate()}
            onEdit={() => onEdit && onEdit(facility)}
            onDelete={() => onDelete && onDelete(facility)}
          />
        </div>
      )}
    </div>
  );
};

export default FacilityCard;
