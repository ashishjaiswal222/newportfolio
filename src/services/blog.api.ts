import api from './api';

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isPinned: boolean;
  views: number;
  likes: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  isPinned?: boolean;
}

export interface BlogQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  status?: string;
  sort?: 'latest' | 'oldest' | 'popular' | 'title';
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  blogId: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  content: string;
  parentId?: string;
}

export interface ModerateCommentData {
  status: 'approved' | 'rejected';
}

export const blogAPI = {
  // Blog CRUD
  getBlogs: async (query?: BlogQuery) => {
    const response = await api.get('/blogs', { params: query });
    return response.data;
  },

  getFeaturedBlogs: async () => {
    const response = await api.get('/blogs/featured');
    return response.data;
  },

  getBlog: async (id: string) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  getRelatedBlogs: async (id: string) => {
    const response = await api.get(`/blogs/${id}/related`);
    return response.data;
  },

  createBlog: async (data: CreateBlogData) => {
    const response = await api.post('/blogs', data);
    return response.data;
  },

  updateBlog: async (id: string, data: UpdateBlogData) => {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  },

  updateBlogStatus: async (id: string, status: 'published' | 'draft') => {
    const response = await api.patch(`/blogs/${id}/status`, { status });
    return response.data;
  },

  updateBlogSEO: async (id: string, seoData: any) => {
    const response = await api.put(`/blogs/${id}/seo`, seoData);
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  togglePin: async (id: string) => {
    const response = await api.put(`/blogs/${id}/pin`);
    return response.data;
  },

  likeBlog: async (id: string) => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },

  bookmarkBlog: async (id: string) => {
    const response = await api.post(`/blogs/${id}/bookmark`);
    return response.data;
  },

  shareBlog: async (id: string) => {
    const response = await api.post(`/blogs/${id}/share`);
    return response.data;
  },

  getBlogAnalytics: async (id: string) => {
    const response = await api.get(`/blogs/${id}/analytics`);
    return response.data;
  },

  // Comments
  getComments: async (blogId: string) => {
    const response = await api.get(`/blogs/${blogId}/comments`);
    return response.data;
  },

  createComment: async (blogId: string, data: CreateCommentData) => {
    const response = await api.post(`/blogs/${blogId}/comments`, data);
    return response.data;
  },

  updateComment: async (id: string, content: string) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  moderateComment: async (id: string, data: ModerateCommentData) => {
    const response = await api.put(`/comments/${id}/moderate`, data);
    return response.data;
  },
};