import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Weight,
  GraduationCap,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { getStatusBadge } from "./RegistrationColumns";
import RegistrationDocumentViewer from "./RegistrationDocumentViewer";

const InfoRow = ({ icon: Icon, label, value, className }) => {
  if (!value) return null;
  const IconComp = Icon;
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <IconComp className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
};

const RegistrationDetailsModal = ({ open, onOpenChange, registration }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  // When document viewer is open, we need to prevent the parent modal from closing
  const isDocumentViewerOpen = !!selectedDocument;

  if (!registration) return null;

  const fullName = registration.full_name || `${registration.first_name} ${registration.last_name}`;
  const initials = `${registration.first_name?.[0] || ""}${registration.last_name?.[0] || ""}`.toUpperCase();

  // Handle modal close - prevent if document viewer is open
  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen);
  };

  // Handle document viewer close - just clear selected document
  // The modal will automatically reopen since open && !isDocumentViewerOpen
  const handleDocumentViewerClose = () => {
    setSelectedDocument(null);
  };

  return (
    <>
      <Modal
        open={open && !isDocumentViewerOpen}
        onOpenChange={handleOpenChange}
        icon={User}
        title="Registration Details"
        description="View complete registration information"
      >
      <div className="space-y-6">
        {/* Header with Avatar and Status */}
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <p className="text-sm text-muted-foreground">{registration.email}</p>
            <div className="mt-1">{getStatusBadge(registration.status)}</div>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-primary">Personal Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={Mail} label="Email" value={registration.email} className="col-span-2 md:col-span-1" />
            <InfoRow icon={Phone} label="Phone" value={registration.phone_number} />
            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={
                registration.date_of_birth
                  ? format(new Date(registration.date_of_birth), "PP")
                  : null
              }
            />
            <InfoRow
              icon={User}
              label="Sex"
              value={registration.sex?.charAt(0).toUpperCase() + registration.sex?.slice(1)}
            />
            <InfoRow
              icon={Ruler}
              label="Height"
              value={registration.height ? `${registration.height} cm` : null}
            />
            <InfoRow
              icon={Weight}
              label="Weight"
              value={registration.weight ? `${registration.weight} kg` : null}
            />
          </div>
        </div>

        <Separator />

        {/* Academic Information */}
        {registration.academic_info && (
          <>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary">Academic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  icon={GraduationCap}
                  label="Year Level"
                  value={registration.academic_info.year_level}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Course"
                  value={registration.academic_info.course}
                />
                {registration.academic_info.section && (
                  <InfoRow
                    icon={GraduationCap}
                    label="Section"
                    value={registration.academic_info.section}
                  />
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Sport Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-primary">Sport Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sport:</span>
              <Badge variant="outline">{registration.sport?.name}</Badge>
            </div>
            {registration.positions?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Positions:</span>
                {registration.positions.map((pos) => (
                  <Badge key={pos.id} variant="secondary">
                    {pos.name}
                  </Badge>
                ))}
              </div>
            )}
            {registration.team && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Team:</span>
                <Badge variant="outline">{registration.team.name}</Badge>
              </div>
            )}
            {registration.jersey_number && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Jersey Number:</span>
                <span className="font-medium">#{registration.jersey_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        {registration.documents?.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary">Documents</h4>
              <div className="space-y-2">
                {registration.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {doc.document_type_display || doc.document_type?.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    {(doc.file_url || doc.file) && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDocument(doc)}
                          className="gap-1.5"
                        >
                          <Eye className="size-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(doc.download_url || doc.file_url || doc.file, "_blank")}
                          className="gap-1.5"
                        >
                          <Download className="size-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Review Information (if reviewed) */}
        {registration.reviewed_at && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary">Review Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Reviewed by:</span>{" "}
                  <span className="font-medium">{registration.reviewed_by_name}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Reviewed at:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(registration.reviewed_at), "PPp")}
                  </span>
                </p>
                {registration.rejection_reason && (
                  <div>
                    <span className="text-muted-foreground">Rejection reason:</span>
                    <p className="mt-1 p-2 rounded bg-destructive/10 text-destructive">
                      {registration.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Submission Info */}
        <Separator />
        <div className="text-xs text-muted-foreground text-center">
          Submitted on {format(new Date(registration.created_at), "PPp")}
        </div>
      </div>
    </Modal>

    {/* Document Viewer - Rendered outside Modal to avoid click conflicts */}
    <RegistrationDocumentViewer
      open={isDocumentViewerOpen}
      onOpenChange={(isOpen) => !isOpen && handleDocumentViewerClose()}
      document={selectedDocument}
      registrationInfo={{
        full_name: fullName,
        email: registration.email,
      }}
    />
  </>
  );
};

export default RegistrationDetailsModal;
