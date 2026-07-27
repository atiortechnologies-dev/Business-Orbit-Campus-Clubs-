import yc from "@/incubators/yc.png";
import techstars from "@/incubators/techstars.png";
import google from "@/incubators/google.png";
import microsoft from "@/incubators/microsoft.png";
import startupIndia from "@/incubators/startup-india.png";
import nasscom from "@/incubators/nasscom.png";

const incubators = [
  {
    id: "1",
    name: "Y Combinator",
    description:
      "World-renowned startup accelerator helping founders build and scale innovative companies.",
    featured: true,
    logo: yc,
    industry: "SaaS/Fintech",
    industry_tags: ["SaaS/Fintech"],
    stage: "MVP",
    program_type: "Accelerator",
    location: "Remote",
    status: "open",
  },
  {
    id: "2",
    name: "Techstars",
    description:
      "Global accelerator providing mentorship, funding and worldwide network access.",
    featured: false,
    logo: techstars,
    industry: "Deep Tech",
    industry_tags: ["Deep Tech"],
    stage: "Seed",
    program_type: "Accelerator",
    location: "New York",
    status: "open",
  },
  {
    id: "3",
    name: "Google for Startups",
    description:
      "Helping startups grow with cloud credits, mentorship and expert guidance.",
    featured: false,
    logo: google,
    industry: "HealthTech",
    industry_tags: ["HealthTech"],
    stage: "Growth",
    program_type: "Incubator",
    location: "London",
    status: "open",
  },
  {
    id: "4",
    name: "Microsoft Founders Hub",
    description:
      "Free Azure credits, AI services and startup mentoring.",
    featured: false,
    logo: microsoft,
    industry: "EdTech",
    industry_tags: ["EdTech"],
    stage: "Ideation",
    program_type: "Incubator",
    location: "Remote",
    status: "open",
  },
  {
    id: "5",
    name: "Startup India",
    description:
      "Government initiative supporting Indian startups through funding and incubation.",
    featured: false,
    logo: startupIndia,
    industry: "CleanTech",
    industry_tags: ["CleanTech"],
    stage: "Seed",
    program_type: "Grant",
    location: "Bengaluru",
    status: "open",
  },
  {
    id: "6",
    name: "NASSCOM 10,000 Startups",
    description:
      "India's largest startup ecosystem with mentors and investor access.",
    featured: false,
    logo: nasscom,
    industry: "SaaS/Fintech",
    industry_tags: ["SaaS/Fintech"],
    stage: "Growth",
    program_type: "Accelerator",
    location: "Bengaluru",
    status: "open",
  },
];

const applications = [];

export const incubationService = {
  async listIncubators() {
    return incubators;
  },

  async getIncubator(id) {
    return incubators.find((i) => i.id === id) || null;
  },

  async applyToIncubator(payload) {
    const application = {
      id: Date.now().toString(),
      ...payload,
      status: "pending",
      current_stage: "Application Submitted",
      documents: [],
    };

    applications.push(application);

    return application;
  },

  async updateApplication(id, payload) {
    const index = applications.findIndex((a) => a.id === id);

    if (index === -1) return null;

    applications[index] = {
      ...applications[index],
      ...payload,
    };

    return applications[index];
  },

  async getMyApplications() {
    return applications;
  },

  async getMyApplicationStatus(id) {
    return applications.find((a) => a.id === id) || null;
  },

  async getMyDocuments(id) {
    const application = applications.find((a) => a.id === id);
    return application?.documents || [];
  },

  async withdrawApplication(id) {
    const application = applications.find((a) => a.id === id);

    if (!application) return null;

    application.status = "withdrawn";
    application.current_stage = "Withdrawn";

    return application;
  },

  async uploadDocument(file) {
    return URL.createObjectURL(file);
  },
};