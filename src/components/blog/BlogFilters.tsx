import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface BlogFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({
  searchTerm,
  selectedCategory,
  sortBy,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClearFilters
}) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 cyber-input"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
          <Select value={sortBy} onValueChange={onSortChange}>
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
            onClick={onClearFilters}
            className="cyber-button"
          >
            <FaFilter className="mr-2" />
            Clear
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default BlogFilters; 