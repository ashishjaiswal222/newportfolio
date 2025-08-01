import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import BlogNavbar from '@/components/blog/BlogNavbar';
import AuthModal from '@/components/auth/AuthModal';
import SEOHead from '@/components/seo/SEOHead';
import { BlogPostingSchema } from '@/components/seo/StructuredData';
import BreadcrumbNav from '@/components/navigation/BreadcrumbNav';
import BlogNavigation from '@/components/blog/BlogNavigation';
import BlogHero from '@/components/blog/BlogHero';
import BlogContent from '@/components/blog/BlogContent';
import BlogComments from '@/components/blog/BlogComments';
import RelatedBlogs from '@/components/blog/RelatedBlogs';
import { useBlogDetail } from '@/hooks/useBlogDetail';
import { FaArrowLeft } from 'react-icons/fa';

const BlogDetail = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const {
    blog,
    comments,
    newComment,
    loading,
    authModalOpen,
    relatedBlogs,
    isLiked,
    isBookmarked,
    likeCount,
    breadcrumbItems,
    setNewComment,
    setAuthModalOpen,
    handleLike,
    handleBookmark,
    handleShare,
    handleAddComment,
    requireAuth
  } = useBlogDetail();

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

  return (
    <>
      {/* SEO Head */}
      <SEOHead
        title={blog.seoTitle || blog.title}
        description={blog.seoDescription || blog.excerpt}
        keywords={blog.seoKeywords || blog.tags?.join(', ')}
        canonical={`/blog/${blog.id}`}
        ogType="article"
        ogImage={blog.featuredImage}
        twitterCard="summary_large_image"
      />
      
      {/* Structured Data */}
      <BlogPostingSchema
        title={blog.title}
        description={blog.excerpt}
        author={blog.author}
        publishedAt={blog.publishedAt || blog.createdAt}
        modifiedAt={blog.updatedAt}
        image={blog.featuredImage}
        url={`https://ashishjaiswal.dev/blog/${blog.id}`}
        readTime={blog.readTime}
        category={blog.category}
        tags={blog.tags}
      />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <BlogNavigation
          onLike={handleLike}
          onBookmark={handleBookmark}
          onShare={handleShare}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
        />

        {/* Breadcrumb Navigation */}
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <BlogHero 
          blog={blog}
          likeCount={likeCount}
          commentsCount={comments.length}
        />

        {/* Content */}
        {isAuthenticated ? (
          <BlogContent content={blog.content} />
        ) : (
          <div className="container mx-auto max-w-4xl px-6 py-12">
            <div className="prose prose-lg max-w-none">
              {/* Show excerpt/preview for unauthenticated users */}
              <div className="text-foreground/80 leading-relaxed mb-8">
                {blog.excerpt}
              </div>
              
              {/* Auth required notice */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-3">
                  Continue Reading
                </h3>
                <p className="text-foreground/70 mb-6">
                  Sign up or log in to read the full article and access all premium content.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="cyber-button bg-gradient-cyber px-6 py-3 rounded-lg font-medium"
                >
                  Sign Up to Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section - Only for authenticated users */}
        {isAuthenticated && (
          <BlogComments
            comments={comments}
            onAddComment={handleAddComment}
          />
        )}

        {/* Related Posts */}
        <RelatedBlogs relatedBlogs={relatedBlogs} />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  );
};

export default BlogDetail;