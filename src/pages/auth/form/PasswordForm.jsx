import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ControlledInput from "@/components/common/ControlledInput";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import { useSetPassword, useChangePassword } from "@/hooks/useAuth";

/**
 * mode: "set" | "change"
 *  - "set": used from email link (uid + token)
 *  - "change": used by logged-in user
 */
const PasswordForm = ({ mode = "set", onClose }) => {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const { mutate: setPassword, isPending: isSetting } = useSetPassword();
  const { mutate: changePassword, isPending: isChanging, error: changeError } = useChangePassword();

  console.log("changeError", changeError);

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match", { richColors: true });
      return;
    }

    if (data.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        richColors: true,
      });
      return;
    }

    if (mode === "set") {
      setPassword(
        { uid, token, password: data.newPassword },
        {
          onSuccess: () => {
            navigate("/login");
          },
        }
      );
    } else {
      changePassword(
        {
          old_password: data.oldPassword,
          new_password: data.newPassword,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <form className="space-y-4 px-1">
      {mode === "change" && (
        <ControlledInput
          control={control}
          name="oldPassword"
          type="password"
          label="Current Password"
          rules={{ required: true }}
        />
      )}
      <ControlledInput
        control={control}
        name="newPassword"
        type="password"
        label="New Password"
        rules={{ required: true }}
      />
      <ControlledInput
        control={control}
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        rules={{ required: true }}
      />
      <Button
        className="w-full mt-4"
        onClick={handleSubmit(onSubmit)}
        disabled={isSetting || isChanging}
      >
        {mode === "set"
          ? isSetting
            ? "Setting Password..."
            : "Set Password"
          : isChanging
          ? "Changing Password..."
          : "Change Password"}
      </Button>
    </form>
  );
};

export default PasswordForm;
