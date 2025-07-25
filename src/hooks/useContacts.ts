import { useState, useEffect } from 'react';
import { contactAPI, Contact } from '@/services/contact.api';
import { useToast } from '@/hooks/use-toast';

export type { Contact };

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await contactAPI.getContacts();
      setContacts(response.contacts || response || []);
      setError(null);
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch contacts';
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitContact = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    source?: string;
  }) => {
    try {
      const response = await contactAPI.createContact(data);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      return response;
    } catch (error: unknown) {
      let errorMessage = "Failed to send message";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateContactStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      await contactAPI.updateContactStatus(id, { status });
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        )
      );
    } catch (error: unknown) {
      let errorMessage = "Failed to update contact status";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await contactAPI.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (error: unknown) {
      let errorMessage = "Failed to delete contact";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    isLoading,
    error,
    submitContact,
    updateContactStatus,
    deleteContact,
    refetch: fetchContacts,
  };
};