import { useState, useRef, useEffect } from "react";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import {
  useRootFolders,
  useFolderContents,
  useSearchDocuments,
  useCopyFile,
  useMoveFile,
  useFolderDetails,
} from "@/hooks/useDocuments";
import { useDocumentNavigation } from "./hooks/useDocumentNavigation";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import DocumentsHeader from "./components/DocumentsHeader";
import UploadFileDialog from "./components/UploadFileDialog";
import MultipleUploadDialog from "./components/MultipleUploadDialog";
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
  const [isMultipleUploadOpen, setIsMultipleUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clipboardFile, setClipboardFile] = useState(null);
  const [clipboardAction, setClipboardAction] = useState(null); // 'copy' or 'cut'
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState([]);
  const [draggedFileCard, setDraggedFileCard] = useState(null);
  const longPressTimerRef = useRef(null);
  const copyMutation = useCopyFile();
  const moveMutation = useMoveFile();

  // Navigation
  const {
    navigationStack,
    currentFolder,
    isRoot,
    handleFolderClick,
    handleBreadcrumbClick,
    navigateToFolder,
    setNavigationPath,
    folderIdFromUrl,
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

  // Fetch folder details when loading from URL
  const { data: folderDetailsData } = useFolderDetails(
    folderIdFromUrl && navigationStack.length === 0 ? folderIdFromUrl : null
  );

  // Restore navigation from URL on mount
  useEffect(() => {
    if (folderIdFromUrl && folderDetailsData && navigationStack.length === 0) {
      // Build navigation stack from breadcrumbs if available
      if (
        folderDetailsData.breadcrumbs &&
        folderDetailsData.breadcrumbs.length > 0
      ) {
        setNavigationPath(folderDetailsData.breadcrumbs);
      } else {
        // No breadcrumbs, just navigate to this folder
        navigateToFolder(folderDetailsData);
      }
    }
  }, [folderIdFromUrl, folderDetailsData, navigationStack.length]);

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
      if (clipboardAction === 'cut') {
        // Move the file
        let targetFolderId = null;
        
        if (currentFolder) {
          targetFolderId = currentFolder.id;
        } else if (rootData) {
          // At root level, admin can paste to null
          targetFolderId = null;
        }
        
        moveMutation.mutate(
          {
            fileId: clipboardFile.id,
            targetFolderId: targetFolderId,
          },
          {
            onSuccess: () => {
              setClipboardFile(null);
              setClipboardAction(null);
            },
          }
        );
      } else {
        // Copy the file
        copyMutation.mutate(
          {
            fileId: clipboardFile.id,
            currentFolder,
            rootData,
          },
          {
            onSuccess: () => {
              setClipboardFile(null);
              setClipboardAction(null);
            },
          }
        );
      }
    }
  };

  // File card drag handlers
  const handleFileCardDragStart = (file) => {
    setDraggedFileCard(file);
  };

  const handleFileCardDragEnd = () => {
    setDraggedFileCard(null);
  };

  // Handle file drop on folder
  const handleFileDrop = (fileData, targetFolder) => {
    if (!fileData || !fileData.fileId) {
      return;
    }
    
    moveMutation.mutate({
      fileId: fileData.fileId,
      targetFolderId: targetFolder.id,
    });
  };

  // Drag and drop file upload handlers
  const handleDragOver = (e) => {
    // Check if we're dragging a file card (internal) or files from outside
    const isFileCard = e.dataTransfer.types.includes("application/x-file-card");
    
    if (isFileCard) {
      // Don't show upload overlay for internal file card dragging
      return;
    }
    
    // Check if we're dragging actual files (not just any drag event)
    const hasFiles = Array.from(e.dataTransfer.items || []).some(
      item => item.kind === 'file'
    );
    
    if (!hasFiles) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragEnter = (e) => {
    // Check if we're dragging a file card (internal)
    const isFileCard = e.dataTransfer.types.includes("application/x-file-card");
    
    if (isFileCard) {
      return;
    }
    
    // Check if we're dragging actual files
    const hasFiles = Array.from(e.dataTransfer.items || []).some(
      item => item.kind === 'file'
    );
    
    if (!hasFiles) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only process if we were showing the upload overlay
    if (!isDraggingOver) return;
    
    // Only set to false if we're leaving the CardContent area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Check if mouse is outside the bounds
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    // Only handle if it's files from outside (not internal drag)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setDraggedFiles(files);
      // Use multiple upload dialog for drag and drop
      setIsMultipleUploadOpen(true);
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
            onUploadFile={() => setIsMultipleUploadOpen(true)}
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
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative"
            >
              {/* Drag overlay */}
              {isDraggingOver && (
                <div className=" absolute inset-0 mx-4 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-xs  rounded-lg pointer-events-none">
                  <div className="text-center bg-background/90 rounded-lg shadow-lg border-primary/20 border-2 p-4 border-dashed">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-primary animate-bounce" />
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Drop files here
                    </h3>
                    <p className="text-muted-foreground">
                      Release to upload to{" "}
                      {currentFolder ? currentFolder.name : "root folder"}
                    </p>
                  </div>
                </div>
              )}

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
                      <div
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2"
                            : "flex flex-col gap-2"
                        }
                      >
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
                            onFileDrop={handleFileDrop}
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
                      <div
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2"
                            : "flex flex-col gap-2"
                        }
                      >
                        {documents.map((file) => (
                          <FileCard
                            key={file.id}
                            file={file}
                            currentFolder={currentFolder}
                            rootData={rootData}
                            showLocation={isSearching}
                            onCopy={(file, action) => {
                              setClipboardFile(file);
                              setClipboardAction(action);
                            }}
                            onCut={(file, action) => {
                              setClipboardFile(file);
                              setClipboardAction(action);
                            }}
                            viewMode={viewMode}
                            onDragStart={handleFileCardDragStart}
                            onDragEnd={handleFileCardDragEnd}
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
                          onClick: () => setIsMultipleUploadOpen(true),
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
            <ContextMenuItem onClick={() => setIsMultipleUploadOpen(true)}>
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
                Paste {clipboardFile && clipboardAction === 'cut' ? '(Move)' : clipboardFile && clipboardAction === 'copy' ? '(Copy)' : ''}
              </span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Card>

      {/* Multiple Upload Dialog */}
      <MultipleUploadDialog
        open={isMultipleUploadOpen}
        onOpenChange={(open) => {
          setIsMultipleUploadOpen(open);
          // Always clear dragged files when dialog closes (whether cancelled or uploaded)
          if (!open) {
            setDraggedFiles([]);
          }
        }}
        currentFolder={currentFolder}
        rootData={rootData}
        draggedFiles={draggedFiles}
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
