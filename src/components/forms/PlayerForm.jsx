import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import MultiSelect from "../common/ControlledMultiSelect";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import ControlledTeamSelect from "../common/ControlledTeamSelect";
import {
  Loader2,
  Upload,
  X,
  FileText,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import { toast } from "sonner";

import { useCreatePlayer, useUpdatePlayer } from "@/hooks/usePlayers";
import { useSportPositions } from "@/hooks/useSports";
import { useSportTeams } from "@/hooks/useTeams";
import { useAcademicInfoForm } from "@/hooks/useAcademicInfo";
import {
  uploadPlayerDocument,
  fetchPlayerDocuments,
  deletePlayerDocument,
} from "@/api/playersApi";
import RegistrationDocumentViewer from "@/features/players/components/RegistrationDocumentViewer";

import { SEX } from "@/constants/player";
import ControlledDatePicker from "../common/ControlledDatePicker";

// Document type options
const DOCUMENT_TYPES = [
  { value: "medical_cert", label: "Medical Certificate" },
  { value: "parent_consent", label: "Parent/Guardian Consent Form" },
  { value: "other", label: "Other" },
];

const PlayerForm = ({ sports, onClose, player }) => {
  const isEdit = !!player;

  const { mutate: createPlayer, isPending: isCreating } = useCreatePlayer();
  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer();

  // Document upload state
  const [documents, setDocuments] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch existing documents when editing a player
  useEffect(() => {
    if (isEdit && player?.slug) {
      setIsLoadingDocs(true);
      fetchPlayerDocuments(player.slug)
        .then((data) => {
          setExistingDocuments(data.documents || []);
        })
        .catch((error) => {
          console.error("Failed to fetch player documents:", error);
        })
        .finally(() => {
          setIsLoadingDocs(false);
        });
    }
  }, [isEdit, player?.slug]);

  // Handle deleting an existing document
  const handleDeleteExistingDocument = async (documentId) => {
    if (!player?.slug) return;

    setDeletingDocId(documentId);
    try {
      await deletePlayerDocument(player.slug, documentId);
      setExistingDocuments((prev) => prev.filter((d) => d.id !== documentId));
      toast.success("Document deleted successfully", { richColors: true });
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document", { richColors: true });
    } finally {
      setDeletingDocId(null);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      first_name: player?.first_name || "",
      last_name: player?.last_name || "",
      email: player?.email || "",
      sex: player?.sex || "",
      date_of_birth: player?.date_of_birth || "",
      profile: null,
      sport_slug: player?.sport?.slug || "",
      height: player?.height || "",
      weight: player?.weight || "",
      jersey_number: player?.jersey_number || "",
      team_id: player?.team?.id || "",
      position_ids: player?.positions?.map((pos) => pos.id) || [],
      // Academic info
      year_level: player?.academic_info?.year_level || "",
      course: player?.academic_info?.course || "",
      section: player?.academic_info?.section || null,
      academic_info_id: player?.academic_info?.id || null,
    },
  });

  // Watch cascading values
  const selectedSport = watch("sport_slug");
  const selectedSex = watch("sex");
  const selectedYear = watch("year_level");
  const selectedCourse = watch("course");
  const selectedSection = watch("section");

  const division = selectedSex;

  // Hooks
  const { data: positions } = useSportPositions(selectedSport);
  const { data: teams } = useSportTeams(selectedSport, division);

  // Academic Info
  const { data: allAcademic } = useAcademicInfoForm();
  const { data: coursesForYear } = useAcademicInfoForm(
    selectedYear ? { year_level: selectedYear } : undefined,
    { enabled: !!selectedYear }
  );
  const { data: sectionsForCourse } = useAcademicInfoForm(
    selectedYear && selectedCourse
      ? { year_level: selectedYear, course: selectedCourse }
      : undefined,
    { enabled: !!selectedYear && !!selectedCourse }
  );

  // Academic options
  const yearOptions = useMemo(() => {
    if (!allAcademic) return [];
    return [...new Set(allAcademic.map((a) => a.year_level))].map((y) => ({
      value: y,
      label: y,
    }));
  }, [allAcademic]);

  const courseOptions = useMemo(() => {
    if (!coursesForYear) return [];
    return [...new Set(coursesForYear.map((a) => a.course))].map((c) => ({
      value: c,
      label: c,
    }));
  }, [coursesForYear]);

  const sectionOptions = useMemo(() => {
    if (!sectionsForCourse) return [];
    const sections = [
      ...new Set(sectionsForCourse.map((a) => a.section || "")),
    ];
    return sections.map((s) => ({
      value: s || null,
      label: s || "None",
    }));
  }, [sectionsForCourse]);

  // Auto-resolve academic_info_id
  useEffect(() => {
    if (!sectionsForCourse) return;
    const normalizedSection = selectedSection === "" ? null : selectedSection;
    const match =
      sectionsForCourse.find((a) => a.section === normalizedSection) ||
      sectionsForCourse.find((a) => a.section == null);

    if (match) setValue("academic_info_id", match.id);
  }, [sectionsForCourse, selectedSection, setValue]);

  // Reset cascading values
  const yearDidMount = useRef(false);
  useEffect(() => {
    if (!yearDidMount.current) {
      yearDidMount.current = true;
      return;
    }
    setValue("course", "");
    setValue("section", "");
    setValue("academic_info_id", null);
  }, [selectedYear, setValue]);

  const courseDidMount = useRef(false);
  useEffect(() => {
    if (!courseDidMount.current) {
      courseDidMount.current = true;
      return;
    }
    setValue("section", "");
    setValue("academic_info_id", null);
  }, [selectedCourse, setValue]);

  // Reset team & positions when sport/sex changes
  useEffect(() => {
    if (!isEdit) {
      setValue("team_id", "");
      setValue("position_ids", []);
    }
  }, [selectedSex, selectedSport, setValue, isEdit]);

  // Handle document upload to local state
  const handleDocumentUpload = (e, documentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB",
        richColors: true,
      });
      return;
    }

    // Validate file type
    const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      toast.error("Invalid file type", {
        description: `Allowed types: ${allowedTypes.join(", ")}`,
        richColors: true,
      });
      return;
    }

    // Add to local state
    setDocuments((prev) => [
      ...prev.filter((d) => d.type !== documentType),
      {
        type: documentType,
        file: file,
        title: file.name,
        status: "pending",
      },
    ]);
  };

  // Remove document from local state
  const removeDocument = (documentType) => {
    setDocuments((prev) => prev.filter((d) => d.type !== documentType));
  };

  // Upload documents after player is created
  const uploadDocuments = async (playerSlug) => {
    for (const doc of documents) {
      try {
        await uploadPlayerDocument(playerSlug, {
          document_type: doc.type,
          title: doc.title,
          file: doc.file,
        });

        setDocuments((prev) =>
          prev.map((d) =>
            d.type === doc.type ? { ...d, status: "uploaded" } : d
          )
        );
      } catch (error) {
        console.error("Failed to upload document:", error);
        setDocuments((prev) =>
          prev.map((d) => (d.type === doc.type ? { ...d, status: "error" } : d))
        );
        toast.error("Document upload failed", {
          description: `Failed to upload ${doc.title}`,
          richColors: true,
        });
      }
    }
  };

  // Submit Handler
  const onSubmit = async (data) => {
    const payload = { ...data };

    // Normalize position_ids
    if (payload.position_ids && !Array.isArray(payload.position_ids)) {
      payload.position_ids = [payload.position_ids];
    }

    // Convert empty jersey_number to null
    if (payload.jersey_number === "" || payload.jersey_number === undefined) {
      payload.jersey_number = null;
    }

    // Convert empty team_id to null
    if (payload.team_id === "" || payload.team_id === undefined) {
      payload.team_id = null;
    }

    // Resolve academic_info_id if missing
    if (!payload.academic_info_id) {
      const normalizedSection = payload.section === "" ? null : payload.section;
      const match =
        sectionsForCourse?.find((a) => a.section === normalizedSection) ||
        sectionsForCourse?.find((a) => a.section == null) ||
        coursesForYear?.find((a) => a.section == null);
      if (match) payload.academic_info_id = match.id;
    }

    // Remove front-end only fields
    delete payload.year_level;
    delete payload.course;
    delete payload.section;

    // Handle file upload
    const hasFile =
      payload.profile instanceof File || payload.profile instanceof FileList;
    let requestData;
    if (hasFile) {
      const formData = convertToFormData(payload);
      requestData = isEdit ? { player: player.slug, data: formData } : formData;
    } else {
      delete payload.profile;
      requestData = isEdit ? { player: player.slug, data: payload } : payload;
    }

    const mutationFn = isEdit ? updatePlayer : createPlayer;
    mutationFn(requestData, {
      onSuccess: async (responseData) => {
        // Get the player slug - for edit it's from the player prop, for create it's from response
        const playerSlug = isEdit ? player.slug : responseData?.slug;

        // Upload new documents if there are any
        if (documents.length > 0 && playerSlug) {
          setIsUploadingDocs(true);
          try {
            await uploadDocuments(playerSlug);
          } catch (error) {
            console.error("Failed to upload some documents:", error);
          } finally {
            setIsUploadingDocs(false);
          }
        }
        onClose();
      },
      onError: (e) => {
        const error = e.response?.data;
        if (error) {
          Object.entries(error).forEach(([field, message]) => {
            setError(field, {
              type: "server",
              message: Array.isArray(message) ? message[0] : message,
            });
          });
        }
      },
    });
  };

  // Initialize form values on edit after all data is loaded
  useEffect(() => {
    if (!player || !allAcademic) return;

    // Set the top-level academic values
    setValue("year_level", player.academic_info?.year_level || "");
    setValue("course", player.academic_info?.course || "");
    setValue("section", player.academic_info?.section || null);

    // Resolve academic_info_id once sections are loaded
    if (sectionsForCourse && sectionsForCourse.length > 0) {
      const normalizedSection = player.academic_info?.section || null;
      const match =
        sectionsForCourse.find((a) => a.section === normalizedSection) ||
        sectionsForCourse.find((a) => a.section == null);

      if (match) setValue("academic_info_id", match.id);
    }
  }, [player, allAcademic, sectionsForCourse, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      {/* PERSONAL DETAILS */}
      <div className="space-y-4 px-1">
        <h2 className="text-lg font-bold text-primary">Personal Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <ControlledInput
            name="first_name"
            label="First Name"
            placeholder="Enter first name"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="last_name"
            label="Last Name"
            placeholder="Enter last name"
            control={control}
            errors={errors}
            optional={true}
          />
        </div>

        <ControlledSelect
          name="sex"
          control={control}
          label="Sex"
          placeholder="Select sex"
          options={SEX}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />

        <ControlledDatePicker
          name="date_of_birth"
          label="Date of Birth"
          placeholder="Select date of birth"
          control={control}
          errors={errors}
        />

        <ControlledInput
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />

        <ControlledInput
          name="profile"
          label="Profile Photo"
          type="file"
          accept="image/*"
          control={control}
          errors={errors}
        />
      </div>

      {/* ACADEMIC DETAILS */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold text-primary">Academic Info</h2>
        <ControlledSelect
          name="year_level"
          control={control}
          label="Year Level"
          placeholder="Select year level"
          options={yearOptions}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />
        <ControlledSelect
          name="course"
          control={control}
          label="Course"
          placeholder="Select course"
          options={courseOptions}
          disabled={!selectedYear}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />
        <ControlledSelect
          name="section"
          control={control}
          label="Section"
          placeholder="Select section"
          options={sectionOptions}
          disabled={!selectedCourse}
          valueKey="value"
          labelKey="label"
          errors={errors}
          optional={true}
        />
      </div>

      {/* PLAYER INFO */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold text-primary">Player Info</h2>

        <ControlledSelect
          name="sport_slug"
          control={control}
          label="Sport"
          placeholder="Select sport"
          options={sports}
          valueKey="slug"
          labelKey="name"
          errors={errors}
        />

        <ControlledTeamSelect
          control={control}
          name="team_id"
          label="Team"
          placeholder={
            !selectedSport
              ? "Select sport first"
              : !selectedSex
              ? "Select sex first"
              : "Select team"
          }
          teams={teams}
          disabled={!selectedSport || !selectedSex}
          errors={errors}
          rules={{ required: "Team is required" }}
        />

        <MultiSelect
          name="position_ids"
          label="Positions"
          control={control}
          options={positions}
          max={3}
          placeholder={
            !selectedSport ? "Select sport first" : "Select player positions"
          }
          disabled={!selectedSport}
          errors={errors}
          optional={true}
        />

        <ControlledInput
          name="jersey_number"
          label="Jersey Number"
          type="number"
          control={control}
          errors={errors}
          optional={true}
        />
        <ControlledInput
          name="height"
          label="Height (cm)"
          type="number"
          control={control}
          errors={errors}
          optional={true}
        />
        <ControlledInput
          name="weight"
          label="Weight (kg)"
          type="number"
          control={control}
          errors={errors}
          optional={true}
        />
      </div>

      {/* DOCUMENTS */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <div>
          <h2 className="text-lg font-bold text-primary">Documents</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isEdit
              ? "View existing documents or upload new ones. Documents must be in PDF, DOC, DOCX, JPG, JPEG, or PNG format (max 10MB each)."
              : "Upload required documents for the player. All documents must be in PDF, DOC, DOCX, JPG, JPEG, or PNG format (max 10MB each)."}
          </p>
        </div>

        {/* Existing Documents (Edit Mode) */}
        {isEdit && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Existing Documents
            </h3>
            {isLoadingDocs ? (
              <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading documents...
              </div>
            ) : existingDocuments.length > 0 ? (
              <div className="grid gap-2">
                {existingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate max-w-[200px] md:max-w-[300px] lg:max-w-[350px]">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.document_type_display ||
                            doc.document_type?.replace("_", " ")}
                          {doc.uploaded_by &&
                            ` • Uploaded by ${doc.uploaded_by}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExistingDocument(doc.id);
                        }}
                        disabled={deletingDocId === doc.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingDocId === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/20">
                No documents uploaded yet
              </p>
            )}
          </div>
        )}

        {/* Add New Documents */}
        <div className="space-y-2">
          {isEdit && (
            <h3 className="text-sm font-medium text-muted-foreground">
              Add New Documents
            </h3>
          )}
          <div className="grid gap-3">
            {DOCUMENT_TYPES.map((docType) => {
              const uploadedDoc = documents.find(
                (d) => d.type === docType.value
              );

              return (
                <div
                  key={docType.value}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{docType.label}</p>
                      {uploadedDoc ? (
                        <p className="text-xs text-green-600 flex items-center gap-1 truncate">
                          <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[300px]">
                            {uploadedDoc.title}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          No file selected
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {uploadedDoc ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(docType.value)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <label>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleDocumentUpload(e, docType.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </span>
                        </Button>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isCreating || isUpdating || isUploadingDocs}
      >
        {isCreating || isUpdating || isUploadingDocs ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            {isUploadingDocs ? "Uploading documents..." : "Please wait"}
          </>
        ) : isEdit ? (
          "Update Player"
        ) : (
          "Register Player"
        )}
      </Button>

      {/* Document Viewer Modal */}
      <RegistrationDocumentViewer
        open={!!selectedDocument}
        onOpenChange={(isOpen) => !isOpen && setSelectedDocument(null)}
        document={selectedDocument}
        registrationInfo={{
          full_name: player ? `${player.first_name} ${player.last_name}` : "",
          email: player?.email,
        }}
      />
    </form>
  );
};

export default PlayerForm;
