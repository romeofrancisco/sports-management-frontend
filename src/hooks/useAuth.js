import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  loginUser,
  logoutUser,
  fetchUser,
  setPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  googleLoginUser,
} from "@/api/authApi";
import { login, logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";
import { useEffect } from "react";
import { persistor } from "@/store";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData) => loginUser(formData),
    onSuccess: (data) => {
      dispatch(login(data));
      navigate("/dashboard");
      toast.success("Login Successful", {
        description: `Welcome back, ${data.first_name}!`,
        richColors: true,
      });
    },
    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.error;
      if (status === 400) {
        toast.error("Login Failed", {
          description: message || "Incorrect email or password",
          richColors: true,
        });
      } else if (status === 403) {
        toast.error("Access Denied", {
          description: message || "Your account is not allowed to login. Contact an administrator.",
          richColors: true,
        });
      }
    },
  });
};

export const useGoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    // The mutationFn now calls the Google specific API function
    mutationFn: (credential) => googleLoginUser(credential),

    onSuccess: (data) => {
      // Success handler is identical to the standard login,
      // as the backend returns the same user data and sets cookies.
      dispatch(login(data));
      navigate("/dashboard");
      toast.success("Login Successful", {
        description: `Welcome back, ${data.first_name}!`,
        richColors: true,
      });
    },

    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.error;
      
      if (status === 404) {
        // User not found in database
        toast.error("Account Not Found", {
          description: message || "No account exists with this Google email. Please contact an administrator.",
          richColors: true,
        });
      } else if (status === 401) {
        toast.error("Google Login Failed", {
          description: "The Google token was invalid or expired.",
          richColors: true,
        });
      } else if (status === 403) {
        toast.error("Access Denied", {
          description: message || "Your account is not allowed to login. Contact an administrator.",
          richColors: true,
        });
      } else {
        toast.error("Login Failed", {
          description: message || "An unexpected error occurred.",
          richColors: true,
        });
      }
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      try {
        // Clear persistence first
        await persistor.purge();

        // Then clear queries and state
        localStorage.removeItem("google_drive_tokens");
        
        queryClient.clear();
        dispatch(logout());

        // Navigate AFTER cleanup
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout error:", error);
      }
      toast.info("Loggged out!", {
        richColors: true,
      });
    },
  });
};

export const useFetchUser = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    onError: (error) => {
      if (error.response?.status === 401) {
        dispatch(logout()); // Handle logout if refresh fails
      }
    },
  });

  useEffect(() => {
    if (query.data) {
      dispatch(login(query.data));
    }
  }, [query.data, dispatch]);

  return query;
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (passwordData) => setPassword(passwordData),
    onSuccess: () => {
      toast.success("Password set successfully!", {
        description: "You can now log in with your new password.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to set password", {
        description:
          error.message || "An error occurred while setting the password.",
        richColors: true,
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => changePassword(passwordData),
    onSuccess: () => {
      toast.success("Password changed successfully!", {
        description: "You can now log in with your new password.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to change password", {
        description:
          error.response.data.error ||
          "An error occurred while changing the password.",
        richColors: true,
      });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (emailData) => forgotPassword(emailData),
    onSuccess: () => {
      toast.success("Password reset email sent!", {
        description: "Please check your inbox for further instructions.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to send password reset email", {
        description:
          error.response.data.error ||
          "An error occurred while sending the email.",
        richColors: true,
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (resetData) => resetPassword(resetData),
    onSuccess: () => {
      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to reset password", {
        description:
          error.response.data.error ||
          "An error occurred while resetting the password.",
        richColors: true,
      });
    },
  });
};
