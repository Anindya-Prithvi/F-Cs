import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const config = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    containerId: 1
};

export const showAlert = (message, type) => {
    console.log("[DEBUG] Error triggered had message: " + message)
    if (type === "error") {
        toast.error(message, config);
    } else if (type === "warning") {
        toast.warning(message, config);
    } else if (type === "success") {
        toast.success(message, config);
    } else {
        toast.info(message, config);
    }
};