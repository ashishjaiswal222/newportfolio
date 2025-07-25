import api from './api';

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  avatar?: string;
  cv?: string;
}

export interface AboutInfo {
  description: string;
  education: {
    degree: string;
    institution: string;
    year: string;
    description?: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
}

export interface PortfolioContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  about: AboutInfo;
  skills: {
    category: string;
    items: string[];
  }[];
  services: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const contentAPI = {
  // Personal Information
  getPersonalInfo: async () => {
    const response = await api.get('/content/personal');
    return response.data;
  },

  updatePersonalInfo: async (data: Partial<PersonalInfo>) => {
    const response = await api.put('/content/personal', data);
    return response.data;
  },

  // About Section
  getAboutInfo: async () => {
    const response = await api.get('/content/about');
    return response.data;
  },

  updateAboutInfo: async (data: Partial<AboutInfo>) => {
    const response = await api.put('/content/about', data);
    return response.data;
  },

  // Portfolio Content
  getPortfolioContent: async () => {
    const response = await api.get('/content/portfolio');
    return response.data;
  },

  updatePortfolioContent: async (data: Partial<PortfolioContent>) => {
    const response = await api.put('/content/portfolio', data);
    return response.data;
  },

  // Skills
  getSkills: async () => {
    const response = await api.get('/content/skills');
    return response.data;
  },

  updateSkills: async (skills: any[]) => {
    const response = await api.put('/content/skills', { skills });
    return response.data;
  },

  // Experience
  getExperience: async () => {
    const response = await api.get('/content/experience');
    return response.data;
  },

  updateExperience: async (experience: any[]) => {
    const response = await api.put('/content/experience', { experience });
    return response.data;
  },
};