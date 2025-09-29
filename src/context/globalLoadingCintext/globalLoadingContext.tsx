import React, { createContext, useContext, useState } from "react";
import LoadingModal from "../../components/LoadingModel";

interface LoadingContextType {
  showLoading: () => void;
  hideLoading: () => void; 
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setShowLoading] = useState(false);
  const showLoading = () => setShowLoading(true);
  const hideLoading = () => setShowLoading(false);

  return (
    <LoadingContext.Provider value={ { showLoading, hideLoading } }>
      {children}
      {loading && <LoadingModal />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within an LoadingProvider");
  }
  return context;
}