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
import * as handlers from "./handlers/documentsListHandlers";
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
import SpreadSheetEditor from "@/features/editors/spreadsheet/SpreadSheetEditor";

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

  // Cleanup long press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Wrapper functions for handlers
  const onBreadcrumbNavigate = (index) => {
    handlers.handleBreadcrumbNavigation(
      index,
      setSearchQuery,
      handleBreadcrumbClick
    );
  };

  const onSearchFolderClick = (folder) => {
    handlers.handleSearchFolderClick(
      folder,
      setSearchQuery,
      setNavigationPath,
      navigateToFolder
    );
  };

  const onTouchStart = () => {
    handlers.handleTouchStart(longPressTimerRef, setContextMenuOpen);
  };

  const onTouchEnd = () => {
    handlers.handleTouchEnd(longPressTimerRef);
  };

  const onTouchMove = () => {
    handlers.handleTouchMove(longPressTimerRef);
  };

  const onPaste = () => {
    handlers.handlePaste({
      clipboardFile,
      clipboardAction,
      currentFolder,
      rootData,
      moveMutation,
      copyMutation,
      setClipboardFile,
      setClipboardAction,
    });
  };

  const onFileCardDragStart = (file) => {
    handlers.handleFileCardDragStart(file, setDraggedFileCard);
  };

  const onFileCardDragEnd = () => {
    handlers.handleFileCardDragEnd(setDraggedFileCard);
  };

  const onFileDrop = (fileData, targetFolder) => {
    handlers.handleFileDrop(fileData, targetFolder, moveMutation);
  };

  const onDragOver = (e) => {
    handlers.handleDragOver(e, isDraggingOver, setIsDraggingOver);
  };

  const onDragEnter = (e) => {
    handlers.handleDragEnter(e, setIsDraggingOver);
  };

  const onDragLeave = (e) => {
    handlers.handleDragLeave(e, isDraggingOver, setIsDraggingOver);
  };

  const onDrop = (e) => {
    handlers.handleDrop(
      e,
      setIsDraggingOver,
      setDraggedFiles,
      setIsMultipleUploadOpen
    );
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
            onBreadcrumbNavigate={onBreadcrumbNavigate}
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
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onTouchMove={onTouchMove}
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
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
                    <div className="mb-4">
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
                                onSearchFolderClick(folder);
                              } else {
                                handleFolderClick(folder);
                              }
                            }}
                            showLocation={isSearching}
                            viewMode={viewMode}
                            onFileDrop={onFileDrop}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Grid */}
                  {documents.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-4 text-xl font-semibold text-primary">
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
                            onDragStart={onFileCardDragStart}
                            onDragEnd={onFileCardDragEnd}
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
                setTimeout(() => onPaste(), 0);
              }}
              disabled={!clipboardFile}
            >
              <span className="flex items-center gap-1">
                <ClipboardPaste className="h-4 w-4" />
                Paste{" "}
                {clipboardFile && clipboardAction === "cut"
                  ? "(Move)"
                  : clipboardFile && clipboardAction === "copy"
                  ? "(Copy)"
                  : ""}
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
