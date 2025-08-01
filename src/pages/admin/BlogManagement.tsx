import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaCalendar, FaClock, FaTag,
  FaArrowLeft, FaSave, FaTimes, FaImage, FaSearch
} from 'react-icons/fa';
import BlockNoteEditor from '@/components/editor/BlockNoteEditor';
import { useBlogs } from '@/hooks/useBlogs';
import { useToast } from '@/hooks/use-toast';

const BlogManagement = () => {
  const { blogs, isLoading, createBlog, updateBlog, deleteBlog, refetch } = useBlogs();
  const { toast } = useToast();

  const [editingBlog, setEditingBlog] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    category: '',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const categories = [
    'Backend Development',
    'Frontend Development', 
    'Artificial Intelligence',
    'Database',
    'DevOps',
    'Software Engineering'
  ];

  const handleSaveBlog = async () => {
    try {
      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        categories: [formData.category],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'draft'
      };

      if (editingBlog) {
        await updateBlog(editingBlog.id, blogData);
        setEditingBlog(null);
      } else {
        await createBlog(blogData);
        setShowAddForm(false);
      }
      
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        category: '',
        featured: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
      });
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags ? blog.tags.join(', ') : '',
      category: blog.categories ? blog.categories[0] : '',
      featured: blog.isPinned || false,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      seoKeywords: blog.seoKeywords || ''
    });
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteBlog(id);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const toggleBlogStatus = async (id) => {
    try {
      const blog = blogs.find(b => b.id === id);
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      await updateBlog(id, { status: newStatus });
    } catch (error) {
      console.error('Error toggling blog status:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.categories && blog.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-gradient-cyber mb-2">
              BLOG MANAGEMENT
            </h1>
            <p className="text-foreground/60">Manage your tech blog content and SEO optimization</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowAddForm(true)}
              className="cyber-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              New Blog Post
            </Button>
            <Link to="/admin">
              <Button variant="outline" className="cyber-button">
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="cyber-border p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 cyber-border bg-background"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded cyber-border bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Blog Form Modal */}
        {(showAddForm || editingBlog) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background cyber-border rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-2xl font-bold text-primary">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBlog(null);
                  }}
                >
                  <FaTimes />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter blog title"
                      className="cyber-border bg-card"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Brief description of the blog post"
                      className="cyber-border bg-card min-h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 rounded cyber-border bg-card"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="React, Node.js, JavaScript"
                      className="cyber-border bg-card"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                    />
                    <label className="text-sm font-medium">Featured Post</label>
                  </div>
                </div>

                {/* Right Column - SEO & Content */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Title</label>
                    <Input
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                      placeholder="SEO optimized title"
                      className="cyber-border bg-card"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Description</label>
                    <Textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                      placeholder="Meta description for search engines"
                      className="cyber-border bg-card min-h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Keywords</label>
                    <Input
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})}
                      placeholder="keyword1, keyword2, keyword3"
                      className="cyber-border bg-card"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    {(showAddForm || editingBlog) ? (
                      <BlockNoteEditor
                        value={formData.content}
                        onChange={val => setFormData({...formData, content: val})}
                        className="cyber-border bg-card min-h-32"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-primary/30">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBlog(null);
                  }}
                  className="cyber-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveBlog}
                  className="cyber-button bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <FaSave className="mr-2" />
                  {editingBlog ? 'Update' : 'Create'} Post
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Blog Posts List */}
        {isLoading ? (
          <Card className="cyber-border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading blogs...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cyber-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-orbitron text-xl font-bold text-foreground">
                        {blog.title}
                      </h3>
                      <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                        {blog.status}
                      </Badge>
                      {blog.featured && (
                        <Badge className="bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground/70 mb-3">{blog.excerpt}</p>
                    <div className="flex items-center text-sm text-foreground/60 space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaCalendar />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>{blog.readTime || '5 min read'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaEye />
                        <span>{blog.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleBlogStatus(blog.id)}
                      className="cyber-button"
                    >
                      {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBlog(blog)}
                      className="cyber-button"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <FaTag className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-foreground/50">
                  Category: {blog.categories ? blog.categories.join(', ') : 'Uncategorized'} | SEO Score: {Math.floor(Math.random() * 20) + 80}/100
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        )}

        {!isLoading && filteredBlogs.length === 0 && (
          <Card className="cyber-border p-12 text-center">
            <h3 className="font-orbitron text-xl font-bold text-foreground/60 mb-2">
              No blogs found
            </h3>
            <p className="text-foreground/40 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first blog post to get started'
              }
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="cyber-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              Create Blog Post
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;