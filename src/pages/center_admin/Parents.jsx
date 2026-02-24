import React from "react";
import ParentModule from "../../modules/parents/ParentModule";
import { useAuthStore } from "../../store/authStore";

const CenterAdminParents = () => {
  const { user } = useAuthStore();

  return (
    <ParentModule
      role="center_admin"
      initialFilters={{ center_id: user?.center_id }}
    />
  );
};

export default CenterAdminParents;
