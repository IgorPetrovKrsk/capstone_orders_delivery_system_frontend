import axios from "axios";
import { useError } from "./context/globalErrorContext/globalErrorContext";
import { useLoading } from "./context/globalLoadingCintext/globalLoadingContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, 
  timeout: 10000,
});

export function setupAxiosInterceptors() {
  const { showError } = useError();
  const { showLoading,hideLoading } = useLoading();

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      showLoading(); 
      return config;
    },
    (error) => {
      hideLoading();
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      hideLoading();
      return response;
    },
    (error) => {
      hideLoading();
      if (error.response) {
        const title = `API Error: ${error.response.status}`;
        const errors = error.response.data.error;
        showError({ title, errors });
      } else if (error.request) {
        showError({ title: "Network Error", errors: [{msg:"No response received. The backend may be powering up on Render.com. Try again in 1-2 minutes."}] });
      } else {
        showError({ title: "Unexpected Error", errors: [{msg:error.message}] });
      }
      return Promise.reject(error);
    }
  );
}


export default api;
