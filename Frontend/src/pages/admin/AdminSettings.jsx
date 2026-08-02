import { useState, useEffect } from "react";
import {
  Fingerprint,
  Upload,
  Laptop,
  Smartphone,
  Monitor,
  Download,
  Share2,
  DatabaseBackup,
  ChevronRight,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAdminDashboard } from "@/context/AdminDashboardContext";

const TIMEZONE_OPTIONS = [
  "(GMT-05:00) Eastern Time (US & Canada)",
  "(GMT+00:00) UTC",
];

const NOTIFICATION_EVENTS = [
  "New User Registration",
  "Startup Submission",
  "Opportunity Submission",
  "Support Ticket Created",
  "Chapter Membership Change",
  "Global Announcement Sent",
  "Meeting Scheduled",
  "Security Alerts",
];

const LOGIN_ACTIVITY = [
  {
    icon: Laptop,
    device: "Chrome / macOS",
    meta: "192.168.1.45 · 2 mins ago",
    current: true,
  },
  {
    icon: Smartphone,
    device: "Safari / iPhone 13",
    meta: "172.56.21.90 · 4 hours ago",
  },
  {
    icon: Monitor,
    device: "Firefox / Windows 11",
    meta: "88.150.21.12 · Nov 21, 10:45 AM",
  },
];

