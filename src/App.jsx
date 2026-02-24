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
    console.log(
      "[App] Mounting, isInitializing:",
      isInitializing,
      "hasToken:",
      !!localStorage.getItem("token"),
    );
    fetchMe();
  }, [fetchMe]);

  console.log(
    "[App] Rendering, isInitializing:",
    isInitializing,
    "user:",
    !!user,
    "auth:",
    isAuthenticated,
  );

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
