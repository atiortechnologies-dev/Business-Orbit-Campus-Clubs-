import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const inputCls =
  'h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none';

export default function CompanyProfile() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    company_name: 'Acme Corp',
    industry: 'Technology',
    website: 'https://acme.com',
    size: '201-500',
    headquarters: 'San Francisco, CA',
    about: 'Building the future of developer tools.',
    contact_name: 'Jordan Lee',
    contact_email: 'jordan@acme.com',
    contact_phone: '+1 (555) 123-4567'
  });

const save = async () => {
  setSaving(true);

  try {
    localStorage.setItem(
      "companyProfile",
      JSON.stringify(profile)
    );

    toast({
      title: "Profile saved",
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

  const Field = ({ label, value, keyName }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-black">{label}</label>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => setProfile({ ...profile, [keyName]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Company Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your company information visible to candidates.</p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-900 text-lg font-bold text-white">
            AC
          </div>
          <div>
            <p className="text-base font-semibold text-black">Acme Corp</p>
            <p className="text-xs text-gray-400">Premium Account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Company Name" value={profile.company_name} keyName="company_name" />
          <Field label="Industry" value={profile.industry} keyName="industry" />
          <Field label="Website" value={profile.website} keyName="website" />
          <Field label="Company Size" value={profile.size} keyName="size" />
          <Field label="Headquarters" value={profile.headquarters} keyName="headquarters" />
          <Field label="Contact Name" value={profile.contact_name} keyName="contact_name" />
          <Field label="Contact Email" value={profile.contact_email} keyName="contact_email" />
          <Field label="Contact Phone" value={profile.contact_phone} keyName="contact_phone" />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-black">About</label>
          <textarea
            rows={4}
            className="w-full resize-y rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:border-black focus:outline-none"
            value={profile.about}
            onChange={(e) => setProfile({ ...profile, about: e.target.value })}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}