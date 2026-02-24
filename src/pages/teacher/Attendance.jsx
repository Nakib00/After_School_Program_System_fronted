import React from "react";
import AttendanceModule from "../../modules/attendance/AttendanceModule";
import { useAuthStore } from "../../store/authStore";

const TeacherAttendance = () => {
  const { user } = useAuthStore();

  return (
    <AttendanceModule
      role="teacher"
      initialFilters={{ teacher_id: user?.id }}
    />
  );
};

export default TeacherAttendance;
