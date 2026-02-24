import React from "react";
import StudentModule from "../../modules/students/StudentModule";
import { useAuthStore } from "../../store/authStore";
import Spinner from "../../components/ui/Spinner";

const CenterAdminStudents = () => {
  const { user } = useAuthStore();

  return (
    <StudentModule
      role="center_admin"
      initialFilters={{ center_id: user?.center_id }}
    />
  );
};

export default CenterAdminStudents;
