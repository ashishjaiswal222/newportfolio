import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import BlogNavbar from '@/components/blog/BlogNavbar';
import UserProfile from '@/components/blog/UserProfile';
import AuthModal from '@/components/auth/AuthModal';
import { 
  FaCalendar, FaClock, FaEye, FaArrowLeft, FaCode, FaRocket, FaBrain, 
  FaHeart, FaComment, FaShare, FaBookmark, FaTags, FaUser,
  FaThumbsUp, FaThumbsDown, FaReply, FaFlag
} from 'react-icons/fa';


// Mock comments data
const mockComments = [
  {
    id: 1,
    blogId: 1,
    author: "John Doe",
    avatar: "/api/placeholder/40/40",
    content: "Excellent article! The Docker configuration examples are really helpful. I've been struggling with multi-stage builds and this cleared things up.",
    date: "2024-12-16",
    likes: 12,
    replies: [
      {
        id: 101,
        author: "Ashish Jaiswal",
        avatar: "/api/placeholder/40/40",
        content: "Thanks John! Multi-stage builds can definitely be tricky at first. Glad this helped clarify things for you.",
        date: "2024-12-16",
        likes: 5
      }
    ]
  },
  {
    id: 2,
    blogId: 1,
    author: "Sarah Chen",
    avatar: "/api/placeholder/40/40",
    content: "Great insights on service communication patterns. Have you tried using gRPC for inter-service communication? Would love to see a follow-up article on that.",
    date: "2024-12-15",
    likes: 8,
    replies: []
  },
  {
    id: 3,
    blogId: 1,
    author: "Mike Johnson",
    avatar: "/api/placeholder/40/40",
    content: "The Kubernetes deployment yaml is exactly what I needed. Quick question: how do you handle service discovery in your setup?",
    date: "2024-12-15",
    likes: 6,
    replies: []
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { getBlog, likeBlog, addComment } = useBlogs();

  // State management
  const [blog, setBlog] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Related blogs
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const blogData = await getBlog(id);
        setBlog(blogData);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, getBlog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="cyber-border p-12 bg-background/20 backdrop-blur-sm max-w-2xl mx-auto text-center">
          <h2 className="font-orbitron text-2xl font-bold text-foreground mb-4">
            Blog post not found
          </h2>
          <p className="text-foreground/70 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate(-1)} variant="outline" className="cyber-button">
              <FaArrowLeft className="mr-2" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/blogs')} className="cyber-button bg-gradient-cyber">
              Browse All Blogs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
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

  const handleLike = async () => {
    if (!requireAuth('like posts')) return;
    try {
      await likeBlog(blog.id);
      setBlog((prev: any) => ({ ...prev, likes: prev.likes + 1 }));
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth('comment')) return;
    if (!newComment.trim()) return;

    try {
      await addComment(blog.id, { content: newComment });
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      // Error handled by hook
    }
  };

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

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleBookmark = async () => {
    if (!requireAuth('bookmark posts')) return;
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Post bookmarked!",
      description: isBookmarked ? "Removed from bookmarks" : "Added to your bookmarks",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Blog link copied to clipboard",
      });
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      blogId: blog.id,
      author: "Anonymous User",
      avatar: "/api/placeholder/40/40",
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast({
      title: "Comment posted!",
      description: "Your comment has been added successfully.",
    });
  };

  const CategoryIcon = getCategoryIcon(blog.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
      >
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="cyber-button"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Link to="/blogs" className="text-foreground/70 hover:text-foreground transition-colors">
                All Blogs
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`cyber-button ${isLiked ? 'text-red-500' : ''}`}
              >
                <FaHeart className={isLiked ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="ghost"
                onClick={handleBookmark}
                className={`cyber-button ${isBookmarked ? 'text-yellow-500' : ''}`}
              >
                <FaBookmark className={isBookmarked ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="ghost"
                onClick={handleShare}
                className="cyber-button"
              >
                <FaShare />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="py-12 px-6 cyber-grid">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Category Badge */}
            <div className="mb-6">
              <Badge className="cyber-button bg-gradient-cyber text-lg px-4 py-2">
                <CategoryIcon className="mr-2" />
                {blog.category}
              </Badge>
              {blog.featured && (
                <Badge className="ml-2 bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="font-orbitron text-3xl md:text-5xl font-bold text-gradient-cyber mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-foreground/70 mb-8">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCalendar className="text-sm" />
                <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaClock className="text-sm" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaEye className="text-sm" />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaHeart className="text-sm" />
                <span>{likeCount} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaComment className="text-sm" />
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <FaTags className="mr-1 text-xs" />
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="cyber-border p-8 md:p-12 bg-background/30 backdrop-blur-sm">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-orbitron
                  prose-p:text-foreground/80 prose-p:leading-relaxed
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-background/50 prose-pre:border prose-pre:border-border
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-primary prose-blockquote:text-foreground/70
                  prose-strong:text-foreground prose-em:text-foreground/80"
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>').replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') }}
              />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="cyber-border p-8 bg-background/30 backdrop-blur-sm">
              <h3 className="font-orbitron text-2xl font-bold text-foreground mb-6">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-8">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="cyber-input mb-4"
                  rows={4}
                />
                <Button
                  onClick={handleCommentSubmit}
                  className="cyber-button bg-gradient-cyber"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-foreground">{comment.author}</span>
                          <span className="text-sm text-foreground/60">{comment.date}</span>
                        </div>
                        <p className="text-foreground/80 mb-3">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="cyber-button">
                            <FaThumbsUp className="mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="cyber-button">
                            <FaReply className="mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="cyber-button text-foreground/50">
                            <FaFlag className="mr-1" />
                            Report
                          </Button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.avatar} />
                                  <AvatarFallback>{reply.author[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-foreground text-sm">{reply.author}</span>
                                    <span className="text-xs text-foreground/60">{reply.date}</span>
                                  </div>
                                  <p className="text-foreground/80 text-sm mb-2">{reply.content}</p>
                                  <Button variant="ghost" size="sm" className="cyber-button text-xs">
                                    <FaThumbsUp className="mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="font-orbitron text-2xl font-bold text-foreground mb-8 text-center">
                Related Posts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog, index) => {
                  const CategoryIcon = getCategoryIcon(relatedBlog.category);
                  return (
                    <motion.div
                      key={relatedBlog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link to={`/blog/${relatedBlog.id}`}>
                        <Card className="cyber-border h-full bg-background/30 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300 overflow-hidden group">
                          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CategoryIcon className="text-4xl text-primary/30" />
                            </div>
                          </div>
                          <div className="p-4">
                            <Badge variant="secondary" className="mb-2">
                              {relatedBlog.category}
                            </Badge>
                            <h4 className="font-orbitron font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedBlog.title}
                            </h4>
                            <p className="text-foreground/70 text-sm line-clamp-2 mb-3">
                              {relatedBlog.excerpt}
                            </p>
                            <div className="flex items-center text-xs text-foreground/60 space-x-3">
                              <span>{relatedBlog.readTime}</span>
                              <span>{relatedBlog.views} views</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;