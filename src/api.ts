import axios from "axios";
import { useError } from "./context/globalErrorContext/globalErrorContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, // Use your backend URL
  timeout: 5000, // Optional: Set request timeout
});

// api.interceptors.request.use(
//   (config) => {
//     console.log("Request sent:", config);

//     // Example: Add Authorization token
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

export function setupAxiosInterceptors() {
  const { showError } = useError();

  api.interceptors.response.use(
    (response) => {
      //console.log("Response received:", response);
      return response;
    },
    (error) => {
      if (error.response) {
        const title = `API Error: ${error.response.status}`;
        const errors = error.response.data.error;
        showError({ title, errors });
      } else if (error.request) {
        showError({ title: "Network Error", errors: [{msg:"No response received"}] });
      } else {
        showError({ title: "Unexpected Error", errors: [{msg:error.message}] });
      }
      return Promise.reject(error);
    }
  );
}


export default api;
