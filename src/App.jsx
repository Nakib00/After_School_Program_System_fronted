import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Spinner from "./components/ui/Spinner";
import "./index.css";

function App() {
  const { fetchMe, isInitializing, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!!localStorage.getItem("token")) {
      console.log("[App] Session detected, verifying...");
      fetchMe().catch((err) =>
        console.error("[App] fetchMe failed:", err.message),
      );
    } else {
      console.log("[App] No session found");
    }
  }, [fetchMe]);

  console.log("[App] rendered with state:", {
    user: user?.name,
    role: user?.role,
    isAuthenticated,
    isInitializing,
  });

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500 font-medium">
            Initializing application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
