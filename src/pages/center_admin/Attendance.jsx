import React from "react";
import AttendanceModule from "../../modules/attendance/AttendanceModule";
import { useAuthStore } from "../../store/authStore";

const CenterAdminAttendance = () => {
  const { user } = useAuthStore();

  return <AttendanceModule role="center_admin" />;
};

export default CenterAdminAttendance;
