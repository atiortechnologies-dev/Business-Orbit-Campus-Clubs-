import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import RoleSignupForm from "@/components/auth/RoleSignupForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getAllChapters } from "@/api/auth/authApi";

const BASE_FIELDS = [
  { name: "full_name", label: "Full Name", placeholder: "e.g. Alex Chen" },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@university.edu",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    name: "college",
    label: "College Name",
    type: "select",
    options: [], // Populated dynamically from API
  },
  {
    name: "degree",
    label: "Degree",
    placeholder: "e.g. B-Tech",
  },
  {
    name: "graduation_year",
    label: "Graduation Year",
    type: "select",
    options: ["2026", "2027", "2028", "2029", "2030"],
  },
];

export default function StudentSignupPage() {
  useDocumentTitle("Student Sign Up — BOCC");

  const [fields, setFields] = useState(BASE_FIELDS);
  const [isFetchingChapters, setIsFetchingChapters] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await getAllChapters();
        // res.data contains [{ collegeName: "...", chapterName: "..." }]
        const collegeNames = res.data?.map((ch) => ch.collegeName) || [];

        setFields((prevFields) =>
          prevFields.map((field) =>
            field.name === "college"
              ? { ...field, options: collegeNames }
              : field,
          ),
        );
      } catch (err) {
        console.error("Failed to load chapters:", err);
      } finally {
        setIsFetchingChapters(false);
      }
    };

    fetchChapters();
  }, []);

  return (
    <RoleSignupForm
      roleId="student"
      title="Create Your Student Account"
      subtitle="Join the BOCC network and start building your startup."
      icon={
        <GraduationCap size={22} strokeWidth={2} className="text-accent-neon" />
      }
      fields={fields}
      isLoadingChapters={isFetchingChapters}
    />
  );
}
