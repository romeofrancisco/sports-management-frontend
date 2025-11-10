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
import {
  useSetPassword,
  useChangePassword,
  useResetPassword,
} from "@/hooks/useAuth";

/**
 * mode: "set" | "change" | "reset"
 *  - "set": used from email link (uid + token)
 *  - "change": used by logged-in user
 *  - "reset": used when user resets password via email link
 */
const PasswordForm = ({ mode = "set", onClose }) => {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const { mutate: setPassword, isPending: isSetting } = useSetPassword();
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

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

    const payload = { uid, token, password: data.newPassword };

    if (mode === "set") {
      setPassword(payload, {
        onSuccess: () => {
          navigate("/login");
        },
      });
    } else if (mode === "reset") {
      resetPassword(payload, {
        onSuccess: () => {
          navigate("/login");
        },
      });
    } else if (mode === "change") {
      changePassword(
        {
          old_password: data.oldPassword,
          new_password: data.newPassword,
        },
        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    }
  };

  const isProcessing = isSetting || isChanging || isResetting;

  const getButtonLabel = () => {
    if (isProcessing) {
      if (mode === "set") return "Setting Password...";
      if (mode === "reset") return "Resetting Password...";
      return "Changing Password...";
    }

    if (mode === "set") return "Set Password";
    if (mode === "reset") return "Reset Password";
    return "Change Password";
  };

  return (
    <form className="space-y-4 px-1" onSubmit={handleSubmit(onSubmit)}>
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

      <Button className="w-full mt-4" type="submit" disabled={isProcessing}>
        {getButtonLabel()}
      </Button>
    </form>
  );
};

export default PasswordForm;
