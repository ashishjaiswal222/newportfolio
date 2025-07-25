import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { contactAPI } from '@/services/contact.api';
import { FaReply, FaPaperclip } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

interface ReplyFormProps {
  contactId: string;
  contactEmail: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ contactId, contactEmail }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await contactAPI.replyToContact(contactId, message, attachments);
      
      toast({
        title: "Reply Sent",
        description: `Reply sent successfully to ${contactEmail}`,
      });
      
      setMessage('');
      setAttachments([]);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="cyber-button bg-primary hover:bg-primary/90"
      >
        <FaReply className="mr-2" />
        Reply to Contact
      </Button>
    );
  }

  return (
    <Card className="cyber-border p-4">
      <h4 className="font-semibold text-foreground mb-4">Reply to {contactEmail}</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Message
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply here..."
            className="cyber-border bg-card min-h-24"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Attachments (Optional)
          </label>
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            className="cyber-border bg-card"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center text-sm text-foreground/70">
                  <FaPaperclip className="mr-2" />
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cyber-button bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FaReply className="mr-2" />
                Send Reply
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setMessage('');
              setAttachments([]);
            }}
            className="cyber-button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReplyForm;