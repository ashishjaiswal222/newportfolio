import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { contactAPI } from '@/services/contact.api';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitContact = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Use the actual API
      await contactAPI.createContact(data);
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitContact, isSubmitting };
};