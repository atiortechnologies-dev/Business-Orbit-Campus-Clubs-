

const opportunities = [
  {
    id: "1",
    title: "Lead UI/UX Design Intern",
    company: "NovaCore Systems",
    location: "Singapore (Remote)",
    salary: "$1,200 - $1,800/mo",
    type: "Internship",
    workMode: "Remote",
    industry: "Design",
    experience: "Entry",
    posted: "2 days ago",
    deadline: "15 Oct 2026",
    logo: "",
    description:
      "We're looking for a creative UI/UX intern to join our design team.",
    skills: ["Figma", "Prototyping", "UX Research"],
  },
  {
    id: "2",
    title: "Junior Frontend Developer",
    company: "FinStrat Global",
    location: "London (Hybrid)",
    salary: "$45k - $55k",
    type: "Full-time",
    workMode: "Hybrid",
    industry: "Software",
    experience: "Junior",
    posted: "4 hours ago",
    deadline: "02 Nov 2026",
    logo: "",
    description:
      "Build modern React applications and collaborate with senior developers.",
    skills: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    id: "3",
    title: "Freelance Content Strategist",
    company: "EcoGrow",
    location: "Remote",
    salary: "$35 - $60/hr",
    type: "Freelance",
    workMode: "Remote",
    industry: "Marketing",
    experience: "Intermediate",
    posted: "1 week ago",
    deadline: "20 Oct 2026",
    logo: "",
    description:
      "Create high-quality content strategies for global brands.",
    skills: ["Copywriting", "SEO", "Brand Strategy"],
  },
];

const applications = [];

export const freelancingService = {
  async listOpportunities(filters = {}) {
    let data = [...opportunities];

    if (filters.type) {
      data = data.filter((item) => item.type === filters.type);
    }

    if (filters.workMode) {
      data = data.filter((item) => item.workMode === filters.workMode);
    }

    if (filters.industry) {
      data = data.filter((item) => item.industry === filters.industry);
    }

    return data;
  },

  async getOpportunity(id) {
    return opportunities.find((item) => item.id === id) || null;
  },

  async getSimilarOpportunities(currentId, industry, limit = 3) {
    return opportunities
      .filter(
        (item) =>
          item.id !== currentId &&
          (!industry || item.industry === industry)
      )
      .slice(0, limit);
  },

  async submitApplication(payload) {
    const application = {
      id: Date.now().toString(),
      ...payload,
      status: "submitted",
      appliedDate: new Date().toLocaleDateString(),
    };

    applications.push(application);

    return application;
  },

  async getMyApplications() {
    return applications;
  },

  async getApplication(id) {
    return applications.find((item) => item.id === id) || null;
  },

  async updateApplication(id, payload) {
    const index = applications.findIndex((item) => item.id === id);

    if (index === -1) return null;

    applications[index] = {
      ...applications[index],
      ...payload,
    };

    return applications[index];
  },

  async withdrawApplication(id) {
    const application = applications.find((item) => item.id === id);

    if (!application) return null;

    application.status = "withdrawn";

    return application;
  },

  async uploadFile(file) {
    return URL.createObjectURL(file);
  },
};