import React, { createContext, useContext, useState, useEffect } from 'react';

const DraftContext = createContext();
const STORAGE_KEY = 'bocc_opportunity_draft';

export const emptyDraft = {
  title: '',
  type: 'Full-time',
  department: '',
  industry: '',
  work_mode: 'Remote',
  location: '',
  duration: '',
  openings: 1,
  deadline: '',
  salary: '',
  logo_url: '',
  skills: [],
  min_education: "Bachelor's Degree",
  min_cgpa: '',
  passing_years: [],
  experience: '0-1 Years (Entry)',
  branches: [],
  languages: [],
  startup_exp: 'Preferred',
  overview: '',
  responsibilities: '',
  learning_outcomes: '',
  benefits: '',
  selection_process: '',
  notes: '',
  documents: [],
  visibility: 'public',
  status: 'draft',
  id: null
};

export function DraftProvider({ children }) {
  const [draft, setDraft] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...emptyDraft, ...JSON.parse(saved) } : emptyDraft;
    } catch {
      return emptyDraft;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft]);

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const resetDraft = () => setDraft(emptyDraft);
  const loadDraft = (data) =>
    setDraft({ ...emptyDraft, ...data, id: data.id || null });

  return (
    <DraftContext.Provider value={{ draft, updateDraft, resetDraft, loadDraft }}>
      {children}
    </DraftContext.Provider>
  );
}

export const useDraft = () => useContext(DraftContext);