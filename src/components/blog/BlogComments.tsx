import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { FaThumbsUp, FaReply, FaFlag } from 'react-icons/fa';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

interface BlogCommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
}

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
}> = ({ comment, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent, comment.id);
    setReplyContent('');
    setShowReply(false);
    toast({
      title: 'Reply posted!',
      description: 'Your reply has been added successfully.',
    });
  };

  return (
    <div className="border-b border-border pb-6 last:border-b-0">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-foreground">{comment.author.name}</span>
            <span className="text-sm text-foreground/60">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-foreground/80 mb-3">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="cyber-button" onClick={() => setShowReply((v) => !v)}>
              <FaReply className="mr-1" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="cyber-button text-foreground/50">
              <FaFlag className="mr-1" />
              Report
            </Button>
          </div>
          {showReply && (
            <div className="mt-4">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="cyber-input mb-2"
                rows={3}
              />
              <Button
                onClick={handleReplySubmit}
                className="cyber-button bg-gradient-cyber"
                disabled={!replyContent.trim()}
              >
                Post Reply
              </Button>
            </div>
          )}
          {/* Recursively render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogComments: React.FC<BlogCommentsProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
    toast({
      title: 'Comment posted!',
      description: 'Your comment has been added successfully.',
    });
  };

  const handleReply = (content: string, parentId: string) => {
    onAddComment(content, parentId);
  };

  return (
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
                <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogComments; 