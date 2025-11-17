import React from "react";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { useFacilities } from "@/hooks/useFacilities";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/common/FilterDropdown";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

const ApprovalFilter = ({ filters = {}, setFilters, setCurrentPage }) => {
  const { data: facilities } = useFacilities({ no_pagination: true });

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...(prev || {}), status: value }));
    setCurrentPage(1);
  };

  const handleFacilityChange = (value) => {
    setFilters((prev) => ({ ...(prev || {}), facility: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...(prev || {}), q: value }));
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full">
        <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
        <Input
          className="w-full ps-7"
          placeholder="Search..."
          value={filters.q || ""}
          onChange={(e) => {
            handleSearchChange(e);
          }}
        />
      </div>
      <FilterDropdown onClear={handleResetAll}>
        <div className="flex justify-between px-1 text-sm my-2">
          <span>Date Range</span>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...(prev || {}),
                start_date: null,
                end_date: null,
              }))
            }
            className="text-primary cursor-pointer"
          >
            Reset
          </button>
        </div>
        <DateRangePicker
          value={{
            from: filters.start_date || null,
            to: filters.end_date || null,
          }}
          onChange={(newRange) => {
            setFilters((prev) => ({
              ...(prev || {}),
              start_date: newRange?.from || null,
              end_date: newRange?.to || null,
            }));
            setCurrentPage(1);
          }}
        />
        <DropdownMenuGroup className="px-1 mb-3">
          <div className="flex justify-between px-1 text-sm my-2">
            <span>Facility</span>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...(prev || {}), facility: null }))
              }
              className="text-primary cursor-pointer"
            >
              Reset
            </button>
          </div>
          <Select
            value={filters.facility || undefined}
            onValueChange={(v) => handleFacilityChange(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities?.map((facility) => (
                <SelectItem key={facility.id} value={String(facility.id)}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="px-1">
          <div className="flex justify-between px-1 text-sm my-2">
            <span>Status</span>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...(prev || {}), status: "all" }))
              }
              className="text-primary cursor-pointer"
            >
              Reset
            </button>
          </div>
          <Select
            value={filters.status || "all"}
            onValueChange={(v) => handleStatusChange(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DropdownMenuGroup>
      </FilterDropdown>
    </div>
  );
};

export default ApprovalFilter;
