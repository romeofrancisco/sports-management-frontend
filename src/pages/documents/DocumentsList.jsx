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
  useRenameFile,
  useRenameFolder,
  useDeleteFolder,
} from "@/hooks/useDocuments";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import Breadcrumbs from "./components/Breadcrumbs";
import UploadFileDialog from "./components/UploadFileDialog";
import CreateFolderDialog from "./components/CreateFolderDialog";
import LoadingState from "./components/LoadingState";
import DeleteModal from "@/components/common/DeleteModal";
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
import { useCreateFolder } from "@/hooks/useDocuments";

const DocumentsList = () => {
  const { permissions } = useRolePermissions();
  const [navigationStack, setNavigationStack] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [deleteFile, setDeleteFile] = useState(null);
  const [deleteFolder, setDeleteFolder] = useState(null);

  const currentFolder = navigationStack[navigationStack.length - 1];
  const isRoot = !currentFolder;

  // Fetch data based on current location
  const { data: rootData, isLoading: rootLoading } = useRootFolders();

  const { data: folderData, isLoading: folderLoading } = useFolderContents(
    currentFolder?.id
  );

  // Mutations
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: createFolder, isPending: isCreatingFolder } = useCreateFolder();
  const downloadMutation = useDownloadFile();
  const copyMutation = useCopyFile();
  const deleteMutation = useDeleteFile();
  const renameMutation = useRenameFile();
  const renameFolderMutation = useRenameFolder();
  const deleteFolderMutation = useDeleteFolder();

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
    // Use personal_folder_id from rootData if at root (for coaches/players)
    const targetFolderId = currentFolder?.id || rootData?.personal_folder_id || null;
    
    uploadFile(
      {
        ...fileData,
        folder: targetFolderId,
      },
      {
        onSuccess: () => {
          setIsUploadOpen(false);
        },
      }
    );
  };

  const handleCreateFolder = (folderData) => {
    // Use personal_folder_id from rootData if at root (for coaches/players)
    const parentFolderId = currentFolder?.id || rootData?.personal_folder_id || null;
    
    createFolder(
      {
        ...folderData,
        parent: parentFolderId,
      },
      {
        onSuccess: () => {
          setIsCreateFolderOpen(false);
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

  const handleDelete = (file) => {
    setDeleteFile(file);
  };

  const confirmDelete = () => {
    if (deleteFile) {
      deleteMutation.mutate(deleteFile.id);
      setDeleteFile(null);
    }
  };

  const handleRename = (fileId, newTitle) => {
    renameMutation.mutate({
      fileId,
      newTitle,
    });
  };

  const handleFolderRename = (folderId, newName) => {
    renameFolderMutation.mutate({
      folderId,
      newName,
    });
  };

  const handleFolderDelete = (folder) => {
    setDeleteFolder(folder);
  };

  const confirmFolderDelete = () => {
    if (deleteFolder) {
      deleteFolderMutation.mutate(deleteFolder.id);
      setDeleteFolder(null);
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
          <div className="flex gap-4">
            <div className="w-full">
              <Search className="absolute ml-2 mt-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-7" placeholder="Search documents..." />
            </div>

            <Button
              variant="outline"
              onClick={() => setIsCreateFolderOpen(true)}
              disabled={!permissions.documents.canUpload(currentFolder)}
            >
              <Folder />
              New Folder
            </Button>

            <Button
              onClick={() => setIsUploadOpen(true)}
              disabled={!permissions.documents.canUpload(currentFolder)}
            >
              <Upload />
              Upload File
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
                        onRename={
                          permissions.documents.canDelete({ owner: folder.owner })
                            ? handleFolderRename
                            : undefined
                        }
                        onDelete={
                          permissions.documents.canDelete({ owner: folder.owner })
                            ? () => handleFolderDelete(folder)
                            : undefined
                        }
                        canDelete={permissions.documents.canDelete({ owner: folder.owner })}
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
                        onDownload={() => handleDownload(file)}
                        onCopy={
                          permissions.documents.canCopy()
                            ? () => handleCopy(file.id)
                            : undefined
                        }
                        onRename={
                          permissions.documents.canDelete(file)
                            ? handleRename
                            : undefined
                        }
                        onDelete={
                          permissions.documents.canDelete(file)
                            ? () => handleDelete(file)
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
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
        isCreating={isCreatingFolder}
        currentFolder={currentFolder}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={!!deleteFile}
        onOpenChange={(open) => {
          if (!open) setDeleteFile(null);
        }}
        onConfirm={confirmDelete}
        itemName={deleteFile?.title}
        itemType="document"
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Delete Folder Confirmation Modal */}
      <DeleteModal
        open={!!deleteFolder}
        onOpenChange={(open) => {
          if (!open) setDeleteFolder(null);
        }}
        onConfirm={confirmFolderDelete}
        itemName={deleteFolder?.name}
        itemType="folder"
        isLoading={deleteFolderMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default DocumentsList;
