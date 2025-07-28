import api from './api';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  source: 'portfolio' | 'linkedin' | 'github' | 'referral' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
}

export interface UpdateContactStatusData {
  status: 'read' | 'replied';
}

export const contactAPI = {
  getContacts: async () => {
    const response = await api.get('/api/contacts');
    return response.data;
  },

  getContact: async (id: string) => {
    const response = await api.get(`/api/contacts/${id}`);
    return response.data;
  },

  createContact: async (data: CreateContactData) => {
    const response = await api.post('/api/contacts', data);
    return response.data;
  },

  updateContactStatus: async (id: string, data: UpdateContactStatusData) => {
    const response = await api.put(`/api/contacts/${id}/status`, data);
    return response.data;
  },

  deleteContact: async (id: string) => {
    const response = await api.delete(`/api/contacts/${id}`);
    return response.data;
  },

  replyToContact: async (id: string, message: string, attachments?: File[]) => {
    const formData = new FormData();
    formData.append('message', message);
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
    const response = await api.post(`/api/contacts/${id}/reply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};