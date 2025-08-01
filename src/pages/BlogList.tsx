import React from 'react';
import { AnimatePresence } from 'framer-motion';
import BlogNavbar from '@/components/blog/BlogNavbar';
import AuthModal from '@/components/auth/AuthModal';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbNav from '@/components/navigation/BreadcrumbNav';
import BlogListHero from '@/components/blog/BlogListHero';
import BlogFilters from '@/components/blog/BlogFilters';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import { useBlogList } from '@/hooks/useBlogList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaSearch, FaPlus } from 'react-icons/fa';

const BlogList = () => {
  const {
    searchTerm,
    selectedCategory,
    sortBy,
    currentPage,
    totalPages,
    paginatedBlogs,
    categories,
    isLoading,
    authModalOpen,
    authMode,
    breadcrumbItems,
    isAuthenticated,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
    setAuthModalOpen,
    handleLike,
    handleBookmark,
    handleShare,
    handleReadMore,
    handleGetStarted,
    handleClearFilters
  } = useBlogList();

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
    <>
      {/* SEO Head */}
      <SEOHead
        title="Tech Blog - Ashish Jaiswal | Software Engineering & Development"
        description="Deep dives into software engineering, cutting-edge technologies, and industry insights. Expert tutorials on React, Node.js, AI, and modern web development."
        keywords="software engineering, web development, React, Node.js, AI, tutorials, tech blog, programming"
        canonical="/blogs"
        ogType="website"
      />

      <div className="min-h-screen bg-background">
        <BlogNavbar />
        
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto max-w-7xl px-6 py-4 mt-20">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
        
        {/* Hero Section */}
        <BlogListHero 
          isAuthenticated={isAuthenticated}
          onGetStarted={handleGetStarted}
        />

        {/* Search and Filters */}
        <div className="container mx-auto max-w-7xl px-6">
          <BlogFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Blog Posts Grid */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedBlogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    index={index}
                    isAuthenticated={isAuthenticated}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                    onReadMore={handleReadMore}
                  />
                ))}
              </div>
            </AnimatePresence>

            {/* No results */}
            {paginatedBlogs.length === 0 && (
              <Card className="cyber-border p-12 bg-background/20 backdrop-blur-sm max-w-md mx-auto text-center">
                <FaSearch className="text-4xl text-foreground/50 mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
                  No blogs found
                </h3>
                <p className="text-foreground/70 mb-4">
                  Try adjusting your search criteria or explore different categories.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="cyber-button bg-gradient-cyber"
                >
                  Clear Filters
                </Button>
              </Card>
            )}

            {/* Pagination */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authMode}
      />
    </>
  );
};

export default BlogList;