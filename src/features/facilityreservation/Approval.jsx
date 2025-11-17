import React, { useState, useMemo } from "react";
import {
  useDeleteReservation,
  useReservations,
  useUpdateReservation,
} from "@/hooks/useReservations";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import ApprovalFilter from "./components/ApprovalFilter";
import { Badge } from "@/components/ui/badge";
import { format, set } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Filter,
  LayoutGrid,
  Check as CheckIcon,
  CheckCircle,
  Trash2,
  Ellipsis,
  MoreHorizontal,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import FilterDropdown from "@/components/common/FilterDropdown";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TablePagination from "@/components/ui/table-pagination";
import Modal from "@/components/common/Modal";
import { useModal } from "@/hooks/useModal";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DeleteModal from "@/components/common/DeleteModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const UPDATE_STATUS_OPTIONS = [
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
  { value: "pending", label: "Pending" },
];

const Approval = () => {
  const [filters, setFilters] = useState({
    status: "all",
    facility: null,
    q: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { isAdmin } = useRolePermissions();

  const statusUpdate = useModal();
  const deleteModal = useModal();

  const params = useMemo(() => {
    const p = {};
    if (filters?.status && filters.status !== "all") p.status = filters.status;
    if (filters?.facility && filters.facility !== "all")
      p.facility = filters.facility;
    if (filters?.q) p.q = filters.q;
    if (filters?.start_date) p.start_date = filters.start_date.toISOString();
    if (filters?.end_date) p.end_date = filters.end_date.toISOString();
    p.page = currentPage;
    p.page_size = pageSize;
    return p;
  }, [filters, currentPage, pageSize]);

  const { data, isLoading, refetch } = useReservations(params, {
    raw: true,
    keepPreviousData: true,
  });

  const reservations = Array.isArray(data) ? data : data?.results || [];
  const totalCount = data?.count ?? reservations.length;

  const { mutate: updateReservation, isPending: isUpdating } =
    useUpdateReservation();
  const { mutate: deleteReservation, isPending: isDeleting } =
    useDeleteReservation();

  const handleChangeStatus = async (id, newStatus) => {
    updateReservation({ id, data: { status: newStatus } });
    setUpdateStatus(null);
  };

  const handleDeleteReservation = async () => {
    deleteReservation(deleteId);
    setDeleteId(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Coach",
        accessorFn: (row) => row,
        cell: ({ getValue }) => {
          const row = getValue();
          const coach = row?.coach || row?.requested_by || null;
          const name = coach
            ? `${coach.first_name || coach.name || ""} ${
                coach.last_name || ""
              }`.trim()
            : "";
          const profileSrc =
            coach?.profile || coach?.profile_photo || coach?.avatar || null;
          return (
            <div className="flex items-center gap-2 max-w-[150px] md:max-w-full">
              <Avatar className="size-12 hidden md:inline-flex">
                <AvatarImage src={profileSrc} alt={name || "Coach"} />
                <AvatarFallback>{name?.[0] || "-"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{name || "-"}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[130px] md:max-w-full">
                  {coach?.email || ""}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Facility",
        accessorFn: (row) => row,
        cell: ({ getValue }) => {
          const { facility } = getValue();
          return (
            <div className="flex gap-1">
              <img
                className="w-12 h-12 object-cover rounded"
                src={
                  facility?.image ||
                  "https://res.cloudinary.com/dzebi1atl/image/upload/v1763285456/assets/facility_placeholder_vkotox.svg"
                }
                alt={facility?.name || "Facility"}
              />
              <div className="flex flex-col">
                <span>{facility?.name || "-"}</span>
                <span className="text-muted-foreground text-xs">
                  {facility?.location || ""}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: "When",
        accessorFn: (row) => row,
        cell: ({ getValue }) => {
          const { start_datetime, end_datetime } = getValue();

          try {
            const s = new Date(start_datetime);
            const e = end_datetime ? new Date(end_datetime) : null;

            // If there's no end, show a single datetime for start
            if (!e)
              return (
                <div>
                  <div>{format(s, "PP")}</div>
                  <div>{format(s, "p")}</div>
                </div>
              );

            // Same calendar date: show date once, then times
            if (s.toDateString() === e.toDateString()) {
              return (
                <div>
                  <div>{format(s, "PP")}</div>
                  <div className="text-xs text-muted-foreground">{`${format(
                    s,
                    "p"
                  )} - ${format(e, "p")}`}</div>
                </div>
              );
            }

            // Different dates: show full start and end datetimes on separate lines
            return (
              <div className="flex items-center">
                <div className="text-center">
                  <div>{format(s, "PP")}</div>
                  <div className="text-xs text-muted-foreground">{`${format(
                    s,
                    "p"
                  )}`}</div>
                </div>
                <span className="mx-2">-</span>
                <div className="text-center">
                  <div>{format(e, "PP")}</div>
                  <div className="text-xs text-muted-foreground">{`${format(
                    e,
                    "p"
                  )}`}</div>
                </div>
              </div>
            );
          } catch (err) {
            return "-";
          }
        },
      },
      {
        header: "Status",
        accessorFn: (row) => row,
        cell: ({ getValue }) => {
          const row = getValue();
          const status = row?.status || row?.meta?.status;
          switch (status) {
            case "approved":
              return (
                <Badge className="bg-green-300 text-green-800 border-0">
                  Approved
                </Badge>
              );

            case "rejected":
              return (
                <Badge className="bg-red-300 text-red-800 border-0">
                  Rejected
                </Badge>
              );

            case "cancelled":
              return (
                <Badge className="bg-gray-300 text-gray-800 border-0">
                  Cancelled
                </Badge>
              );

            case "expired":
              return (
                <Badge className="bg-gray-300 text-gray-800 border-0">
                  Expired
                </Badge>
              );

            default:
              return (
                <Badge className="bg-yellow-300 text-yellow-800 border-0">
                  Pending
                </Badge>
              );
          }
        },
      },
    ],
    [statusUpdate, deleteModal]
  );

  if (isAdmin()) {
    columns.push({
      header: "",
      accessorKey: "id_action",
      cell: (info) => {
        const row = info.row.original;
        const status = row?.status || row?.meta?.status;

        if (status !== "pending")
          return (
            <div className="flex items-center gap-2 justify-end mr-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      statusUpdate.openModal();
                      setUpdateStatus(row);
                    }}
                    disabled={
                      row.start_datetime &&
                      new Date(row.start_datetime) < new Date()
                    }
                  >
                    <Edit />
                    Update Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      deleteModal.openModal();
                      setDeleteId(row.id);
                    }}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );

        return (
          <div className="flex items-center gap-2 justify-end mr-5">
            <Button
              size="sm"
              onClick={() => handleChangeStatus(row.id, "approved")}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleChangeStatus(row.id, "rejected")}
            >
              Reject
            </Button>
          </div>
        );
      },
    });
  }

  return (
    <>
      <Card className="border-2 border-primary/20 gap-0">
        <CardHeader className="flex flex-col gap-4 pb-5 bg-transparent border-b-2 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-xl">
              <CheckCircle className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {isAdmin() ? "Manage Approvals" : "Reservation Approvals"}
                </h2>
                <Badge className="h-6 text-[11px] hidden md:inline-flex">
                  {totalCount} reservations
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {isAdmin()
                  ? "Approve or reject facility reservation requests from coaches."
                  : "View the status of your facility reservation requests."}
              </p>
            </div>
          </div>

          <ApprovalFilter
            filters={filters}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
          />
        </CardHeader>

        <CardContent className="p-0">
          <div>
            <DataTable
              columns={columns}
              data={reservations}
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
                itemName="reservations"
                pageSizeOptions={[10, 20, 50, 100]}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {!isAdmin() && (
        <>
          <Modal
            open={statusUpdate.isOpen}
            onOpenChange={statusUpdate.closeModal}
            icon={Edit}
            title="Update Reservation Status"
            description="Change the status of the selected reservation."
            contentClassName="sm:max-w-[400px]"
          >
            <Label className="mb-1">Status</Label>
            <Select
              value={updateStatus?.status}
              onValueChange={(value) =>
                setUpdateStatus({ ...updateStatus, status: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {UPDATE_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full mt-4"
              onClick={async () => {
                if (!updateStatus) return;
                try {
                  await handleChangeStatus(
                    updateStatus.id,
                    updateStatus.status
                  );
                  // close modal and clear selection
                  statusUpdate.closeModal();
                  setUpdateStatus(null);
                } catch (err) {
                  console.error(err);
                }
              }}
              disabled={!updateStatus || isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </Modal>
          <DeleteModal
            open={deleteModal.isOpen}
            onOpenChange={deleteModal.closeModal}
            title="Delete Reservation"
            description="Are you sure you want to delete this reservation? This action cannot be undone."
            icon={Trash2}
            onConfirm={handleDeleteReservation}
            isLoading={isDeleting}
          />
        </>
      )}
    </>
  );
};

export default Approval;
