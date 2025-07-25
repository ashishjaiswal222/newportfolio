import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Contact } from '../models/Contact';
import { ContactReply } from '../models/ContactReply';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

const COMPANY_SENDER = process.env.COMPANY_SENDER_NAME || 'Company Support';
const ADMIN_SENDER = process.env.ADMIN_SENDER_NAME || 'Admin Notification';
const BCC_EMAIL = process.env.BCC_EMAIL || '';

function cyberpunkEmailWrapper(content: string, heading: string) {
  return `
  <div style="background: #0a0a23; color: #e0f7fa; font-family: 'Orbitron', 'Rajdhani', 'Segoe UI', monospace, sans-serif; padding: 0; border-radius: 18px; max-width: 600px; margin: 32px auto; border: 2px solid #00fff7; box-shadow: 0 0 24px #00fff7, 0 0 48px #a259ff; background-image: linear-gradient(135deg, #0a0a23 80%, #1a1a40 100%); overflow: hidden;">
    <!-- Neon Header Bar -->
    <div style="height: 16px; width: 100%; background: linear-gradient(90deg, #00fff7, #a259ff, #00ff87, #ff00c8, #ffb300); box-shadow: 0 0 16px #00fff7, 0 0 32px #a259ff;"></div>
    <!-- Glitch Heading with SVG Accent -->
    <div style="display: flex; align-items: center; justify-content: center; margin-top: 24px; margin-bottom: 12px;">
      <span style="display:inline-block; margin-right: 10px;">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="#00fff7" stroke-width="3" fill="#0a0a23"/>
          <path d="M8 16h16" stroke="#a259ff" stroke-width="3" stroke-linecap="round"/>
          <path d="M16 8v16" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </span>
      <h1 style="font-size: 2.2rem; margin: 0; background: linear-gradient(90deg, #00fff7, #a259ff, #00ff87); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 8px #00fff7, 0 0 16px #a259ff; font-family: 'Orbitron', monospace; letter-spacing: 2px;">${heading}</h1>
    </div>
    <!-- Holographic Divider -->
    <div style="height: 4px; width: 120px; background: linear-gradient(90deg, #00fff7, #a259ff, #00ff87, #ff00c8, #ffb300); margin: 0 auto 18px auto; border-radius: 2px; box-shadow: 0 0 8px #00fff7;"></div>
    <!-- Glassmorphism Card -->
    <div style="border-radius: 14px; background: rgba(20,20,40,0.92); box-shadow: 0 0 18px #a259ff; padding: 28px 24px 24px 24px; margin-bottom: 18px; border: 1.5px solid #00fff7;">
      ${content}
    </div>
    <!-- Neon Accent Line -->
    <div style="height: 2px; width: 80%; background: linear-gradient(90deg, #00fff7, #a259ff, #00ff87, #ff00c8, #ffb300); margin: 24px auto 12px auto; border-radius: 2px;"></div>
    <!-- Footer -->
    <div style="text-align: center; margin-top: 18px;">
      <span style="font-size: 1.1rem; color: #00fff7; font-family: 'Orbitron', monospace; letter-spacing: 1px;">Stay Neon. Stay Futuristic.</span><br>
      <span style="font-size: 0.95rem; color: #a259ff;">Cyberpunk Portfolio &copy; ${new Date().getFullYear()}<br>Built by Ashish Jaiswal</span>
    </div>
  </div>
  `;
}

// Zod schemas
const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(5),
  source: z.string().optional(),
});
const replySchema = z.object({
  message: z.string().min(2),
});

