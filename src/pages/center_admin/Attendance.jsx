import React from "react";
import AttendanceModule from "../../modules/attendance/AttendanceModule";
import { useAuthStore } from "../../store/authStore";

const CenterAdminAttendance = () => {
  const { user } = useAuthStore();

  return (
    <AttendanceModule
      role="center_admin"
      initialFilters={{ center_id: user?.center_id }}
    />
  );
};

export default CenterAdminAttendance;
