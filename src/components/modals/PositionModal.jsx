import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import ControlledInput from "../common/ControlledInput";
import { useParams } from "react-router";
import { useCreateposition, useUpdateposition } from "@/hooks/useSports";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const PostitionModal = ({ isOpen, onClose, position = null }) => {
  const isEdit = !!position;
  const { sport } = useParams();
  console.log(position);

  const { mutate: createPosition, isPending: isCreating } = useCreateposition();
  const { mutate: updatePosition, isPending: isUpdating } = useUpdateposition();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, 
    setError
  } = useForm({
    defaultValues: {
      sport: sport,
      name: position?.name || "",
      abbreviation: position?.abbreviation || "",
    },
  });

  useEffect(() => {
    if (position) {
      reset({
        sport: sport,
        name: position.name || "",
        abbreviation: position.abbreviation || "",
      });
    } else {
      reset({
        sport: sport,
        name: "",
        abbreviation: "",
      });
    }
  }, [position, reset, sport]);

  const onSubmit = (data) => {
    const mutationFn = isEdit ? updatePosition : createPosition;
    const payload = isEdit ? { id: position.id, data: data } : data;

    mutationFn(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        const error = e.response?.data;
        if (error) {
          Object.keys(error).forEach((fieldName) => {
            setError(fieldName, {
              type: "server",
              message: error[fieldName],
            });
          });
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Position" : "Create New Position"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-1"
        >
          <ControlledInput
            name="name"
            control={control}
            placeholder="Enter position name"
            label="Name"
            errors={errors}
          />
          <ControlledInput
            name="abbreviation"
            control={control}
            placeholder="Enter sport abbreviation (e.g, PG, SG, SF, (Basketball))"
            label="Abbreviation"
            errors={errors}
          />

          <Button
            type="submit"
            className="mt-4"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : isEdit ? (
              "Update Position"
            ) : (
              "Create Position"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostitionModal;