export default function AdminSettingsPage() {
  useDocumentTitle("Settings — BOCC Admin");

  const {
    settings,
    updateProfile: submitProfile,
    updatePlatformSettings,
    updateNotifications,
    _isLoadingSettings,
  } = useAdminDashboard();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    twoFactor: true,
  });

  const [platform, setPlatform] = useState({
    name: "",
    supportEmail: "",
    timezone: TIMEZONE_OPTIONS[0],
    newRegistrations: true,
    emailVerificationRequired: true,
    maintenanceMode: false,
    publicProfilesVisible: true,
  });

  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [eventToggles, setEventToggles] = useState({
    "New User Registration": true,
    "Startup Submission": true,
    "Opportunity Submission": true,
    "Support Ticket Created": true,
    "Chapter Membership Change": false,
    "Global Announcement Sent": false,
    "Meeting Scheduled": true,
    "Security Alerts": true,
  });

  useEffect(() => {
    if (settings) {
      setProfile((prev) => ({ ...prev, ...settings.profile }));
      setPlatform((prev) => ({ ...prev, ...settings.platform }));
      if (settings.notifications) {
        setNotifyInApp(settings.notifications.inApp ?? true);
        setNotifyEmail(settings.notifications.email ?? true);
        if (settings.notifications.events) {
          setEventToggles((prev) => ({
            ...prev,
            ...settings.notifications.events,
          }));
        }
      }
    }
  }, [settings]);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = (field) => (e) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  const updatePlatform = (field) => (e) =>
    setPlatform((prev) => ({ ...prev, [field]: e.target.value }));
  const toggleEvent = (event) =>
    setEventToggles((prev) => ({ ...prev, [event]: !prev[event] }));

  const handleSaveChanges = async () => {
    setError(null);
    try {
      await Promise.all([
        submitProfile(profile),
        updatePlatformSettings(platform),
        updateNotifications({
          inApp: notifyInApp,
          email: notifyEmail,
          events: eventToggles,
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.message || "Failed to save changes");
    }
  };

  const handleCancel = () => {
    if (settings) {
      setProfile((prev) => ({ ...prev, ...settings.profile }));
      setPlatform((prev) => ({ ...prev, ...settings.platform }));
      if (settings.notifications) {
        setNotifyInApp(settings.notifications.inApp ?? true);
        setNotifyEmail(settings.notifications.email ?? true);
        if (settings.notifications.events) {
          setEventToggles((prev) => ({
            ...prev,
            ...settings.notifications.events,
          }));
        }
      }
    }
    setError(null);
    setSaved(false);
  };


  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Settings
        </h1>
        <p className="font-inter text-body text-text-body mt-1 max-w-2xl">
          Manage your administrator account, platform preferences,
          notifications, and system configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8 relative overflow-hidden">
            <Fingerprint
              size={64}
              strokeWidth={1.5}
              className="absolute top-4 right-4 text-text-muted opacity-10"
            />
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-6 pb-2 border-b border-divider-line">
              Administrator Profile
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <ComingSoon
                label="Upload Avatar"
                position="top"
                inline
                className="shrink-0"
              >
                <span className="w-24 h-24 shrink-0 border-2 border-dashed border-border-subtle rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-canvas-bg transition-colors cursor-pointer">
                  <Upload
                    size={20}
                    strokeWidth={2}
                    className="text-text-muted"
                  />
                  <span className="font-inter text-caption text-text-muted">
                    Avatar
                  </span>
                </span>
              </ComingSoon>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="fullName"
                  label="Full Name"
                  value={profile.fullName}
                  onChange={updateProfile("fullName")}
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={updateProfile("email")}
                />
                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={profile.phone}
                  onChange={updateProfile("phone")}
                />
                <Input
                  id="designation"
                  label="Designation"
                  value={profile.designation}
                  onChange={updateProfile("designation")}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-caption font-medium text-text-heading font-inter">
                    System Role (Read-only)
                  </label>
                  <div className="min-h-[44px] flex items-center px-3 rounded-md border border-border-subtle bg-canvas-bg text-text-muted font-inter text-small">
                    Super Admin
                  </div>
                </div>
                <div className="flex items-end pb-1">
                  <ComingSoon label="Change Password" position="top" inline>
                    <span className="font-poppins font-semibold text-small text-text-heading">
                      Change Password
                    </span>
                  </ComingSoon>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-divider-line flex items-center justify-between">
              <div>
                <h4 className="font-poppins font-semibold text-body text-text-heading">
                  Two-Factor Authentication
                </h4>
                <p className="font-inter text-small text-text-muted">
                  Secure your account with a secondary verification step.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={profile.twoFactor}
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    twoFactor: !prev.twoFactor,
                  }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${profile.twoFactor ? "bg-brand-black" : "bg-border-subtle"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${profile.twoFactor ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-6 pb-2 border-b border-divider-line">
              Platform Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  id="platformName"
                  label="Platform Name"
                  value={platform.name}
                  onChange={updatePlatform("name")}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-caption font-medium text-text-heading font-inter">
                    Logo Upload
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading">
                      B
                    </div>
                    <ComingSoon label="Replace Logo" position="top" inline>
                      <span className="border border-border-subtle px-4 py-2 rounded-md font-poppins font-semibold text-caption text-text-heading">
                        Replace
                      </span>
                    </ComingSoon>
                  </div>
                </div>
                <Input
                  id="supportEmail"
                  label="Support Email"
                  type="email"
                  value={platform.supportEmail}
                  onChange={updatePlatform("supportEmail")}
                />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="timezone"
                    className="text-caption font-medium text-text-heading font-inter"
                  >
                    Time Zone
                  </label>
                  <select
                    id="timezone"
                    value={platform.timezone}
                    onChange={updatePlatform("timezone")}
                    className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4">
                <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
                  Functional Toggles
                </h4>
                <div className="space-y-4">
                  {[
                    { key: "newRegistrations", label: "New Registrations" },
                    {
                      key: "emailVerificationRequired",
                      label: "Email Verification Required",
                    },
                    {
                      key: "maintenanceMode",
                      label: "Maintenance Mode",
                      danger: true,
                    },
                    {
                      key: "publicProfilesVisible",
                      label: "Public Profiles Visible",
                    },
                  ].map(({ key, label, danger }) => (
                    <label
                      key={key}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span
                        className={`font-inter text-small ${danger ? "text-error font-semibold" : "text-text-body"}`}
                      >
                        {label}
                      </span>
                      <input
                        type="checkbox"
                        checked={platform[key]}
                        onChange={() =>
                          setPlatform((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-divider-line">
              <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest">
                Admin Notifications
              </h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-inter text-caption text-text-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyInApp}
                    onChange={() => setNotifyInApp((v) => !v)}
                    className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                  In-App
                </label>
                <label className="flex items-center gap-2 font-inter text-caption text-text-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={() => setNotifyEmail((v) => !v)}
                    className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                  Email
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              {NOTIFICATION_EVENTS.map((event) => (
                <div
                  key={event}
                  className="flex items-center justify-between py-2 border-b border-divider-line last:border-0"
                >
                  <span className="font-inter text-small text-text-body">
                    {event}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={eventToggles[event]}
                    onClick={() => toggleEvent(event)}
                    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${eventToggles[event] ? "bg-brand-black" : "bg-border-subtle"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${eventToggles[event] ? "translate-x-4" : ""}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-6 pb-2 border-b border-divider-line">
              Security &amp; Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-canvas-bg border border-border-subtle rounded-lg">
                  <div>
                    <p className="font-inter text-caption text-text-muted">
                      Password Last Changed
                    </p>
                    <p className="font-inter font-semibold text-small text-text-heading">
                      14 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-canvas-bg border border-border-subtle rounded-lg">
                  <div>
                    <p className="font-inter text-caption text-text-muted">
                      Active Sessions
                    </p>
                    <p className="font-inter font-semibold text-small text-text-heading">
                      3 Sessions
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <ComingSoon label="View Login History" position="top">
                  <span className="flex items-center justify-between w-full border border-border-subtle rounded-lg px-4 py-3 font-poppins font-semibold text-small text-text-heading">
                    View Login History{" "}
                    <ChevronRight size={16} strokeWidth={2} />
                  </span>
                </ComingSoon>
                <ComingSoon label="Sign Out of All Devices" position="top">
                  <span className="flex items-center justify-between w-full border border-error text-error rounded-lg px-4 py-3 font-poppins font-semibold text-small">
                    Sign Out of All Devices
                  </span>
                </ComingSoon>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4 pb-2 border-b border-divider-line">
              System Information
            </h4>
            <div className="space-y-3 font-inter text-small">
              <div className="flex justify-between">
                <span className="text-text-muted">Platform Version</span>
                <span className="text-text-heading font-semibold">
                  v2.4.8-stable
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">DB / Server Status</span>
                <span className="flex items-center gap-1.5 text-success font-semibold">
                  <span className="w-2 h-2 rounded-full bg-success" /> Online
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Last Backup</span>
                <span className="text-text-heading">2023-11-22 04:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Current Build</span>
                <span className="text-text-heading">f8a2c1e4</span>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4 pb-2 border-b border-divider-line">
              Storage Usage
            </h4>
            <div className="flex justify-between items-end mb-2">
              <p className="font-poppins font-semibold text-section text-text-heading">
                68<span className="font-inter font-normal text-small">%</span>
              </p>
              <p className="font-inter text-caption text-text-muted">
                340 GB / 500 GB
              </p>
            </div>
            <div className="w-full h-3 bg-canvas-bg rounded-full overflow-hidden">
              <div
                className="bg-brand-black h-full rounded-full"
                style={{ width: "68%" }}
              />
            </div>
            <p className="font-inter text-caption text-text-muted mt-3 italic">
              Database assets and uploaded documentation.
            </p>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4 pb-2 border-b border-divider-line">
              Recent Login Activity
            </h4>
            <div className="space-y-4">
              {LOGIN_ACTIVITY.map(({ icon: Icon, device, meta, current }) => (
                <div key={device} className="flex items-start gap-3">
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className="text-text-muted shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-inter font-semibold text-small text-text-heading">
                      {device}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {meta}
                    </p>
                  </div>
                  {current && (
                    <span className="text-[10px] uppercase bg-brand-black text-white px-1.5 py-0.5 rounded-full shrink-0">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <ComingSoon label="Download System Logs" position="top">
                <span className="flex items-center gap-3 w-full border border-border-subtle rounded-lg px-4 py-2.5 font-poppins font-semibold text-small text-text-heading">
                  <Download size={18} strokeWidth={2} /> Download System Logs
                </span>
              </ComingSoon>
              <ComingSoon label="Export Config" position="top">
                <span className="flex items-center gap-3 w-full border border-border-subtle rounded-lg px-4 py-2.5 font-poppins font-semibold text-small text-text-heading">
                  <Share2 size={18} strokeWidth={2} /> Export Config (JSON)
                </span>
              </ComingSoon>
              <ComingSoon label="Backup Settings" position="top">
                <span className="flex items-center gap-3 w-full border border-border-subtle rounded-lg px-4 py-2.5 font-poppins font-semibold text-small text-text-heading">
                  <DatabaseBackup size={18} strokeWidth={2} /> Backup Settings
                </span>
              </ComingSoon>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 bg-canvas-bg/95 backdrop-blur-sm border-t border-divider-line py-4 mt-8 flex items-center justify-end gap-4">
        {error && (
          <span className="font-inter text-small text-error mr-auto">
            {error}
          </span>
        )}
        {!error && saved && (
          <span className="font-inter text-small text-success mr-auto">
            Changes saved.
          </span>
        )}
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </AdminShell>
  );
}
