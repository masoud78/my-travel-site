import { z } from "zod";

const phoneRegex = /^(\+98|0)?9\d{9}$/;
const landlineRegex = /^0\d{2,3}\d{7,8}$/;

export const callbackSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(100),
  phone: z
    .string()
    .regex(phoneRegex, "شماره موبایل معتبر نیست")
    .or(z.string().regex(landlineRegex, "شماره ثابت معتبر نیست")),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  subject: z.string().min(2).max(200),
  message: z.string().min(10, "متن پیام حداقل ۱۰ کاراکتر").max(2000),
});

export const reviewSubmitSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal("")),
  tourId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(20, "نظر حداقل ۲۰ کاراکتر").max(2000),
});

export const jobApplicationSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(phoneRegex, "شماره موبایل معتبر نیست"),
  email: z.string().email(),
  position: z.string().min(2),
  message: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
});

export const searchToursSchema = z.object({
  destination: z.string().optional(),
  origin: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  budgetMax: z.coerce.number().optional(),
  transport: z.string().optional(),
  duration: z.coerce.number().optional(),
  travelers: z.coerce.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر"),
});

// CMS admin schemas
export const tourFormSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  category: z.string().min(2),
  destination: z.string().min(2),
  origin: z.string().optional(),
  duration: z.coerce.number().int().min(1),
  nights: z.coerce.number().int().min(0),
  transport: z.string(),
  airline: z.string().optional(),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const blogPostFormSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  excerpt: z.string().optional(),
  content: z.string().min(20),
  category: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CallbackInput = z.infer<typeof callbackSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ReviewInput = z.infer<typeof reviewSubmitSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TourFormInput = z.infer<typeof tourFormSchema>;
export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;
