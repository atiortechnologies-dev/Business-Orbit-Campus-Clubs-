import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "@/lib/companyService";

export default function ApplicantsLanding() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const opps = await companyService.listOpportunities();

        const target =
          opps.find((o) => o.status === "active") || opps[0];

        if (target) {
          navigate(`/company/opportunity/${target.id}/applicants`, {
            replace: true,
          });
        } else {
          navigate("/company/my-opportunities", {
            replace: true,
          });
        }
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    loadOpportunities();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Unable to load opportunities.
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
    </div>
  );
}