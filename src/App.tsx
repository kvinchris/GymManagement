import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import routes from "tempo-routes";

// Lazy load the AttendanceManagement component
const AttendanceManagement = lazy(
  () => import("./components/attendance/AttendanceManagement"),
);

// Lazy load components for better performance
const TrainerView = lazy(() => import("./components/trainers/TrainerView"));
const UnauthorizedPage = lazy(() => import("./components/UnauthorizedPage"));

function App() {
  const { currentUser, userRole } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" replace /> : <LoginForm />}
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {userRole === "trainer" ? (
                  <Navigate to="/trainer" replace />
                ) : (
                  <Home />
                )}
              </ProtectedRoute>
            }
          />

          {/* Trainer routes */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <TrainerView />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/members/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainers/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AttendanceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
