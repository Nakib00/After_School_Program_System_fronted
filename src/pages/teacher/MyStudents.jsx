import React from "react";
import StudentModule from "../../modules/students/StudentModule";
import { useAuthStore } from "../../store/authStore";

const MyStudents = () => {
  const { user } = useAuthStore();

  return (
    <StudentModule
      role="teacher"
      initialFilters={{ teacher_id: user?.teacher_id || user?.id }}
    />
  );
};

export default MyStudents;
