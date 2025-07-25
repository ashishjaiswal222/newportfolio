import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContactForm, ContactFormData } from "@/hooks/useContactForm";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';
import { Loader2 } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  source: z.string().optional(),
});

// type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const { submitContact, isSubmitting } = useContactForm();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      source: "portfolio",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    const success = await submitContact(data);
    if (success) {
      form.reset();
    }
  };
  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: "ashishjaiswal0701@gmail.com",
      href: "mailto:ashishjaiswal0701@gmail.com"
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: "+91 6394860044",
      href: "tel:+916394860044"
    },
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: "Mumbai, Maharashtra, India",
      href: "#"
    }
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/ashishjaiswal222",
      color: "hover:text-neon-cyan"
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn", 
      href: "https://www.linkedin.com/in/ashish-jaiswal-developer",
      color: "hover:text-neon-purple"
    },
    {
      icon: SiLeetcode,
      label: "LeetCode",
      href: "https://leetcode.com/u/ashishjaiswal22214345/",
      color: "hover:text-neon-green"
    },
    {
      icon: SiHackerrank,
      label: "HackerRank",
      href: "https://www.hackerrank.com/profile/ashishjaiswal223",
      color: "hover:text-neon-pink"
    }
  ];

  return (
    <section className="py-20 cyber-grid">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
            GET IN TOUCH
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-6"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Ready to build the future together? Let's connect and discuss how we can create 
            something amazing with cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="cyber-border p-8">
              <h3 className="font-orbitron text-2xl font-bold text-primary mb-6">
                SEND MESSAGE
              </h3>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      First Name
                    </label>
                    <Input 
                      {...form.register("firstName")}
                      className="cyber-border bg-card"
                      placeholder="Your first name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Last Name
                    </label>
                    <Input 
                      {...form.register("lastName")}
                      className="cyber-border bg-card"
                      placeholder="Your last name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Email
                  </label>
                  <Input 
                    {...form.register("email")}
                    type="email"
                    className="cyber-border bg-card"
                    placeholder="your.email@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Phone Number <span className="text-foreground/50">(Optional)</span>
                  </label>
                  <Input 
                    {...form.register("phone")}
                    type="tel"
                    className="cyber-border bg-card"
                    placeholder="+91 XXXXXXXXXX"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Subject
                  </label>
                  <Input 
                    {...form.register("subject")}
                    className="cyber-border bg-card"
                    placeholder="What's this about?"
                  />
                  {form.formState.errors.subject && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Message
                  </label>
                  <Textarea 
                    {...form.register("message")}
                    className="cyber-border bg-card min-h-32"
                    placeholder="Tell me about your project or opportunity..."
                  />
                  {form.formState.errors.message && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="cyber-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    "SEND MESSAGE"
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <Card className="cyber-border p-8">
              <h3 className="font-orbitron text-2xl font-bold text-secondary mb-6">
                CONTACT INFO
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                      <info.icon className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm">{info.label}</p>
                      <p className="text-foreground font-medium">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="cyber-border p-8">
              <h3 className="font-orbitron text-2xl font-bold text-accent mb-6">
                CONNECT WITH ME
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-3 p-4 rounded border border-foreground/20 hover:border-accent hover:bg-accent/10 transition-all duration-300 group ${social.color}`}
                  >
                    <social.icon className="text-xl" />
                    <span className="font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </Card>

            {/* Call to Action */}
            <Card className="cyber-border p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="font-orbitron text-xl font-bold text-primary mb-4">
                READY TO HIRE?
              </h3>
              <p className="text-foreground/80 mb-6">
                Looking for a passionate full-stack developer? Let's discuss your next project!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="cyber-button flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <a href="mailto:ashishjaiswal0701@gmail.com">
                    <FaEnvelope className="mr-2" />
                    HIRE ME NOW
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  className="cyber-button flex-1"
                >
                  DOWNLOAD CV
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16 pt-8 border-t border-primary/30"
        >
          <p className="text-foreground/60">
            © 2024 Ashish Jaiswal. Built with React, TypeScript & Cyberpunk aesthetics.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="cyber-button"
              asChild
            >
              <a href="/admin">Admin Panel</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;