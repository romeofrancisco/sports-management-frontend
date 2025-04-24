import React from "react";
import ControlledInput from "../common/ControlledInput";
import { useForm, useFieldArray } from "react-hook-form";
import ControlledTextarea from "../common/ControlledTextarea";
import ControlledSelect from "../common/ControlledSelect";
import { Button } from "../ui/button";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useCreateFormula, useUpdateFormula } from "@/hooks/useFormula";

const FormulaForm = ({ onClose, stats, sport, formula = null }) => {
  const isEdit = !!formula;
  const { mutate: createFormula, isPending: isCreating } = useCreateFormula();
  const { mutate: updateFormula, isPending: isUpdating } = useUpdateFormula();

  const {
    control,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: formula?.name || "",
      sport_slug: sport,
      expression: formula?.expression || "",
      components: formula?.components?.map((component) => ({
        id: component.id,
        stat_type: component.stat_type_id,
      })) || [{ id: "", stat_type: "" }], // Initialize with one empty component
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  const onSubmit = (data) => {
    const mutationFn = isEdit ? updateFormula : createFormula;
    const payload = isEdit ? { id: formula.id, data: data } : data;

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-1"
    >
      <ControlledInput
        name="name"
        control={control}
        placeholder="Enter formula name"
        label="Name"
        errors={errors}
      />
      <ControlledTextarea
        name="expression"
        control={control}
        label="Formula"
        placeholder="Enter formula for expression..."
        errors={errors}
      />
      <div className="space-y-4">
        <label className="block font-medium">Components</label>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <ControlledSelect
                name={`components.${index}.stat_type`}
                control={control}
                label={`Stat ${index + 1}`}
                placeholder="Select stat..."
                errors={errors}
                options={stats}
                labelKey="name"
                valueKey="id"
                secondaryLabel="code"
                rules={{ required: "Stat is required" }}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="mt-6"
              onClick={() => remove(index)}
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ stat_type: "" })}
      >
        <Plus />
        Add Component
      </Button>

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
          "Update Formula"
        ) : (
          "Create Formula"
        )}
      </Button>
    </form>
  );
};

export default FormulaForm;
