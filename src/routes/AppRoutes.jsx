import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import Spinner from "../components/ui/Spinner";

// Auth Pages
const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

// Super Admin Pages
const SuperAdminDashboard = lazy(
  () => import("../pages/super_admin/Dashboard"),
);
const Centers = lazy(() => import("../pages/super_admin/Centers"));
const SuperAdminStudents = lazy(() => import("../pages/super_admin/Students"));
const SuperAdminTeachers = lazy(() => import("../pages/super_admin/Teachers"));
const Subjects = lazy(() => import("../pages/super_admin/Subjects"));
const Levels = lazy(() => import("../pages/super_admin/Levels"));
const SuperAdminFees = lazy(() => import("../pages/super_admin/Fees"));
const SuperAdminReports = lazy(() => import("../pages/super_admin/Reports"));
const CenterAdmins = lazy(() => import("../pages/super_admin/CenterAdmins"));
const Parents = lazy(() => import("../pages/super_admin/Parents"));

// Center Admin Pages
const CenterAdminDashboard = lazy(
  () => import("../pages/center_admin/Dashboard"),
);
const CenterAdminStudents = lazy(
  () => import("../pages/center_admin/Students"),
);
const CenterAdminTeachers = lazy(
  () => import("../pages/center_admin/Teachers"),
);
const CenterAdminAttendance = lazy(
  () => import("../pages/center_admin/Attendance"),
);
const CenterAdminFees = lazy(() => import("../pages/center_admin/Fees"));
const CenterAdminReports = lazy(() => import("../pages/center_admin/Reports"));

// Teacher Pages
const TeacherDashboard = lazy(() => import("../pages/teacher/Dashboard"));
const MyStudents = lazy(() => import("../pages/teacher/MyStudents"));
const Assignments = lazy(() => import("../pages/teacher/Assignments"));
const GradeSubmissions = lazy(
  () => import("../pages/teacher/GradeSubmissions"),
);
const TeacherAttendance = lazy(() => import("../pages/teacher/Attendance"));

// Parent Pages
const ParentDashboard = lazy(() => import("../pages/parent/Dashboard"));
const ChildProgress = lazy(() => import("../pages/parent/ChildProgress"));
const ParentAssignments = lazy(() => import("../pages/parent/Assignments"));
const ParentFees = lazy(() => import("../pages/parent/Fees"));

// Student Pages
const StudentDashboard = lazy(() => import("../pages/student/Dashboard"));
const MyAssignments = lazy(() => import("../pages/student/MyAssignments"));
const SubmitWork = lazy(() => import("../pages/student/SubmitWork"));
const MyProgress = lazy(() => import("../pages/student/MyProgress"));

// Shared Pages
const Profile = lazy(() => import("../pages/Profile"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Shared Route for all authenticated users */}
            <Route path="/profile" element={<Profile />} />

            {/* Super Admin Routes */}
            <Route element={<RoleRoute allowedRoles={["super_admin"]} />}>
              <Route
                path="/super-admin/dashboard"
                element={<SuperAdminDashboard />}
              />
              <Route path="/super-admin/centers" element={<Centers />} />
              <Route
                path="/super-admin/students"
                element={<SuperAdminStudents />}
              />
              <Route
                path="/super-admin/teachers"
                element={<SuperAdminTeachers />}
              />
              <Route path="/super-admin/subjects" element={<Subjects />} />
              <Route path="/super-admin/levels" element={<Levels />} />
              <Route path="/super-admin/fees" element={<SuperAdminFees />} />
              <Route
                path="/super-admin/reports"
                element={<SuperAdminReports />}
              />
              <Route
                path="/super-admin/center-admins"
                element={<CenterAdmins />}
              />
              <Route path="/super-admin/parents" element={<Parents />} />
            </Route>

            {/* Center Admin Routes */}
            <Route element={<RoleRoute allowedRoles={["center_admin"]} />}>
              <Route
                path="/center-admin/dashboard"
                element={<CenterAdminDashboard />}
              />
              <Route
                path="/center-admin/students"
                element={<CenterAdminStudents />}
              />
              <Route
                path="/center-admin/teachers"
                element={<CenterAdminTeachers />}
              />
              <Route
                path="/center-admin/attendance"
                element={<CenterAdminAttendance />}
              />
              <Route path="/center-admin/fees" element={<CenterAdminFees />} />
              <Route
                path="/center-admin/reports"
                element={<CenterAdminReports />}
              />
            </Route>

            {/* Teacher Routes */}
            <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<MyStudents />} />
              <Route path="/teacher/assignments" element={<Assignments />} />
              <Route path="/teacher/grade" element={<GradeSubmissions />} />
              <Route
                path="/teacher/attendance"
                element={<TeacherAttendance />}
              />
            </Route>

            {/* Parent Routes */}
            <Route element={<RoleRoute allowedRoles={["parents"]} />}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/parent/progress" element={<ChildProgress />} />
              <Route
                path="/parent/assignments"
                element={<ParentAssignments />}
              />
              <Route path="/parent/fees" element={<ParentFees />} />
            </Route>

            {/* Student Routes */}
            <Route element={<RoleRoute allowedRoles={["student"]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/assignments" element={<MyAssignments />} />
              <Route path="/student/submit" element={<SubmitWork />} />
              <Route path="/student/progress" element={<MyProgress />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
