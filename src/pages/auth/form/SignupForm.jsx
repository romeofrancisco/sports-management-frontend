import { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Loader2, Upload, X, FileText, CheckCircle2, User, Image } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledSelect from "@/components/common/ControlledSelect";
import ControlledMultiSelect from "@/components/common/ControlledMultiSelect";
import { Link } from "react-router";
import ControlledDatePicker from "@/components/common/ControlledDatePicker";
// Document type options
const DOCUMENT_TYPES = [
  { value: "medical_cert", label: "Medical Certificate" },
  { value: "parent_consent", label: "Parent/Guardian Consent Form" },
  { value: "other", label: "Other" },
];

// Sex options
const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export function SignupForm({ className, ...props }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sports, setSports] = useState([]);
  const [positions, setPositions] = useState([]);
  const [academicInfo, setAcademicInfo] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [registrationId, setRegistrationId] = useState(null);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      sex: "",
      date_of_birth: "",
      phone_number: "",
      height: "",
      weight: "",
      sport_id: "",
      position_ids: [],
      year_level: "",
      course: "",
      section: "",
      academic_info_id: null,
    },
  });

  // Watch values for cascading selects
  const selectedSport = watch("sport_id");
  const selectedYear = watch("year_level");
  const selectedCourse = watch("course");
  const selectedSection = watch("section");

  // Fetch sports on mount
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

  // Fetch positions when sport changes
  useEffect(() => {
    if (!selectedSport) {
      setPositions([]);
      return;
    }

    const fetchPositions = async () => {
      try {
        const sport = sports.find((s) => s.id === parseInt(selectedSport));
        if (sport) {
          const { data } = await api.get(`positions/?sport=${sport.slug}`);
          setPositions(data);
        }
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    };
    fetchPositions();
  }, [selectedSport, sports]);

  // Fetch academic info on mount
  useEffect(() => {
    const fetchAcademicInfo = async () => {
      try {
        const { data } = await api.get("academic-info/");
        setAcademicInfo(data);
      } catch (error) {
        console.error("Failed to fetch academic info:", error);
      }
    };
    fetchAcademicInfo();
  }, []);

  // Academic options computed from data
  const yearOptions = useMemo(() => {
    if (!academicInfo.length) return [];
    return [...new Set(academicInfo.map((a) => a.year_level))]
      .filter(Boolean)
      .map((y) => ({
        value: y,
        label: y,
      }));
  }, [academicInfo]);

  const courseOptions = useMemo(() => {
    if (!selectedYear || !academicInfo.length) return [];
    const filtered = academicInfo.filter((a) => a.year_level === selectedYear);
    return [...new Set(filtered.map((a) => a.course))]
      .filter(Boolean)
      .map((c) => ({
        value: c,
        label: c,
      }));
  }, [selectedYear, academicInfo]);

  const sectionOptions = useMemo(() => {
    if (!selectedYear || !selectedCourse || !academicInfo.length) return [];
    // Filter for this year+course combo
    const filtered = academicInfo.filter(
      (a) => a.year_level === selectedYear && a.course === selectedCourse
    );
    // Get unique sections (including null/empty)
    const sections = [...new Set(filtered.map((a) => a.section || ""))];
    return sections.map((s) => ({
      value: s || null,
      label: s || "None",
      id: filtered.find((a) => (a.section || "") === s)?.id,
    }));
  }, [selectedYear, selectedCourse, academicInfo]);

  // Get the filtered academic info for current year+course (like sectionsForCourse in PlayerForm)
  const sectionsForCourse = useMemo(() => {
    if (!selectedYear || !selectedCourse || !academicInfo.length) return [];
    return academicInfo.filter(
      (a) => a.year_level === selectedYear && a.course === selectedCourse
    );
  }, [selectedYear, selectedCourse, academicInfo]);

  // Auto-resolve academic_info_id (same logic as PlayerForm)
  useEffect(() => {
    if (!sectionsForCourse || sectionsForCourse.length === 0) return;

    const normalizedSection = selectedSection === "" ? null : selectedSection;
    const match =
      sectionsForCourse.find((a) => a.section === normalizedSection) ||
      sectionsForCourse.find((a) => a.section == null);

    if (match) {
      setValue("academic_info_id", match.id);
    }
  }, [sectionsForCourse, selectedSection, setValue]);

  // Reset cascading values when parent changes
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

  // Reset positions when sport changes
  const sportDidMount = useRef(false);
  useEffect(() => {
    if (!sportDidMount.current) {
      sportDidMount.current = true;
      return;
    }
    setValue("position_ids", []);
  }, [selectedSport, setValue]);

  // Handle profile image upload
  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB for profile)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum profile image size is 5MB",
        richColors: true,
      });
      return;
    }

    // Validate file type (images only)
    const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      toast.error("Invalid file type", {
        description: `Allowed types: ${allowedTypes.join(", ")}`,
        richColors: true,
      });
      return;
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImage(null);
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
      setProfilePreview(null);
    }
  };

  // Handle document upload (supports multiple files for "other" type)
  const handleDocumentUpload = async (e, documentType) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];

    for (const file of files) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: `${file.name} exceeds maximum size of 10MB`,
          richColors: true,
        });
        continue;
      }

      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedTypes.includes(ext)) {
        toast.error("Invalid file type", {
          description: `${file.name}: Allowed types: ${allowedTypes.join(", ")}`,
          richColors: true,
        });
        continue;
      }

      validFiles.push({
        type: documentType,
        file: file,
        title: file.name,
        status: "pending",
        id: `${documentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
    }

    if (validFiles.length > 0) {
      if (documentType === "other") {
        // For "other" type, allow multiple files
        setDocuments((prev) => [...prev, ...validFiles]);
      } else {
        // For specific types, replace existing file of same type
        setDocuments((prev) => [
          ...prev.filter((d) => d.type !== documentType),
          ...validFiles,
        ]);
      }
    }
  };

  // Remove document
  const removeDocument = (documentId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
  };

  // Upload documents after registration is created
  const uploadDocuments = async (regId) => {
    for (const doc of documents) {
      try {
        const formData = new FormData();
        formData.append("document_type", doc.type);
        formData.append("title", doc.title);
        formData.append("file", doc.file);

        await api.post(
          `player-registrations/${regId}/upload-document/`,
          formData
        );

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
      }
    }
  };

  // Submit handler
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Prepare FormData for multipart upload (for profile image)
      const payload = new FormData();
      
      payload.append("first_name", formData.first_name);
      payload.append("last_name", formData.last_name);
      payload.append("email", formData.email);
      payload.append("sex", formData.sex);
      
      if (formData.date_of_birth) {
        payload.append("date_of_birth", formData.date_of_birth);
      }
      if (formData.phone_number) {
        payload.append("phone_number", formData.phone_number);
      }
      if (formData.height) {
        payload.append("height", parseFloat(formData.height));
      }
      if (formData.weight) {
        payload.append("weight", parseFloat(formData.weight));
      }
      
      payload.append("sport_id", parseInt(formData.sport_id));
      
      if (formData.position_ids?.length) {
        formData.position_ids.forEach((id) => {
          payload.append("position_ids", parseInt(id));
        });
      }
      
      if (formData.academic_info_id) {
        payload.append("academic_info_id", formData.academic_info_id);
      }
      
      // Add profile image if exists
      if (profileImage) {
        payload.append("profile", profileImage);
      }

      // Create registration
      const { data } = await api.post("player-registrations/", payload);

      const registrationData = data.registration;
      setRegistrationId(registrationData.id);

      // Upload documents if any
      if (documents.length > 0) {
        await uploadDocuments(registrationData.id);
      }

      setIsSuccess(true);
      toast.success("Registration submitted!", {
        description: "Please check your email for confirmation.",
        richColors: true,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      const errorData = error.response?.data;

      if (errorData) {
        Object.entries(errorData).forEach(([field, message]) => {
          setError(field, {
            type: "server",
            message: Array.isArray(message) ? message[0] : message,
          });
        });
      }

      toast.error("Registration failed", {
        description:
          errorData?.email ||
          errorData?.detail ||
          "Please check the form and try again.",
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <div className="rounded-full bg-muted p-5">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Registration Submitted!</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Your player registration has been submitted successfully. Please
            check your email for confirmation. A coach or admin will review your
            application and you'll be notified once approved.
          </p>
          <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setIsSuccess(false);
              setDocuments([]);
              setProfileImage(null);
              setProfilePreview(null);
              reset();
            }}
          >
            Submit Another Registration
          </Button>
          <Button className="flex-1" asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Player Registration</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to register as a player
          </p>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">
            Personal Information
          </h2>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {profilePreview ? (
                <div className="relative">
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleProfileUpload}
                  />
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </div>
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Profile photo (optional, max 5MB)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              name="first_name"
              label="First Name"
              placeholder="Enter first name"
              control={control}
              errors={errors}
              rules={{ required: "First name is required" }}
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

          <ControlledInput
            name="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            control={control}
            errors={errors}
            help_text="We'll send registration updates to this email."
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledSelect
              name="sex"
              label="Sex"
              placeholder="Select sex"
              control={control}
              options={SEX_OPTIONS}
              errors={errors}
              rules={{ required: "Sex is required" }}
            />

            <ControlledDatePicker
              name="date_of_birth"
              label="Date of Birth"
              placeholder="Select date of birth"
              control={control}
              error={errors.date_of_birth}
              rules={{required: "Date of birth is required"}}
            />
          </div>

          <ControlledInput
            name="phone_number"
            label="Phone Number"
            type="tel"
            placeholder="+63 9XX XXX XXXX"
            control={control}
            errors={errors}
            optional
          />
        </div>

        <FieldSeparator />

        {/* Academic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">
            Academic Information
          </h2>

          <ControlledSelect
            name="year_level"
            label="Year Level"
            placeholder="Select year level"
            control={control}
            options={yearOptions}
            errors={errors}
            rules={{ required: "Year level is required" }}
          />

          <ControlledSelect
            name="course"
            label="Course"
            placeholder={
              selectedYear ? "Select course" : "Select year level first"
            }
            control={control}
            options={courseOptions}
            disabled={!selectedYear}
            errors={errors}
            rules={{ required: "Course is required" }}
          />

          <ControlledSelect
            name="section"
            label="Section"
            placeholder={
              !selectedCourse
                ? "Select course first"
                : sectionOptions.length === 0
                ? "No sections available"
                : "Select section"
            }
            control={control}
            options={sectionOptions}
            disabled={!selectedCourse || sectionOptions.length === 0}
            errors={errors}
            optional={true}
          />
        </div>

        <FieldSeparator />

        {/* Player Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">
            Player Information
          </h2>

          <ControlledSelect
            name="sport_id"
            label="Sport"
            placeholder="Select sport"
            control={control}
            options={sports}
            valueKey="id"
            labelKey="name"
            errors={errors}
            rules={{ required: "Sport is required" }}
          />

          <ControlledMultiSelect
            name="position_ids"
            label="Preferred Position(s)"
            control={control}
            options={positions}
            max={3}
            placeholder={
              selectedSport
                ? "Select your preferred positions"
                : "Select sport first"
            }
            disabled={!selectedSport}
            errors={errors}
            help_text="You can select up to 3 positions."
            optional={true}
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              name="height"
              label="Height (cm)"
              type="number"
              step="0.01"
              placeholder="e.g. 175.5"
              control={control}
              errors={errors}
              optional
            />

            <ControlledInput
              name="weight"
              label="Weight (kg)"
              type="number"
              step="0.01"
              placeholder="e.g. 70.5"
              control={control}
              errors={errors}
              optional
            />
          </div>
        </div>

        <FieldSeparator />

        {/* Document Upload */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">
            Required Documents
          </h2>
          <p className="text-xs text-muted-foreground !mt-0">
            Upload the required documents for your registration. All documents
            must be in PDF, DOC, DOCX, JPG, JPEG, or PNG format (max 10MB each).
            You can upload multiple files for "Other" documents.
          </p>

          <div className="grid gap-4">
            {DOCUMENT_TYPES.map((docType) => {
              const uploadedDocs = documents.filter(
                (d) => d.type === docType.value
              );
              const isOtherType = docType.value === "other";

              return (
                <div
                  key={docType.value}
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p
                          title={docType.label}
                          className="font-medium text-sm line-clamp-1"
                        >
                          {docType.label}
                        </p>
                        {uploadedDocs.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            No file uploaded
                          </p>
                        )}
                      </div>
                    </div>

                    <label>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple={isOtherType}
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
                          {uploadedDocs.length > 0 && !isOtherType ? "Replace" : "Upload"}
                        </span>
                      </Button>
                    </label>
                  </div>

                  {/* Show uploaded files */}
                  {uploadedDocs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between bg-background/50 rounded px-3 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span
                              title={doc.title}
                              className="text-xs max-w-[250px] md:max-w-[400px] text-green-600 truncate"
                            >
                              {doc.title}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <FieldSeparator />

        {/* Submit */}
        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Submitting Registration...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground px-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
