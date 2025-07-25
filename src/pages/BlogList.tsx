import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import BlogNavbar from '@/components/blog/BlogNavbar';
import AuthModal from '@/components/auth/AuthModal';
import { 
  FaCalendar, FaClock, FaEye, FaArrowRight, FaCode, FaRocket, FaBrain, 
  FaSearch, FaFilter, FaHeart, FaComment, FaShare, FaBookmark,
  FaArrowLeft, FaTags, FaUser, FaThumbsUp, FaThumbsDown, FaLock, FaThumbtack
} from 'react-icons/fa';

const POSTS_PER_PAGE = 6;

const BlogList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { blogs, isLoading, likeBlog, bookmarkBlog, featuredBlogs } = useBlogs();
  
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // State management
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(blogs.map(blog => blog.categories).flat()))];

  // Get blogs to display based on auth status
  const displayBlogs = isAuthenticated ? blogs : featuredBlogs;

  // Filter and sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = displayBlogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || blog.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory && blog.status === 'published';
    });

    // Sort blogs
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, displayBlogs, isAuthenticated]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Backend Development':
      case 'Database':
      case 'DevOps':
        return FaCode;
      case 'Artificial Intelligence':
        return FaBrain;
      case 'Frontend Development':
        return FaRocket;
      default:
        return FaCode;
    }
  };

  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setAuthModalOpen(true);
      toast({
        title: "Authentication required",
        description: `Please login to ${action}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleLike = async (blogId: string) => {
    if (!requireAuth('like posts')) return;
    try {
      await likeBlog(blogId);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleBookmark = async (blogId: string) => {
    if (!requireAuth('bookmark posts')) return;
    try {
      await bookmarkBlog(blogId);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleShare = (blog: any) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: `/blog/${blog.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${blog.id}`);
      toast({
        title: "Link copied!",
        description: "Blog link copied to clipboard",
      });
    }
  };

  const handleReadMore = (blogId: string) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setAuthModalOpen(true);
      toast({
        title: "Login to read full articles",
        description: "Create an account to access all blog content",
        variant: "destructive"
      });
      return;
    }
    navigate(`/blog/${blogId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogNavbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 cyber-grid mt-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
              TECH BLOG
            </h1>
            <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-6 animate-neon-pulse"></div>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Deep dives into software engineering, cutting-edge technologies, and industry insights
            </p>
            {!isAuthenticated && (
              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-foreground/70 mb-2">
                  <FaLock className="inline mr-2" />
                  Login to access all blog content and features
                </p>
                <Button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  size="sm"
                  className="cyber-button bg-gradient-cyber"
                >
                  Get Started
                </Button>
              </div>
            )}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="cyber-border p-6 bg-background/30 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
                  <Input
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 cyber-input"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="cyber-input">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="cyber-input">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="liked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSortBy('newest');
                    setCurrentPage(1);
                  }}
                  className="cyber-button"
                >
                  <FaFilter className="mr-2" />
                  Clear
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {paginatedBlogs.map((blog, index) => {
                const CategoryIcon = getCategoryIcon(blog.categories[0] || '');
                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => handleReadMore(blog.id)}
                  >
                    <Card className="cyber-border h-full bg-background/20 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300 overflow-hidden">
                      {/* Featured Image Placeholder */}
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CategoryIcon className="text-6xl text-primary/30" />
                        </div>
                        {blog.isPinned && (
                          <div className="absolute top-4 right-4">
                            <Badge className="cyber-badge bg-gradient-cyber">
                              <FaThumbtack className="mr-1 h-3 w-3" />
                              Pinned
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <Badge className="mb-3 cyber-badge">
                          <CategoryIcon className="mr-2 h-3 w-3" />
                          {blog.categories[0]}
                        </Badge>
                        
                        <h3 className="font-orbitron text-xl font-bold text-foreground mb-3 group-hover:text-gradient-cyber transition-all duration-300">
                          {blog.title}
                        </h3>
                        
                        <p className="text-foreground/70 mb-4 leading-relaxed">
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs cyber-badge-outline">
                              <FaTags className="mr-1 h-2 w-2" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Blog Stats */}
                        <div className="flex items-center justify-between text-sm text-foreground/60 mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <FaEye className="mr-1 h-3 w-3" />
                              {blog.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <FaHeart className="mr-1 h-3 w-3" />
                              {blog.likes}
                            </span>
                          </div>
                          <span className="flex items-center">
                            <FaClock className="mr-1 h-3 w-3" />
                            {Math.ceil(blog.content.length / 1000)} min read
                          </span>
                        </div>

                        {/* Premium Content Notice */}
                        {!isAuthenticated && (
                          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                            <div className="flex items-center text-sm">
                              <FaLock className="mr-2 text-primary" />
                              <span className="text-foreground/80">Login required to read full article</span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLike(blog.id);
                              }}
                              className="h-8 px-2 text-foreground/60 hover:text-red-500"
                            >
                              <FaHeart className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleBookmark(blog.id);
                              }}
                              className="h-8 px-2 text-foreground/60 hover:text-yellow-500"
                            >
                              <FaBookmark className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShare(blog);
                              }}
                              className="h-8 px-2 text-foreground/60"
                            >
                              <FaShare className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReadMore(blog.id);
                            }}
                            className="text-primary hover:text-primary/80 font-medium cyber-button-sm"
                          >
                            {isAuthenticated ? 'Read More' : 'Login to Read'} 
                            <FaArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* No results */}
          {filteredAndSortedBlogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Card className="cyber-border p-12 bg-background/20 backdrop-blur-sm max-w-md mx-auto">
                <FaSearch className="text-4xl text-foreground/50 mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
                  No blogs found
                </h3>
                <p className="text-foreground/70 mb-4">
                  Try adjusting your search criteria or explore different categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSortBy('newest');
                  }}
                  className="cyber-button bg-gradient-cyber"
                >
                  Clear Filters
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authMode}
      />
    </div>
  );
};

export default BlogList;