import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useContacts } from '@/hooks/useContacts';
import ReplyForm from '@/components/admin/ReplyForm';
import {
  FaEnvelope, FaPhone, FaUser, FaCalendar, FaEye, FaReply,
  FaArrowLeft, FaTrash, FaSearch, FaFilter, FaCheckCircle, FaTimes
} from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

const ContactManagement = () => {
  const { contacts, updateContactStatus, deleteContact, isLoading } = useContacts();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const handleMarkAsRead = (id: string) => {
    updateContactStatus(id, 'read');
  };

  const handleMarkAsReplied = (id: string) => {
    updateContactStatus(id, 'replied');
  };

  const handleDeleteContact = (id: string) => {
    deleteContact(id);
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact(null);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || contact.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'read': return 'bg-yellow-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'portfolio': return '🌐';
      case 'linkedin': return '💼';
      case 'github': return '⚡';
      case 'referral': return '👥';
      default: return '📧';
    }
  };

  const stats = [
    { label: 'Total Messages', value: contacts.length, color: 'text-neon-cyan' },
    { label: 'Unread', value: contacts.filter(c => c.status === 'unread').length, color: 'text-red-400' },
    { label: 'Replied', value: contacts.filter(c => c.status === 'replied').length, color: 'text-green-400' },
    { label: 'This Week', value: contacts.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length, color: 'text-neon-purple' }
  ];

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-gradient-cyber mb-2">
              CONTACT MANAGEMENT
            </h1>
            <p className="text-foreground/60">Manage inquiries and client communications</p>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="cyber-button">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cyber-border p-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold font-orbitron ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-foreground/60 text-sm">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="cyber-border p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 cyber-border bg-background"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded cyber-border bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-4 py-2 rounded cyber-border bg-background text-foreground"
              >
                <option value="all">All Sources</option>
                <option value="portfolio">Portfolio</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact List */}
          <div className="space-y-4">
            <h2 className="font-orbitron text-xl font-bold text-primary mb-4">
              Messages ({filteredContacts.length})
            </h2>
            {isLoading ? (
              <Card className="cyber-border p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-foreground/60">Loading contacts...</p>
              </Card>
            ) : filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedContact(contact);
                  if (contact.status === 'unread') {
                    handleMarkAsRead(contact.id);
                  }
                }}
                className={`cursor-pointer ${selectedContact?.id === contact.id ? 'ring-2 ring-primary' : ''}`}
              >
                <Card className={`cyber-border p-4 hover:shadow-glow-cyan transition-all duration-300 ${contact.status === 'unread' ? 'border-yellow-400' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(contact.status)}`}></div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-foreground/60">{contact.email}</p>
                      </div>
                    </div>
                     <div className="text-right">
                       <div className="text-xs text-foreground/40">{new Date(contact.createdAt).toLocaleDateString()}</div>
                       <div className="text-xs">{getSourceIcon(contact.source)}</div>
                     </div>
                  </div>
                  <div className="mb-2">
                    <h4 className="font-medium text-sm text-foreground mb-1">{contact.subject}</h4>
                    <p className="text-xs text-foreground/70 line-clamp-2">{contact.message}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={contact.status === 'unread' ? 'destructive' : contact.status === 'replied' ? 'default' : 'secondary'}>
                      {contact.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {contact.source}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}

            {filteredContacts.length === 0 && (
              <Card className="cyber-border p-12 text-center">
                <h3 className="font-orbitron text-xl font-bold text-foreground/60 mb-2">
                  No messages found
                </h3>
                <p className="text-foreground/40">
                  Try adjusting your search or filter criteria
                </p>
              </Card>
            )}
          </div>

          {/* Contact Details */}
          <div className="sticky top-6">
            {selectedContact ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={selectedContact.id}
              >
                <Card className="cyber-border p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-orbitron text-xl font-bold text-primary mb-2">
                        {selectedContact.firstName} {selectedContact.lastName}
                      </h2>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-foreground/70">
                          <FaEnvelope className="mr-2" />
                          {selectedContact.email}
                        </div>
                        <div className="flex items-center text-foreground/70">
                          <FaPhone className="mr-2" />
                          {selectedContact.phone}
                        </div>
                         <div className="flex items-center text-foreground/70">
                           <FaCalendar className="mr-2" />
                           {new Date(selectedContact.createdAt).toLocaleDateString()}
                         </div>
                      </div>
                    </div>
                    <Badge variant={selectedContact.status === 'unread' ? 'destructive' : selectedContact.status === 'replied' ? 'default' : 'secondary'}>
                      {selectedContact.status}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Subject:</h3>
                    <p className="text-foreground/80">{selectedContact.subject}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Message:</h3>
                    <div className="bg-card p-4 rounded cyber-border">
                      <p className="text-foreground/80 leading-relaxed">{selectedContact.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {selectedContact.status !== 'replied' && (
                      <Button
                        onClick={() => handleMarkAsReplied(selectedContact.id)}
                        className="cyber-button bg-green-600 hover:bg-green-700"
                      >
                        <FaCheckCircle className="mr-2" />
                        Mark as Replied
                      </Button>
                    )}
                    <ReplyForm contactId={selectedContact.id} contactEmail={selectedContact.email} />
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteContact(selectedContact.id)}
                      size="sm"
                    >
                      <FaTrash className="mr-2" />
                      Delete Contact
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="cyber-border p-12 text-center">
                <FaEnvelope className="text-6xl text-foreground/20 mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold text-foreground/60 mb-2">
                  Select a message
                </h3>
                <p className="text-foreground/40">
                  Choose a message from the list to view details
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;