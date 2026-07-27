import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const inputCls =
  "h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none";

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "bg-black" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function CompanySettings() {
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    email_new_applicants: true,
    email_deadline_reminders: true,
    auto_shortlist: false,
    weekly_summary: true,
    visibility: "public",
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("companySettings");

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const save = async () => {
    setSaving(true);

    try {
      localStorage.setItem(
        "companySettings",
        JSON.stringify(settings)
      );

      toast({
        title: "Settings saved",
      });
    } catch (e) {
      toast({
        title: "Save failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggles = [
    {
      key: "email_new_applicants",
      label: "New applicant notifications",
      desc: "Email me when someone applies.",
    },
    {
      key: "email_deadline_reminders",
      label: "Deadline reminders",
      desc: "Notify me 48h before a deadline.",
    },
    {
      key: "auto_shortlist",
      label: "AI auto-shortlist",
      desc: "Automatically shortlist candidates matching criteria.",
    },
    {
      key: "weekly_summary",
      label: "Weekly summary",
      desc: "Get a weekly hiring report every Monday.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage notifications and account preferences.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-black">
            Notifications
          </h2>

          <div className="space-y-4">
            {toggles.map((t) => (
              <div
                key={t.key}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {t.label}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t.desc}
                  </p>
                </div>

                <Toggle
                  enabled={settings[t.key]}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      [t.key]: value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-black">
            Default Visibility
          </h2>

          <select
            className={inputCls}
            value={settings.visibility}
            onChange={(e) =>
              setSettings({
                ...settings,
                visibility: e.target.value,
              })
            }
          >
            <option value="public">
              Public — visible to all students
            </option>
            <option value="members">
              BOCC Members Only
            </option>
            <option value="colleges">
              Selected Colleges
            </option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}