export const createContact = async (req: Request, res: Response) => {
  console.log('Received contact POST:', req.body);
  try {
    const repo = AppDataSource.getRepository(Contact);
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.flatten() });
    }
    const { firstName, lastName, email, phone, subject, message, source } = parseResult.data;
    const contact = repo.create({ firstName, lastName, email, phone, subject, message, source });
    await repo.save(contact);

    // Debug: Log email credentials
    console.log('COMPANY_EMAIL:', process.env.COMPANY_EMAIL);
    console.log('COMPANY_EMAIL_PASSWORD:', process.env.COMPANY_EMAIL_PASSWORD);

    // Cyberpunk-styled content
    const content = `
      <p style="font-size:1.1rem;"><span style="color:#00fff7;font-weight:bold;">Name:</span> ${firstName} ${lastName}</p>
      <p style="font-size:1.1rem;"><span style="color:#a259ff;font-weight:bold;">Email:</span> ${email}</p>
      <p style="font-size:1.1rem;"><span style="color:#00ff87;font-weight:bold;">Phone:</span> ${phone || 'N/A'}</p>
      <p style="font-size:1.1rem;"><span style="color:#ff00c8;font-weight:bold;">Subject:</span> ${subject}</p>
      <p style="font-size:1.1rem;"><span style="color:#ffb300;font-weight:bold;">Source:</span> ${source || 'portfolio'}</p>
      <div style="margin:18px 0;padding:18px;background:rgba(0,255,247,0.07);border-radius:8px;border:1px solid #00fff7;">
        <span style="color:#00fff7;font-weight:bold;">Message:</span>
        <p style="white-space:pre-line;font-size:1.1rem;">${message}</p>
      </div>
    `;
    const html = cyberpunkEmailWrapper(content, 'New Contact Submission');

    // Send styled email to admin (notification)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `"${COMPANY_SENDER}" <${process.env.COMPANY_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || undefined,
      bcc: BCC_EMAIL ? BCC_EMAIL : undefined,
      subject: `New Contact Submission: ${subject}`,
      html,
    };
    // Only send if to or bcc is present
    if (mailOptions.to || mailOptions.bcc) {
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: 'Contact created and admin notified.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create contact.' });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Contact);
    const contacts = await repo.find({
      relations: ['replies'],
      order: { createdAt: 'DESC' },
    });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contacts.' });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const repo = AppDataSource.getRepository(Contact);
    const contact = await repo.findOneBy({ id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    contact.status = status;
    await repo.save(contact);
    res.json({ message: 'Contact status updated.', contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update contact status.' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Contact);
    const contact = await repo.findOneBy({ id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    await repo.remove(contact);
    res.json({ message: 'Contact deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete contact.' });
  }
};

// Helper: get attachments from req.files (multer)
function getEmailAttachments(files: Express.Multer.File[] | undefined) {
  if (!files) return [];
  return files.map(file => ({
    filename: file.originalname,
    path: file.path,
  }));
}

export const replyToContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = replySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.flatten() });
    }
    const { message } = parseResult.data;
    const contactRepo = AppDataSource.getRepository(Contact);
    const replyRepo = AppDataSource.getRepository(ContactReply);
    const contact = await contactRepo.findOneBy({ id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    // Save reply to DB
    const reply = replyRepo.create({ message, adminEmail: process.env.COMPANY_EMAIL, contact });
    await replyRepo.save(reply);
    // Update contact status to 'replied'
    contact.status = 'replied';
    await contactRepo.save(contact);
    // Cyberpunk-styled reply content
    const content = `
      <p style="font-size:1.1rem;"><span style="color:#00fff7;font-weight:bold;">Hi ${contact.firstName},</span></p>
      <div style="margin:18px 0;padding:18px;background:rgba(162,89,255,0.07);border-radius:8px;border:1px solid #a259ff;">
        <span style="color:#a259ff;font-weight:bold;">Your original message:</span>
        <p style="white-space:pre-line;font-size:1.1rem;">${contact.message}</p>
      </div>
      <div style="margin:18px 0;padding:18px;background:rgba(0,255,247,0.07);border-radius:8px;border:1px solid #00fff7;">
        <span style="color:#00fff7;font-weight:bold;">Admin reply:</span>
        <p style="white-space:pre-line;font-size:1.1rem;">${message}</p>
      </div>
      <p style="color:#ff00c8;font-size:1rem;margin-top:24px;">If you have further questions, just reply to this email.<br>Stay neon!<br><span style="font-family:'Orbitron',monospace;">Ashish Jaiswal</span></p>
    `;
    const html = cyberpunkEmailWrapper(content, 'Reply from Admin');
    // Send styled email to user (with attachments) from COMPANY_EMAIL
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });
    const attachments = getEmailAttachments((req as any).files);
    const mailOptions = {
      from: `"${COMPANY_SENDER}" <${process.env.COMPANY_EMAIL}>`,
      to: contact.email,
      cc: process.env.ADMIN_EMAIL || undefined,
      bcc: BCC_EMAIL ? BCC_EMAIL : undefined,
      subject: `Reply to your contact: ${contact.subject}`,
      html,
      attachments,
    };
    // Only send if to or bcc is present
    if (mailOptions.to || mailOptions.bcc) {
      await transporter.sendMail(mailOptions);
    }
    // Optionally, delete files after sending
    if (attachments.length) {
      attachments.forEach(att => {
        fs.unlink(att.path, () => {});
      });
    }
    res.json({ message: 'Reply sent and saved.', reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reply.' });
  }
}; 