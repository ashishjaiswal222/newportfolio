import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Testimonial, TestimonialStatus } from '../models/Testimonial';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Testimonial);
    const { status } = req.query;
    let testimonials;
    if (status && typeof status === 'string' && ['pending', 'approved', 'rejected'].includes(status)) {
      testimonials = await repo.find({ where: { status: status as TestimonialStatus }, order: { createdAt: 'DESC' } });
    } else {
      testimonials = await repo.find({ order: { createdAt: 'DESC' } });
    }
    res.json({ testimonials });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Failed to fetch testimonials.' });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, email, role, company, content, rating } = req.body;
    if (!name || !email || !content || !rating) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const repo = AppDataSource.getRepository(Testimonial);
    const testimonial = repo.create({
      name,
      email,
      role: role || '',
      company: company || '',
      content,
      rating,
      status: 'pending',
    });
    await repo.save(testimonial);
    res.status(201).json({ testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create testimonial.' });
  }
};

export const updateTestimonialStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const repo = AppDataSource.getRepository(Testimonial);
    const testimonial = await repo.findOne({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    testimonial.status = status;
    await repo.save(testimonial);
    res.json({ testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update testimonial status.' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Testimonial);
    const testimonial = await repo.findOne({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    await repo.remove(testimonial);
    res.json({ message: 'Testimonial deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete testimonial.' });
  }
}; 