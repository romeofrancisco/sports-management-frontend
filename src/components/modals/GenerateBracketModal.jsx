import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ELIMINATION_TYPES } from "@/constants/bracket";
import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import { useCreateBracket } from "@/hooks/useBrackets";
import { Loader2 } from "lucide-react";

const GenerateBracketModal = ({
  isOpen,
  onClose,
  season,
  league,
  tournament,
  isTournament = false,
}) => {
  const [serverError, setServerError] = useState(null);

  const { mutate: createBracket, isPending } = useCreateBracket(
    isTournament ? null : league,
    isTournament ? null : season,
    isTournament ? tournament : null
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      elimination_type: "",
    },
    mode: "onTouched",
  });

  /** Extract a user-friendly error message from a DRF-style response */
  const extractErrorMessage = (err) => {
    const resp = err?.response?.data || err?.data || null;
    if (!resp) return "An unexpected error occurred.";

    if (typeof resp === "object") {
      const possibleKeys = ["detail", "non_field_errors", "__all__"];
      for (const key of possibleKeys) {
        if (resp[key]) {
          return Array.isArray(resp[key])
            ? resp[key].join(" ")
            : String(resp[key]);
        }
      }
      // Join all field messages if present
      return Object.entries(resp)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
        .join(" ");
    }

    return String(resp);
  };

  const onSubmit = (data) => {
    setServerError(null);

    const payload = {
      elimination_type: data.elimination_type,
      ...(isTournament
        ? { tournament }
        : { season }),
    };

    createBracket(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (err) => setServerError(extractErrorMessage(err)),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { setServerError(null); onClose(); }}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Generate Bracket</DialogTitle>
          <DialogDescription>
            Select the elimination type to create a bracket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <p className="text-destructive text-sm bg-destructive/10 p-2 rounded-md">
              {serverError}
            </p>
          )}

          {/* Elimination Type Select */}
          <Controller
            name="elimination_type"
            control={control}
            rules={{ required: "Elimination type is required." }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Elimination Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Elimination Types</SelectLabel>
                    {ELIMINATION_TYPES.map((elim) => (
                      <SelectItem key={elim.value} value={elim.value}>
                        {elim.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.elimination_type && (
            <p className="text-destructive text-xs">
              {errors.elimination_type.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin size-4" />
                Generating...
              </>
            ) : (
              "Generate Bracket"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateBracketModal;
