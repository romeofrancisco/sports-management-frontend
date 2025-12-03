import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import DeleteModal from "@/components/common/DeleteModal";
import { useModal } from "@/hooks/useModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import {
  usePlayerRegistrations,
  useApproveRegistration,
  useRejectRegistration,
  useDeleteRegistration,
  usePlayerRegistration,
} from "@/hooks/usePlayerRegistrations";
import {
  RegistrationApprovalFilter,
  RegistrationApproveModal,
  RegistrationRejectModal,
  RegistrationDetailsModal,
  createRegistrationColumns,
} from "./components";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const PlayerRegistrationApprovalPage = () => {
  const [filters, setFilters] = useState({
    status: "all",
    sport: null,
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected registration for modals
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Modal controls
  const approveModal = useModal();
  const rejectModal = useModal();
  const detailsModal = useModal();
  const deleteModal = useModal();

  const { isAdmin, isCoach } = useRolePermissions();
  const canManage = isAdmin() || isCoach();

  // Build query params
  const params = useMemo(() => {
    const p = { page: currentPage, page_size: pageSize };
    if (filters?.status && filters.status !== "all") p.status = filters.status;
    if (filters?.sport && filters.sport !== "all") p.sport = filters.sport;
    if (filters?.search) p.search = filters.search;
    return p;
  }, [filters, currentPage, pageSize]);

  // Fetch registrations
  const { data, isLoading } = usePlayerRegistrations(params, {
    keepPreviousData: true,
  });

  const registrations = Array.isArray(data) ? data : data?.results || [];
  const totalCount = data?.count ?? registrations.length;

  // Fetch selected registration details for modals
  const { data: registrationDetails } = usePlayerRegistration(
    selectedRegistration?.id,
    { enabled: !!selectedRegistration?.id && detailsModal.isOpen }
  );

  // Mutations
  const { mutate: approveRegistration, isPending: isApproving } = useApproveRegistration();
  const { mutate: rejectRegistration, isPending: isRejecting } = useRejectRegistration();
  const { mutate: deleteRegistration, isPending: isDeleting } = useDeleteRegistration();

  // Handlers
  const handleApprove = (registration) => {
    setSelectedRegistration(registration);
    approveModal.openModal();
  };

  const handleReject = (registration) => {
    setSelectedRegistration(registration);
    rejectModal.openModal();
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    detailsModal.openModal();
  };

  const handleDelete = (registration) => {
    setSelectedRegistration(registration);
    deleteModal.openModal();
  };

  const handleApproveSubmit = (data) => {
    approveRegistration(data, {
      onSuccess: () => {
        approveModal.closeModal();
        setSelectedRegistration(null);
      },
    });
  };

  const handleRejectSubmit = (data) => {
    rejectRegistration(data, {
      onSuccess: () => {
        rejectModal.closeModal();
        setSelectedRegistration(null);
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteRegistration(selectedRegistration.id, {
      onSuccess: () => {
        deleteModal.closeModal();
        setSelectedRegistration(null);
      },
    });
  };

  // Create columns
  const columns = createRegistrationColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onViewDetails: handleViewDetails,
    onDelete: handleDelete,
    isAdmin: canManage,
  });

  return (
    <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
            title="Registrations"
            description="Manage player registration requests and approvals."
        />
      <Card className="border-2 border-primary/20 gap-0">
        <CardHeader className="flex flex-col gap-4 pb-5 bg-transparent border-b-2 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-xl">
              <UserPlus className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Player Registrations
                </h2>
                <Badge className="h-6 text-[11px] hidden md:inline-flex">
                  {totalCount} registrations
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {canManage
                  ? "Review and approve player registration requests."
                  : "View player registration status."}
              </p>
            </div>
          </div>

          <RegistrationApprovalFilter
            filters={filters}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
          />
        </CardHeader>

        <CardContent className="p-0">
          <div>
            <DataTable
              columns={columns}
              data={registrations}
              loading={isLoading}
              pageSize={pageSize}
              showPagination={false}
              showColumnBorders={false}
            />
          </div>
          {totalCount > 0 && (
            <div className="px-4">
              <TablePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo(0, 0);
                }}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                isLoading={isLoading}
                itemName="registrations"
                pageSizeOptions={[10, 20, 50, 100]}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <RegistrationApproveModal
        open={approveModal.isOpen}
        onOpenChange={approveModal.closeModal}
        registration={selectedRegistration}
        onApprove={handleApproveSubmit}
        isLoading={isApproving}
      />

      {/* Reject Modal */}
      <RegistrationRejectModal
        open={rejectModal.isOpen}
        onOpenChange={rejectModal.closeModal}
        registration={selectedRegistration}
        onReject={handleRejectSubmit}
        isLoading={isRejecting}
      />

      {/* Details Modal */}
      <RegistrationDetailsModal
        open={detailsModal.isOpen}
        onOpenChange={detailsModal.closeModal}
        registration={registrationDetails || selectedRegistration}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModal.isOpen}
        onOpenChange={deleteModal.closeModal}
        title="Delete Registration"
        description="Are you sure you want to delete this registration? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PlayerRegistrationApprovalPage;
