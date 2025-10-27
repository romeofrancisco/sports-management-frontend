import { useState } from "react";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Button } from "@/components/ui/button";
import {
  useRootFolders,
  useFolderContents,
  useUploadFile,
  useDownloadFile,
  useCopyFile,
  useDeleteFile,
} from "@/hooks/useDocuments";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import Breadcrumbs from "./components/Breadcrumbs";
import UploadFileDialog from "./components/UploadFileDialog";
import LoadingState from "./components/LoadingState";
import {
  Upload,
  Folder,
  Table2,
  LayoutGrid,
  FolderClosed,
  icons,
  Search,
} from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import ContentEmpty from "@/components/common/ContentEmpty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DocumentsList = () => {
  const { user, isAdmin, isCoach, isPlayer, permissions } =
    useRolePermissions();
  const [navigationStack, setNavigationStack] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const currentFolder = navigationStack[navigationStack.length - 1];
  const isRoot = !currentFolder;

  // Fetch data based on current location
  const {
    data: rootData,
    isLoading: rootLoading,
    error: rootError,
  } = useRootFolders();

  const {
    data: folderData,
    isLoading: folderLoading,
    error: folderError,
  } = useFolderContents(currentFolder?.id);

  // Mutations
  const {
    mutate: uploadFile,
    isPending: isUploading,
    uploadProgress,
  } = useUploadFile();
  const downloadMutation = useDownloadFile();
  const copyMutation = useCopyFile();
  const deleteMutation = useDeleteFile();

  // Get current data
  const currentData = isRoot ? rootData : folderData;
  const isLoading = isRoot ? rootLoading : folderLoading;

  // Backend returns 'folders' for root, but 'subfolders' for folder contents
  const folders = isRoot
    ? currentData?.folders || []
    : currentData?.subfolders || [];
  const documents = currentData?.documents || [];

  // Navigation handlers
  const handleFolderClick = (folder) => {
    setNavigationStack([...navigationStack, folder]);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      // Go to root
      setNavigationStack([]);
    } else {
      // Go to specific folder in path
      setNavigationStack(navigationStack.slice(0, index + 1));
    }
  };

  // File action handlers
  const handleUpload = (fileData) => {
    uploadFile(
      {
        ...fileData,
        folder: currentFolder?.id || null,
      },
      {
        onSuccess: () => {
          setIsUploadOpen(false);
        },
      }
    );
  };

  const handleDownload = (file) => {
    downloadMutation.mutate({
      fileId: file.id,
      fileName: file.title,
    });
  };

  const handleCopy = (fileId) => {
    copyMutation.mutate({
      fileId,
      currentFolder,
      rootData,
    });
  };

  const handleDelete = (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      deleteMutation.mutate(fileId);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <UniversityPageHeader
        title="Documents Management"
        description="Manage and organize your files and folders"
      />
      {permissions.documents.canUpload(currentFolder) && (
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      )}

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
              <div>
                <Search className="absolute ml-2 mt-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-7" placeholder="Search documents..." />
              </div>
              <Button variant="outline" size="icon">
                <Table2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* <TeamFiltersBar filter={filter} setFilter={handleFilterChange} /> */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {documents.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onDownload={() => handleDownload(file)}
                        onCopy={
                          permissions.documents.canCopy()
                            ? () => handleCopy(file.id)
                            : undefined
                        }
                        onDelete={
                          permissions.documents.canDelete(file)
                            ? () => handleDelete(file.id)
                            : undefined
                        }
                        canDelete={permissions.documents.canDelete(file)}
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
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
};

export default DocumentsList;
