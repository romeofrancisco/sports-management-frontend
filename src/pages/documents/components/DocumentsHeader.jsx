import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  Table2,
  LayoutGrid,
  FolderClosed,
  Search,
  FolderPlus,
  RotateCw,
  MoreVertical,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Breadcrumbs from "./Breadcrumbs";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const DocumentsHeader = ({
  navigationStack,
  onBreadcrumbNavigate,
  isFetching,
  onRefresh,
  searchQuery,
  onSearchChange,
  onCreateFolder,
  onUploadFile,
  currentFolder,
  viewMode,
  onViewModeChange,
}) => {
  const isMobile = useIsMobile();
  const { permissions } = useRolePermissions();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleUploadClick = () => {
    setDropdownOpen(false);
    onUploadFile();
  };

  const handleCreateFolderClick = () => {
    setDropdownOpen(false);
    onCreateFolder();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-3 rounded-xl">
            <FolderClosed className="size-7 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">Documents</h2>
            </div>

            <Breadcrumbs
              path={navigationStack}
              onNavigate={onBreadcrumbNavigate}
            />
          </div>
        </div>

        {/* View buttons - Desktop only */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("list")}
            >
              <Table2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isFetching}
        >
          <RotateCw className={isFetching ? "animate-spin" : ""} />
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-7"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Desktop buttons */}
        {!isMobile && (
          <>
            <Button variant="outline" onClick={onCreateFolder}>
              <FolderPlus />
              <span className="hidden md:block">New Folder</span>
            </Button>

            <Button
              onClick={onUploadFile}
              disabled={!permissions.documents.canUpload(currentFolder)}
            >
              <Upload />
              <span className="hidden md:block">Upload File</span>
            </Button>
          </>
        )}

        {/* Mobile dropdown menu */}
        {isMobile && (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleUploadClick}
                disabled={!permissions.documents.canUpload(currentFolder)}
              >
                <Upload />
                Upload File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateFolderClick}>
                <FolderPlus />
                New Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewModeChange("list")}>
                <Table2 />
                List View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewModeChange("grid")}>
                <LayoutGrid />
                Grid View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

export default DocumentsHeader;
