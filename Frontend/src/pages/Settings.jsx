import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  X,
  Plus,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  KeyRound,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Modal from "@/components/ui/Modal";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getStudentProfile, updateProfile } from "@/api/dashboardApi";
import * as studentChapterApi from "@/api/auth/studentChapterApi";
import {
  deleteMyAccount,
  updateNotificationPreferences,
  uploadProfilePhoto,
  changePassword,
} from "@/api/auth/profileApi";
import api from "@/api/axiosInstance";

export default function SettingsPage() {
  useDocumentTitle("Settings — BOCC");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    gradYear: "",
    linkedin: "",
    portfolio: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [userId, setUserId] = useState(null);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    inApp: true,
  });
  const [visibility, setVisibility] = useState("public");
  const [prefsSaving, setPrefsSaving] = useState(false);

  const [photoUrl, setPhotoUrl] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteRequested, setDeleteRequested] = useState(false);

  // Load student details from /api/student/profile-details
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getStudentProfile();
        const data = res?.data || res;

        const userObj = data?.user || {};
        const profileObj = data?.profile || {};

        setUserId(userObj?._id || userObj?.id || null);
        if (profileObj?.notification_preferences) {
          setNotificationPrefs({
            email: profileObj.notification_preferences.email ?? true,
            inApp: profileObj.notification_preferences.inApp ?? true,
          });
        }

        setForm({
          fullName: userObj?.full_name || "",
          email: userObj?.email || "",
          phone: userObj?.phone || "",
          college: profileObj?.college || profileObj?.college_name || "",
          branch: profileObj?.degree || profileObj?.branch || "",
          gradYear: profileObj?.graduation_year || "",
          linkedin: profileObj?.linkedin_url || "",
          portfolio: profileObj?.portfolio_url || "",
        });

        setSkills(profileObj?.skills || []);
        if (profileObj?.profile_photo) {
          setPhotoUrl(profileObj.profile_photo);
        }
      } catch (err) {
        console.error("Failed to load student profile details:", err);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load profile data. Please refresh the page.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append("photo", file);
      await uploadProfilePhoto("student", formData);
    } catch (err) {
      console.error("Failed to upload photo:", err);
    }
  };

  const handlePasswordField = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    try {
      setPasswordError("");
      await changePassword("student", {
        current_password: passwordForm.current,
        new_password: passwordForm.next,
      });
      setPasswordSuccess(true);
      setPasswordForm({ current: "", next: "", confirm: "" });
      setTimeout(() => {
        setPasswordSuccess(false);
        setPasswordOpen(false);
      }, 1500);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password.",
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userId) {
      setErrorMsg("Unable to determine user ID.");
      return;
    }
    try {
      await deleteMyAccount(userId);
      setDeleteOpen(false);
      setDeleteConfirmText("");
      setDeleteRequested(true);
      // Optional: redirect or logout could happen here
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete account. Please try again later.",
      );
    }
  };

  const handleTogglePref = async (key) => {
    const newPrefs = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(newPrefs);
    try {
      setPrefsSaving(true);
      await updateNotificationPreferences("student", newPrefs);
    } catch (err) {
      console.error(err);
      // Revert on failure
      setNotificationPrefs({ ...notificationPrefs });
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to update notification preferences.",
      );
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    const newVis = visibility === "public" ? "private" : "public";
    setVisibility(newVis);
    try {
      await api.patch("/profile/visibility", { visibility: newVis });
    } catch (err) {
      console.error(err);
      setVisibility(visibility); // Revert on failure
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to update visibility.",
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const trimmed = skillDraft.trim();
    if (trimmed && !skills.includes(trimmed))
      setSkills((prev) => [...prev, trimmed]);
    setSkillDraft("");
  };

  const removeSkill = (skill) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const canSave = form.fullName.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    try {
      setSaving(true);
      setErrorMsg("");

      const updatePayload = {
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        degree: form.branch.trim(),
        graduation_year: form.gradYear ? Number(form.gradYear) : null,
        linkedin_url: form.linkedin.trim(),
        portfolio_url: form.portfolio.trim(),
        skills,
      };

      await updateProfile(updatePayload);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err?.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  const initials = form.fullName
    ? form.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <DashboardShell pageId="settings">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Settings</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Account Settings
      </h1>
      <p className="font-inter text-body text-text-body mb-8">
        Manage your profile, education details, and account security.
      </p>

      {saveSuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border bg-success/10 border-success/30 text-success px-4 py-3 font-inter text-small">
          <CheckCircle2 size={16} strokeWidth={2} />
          Changes saved successfully.
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
          <div className="lg:col-span-4">
            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div
                  className="w-24 h-24 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-3xl select-none bg-cover bg-center"
                  style={
                    photoUrl
                      ? { backgroundImage: `url(${photoUrl})` }
                      : undefined
                  }
                >
                  {!photoUrl && initials}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-black flex items-center justify-center border-2 border-surface-white cursor-pointer hover:opacity-90 transition-opacity">
                  <Camera size={14} strokeWidth={2} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                    aria-label="Change photo"
                  />
                </label>
              </div>
              <h3 className="font-poppins font-semibold text-card text-text-heading">
                {form.fullName || "Student Name"}
              </h3>
              <p className="font-inter text-small text-text-muted">
                {form.college || "College"} · {form.branch || "Branch"}
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setErrorMsg("");
                    await studentChapterApi.requestChapterChange({
                      reason: "Requested from settings",
                    });
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  } catch (err) {
                    setErrorMsg(
                      err.response?.data?.message ||
                        err.message ||
                        "Error requesting chapter change",
                    );
                  }
                }}
                className="mt-2 text-small text-brand-black underline hover:text-text-muted transition-colors"
              >
                Request Chapter Change
              </button>
              <Link
                to="/build-startup/journey"
                className="mt-4 w-full border border-border-subtle text-text-heading py-2 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
              >
                View Startup Journey
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
                Personal Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                  />
                </div>
                <div>
                  <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-muted font-inter text-body py-2.5 px-3 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
                Education
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                    College
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                      Branch / Degree
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                    />
                  </div>
                  <div>
                    <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      name="gradYear"
                      value={form.gradYear}
                      onChange={handleChange}
                      className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
                Skills &amp; Interests
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 bg-canvas-bg border border-border-subtle rounded-full px-3 py-1 font-inter text-small text-text-body"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      <X
                        size={12}
                        strokeWidth={2}
                        className="text-text-muted hover:text-error transition-colors"
                      />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Add a skill..."
                  className="flex-1 bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="w-9 h-9 rounded-md bg-brand-black flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} strokeWidth={2} className="text-white" />
                </button>
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
                Professional Links
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                    Portfolio (Optional)
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={form.portfolio}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
                Account Security
              </h3>
              <div className="space-y-3">
                <div className="border border-border-subtle rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPasswordOpen((v) => !v)}
                    className="flex items-center justify-between w-full p-4 hover:bg-canvas-bg transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-inter text-small text-text-body">
                      <KeyRound
                        size={16}
                        strokeWidth={2}
                        className="text-text-muted"
                      />{" "}
                      Change Password
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={`text-text-muted transition-transform ${
                        passwordOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {passwordOpen && (
                    <div className="p-4 pt-0 space-y-3 border-t border-divider-line">
                      {passwordSuccess ? (
                        <p className="flex items-center gap-2 text-success font-inter text-small pt-3">
                          <CheckCircle2 size={16} strokeWidth={2} /> Password
                          updated.
                        </p>
                      ) : (
                        <>
                          <input
                            type="password"
                            name="current"
                            value={passwordForm.current}
                            onChange={handlePasswordField}
                            placeholder="Current password"
                            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 mt-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                          />
                          <input
                            type="password"
                            name="next"
                            value={passwordForm.next}
                            onChange={handlePasswordField}
                            placeholder="New password"
                            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                          />
                          <input
                            type="password"
                            name="confirm"
                            value={passwordForm.confirm}
                            onChange={handlePasswordField}
                            placeholder="Confirm new password"
                            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                          />
                          {passwordError && (
                            <p className="text-error font-inter text-small">
                              {passwordError}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={handlePasswordSubmit}
                            className="bg-action-bg text-action-text px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
                          >
                            Update Password
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border border-border-subtle rounded-lg p-4">
                  <span className="flex items-center gap-2.5 font-inter text-small text-text-body">
                    <ShieldCheck
                      size={16}
                      strokeWidth={2}
                      className="text-text-muted"
                    />{" "}
                    Two-Factor Authentication
                  </span>
                  <span className="font-poppins font-semibold text-caption text-text-muted">
                    Not Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between border border-border-subtle rounded-lg p-4">
                  <span className="flex items-center gap-2.5 font-inter text-small text-text-body">
                    <ShieldCheck
                      size={16}
                      strokeWidth={2}
                      className="text-text-muted"
                    />{" "}
                    Profile Visibility
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleVisibility}
                    className="font-poppins font-semibold text-caption text-brand-black underline"
                  >
                    {visibility === "public" ? "Public" : "Private"}
                  </button>
                </div>
                {deleteRequested ? (
                  <div className="flex items-center gap-2.5 border border-warning/30 bg-warning/10 rounded-lg p-4 font-inter text-small text-warning">
                    <AlertTriangle size={16} strokeWidth={2} /> Deletion
                    requested — our team will follow up by email.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center justify-between w-full border border-error/30 rounded-lg p-4 hover:bg-error/5 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-inter text-small text-error">
                      <Trash2 size={16} strokeWidth={2} /> Delete Account
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-semibold text-body text-text-heading">
                  Notification Preferences
                </h3>
                {prefsSaving && (
                  <Loader2 size={16} className="animate-spin text-text-muted" />
                )}
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="font-inter font-semibold text-small text-text-heading group-hover:text-brand-black transition-colors">
                      Email Alerts
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      Receive updates, meeting reminders, and reports via email.
                    </p>
                  </div>
                  <div
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2 ${notificationPrefs.email ? "bg-brand-black" : "bg-gray-200"}`}
                    onClick={() => handleTogglePref("email")}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notificationPrefs.email ? "translate-x-2" : "-translate-x-2"}`}
                    />
                  </div>
                </label>
                <div className="h-px bg-border-subtle w-full" />
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="font-inter font-semibold text-small text-text-heading group-hover:text-brand-black transition-colors">
                      In-App Notifications
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      Get alerts directly within the BOCC platform dashboard.
                    </p>
                  </div>
                  <div
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2 ${notificationPrefs.inApp ? "bg-brand-black" : "bg-gray-200"}`}
                    onClick={() => handleTogglePref("inApp")}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notificationPrefs.inApp ? "translate-x-2" : "-translate-x-2"}`}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteConfirmText("");
        }}
        title="Delete account"
      >
        <p className="font-inter text-small text-text-body mb-4">
          This permanently removes your BOCC account and startup progress. Type{" "}
          <strong>DELETE</strong> to confirm.
        </p>
        <input
          type="text"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder="DELETE"
          className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 mb-4 focus:outline-none focus:ring-1 focus:ring-error"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setDeleteOpen(false);
              setDeleteConfirmText("");
            }}
            className="border border-border-subtle text-text-heading px-5 py-2 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={deleteConfirmText !== "DELETE"}
            className="bg-error text-white px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </Modal>
    </DashboardShell>
  );
}
