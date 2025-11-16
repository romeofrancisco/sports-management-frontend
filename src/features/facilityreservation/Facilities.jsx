import React, { useState, useEffect } from "react";
import { useFacilities } from "@/hooks/useFacilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, MapPin, MapPinned, Plus } from "lucide-react";
import TablePagination from "@/components/ui/table-pagination";
import ContentEmpty from "@/components/common/ContentEmpty";
import FacilityActions from "./components/FacilityActions";
import FacilityFormModal from "./components/FacilityFormModal";
import { useModal } from "@/hooks/useModal";
import DeleteModal from "@/components/common/DeleteModal";
import api from "@/api";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { data, isLoading, isError } = useFacilities({}, currentPage, pageSize);
  const facilities = data?.results || [];
  const total = data?.count || 0;

  const facility = useModal();
  const deleteFacility = useModal();

  const [formState, setFormState] = useState({
    name: "",
    location: "",
    capacity: 0,
    description: "",
    image: null,
  });

  useEffect(() => {
    if (facility.isOpen) {
      if (selectedFacility) {
        setFormState({
          name: selectedFacility.name || "",
          location: selectedFacility.location || "",
          capacity: selectedFacility.capacity || 0,
          description: selectedFacility.description || "",
          image: selectedFacility.image || null,
        });
      } else {
        setFormState({
          name: "",
          location: "",
          capacity: 0,
          description: "",
          image: null,
        });
      }
    }
  }, [facility.isOpen, selectedFacility]);

  return (
    <>
      <Card className="border-2 border-primary/20">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 bg-transparent border-b-2 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-xl">
              <LayoutGrid className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Facilities
                </h2>
                <Badge className="h-6 text-[11px]">{total} facilities</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Manage facility rooms, locations and availability for events and
                training.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                facility.openModal();
                setSelectedFacility(null);
              }}
            >
              <Plus />
              Add Facility
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-8">Loading facilities...</div>
          ) : facilities && facilities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {facilities.map((f) => (
                  <div className="w-full max-w-md mx-auto relative" key={f.id}>
                    <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-950">
                      <img
                        src={
                          f.image ||
                          "https://res.cloudinary.com/dzebi1atl/image/upload/v1763285456/assets/facility_placeholder_vkotox.svg"
                        }
                        alt={f.name}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover dark:brightness-50"
                        style={{ aspectRatio: "600/400", objectFit: "cover" }}
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold">{f.name}</h3>
                        {f.location && (
                          <p className="text-muted-foreground text-xs flex items-center gap-0.5">
                            <MapPin className="size-4" />
                            {f.location}
                          </p>
                        )}
                        {f.description && (
                          <p className="text-muted-foreground text-sm line-clamp-1">
                            {f.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <FacilityActions
                        facility={f}
                        onCreate={() => {
                          facility.openModal();
                          setSelectedFacility(null);
                        }}
                        onEdit={(fac) => {
                          facility.openModal();
                          setSelectedFacility(fac);
                        }}
                        onDelete={(fac) => {
                          deleteFacility.openModal();
                          setSelectedFacility(fac);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <TablePagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={total}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  itemName="facilities"
                />
              </div>
            </>
          ) : (
            <ContentEmpty
              icon={MapPinned}
              title="No Facilities Found"
              description="Register your first facility to start scheduling reservations."
            />
          )}
        </CardContent>
      </Card>
      <FacilityFormModal
        open={facility.isOpen}
        onOpenChange={facility.closeModal}
        selectedFacility={selectedFacility}
      />

      <DeleteModal
        open={deleteFacility.isOpen}
        onOpenChange={deleteFacility.closeModal}
        title={
          selectedFacility
            ? `Delete ${selectedFacility.name}`
            : "Delete Facility"
        }
        itemName={selectedFacility?.name}
        onConfirm={async () => {
          try {
            if (!selectedFacility) return;
            await api.delete(`facilities/${selectedFacility.id}/`);
            toast.success("Facility deleted");
            queryClient.invalidateQueries(["facilities"]);
            deleteFacility.closeModal();
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete facility");
          }
        }}
      />
    </>
  );
};

export default Facilities;
