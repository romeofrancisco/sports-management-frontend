import React, { useEffect } from "react";
import ControlledInput from "../common/ControlledInput";
import { useForm, useFieldArray } from "react-hook-form";
import ControlledTextarea from "../common/ControlledTextarea";
import ControlledSelect from "../common/ControlledSelect";
import { Button } from "../ui/button";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useCreateFormula, useUpdateFormula } from "@/hooks/useFormula";
import ControlledCheckbox from "../common/ControlledCheckbox";
import ControlledCombobox from "../common/ControlledCombobox";

const FormulaForm = ({ onClose, stats, sport, formula = null }) => {
  const isEdit = !!formula;
  const { mutate: createFormula, isPending: isCreating } = useCreateFormula();
  const { mutate: updateFormula, isPending: isUpdating } = useUpdateFormula();

  const {
    control,
    formState: { errors },
    setError,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: formula?.name || "",
      sport_slug: sport,
      expression: formula?.expression || "",
      is_ratio: formula?.is_ratio || false,
      uses_point_value: formula?.uses_point_value || false,
      components: formula?.components?.map((component) => ({
        id: component.id,
        stat_type: component.stat_type_id,
      })) || [{ id: "", stat_type: "" }], // Initialize with one empty component
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "components",
  });

  const isRatio = watch("is_ratio");

  // Effect to handle ratio changes
  useEffect(() => {
    if (isRatio) {
      // Clear the expression when ratio is enabled
      setValue("expression", "");

      // Ensure exactly 2 components for ratio
      if (fields.length !== 2) {
        replace([
          { id: "", stat_type: "" },
          { id: "", stat_type: "" },
        ]);
      }
    }
  }, [isRatio, setValue, replace, fields.length]);

  const onSubmit = (data) => {
    // Clear any previous server errors
    Object.keys(errors).forEach((fieldName) => {
      if (errors[fieldName]?.type === "server") {
        setError(fieldName, null);
      }
    });

    const mutationFn = isEdit ? updateFormula : createFormula;
    const payload = isEdit ? { id: formula.id, data: data } : data;

    // For ratio formulas, clear the expression since it's not needed
    if (data.is_ratio) {
      data.expression = "";
    }

    mutationFn(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        const error = e.response?.data;
        if (error) {
          Object.keys(error).forEach((fieldName) => {
            if (fieldName === "components" && Array.isArray(error[fieldName])) {
              // Handle nested component errors
              error[fieldName].forEach((componentError, index) => {
                if (componentError && typeof componentError === "object") {
                  Object.keys(componentError).forEach((nestedField) => {
                    const fieldPath = `components.${index}.${nestedField}`;
                    const errorMessage = Array.isArray(
                      componentError[nestedField]
                    )
                      ? componentError[nestedField][0]
                      : componentError[nestedField];
                    setError(fieldPath, {
                      type: "server",
                      message: errorMessage,
                    });
                  });
                }
              });
            } else {
              // Handle top-level field errors
              const errorMessage = Array.isArray(error[fieldName])
                ? error[fieldName][0]
                : error[fieldName];
              setError(fieldName, {
                type: "server",
                message: errorMessage,
              });
            }
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

      <ControlledCheckbox
        name="is_ratio"
        label="Make/Attempt"
        help_text="Enable if this formula represents a make/attempt (e.g; 5/7)"
        control={control}
        errors={errors}
      />

      <ControlledCheckbox
        name="uses_point_value"
        label="Uses Point Value"
        help_text="Enable if this formula should use the point values of stats"
        control={control}
        errors={errors}
      />

      {!isRatio && (
        <ControlledTextarea
          name="expression"
          control={control}
          label="Formula"
          placeholder="Enter formula for expression..."
          errors={errors}
        />
      )}

      <div className="space-y-4">
        <label className="block font-medium">
          Components{" "}
          {isRatio && (
            <span className="text-xs text-muted-foreground">
              (Make/Attempt requires exactly 2 stats)
            </span>
          )}
        </label>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <ControlledCombobox
                name={`components.${index}.stat_type`}
                control={control}
                label={
                  isRatio
                    ? index === 0
                      ? "Made"
                      : "Attempted"
                    : `Stat ${index + 1}`
                }
                placeholder="Select stat..."
                errors={errors}
                options={stats}
                labelKey="name"
                valueKey="id"
                secondaryLabel="code"
                rules={{ required: "Stat is required" }}
                size="lg"
              />
            </div>
            {!isRatio && (
              <Button
                variant="outline"
                size="icon"
                className="mt-6"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
              >
                <Trash />
              </Button>
            )}
          </div>
        ))}
      </div>
      {!isRatio && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ stat_type: "" })}
        >
          <Plus />
          Add Component
        </Button>
      )}

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
