import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// User submits contact form
router.post('/', contactController.createContact);

// Admin: list all contacts
router.get('/', contactController.getContacts);

// Admin: update contact status
router.put('/:id/status', contactController.updateContactStatus);

// Admin: delete contact
router.delete('/:id', contactController.deleteContact);

// Admin: reply to contact (with attachments)
router.post('/:id/reply', upload.array('attachments'), contactController.replyToContact);

export default router; 