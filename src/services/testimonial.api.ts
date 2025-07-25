import api from './api';

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestimonialData {
  name: string;
  email: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export interface UpdateTestimonialStatusData {
  status: 'approved' | 'rejected';
}

export const testimonialAPI = {
  getTestimonials: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },

  getApprovedTestimonials: async () => {
    const response = await api.get('/testimonials?status=approved');
    return response.data;
  },

  createTestimonial: async (data: CreateTestimonialData) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  updateTestimonialStatus: async (id: string, data: UpdateTestimonialStatusData) => {
    const response = await api.put(`/testimonials/${id}/status`, data);
    return response.data;
  },

  deleteTestimonial: async (id: string) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};