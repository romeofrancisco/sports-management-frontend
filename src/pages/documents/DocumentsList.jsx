import { useState, useRef, useEffect } from "react";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import {
  useRootFolders,
  useFolderContents,
  useSearchDocuments,
  useCopyFile,
} from "@/hooks/useDocuments";
import { useDocumentNavigation } from "./hooks/useDocumentNavigation";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import DocumentsHeader from "./components/DocumentsHeader";
import UploadFileDialog from "./components/UploadFileDialog";
import CreateFolderDialog from "./components/CreateFolderDialog";
import LoadingState from "./components/LoadingState";
import {
  Upload,
  Folder,
  Search,
  File,
  ClipboardPaste,
  FolderPlus,
} from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import ContentEmpty from "@/components/common/ContentEmpty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const DocumentsList = () => {
  const { permissions } = useRolePermissions();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clipboardFile, setClipboardFile] = useState(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const longPressTimerRef = useRef(null);
  const copyMutation = useCopyFile();

  // Navigation
  const {
    navigationStack,
    currentFolder,
    isRoot,
    handleFolderClick,
    handleBreadcrumbClick,
    navigateToFolder,
    setNavigationPath,
  } = useDocumentNavigation();

  // Fetch data based on current location
  const {
    data: rootData,
    isLoading: rootLoading,
    isFetching: rootFetching,
    refetch: refetchRoot,
  } = useRootFolders();

  const {
    data: folderData,
    isLoading: folderLoading,
    isFetching: folderFetching,
    refetch: refetchFolder,
  } = useFolderContents(currentFolder?.id);

  // Search
  const { data: searchResults, isLoading: searchLoading } = useSearchDocuments(
    searchQuery,
    searchQuery.length >= 2
  );

  // Get current data and loading states
  const isSearching = searchQuery.length >= 2;
  const currentData = isSearching
    ? searchResults
    : isRoot
    ? rootData
    : folderData;
  const isLoading = isSearching
    ? searchLoading
    : isRoot
    ? rootLoading
    : folderLoading;
  const isFetching = isRoot ? rootFetching : folderFetching;

  // Backend returns 'folders' for root, but 'subfolders' for folder contents
  // For search results, we get a unified 'results' array
  const folders = isSearching
    ? currentData?.results?.filter((item) => item.type === "folder") || []
    : isRoot
    ? currentData?.folders || []
    : currentData?.subfolders || [];

  const documents = isSearching
    ? currentData?.results?.filter((item) => item.type === "document") || []
    : currentData?.documents || [];

  const handleRefresh = () => {
    if (isRoot) {
      refetchRoot();
    } else {
      refetchFolder();
    }
  };

  const handleBreadcrumbNavigation = (index) => {
    // Clear search when navigating via breadcrumb
    setSearchQuery("");
    handleBreadcrumbClick(index);
  };

  const handleSearchFolderClick = (folder) => {
    // Clear search first
    setSearchQuery("");

    // If the folder has location info, parse it to build the full breadcrumb path
    if (folder.location) {
      // Location format: "Coaches > Ittetsu Takeda > Players > Caitlin Antetokounmpo"
      // Using " > " as separator to avoid conflicts with folder names containing "/"
      const pathParts = folder.location.split(" > ");

      // Create folder objects for each part of the path for breadcrumb display
      const pathFolders = pathParts.map((name, index) => {
        // Only the last item in the path has the real folder ID
        if (index === pathParts.length - 1) {
          return folder; // Use the actual folder object
        }
        // For parent folders, create temporary objects for breadcrumb display
        return {
          id: `breadcrumb-${index}-${name}`,
          name: name,
        };
      });

      // Set the full navigation path for proper breadcrumb display
      setNavigationPath(pathFolders);
    } else {
      // No location means it's a root folder
      navigateToFolder(folder);
    }
  };

  // Cleanup long press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Touch handlers for long press
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setContextMenuOpen(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handlePaste = () => {
    if (clipboardFile) {
      copyMutation.mutate(
        {
          fileId: clipboardFile.id,
          currentFolder,
          rootData,
        },
        {
          onSuccess: () => {
            setClipboardFile(null); // Clear clipboard after successful paste
          },
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-1 md:p-6 space-y-6">
      {/* Header */}
      <UniversityPageHeader
        title="Documents Management"
        description="Manage and organize your files and folders"
        showUniversityColors={true}
      />

      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 ">
        <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
          <DocumentsHeader
            navigationStack={navigationStack}
            onBreadcrumbNavigate={handleBreadcrumbNavigation}
            isFetching={isFetching}
            onRefresh={handleRefresh}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentFolder={currentFolder}
            onUploadFile={() => setIsUploadOpen(true)}
            onCreateFolder={() => setIsCreateFolderOpen(true)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </CardHeader>
        <ContextMenu
          modal={false}
          open={contextMenuOpen}
          onOpenChange={setContextMenuOpen}
        >
          <ContextMenuTrigger asChild>
            <CardContent
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {/* Loading State */}
              {isLoading ? (
                <LoadingState viewMode={viewMode} />
              ) : (
                <>
                  {/* Folders Grid */}
                  {folders.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-4 text-xl font-semibold text-primary">
                        <Folder className="size-4 md:size-6" />
                        <h2 className="text-lg md:text-xl">Folders</h2>
                        {isSearching && (
                          <span className="text-xs md:text-sm text-muted-foreground font-normal">
                            ({folders.length} result
                            {folders.length !== 1 ? "s" : ""})
                          </span>
                        )}
                      </div>
                      <div className={
                        viewMode === "grid"
                          ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2"
                          : "flex flex-col gap-2"
                      }>
                        {folders.map((folder) => (
                          <FolderCard
                            key={folder.id}
                            folder={folder}
                            onClick={() => {
                              if (isSearching) {
                                handleSearchFolderClick(folder);
                              } else {
                                handleFolderClick(folder);
                              }
                            }}
                            showLocation={isSearching}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Grid */}
                  {documents.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 my-4 text-xl font-semibold text-primary">
                        <File className="size-4 md:size-6" />
                        <h2 className="text-lg md:text-xl">Files</h2>
                        {isSearching && (
                          <span className="text-xs md:text-sm text-muted-foreground font-normal">
                            ({documents.length} result
                            {documents.length !== 1 ? "s" : ""})
                          </span>
                        )}
                      </div>
                      <div className={
                        viewMode === "grid"
                          ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2"
                          : "flex flex-col gap-2"
                      }>
                        {documents.map((file) => (
                          <FileCard
                            key={file.id}
                            file={file}
                            currentFolder={currentFolder}
                            rootData={rootData}
                            showLocation={isSearching}
                            onCopy={setClipboardFile}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {folders.length === 0 && documents.length === 0 && (
                    <ContentEmpty
                      title={
                        isSearching ? "No Results Found" : "No Documents Found"
                      }
                      icon={isSearching ? Search : Folder}
                      description={
                        isSearching
                          ? `No files or folders match "${searchQuery}"`
                          : "Upload your documents to get started."
                      }
                      action={
                        !isSearching &&
                        permissions.documents.canUpload(currentFolder) && {
                          label: "Upload File",
                          logo: Upload,
                          onClick: () => setIsUploadOpen(true),
                          extra: {
                            label: "Create Folder",
                            logo: Folder,
                            onClick: () => setIsCreateFolderOpen(true),
                          },
                        }
                      }
                    />
                  )}
                </>
              )}
            </CardContent>
          </ContextMenuTrigger>

          {/* Right-Click/Long-Press Context Menu for Paste */}
          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={() => setIsCreateFolderOpen(true)}>
              <span className="flex items-center gap-1">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setIsUploadOpen(true)}>
              <span className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Upload File
              </span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setContextMenuOpen(false);
                setTimeout(() => handlePaste(), 0);
              }}
              disabled={!clipboardFile}
            >
              <span className="flex items-center gap-1">
                <ClipboardPaste className="h-4 w-4" />
                Paste
              </span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Card>

      {/* Upload Dialog */}
      <UploadFileDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        currentFolder={currentFolder}
        rootData={rootData}
      />

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        currentFolder={currentFolder}
        rootData={rootData}
      />
    </div>
  );
};

export default DocumentsList;
