import React, { useState, useEffect } from "react";
import { DropdownMenuGroup, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/common/FilterDropdown";
import { useDebounce } from "use-debounce";
import api from "@/api";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const RegistrationApprovalFilter = ({ filters = {}, setFilters, setCurrentPage }) => {
  const [sports, setSports] = useState([]);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  // Fetch sports for filter
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data } = await api.get("sports/");
        setSports(data);
      } catch (error) {
        console.error("Failed to fetch sports:", error);
      }
    };
    fetchSports();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...(prev || {}), search: debouncedSearchValue }));
    setCurrentPage(1);
  }, [debouncedSearchValue, setFilters, setCurrentPage]);

  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...(prev || {}), status: value }));
    setCurrentPage(1);
  };

  const handleSportChange = (value) => {
    setFilters((prev) => ({ ...(prev || {}), sport: value }));
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    setFilters({});
    setSearchValue("");
    setCurrentPage(1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full">
        <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
        <Input
          className="w-full ps-7"
          placeholder="Search by name or email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <FilterDropdown onClear={handleResetAll}>
        <DropdownMenuGroup className="px-1 mb-3">
          <div className="flex justify-between px-1 text-sm my-2">
            <span>Sport</span>
            <button
              onClick={() => setFilters((prev) => ({ ...(prev || {}), sport: null }))}
              className="text-primary cursor-pointer"
            >
              Reset
            </button>
          </div>
          <Select
            value={filters.sport || undefined}
            onValueChange={(v) => handleSportChange(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports?.map((sport) => (
                <SelectItem key={sport.id} value={String(sport.id)}>
                  {sport.name}
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
              onClick={() => setFilters((prev) => ({ ...(prev || {}), status: "all" }))}
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

export default RegistrationApprovalFilter;
