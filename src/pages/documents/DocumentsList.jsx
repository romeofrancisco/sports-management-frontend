import { useState } from "react";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Button } from "@/components/ui/button";
import { useRootFolders, useFolderContents } from "@/hooks/useDocuments";
import { useDocumentNavigation } from "./hooks/useDocumentNavigation";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import Breadcrumbs from "./components/Breadcrumbs";
import UploadFileDialog from "./components/UploadFileDialog";
import CreateFolderDialog from "./components/CreateFolderDialog";
import LoadingState from "./components/LoadingState";
import {
  Upload,
  Folder,
  Table2,
  LayoutGrid,
  FolderClosed,
  Search,
  FolderPlus,
  RotateCw,
} from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import ContentEmpty from "@/components/common/ContentEmpty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DocumentsList = () => {
  const { permissions } = useRolePermissions();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  // Navigation
  const {
    navigationStack,
    currentFolder,
    isRoot,
    handleFolderClick,
    handleBreadcrumbClick,
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

  // Get current data and loading states
  const currentData = isRoot ? rootData : folderData;
  const isLoading = isRoot ? rootLoading : folderLoading;
  const isFetching = isRoot ? rootFetching : folderFetching;

  // Backend returns 'folders' for root, but 'subfolders' for folder contents
  const folders = isRoot
    ? currentData?.folders || []
    : currentData?.subfolders || [];
  const documents = currentData?.documents || [];

  const handleRefresh = () => {
    if (isRoot) {
      refetchRoot();
    } else {
      refetchFolder();
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-3 rounded-xl">
                <FolderClosed className="size-7 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Documents
                  </h2>
                </div>

                <Breadcrumbs
                  path={navigationStack}
                  onNavigate={handleBreadcrumbClick}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Table2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RotateCw className={isFetching ? "animate-spin" : ""} />
            </Button>
            <div className="w-full">
              <Search className="absolute ml-2 mt-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-7" placeholder="Search documents..." />
            </div>

            <Button
              variant="outline"
              onClick={() => setIsCreateFolderOpen(true)}
            >
              <FolderPlus />
              <span className="hidden md:block">New Folder</span>
            </Button>

            <Button
              onClick={() => setIsUploadOpen(true)}
              disabled={!permissions.documents.canUpload(currentFolder)}
            >
              <Upload />
              <span className="hidden md:block">Upload File</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {/* Folders Grid */}
              {folders.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-4 text-xl font-semibold">
                    <Folder />
                    <h2 className="">Folders</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {folders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onClick={() => handleFolderClick(folder)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Files Grid */}
              {documents.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Files</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {documents.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        currentFolder={currentFolder}
                        rootData={rootData}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {folders.length === 0 && documents.length === 0 && (
                <ContentEmpty
                  title="No Documents Found"
                  icon={Folder}
                  description="Upload your documents to get started."
                  action={
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
