import React from "react";
import FeeModule from "../../modules/fees/FeeModule";
import { useAuthStore } from "../../store/authStore";

const CenterAdminFees = () => {
  const { user } = useAuthStore();

  return (
    <FeeModule
      role="center_admin"
      initialFilters={{ center_id: user?.center_id }}
    />
  );
};

export default CenterAdminFees;
