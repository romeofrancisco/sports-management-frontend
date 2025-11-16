import React, { useState, useMemo } from "react";
import { useReservations, useUpdateReservation } from "@/hooks/useReservations";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const Approval = () => {
  const [status, setStatus] = useState("all");
  const [pageSize] = useState(20);

  const params = useMemo(() => {
    const p = {};
    if (status && status !== "all") p.status = status;
    return p;
  }, [status]);

  const { data: reservations = [], isLoading, refetch } = useReservations(params, {
    keepPreviousData: true,
  });

  const update = useUpdateReservation({
    onSuccess: () => {
      refetch();
    },
    onError: (err) => console.error(err),
  });

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await update.mutateAsync({ id, data: { status: newStatus } });
    } catch (err) {
      // handled in mutation
    }
  };

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 40, meta: { priority: "low" } },
      {
        header: "Facility",
        accessorFn: (row) => row.meta?.facility?.name || row.title,
        cell: (info) => info.getValue(),
        size: 200,
        meta: { priority: "high" },
      },
      {
        header: "Coach",
        accessorFn: (row) => (row.meta?.coach ? `${row.meta.coach.first_name || ''} ${row.meta.coach.last_name || ''}`.trim() : "-"),
        cell: (info) => info.getValue(),
        size: 160,
        meta: { priority: "medium" },
      },
      {
        header: "Start",
        accessorKey: "startDate",
        cell: (info) => {
          const v = info.getValue();
          return v ? format(new Date(v), "PPpp") : "-";
        },
        size: 180,
        meta: { priority: "high" },
      },
      {
        header: "End",
        accessorKey: "endDate",
        cell: (info) => {
          const v = info.getValue();
          return v ? format(new Date(v), "PPpp") : "-";
        },
        size: 180,
        meta: { priority: "high" },
      },
      {
        header: "Status",
        accessorFn: (row) => row.meta?.status || "",
        cell: (info) => {
          const s = info.getValue();
          return <Badge className="capitalize" variant="outline">{s}</Badge>;
        },
        size: 120,
        meta: { priority: "medium" },
      },
      {
        header: "Actions",
        accessorKey: "id_action",
        cell: (info) => {
          const row = info.row.original;
          const s = row.meta?.status;
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={s !== "pending" || update.isLoading}
                onClick={() => handleChangeStatus(row.id, "approved")}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={s !== "pending" || update.isLoading}
                onClick={() => handleChangeStatus(row.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          );
        },
        size: 220,
        meta: { priority: "low" },
      },
    ],
    [update]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Reservation Approvals</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={reservations} loading={isLoading} pageSize={pageSize} />
    </div>
  );
};

export default Approval;

 


