import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface BlogContentProps {
  content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  return (
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
              dangerouslySetInnerHTML={{ 
                __html: content.replace(/\n/g, '<br>').replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') 
              }}
            />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogContent; 