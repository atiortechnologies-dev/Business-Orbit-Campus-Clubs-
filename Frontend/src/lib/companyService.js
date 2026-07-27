const STORAGE_KEY = "companyOpportunities";

const getData = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const companyService = {
  async createOpportunity(data) {
    const opportunities = getData();

    const opportunity = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applications_count: 0,
      new_count: 0,
      ...data,
    };

    opportunities.push(opportunity);

    saveData(opportunities);

    return opportunity;
  },

  async updateOpportunity(id, data) {
    const opportunities = getData();

    const index = opportunities.findIndex((item) => item.id === id);

    if (index === -1) return null;

    opportunities[index] = {
      ...opportunities[index],
      ...data,
    };

    saveData(opportunities);

    return opportunities[index];
  },

  async getOpportunity(id) {
    const opportunities = getData();

    return opportunities.find((item) => item.id === id) || null;
  },

  async listOpportunities() {
    return getData();
  },

  async deleteOpportunity(id) {
    const opportunities = getData().filter(
      (item) => item.id !== id
    );

    saveData(opportunities);

    return true;
  },
};