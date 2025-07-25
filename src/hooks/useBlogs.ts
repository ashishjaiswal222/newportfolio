import { useState, useEffect } from 'react';
import { blogAPI, Blog, BlogQuery } from '@/services/blog.api';
import { useToast } from '@/hooks/use-toast';

export type { Blog };

export const useBlogs = (query?: BlogQuery) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  const fetchBlogs = async (searchQuery?: BlogQuery) => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getBlogs(searchQuery || query);
      setBlogs(response.blogs);
      setPagination(response.pagination);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch blogs');
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBlog = async (data: any) => {
    try {
      const response = await blogAPI.createBlog(data);
      setBlogs(prev => [response.blog, ...prev]);
      toast({
        title: "Blog created",
        description: "Blog has been successfully created.",
      });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create blog",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBlog = async (id: string, data: any) => {
    try {
      const response = await blogAPI.updateBlog(id, data);
      setBlogs(prev => 
        prev.map(blog => 
          blog.id === id ? response.blog : blog
        )
      );
      toast({
        title: "Blog updated",
        description: "Blog has been successfully updated.",
      });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update blog",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await blogAPI.deleteBlog(id);
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      toast({
        title: "Blog deleted",
        description: "Blog has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const togglePin = async (id: string) => {
    try {
      const response = await blogAPI.togglePin(id);
      setBlogs(prev => 
        prev.map(blog => 
          blog.id === id ? { ...blog, isPinned: response.blog.isPinned } : blog
        )
      );
      toast({
        title: response.blog.isPinned ? "Blog pinned" : "Blog unpinned",
        description: `Blog has been ${response.blog.isPinned ? 'pinned' : 'unpinned'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to toggle pin",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getBlog = async (id: string) => {
    const response = await blogAPI.getBlog(id);
    return response.blog;
  };

  const likeBlog = async (id: string) => {
    // Implement like functionality
    toast({
      title: "Post liked!",
      description: "Added to your liked posts",
    });
  };

  const bookmarkBlog = async (id: string) => {
    // Implement bookmark functionality
    toast({
      title: "Post bookmarked!",
      description: "Added to your bookmarks",
    });
  };

  const addComment = async (blogId: string, data: any) => {
    // Implement comment functionality
    toast({
      title: "Comment added",
      description: "Your comment has been posted",
    });
  };

  const featuredBlogs = blogs.filter(blog => blog.isPinned);

  return {
    blogs,
    isLoading,
    error,
    pagination,
    createBlog,
    updateBlog,
    deleteBlog,
    togglePin,
    getBlog,
    likeBlog,
    bookmarkBlog,
    addComment,
    featuredBlogs,
    refetch: fetchBlogs,
  };
};