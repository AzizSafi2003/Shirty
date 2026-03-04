import toast from "react-hot-toast";

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#10B981",
        color: "#fff",
        fontWeight: "bold",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#EF4444",
        color: "#fff",
        fontWeight: "bold",
      },
    });
  };

  const showLoading = (message) => {
    return toast.loading(message, {
      position: "top-center",
      style: {
        background: "#3B82F6",
        color: "#fff",
      },
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  return { showSuccess, showError, showLoading, dismiss };
};

export default useToast;
