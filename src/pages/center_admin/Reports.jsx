import React from "react";
import { useAuthStore } from "../../store/authStore";
import ReportModule from "../../modules/reports/ReportModule";

const CenterAdminReports = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <ReportModule centerId={user?.center_id} />
    </div>
  );
};

export default CenterAdminReports;
