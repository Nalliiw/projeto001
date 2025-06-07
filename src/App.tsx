import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./components/home";
import SuperAdminDashboard from "./components/dashboards/SuperAdminDashboard";
import SpecialistDashboard from "./components/dashboards/SpecialistDashboard";
import ChiefSpecialistDashboard from "./components/dashboards/ChiefSpecialistDashboard";
import PatientDashboard from "./components/dashboards/PatientDashboard";
import AchievementsPage from "./components/dashboards/AchievementsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import routes from "tempo-routes";

// Component to handle role-based routing
const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const getDashboardPath = () => {
      switch (user.role) {
        case "super_admin":
          return "/dashboard/super-admin";
        case "chief_specialist":
          return "/dashboard/chief-specialist";
        case "specialist":
          return "/dashboard/specialist";
        case "patient":
          return "/dashboard/patient";
        default:
          return "/";
      }
    };

    return (
      <Routes>
        <Route
          path="/"
          element={<Navigate to={getDashboardPath()} replace />}
        />

        <Route
          path="/dashboard/super-admin"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/chief-specialist"
          element={
            <ProtectedRoute allowedRoles={["chief_specialist"]}>
              <ChiefSpecialistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/chief-specialist/*"
          element={
            <ProtectedRoute allowedRoles={["chief_specialist"]}>
              <ChiefSpecialistDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/achievements"
          element={
            <ProtectedRoute allowedRoles={["chief_specialist", "super_admin"]}>
              <AchievementsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/specialist"
          element={
            <ProtectedRoute allowedRoles={["specialist"]}>
              <SpecialistDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={getDashboardPath()} replace />}
        />
      </Routes>
    );
  }

  // If not authenticated, show login page
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
        }
      >
        <>
          <AppRoutes />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
