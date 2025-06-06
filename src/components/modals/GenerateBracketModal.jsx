import React from "react";
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
import { useNavigate } from "react-router";

const GenerateBracketModal = ({ isOpen, onClose, season, league }) => {
  const { mutate: createBracket, isPending } = useCreateBracket(league, season);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      season: season,
      elimination_type: "",
    },
    mode: "onBlur",
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    createBracket(data, {
      onSuccess: () => {
        // Navigate to the bracket page and close the modal
        navigate(`/leagues/${league}/seasons/${season}/bracket`);
        onClose();
      },
      onError: () => {},
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Generate Bracket</DialogTitle>
          <DialogDescription>
            Select Elimination Type for Bracket
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="elimination_type"
            control={control}
            rules={{ required: "Elimination type is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
            <p className="text-destructive text-xs mt-1">
              {errors.elimination_type.message}
            </p>
          )}

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
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
