"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth, getCurrentUser, hashPassword } from "@/lib/auth";

// ===== USERS =====
export async function getUsers() {
  await requireAuth();
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: string;
  phone?: string;
  isActive?: boolean;
}) {
  await requireAuth();
  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
      phone: data.phone,
      isActive: data.isActive ?? true,
    },
  });
  revalidatePath("/admin/users");
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    name: string;
    password: string;
    role: string;
    phone?: string;
    isActive: boolean;
  }>
) {
  await requireAuth();
  const updateData: Record<string, unknown> = { ...data };
  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
    delete updateData.password;
  }
  const user = await prisma.user.update({ where: { id }, data: updateData });
  revalidatePath("/admin/users");
  return user;
}

export async function deleteUser(id: string) {
  await requireAuth();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ===== DESTINATIONS =====
export type DestinationInput = {
  name: string;
  nameEn?: string;
  slug: string;
  type: string;
  parentId?: string | null;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDesc?: string;
  order?: number;
  isActive?: boolean;
};

export async function getDestinations() {
  await requireAuth();
  return prisma.destination.findMany({
    include: { parent: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDestinationsTree() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const all = await prisma.destination.findMany({
    include: { children: true, parent: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  const roots = all.filter((d) => !d.parentId);
  return roots.map((root) => ({
    ...root,
    children: all.filter((d) => d.parentId === root.id).map((child) => ({ ...child, children: [] })),
  }));
}

export async function createDestination(data: DestinationInput) {
  await requireAuth();
  const dest = await prisma.destination.create({ data });
  revalidatePath("/admin/destinations");
  revalidatePath("/tours");
  return dest;
}

export async function updateDestination(id: string, data: Partial<DestinationInput>) {
  await requireAuth();
  const dest = await prisma.destination.update({ where: { id }, data });
  revalidatePath("/admin/destinations");
  revalidatePath("/tours");
  return dest;
}

export async function deleteDestination(id: string) {
  await requireAuth();
  await prisma.destination.delete({ where: { id } });
  revalidatePath("/admin/destinations");
  revalidatePath("/tours");
}

// ===== HOTELS =====
export type HotelInput = {
  name: string;
  nameEn?: string;
  stars: number;
  address?: string;
  description?: string;
  images?: string[];
  amenities?: string[];
  city?: string;
  country?: string;
};

export async function getHotels() {
  await requireAuth();
  return prisma.hotel.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createHotel(data: HotelInput) {
  await requireAuth();
  const hotel = await prisma.hotel.create({
    data: {
      ...data,
      images: JSON.stringify(data.images ?? []),
      amenities: JSON.stringify(data.amenities ?? []),
    },
  });
  revalidatePath("/admin/hotels");
  return hotel;
}

export async function updateHotel(id: string, data: Partial<HotelInput>) {
  await requireAuth();
  const updateData: Record<string, unknown> = { ...data };
  if (data.images) updateData.images = JSON.stringify(data.images);
  if (data.amenities) updateData.amenities = JSON.stringify(data.amenities);
  const hotel = await prisma.hotel.update({ where: { id }, data: updateData });
  revalidatePath("/admin/hotels");
  return hotel;
}

export async function deleteHotel(id: string) {
  await requireAuth();
  await prisma.hotel.delete({ where: { id } });
  revalidatePath("/admin/hotels");
}

// ===== TRANSPORTS =====
export type TransportInput = { name: string; type: string; logo?: string; isActive?: boolean };

export async function getTransports() {
  await requireAuth();
  return prisma.transport.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTransport(data: TransportInput) {
  await requireAuth();
  const transport = await prisma.transport.create({ data });
  revalidatePath("/admin/transports");
  return transport;
}

export async function updateTransport(id: string, data: Partial<TransportInput>) {
  await requireAuth();
  const transport = await prisma.transport.update({ where: { id }, data });
  revalidatePath("/admin/transports");
  return transport;
}

export async function deleteTransport(id: string) {
  await requireAuth();
  await prisma.transport.delete({ where: { id } });
  revalidatePath("/admin/transports");
}

// ===== TOURS =====
export type TourInput = {
  title: string;
  slug: string;
  shortDesc?: string;
  description?: string;
  category: string;
  duration: number;
  nights?: number;
  transportType: string;
  startPrice: number;
  destinationId?: string | null;
  transportId?: string | null;
  originCity?: string;
  origins?: string[];
  images?: string[];
  thumbnail?: string;
  includes?: string[];
  excludes?: string[];
  requirements?: string[];
  cancellation?: string;
  isFeatured?: boolean;
  isLastMinute?: boolean;
  status?: string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
};

export async function getTours() {
  await requireAuth();
  return prisma.tour.findMany({
    include: { destination: true, transport: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTour(data: TourInput) {
  const user = await requireAuth();
  const tour = await prisma.tour.create({
    data: {
      ...data,
      nights: data.nights ?? 0,
      origins: JSON.stringify(data.origins ?? []),
      images: JSON.stringify(data.images ?? []),
      includes: JSON.stringify(data.includes ?? []),
      excludes: JSON.stringify(data.excludes ?? []),
      requirements: JSON.stringify(data.requirements ?? []),
      authorId: user.id,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return tour;
}

export async function updateTour(id: string, data: Partial<TourInput>) {
  await requireAuth();
  const updateData: Record<string, unknown> = { ...data };
  if (data.origins) updateData.origins = JSON.stringify(data.origins);
  if (data.images) updateData.images = JSON.stringify(data.images);
  if (data.includes) updateData.includes = JSON.stringify(data.includes);
  if (data.excludes) updateData.excludes = JSON.stringify(data.excludes);
  if (data.requirements) updateData.requirements = JSON.stringify(data.requirements);
  if (data.status === "PUBLISHED") updateData.publishedAt = new Date();
  const tour = await prisma.tour.update({ where: { id }, data: updateData });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  revalidatePath(`/tours/${tour.slug}`);
  return tour;
}

export async function deleteTour(id: string) {
  await requireAuth();
  await prisma.tour.delete({ where: { id } });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
}

// ===== TOUR DATES =====
export type TourDateInput = {
  tourId: string;
  departDate: Date;
  returnDate: Date;
  price: number;
  capacity: number;
  remaining?: number;
  status?: string;
};

export async function getTourDates(tourId?: string) {
  await requireAuth();
  return prisma.tourDate.findMany({
    where: tourId ? { tourId } : undefined,
    include: { tour: { select: { title: true, slug: true } } },
    orderBy: { departDate: "asc" },
  });
}

export async function createTourDate(data: TourDateInput) {
  await requireAuth();
  const date = await prisma.tourDate.create({
    data: { ...data, remaining: data.remaining ?? data.capacity },
  });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return date;
}

export async function updateTourDate(id: string, data: Partial<TourDateInput>) {
  await requireAuth();
  const date = await prisma.tourDate.update({ where: { id }, data });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return date;
}

export async function deleteTourDate(id: string) {
  await requireAuth();
  await prisma.tourDate.delete({ where: { id } });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
}

// ===== PAGES =====
export type PageInput = {
  title: string;
  slug: string;
  content: string;
  type?: string;
  campaignBanner?: string;
  campaignCta?: string;
  image?: string;
  parentId?: string | null;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  ogImage?: string;
  status?: string;
  order?: number;
};

export async function getPages(type?: string) {
  await requireAuth();
  return prisma.page.findMany({
    where: type ? { type } : undefined,
    include: { parent: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryPages() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return prisma.page.findMany({
    where: { type: "CATEGORY" },
    include: { parent: { select: { id: true, title: true, slug: true } }, children: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getCategoryPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug, type: "CATEGORY", status: "PUBLISHED" },
    include: { parent: true, children: true },
  });
}

export async function createPage(data: PageInput) {
  await requireAuth();
  const page = await prisma.page.create({ data });
  revalidatePath("/admin/pages");
  revalidatePath(`/p/${page.slug}`);
  return page;
}

export async function updatePage(id: string, data: Partial<PageInput>) {
  await requireAuth();
  const page = await prisma.page.update({ where: { id }, data });
  revalidatePath("/admin/pages");
  revalidatePath(`/p/${page.slug}`);
  return page;
}

export async function deletePage(id: string) {
  await requireAuth();
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
}

// ===== BLOG POSTS =====
export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  readingTime?: number;
  category?: string;
  tags?: string[];
  status?: string;
  metaTitle?: string;
  metaDesc?: string;
};

export async function getBlogPosts() {
  await requireAuth();
  return prisma.blogPost.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBlogPost(data: BlogPostInput) {
  const user = await requireAuth();
  const post = await prisma.blogPost.create({
    data: {
      ...data,
      tags: JSON.stringify(data.tags ?? []),
      authorId: user.id,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return post;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
  await requireAuth();
  const updateData: Record<string, unknown> = { ...data };
  if (data.tags) updateData.tags = JSON.stringify(data.tags);
  if (data.status === "PUBLISHED") updateData.publishedAt = new Date();
  const post = await prisma.blogPost.update({ where: { id }, data: updateData });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

// ===== REVIEWS =====
export type ReviewInput = {
  authorName: string;
  authorEmail?: string;
  authorPhone?: string;
  rating: number;
  title?: string;
  content: string;
  tourId?: string;
  tourTitle?: string;
  blogPostId?: string;
  postTitle?: string;
  status?: string;
  agencyReply?: string;
};

export async function getReviews() {
  await requireAuth();
  return prisma.review.findMany({
    include: {
      tour: { select: { title: true, slug: true } },
      blogPost: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviewsAdmin(options?: {
  type?: "all" | "tour" | "blog";
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  sortBy?: "createdAt" | "rating" | "status";
  sortOrder?: "asc" | "desc";
}) {
  await requireAuth();
  const { type = "all", status = "all", sortBy = "createdAt", sortOrder = "desc" } = options || {};

  const where: Record<string, unknown> = {};
  if (status !== "all") where.status = status;
  if (type === "tour") where.tourId = { not: null };
  if (type === "blog") where.blogPostId = { not: null };

  const orderBy: Record<string, string> = {};
  orderBy[sortBy] = sortOrder;

  return prisma.review.findMany({
    where,
    include: {
      tour: { select: { title: true, slug: true } },
      blogPost: { select: { title: true, slug: true } },
    },
    orderBy,
  });
}

export async function createReview(data: ReviewInput) {
  await requireAuth();
  const review = await prisma.review.create({ data });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  return review;
}

export async function updateReview(id: string, data: Partial<ReviewInput>) {
  await requireAuth();
  const review = await prisma.review.update({ where: { id }, data });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  return review;
}

export async function deleteReview(id: string) {
  await requireAuth();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function createPublicReview(data: Omit<ReviewInput, "status">) {
  const review = await prisma.review.create({
    data: { ...data, status: "PENDING" },
  });
  revalidatePath("/reviews");
  if (data.tourId) revalidatePath(`/tours/${data.tourTitle ?? ""}`);
  if (data.blogPostId) revalidatePath(`/blog/${data.postTitle ?? ""}`);
  return review;
}

export async function getApprovedReviews(tourId?: string, blogPostId?: string) {
  return prisma.review.findMany({
    where: {
      status: "APPROVED",
      ...(tourId ? { tourId } : {}),
      ...(blogPostId ? { blogPostId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

// ===== CONTACT REQUESTS =====
export type ContactRequestInput = {
  status?: string;
  assignedTo?: string;
  notes?: string;
};

export async function getContactRequests() {
  await requireAuth();
  return prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateContactRequest(id: string, data: ContactRequestInput) {
  await requireAuth();
  const req = await prisma.contactRequest.update({ where: { id }, data });
  revalidatePath("/admin/requests");
  return req;
}

export async function deleteContactRequest(id: string) {
  await requireAuth();
  await prisma.contactRequest.delete({ where: { id } });
  revalidatePath("/admin/requests");
}

// ===== TEAM / CONSULTANTS =====
export type ConsultantInput = {
  name: string;
  title: string;
  specialty?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  workHours?: string;
  order?: number;
  isActive?: boolean;
};

export async function getConsultants() {
  await requireAuth();
  return prisma.consultant.findMany({ orderBy: { order: "asc" } });
}

export async function createConsultant(data: ConsultantInput) {
  await requireAuth();
  const consultant = await prisma.consultant.create({ data });
  revalidatePath("/admin/users");
  revalidatePath("/team");
  return consultant;
}

export async function updateConsultant(id: string, data: Partial<ConsultantInput>) {
  await requireAuth();
  const consultant = await prisma.consultant.update({ where: { id }, data });
  revalidatePath("/admin/users");
  revalidatePath("/team");
  return consultant;
}

export async function deleteConsultant(id: string) {
  await requireAuth();
  await prisma.consultant.delete({ where: { id } });
  revalidatePath("/admin/users");
  revalidatePath("/team");
}

// ===== BRANCHES =====
export type BranchInput = {
  name: string;
  address: string;
  phone: string;
  email?: string;
  workHours?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  isMain?: boolean;
  order?: number;
  isActive?: boolean;
};

export async function getBranches() {
  await requireAuth();
  return prisma.branch.findMany({ orderBy: { order: "asc" } });
}

export async function createBranch(data: BranchInput) {
  await requireAuth();
  const branch = await prisma.branch.create({ data });
  revalidatePath("/admin/users");
  revalidatePath("/branches");
  return branch;
}

export async function updateBranch(id: string, data: Partial<BranchInput>) {
  await requireAuth();
  const branch = await prisma.branch.update({ where: { id }, data });
  revalidatePath("/admin/users");
  revalidatePath("/branches");
  return branch;
}

export async function deleteBranch(id: string) {
  await requireAuth();
  await prisma.branch.delete({ where: { id } });
  revalidatePath("/admin/users");
  revalidatePath("/branches");
}

// ===== GALLERY =====
export type GalleryItemInput = {
  title?: string;
  image: string;
  thumbnail?: string;
  destination?: string;
  tourId?: string;
  order?: number;
};

export async function getGalleryItems() {
  await requireAuth();
  return prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
}

export async function createGalleryItem(data: GalleryItemInput) {
  await requireAuth();
  const item = await prisma.galleryItem.create({ data });
  revalidatePath("/admin/settings");
  revalidatePath("/gallery");
  return item;
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItemInput>) {
  await requireAuth();
  const item = await prisma.galleryItem.update({ where: { id }, data });
  revalidatePath("/admin/settings");
  revalidatePath("/gallery");
  return item;
}

export async function deleteGalleryItem(id: string) {
  await requireAuth();
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/admin/settings");
  revalidatePath("/gallery");
}

// ===== BANNERS =====
export type BannerInput = {
  title: string;
  subtitle?: string;
  image: string;
  url?: string;
  buttonText?: string;
  position: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  order?: number;
};

export async function getBanners() {
  await requireAuth();
  return prisma.banner.findMany({ orderBy: { order: "asc" } });
}

export async function createBanner(data: BannerInput) {
  await requireAuth();
  const banner = await prisma.banner.create({ data });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return banner;
}

export async function updateBanner(id: string, data: Partial<BannerInput>) {
  await requireAuth();
  const banner = await prisma.banner.update({ where: { id }, data });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return banner;
}

export async function deleteBanner(id: string) {
  await requireAuth();
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

// ===== MENUS =====
export type MenuInput = {
  location: string;
  label: string;
  url: string;
  icon?: string;
  image?: string;
  parentId?: string | null;
  order?: number;
  isActive?: boolean;
};

export async function getMenus() {
  await requireAuth();
  return prisma.menu.findMany({
    include: { parent: { select: { label: true } } },
    orderBy: { order: "asc" },
  });
}

export async function getMenusTree() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const all = await prisma.menu.findMany({
    orderBy: [{ order: "asc" }, { label: "asc" }],
    include: { children: true, parent: { select: { id: true, label: true } } },
  });
  const roots = all.filter((m) => !m.parentId);
  return roots.map((root) => ({
    ...root,
    children: all.filter((m) => m.parentId === root.id),
  }));
}

export async function createMenu(data: MenuInput) {
  await requireAuth();
  const menu = await prisma.menu.create({ data });
  revalidatePath("/admin/menus");
  revalidatePath("/");
  return menu;
}

export async function updateMenu(id: string, data: Partial<MenuInput>) {
  await requireAuth();
  const menu = await prisma.menu.update({ where: { id }, data });
  revalidatePath("/admin/menus");
  revalidatePath("/");
  return menu;
}

export async function deleteMenu(id: string) {
  await requireAuth();
  await prisma.menu.delete({ where: { id } });
  revalidatePath("/admin/menus");
  revalidatePath("/");
}

// ===== SETTINGS =====
export async function getSettings() {
  await requireAuth();
  return prisma.setting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
}

export async function updateSetting(id: string, value: string) {
  await requireAuth();
  const setting = await prisma.setting.update({ where: { id }, data: { value } });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return setting;
}

export async function createSetting(data: { key: string; value: string; group?: string; type?: string; label?: string }) {
  await requireAuth();
  const setting = await prisma.setting.create({ data });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return setting;
}

export async function deleteSetting(id: string) {
  await requireAuth();
  await prisma.setting.delete({ where: { id } });
  revalidatePath("/admin/settings");
}

// ===== REDIRECTS =====
export type RedirectInput = {
  fromPath: string;
  toPath: string;
  statusCode?: number;
  isActive?: boolean;
};

export async function getRedirects() {
  await requireAuth();
  return prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createRedirect(data: RedirectInput) {
  await requireAuth();
  const redirect = await prisma.redirect.create({ data });
  revalidatePath("/admin/settings");
  return redirect;
}

export async function updateRedirect(id: string, data: Partial<RedirectInput>) {
  await requireAuth();
  const redirect = await prisma.redirect.update({ where: { id }, data });
  revalidatePath("/admin/settings");
  return redirect;
}

export async function deleteRedirect(id: string) {
  await requireAuth();
  await prisma.redirect.delete({ where: { id } });
  revalidatePath("/admin/settings");
}

// ===== NEWSLETTER =====
export async function getNewsletters() {
  await requireAuth();
  return prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } });
}

export async function deleteNewsletter(id: string) {
  await requireAuth();
  await prisma.newsletter.delete({ where: { id } });
  revalidatePath("/admin/requests");
}

// ===== JOBS =====
export type JobInput = {
  title: string;
  slug: string;
  type: string;
  city?: string;
  department?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  isActive?: boolean;
};

export async function getJobs() {
  await requireAuth();
  return prisma.job.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createJob(data: JobInput) {
  await requireAuth();
  const job = await prisma.job.create({ data });
  revalidatePath("/admin/users");
  revalidatePath("/careers");
  return job;
}

export async function updateJob(id: string, data: Partial<JobInput>) {
  await requireAuth();
  const job = await prisma.job.update({ where: { id }, data });
  revalidatePath("/admin/users");
  revalidatePath("/careers");
  return job;
}

export async function deleteJob(id: string) {
  await requireAuth();
  await prisma.job.delete({ where: { id } });
  revalidatePath("/admin/users");
  revalidatePath("/careers");
}

// ===== MEDIA LIBRARY =====
export type MediaInput = {
  filename: string;
  originalName?: string;
  mimeType: string;
  type?: string;
  category?: string;
  size: number;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export async function getMedia(filters?: { type?: string; category?: string; search?: string }) {
  await requireAuth();
  return prisma.mediaLibrary.findMany({
    where: {
      ...(filters?.type && filters.type !== "ALL" ? { type: filters.type } : {}),
      ...(filters?.category ? { category: { contains: filters.category } } : {}),
      ...(filters?.search
        ? {
            OR: [
              { filename: { contains: filters.search } },
              { originalName: { contains: filters.search } },
              { altText: { contains: filters.search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createMedia(data: MediaInput) {
  await requireAuth();
  const media = await prisma.mediaLibrary.create({ data });
  revalidatePath("/admin/media");
  return media;
}

export async function updateMedia(id: string, data: Partial<MediaInput>) {
  await requireAuth();
  const media = await prisma.mediaLibrary.update({ where: { id }, data });
  revalidatePath("/admin/media");
  return media;
}

export async function deleteMedia(id: string) {
  await requireAuth();
  await prisma.mediaLibrary.delete({ where: { id } });
  revalidatePath("/admin/media");
}

// ===== SERVICE TEMPLATES =====
export type ServiceTemplateInput = {
  type: string;
  label: string;
  value?: string;
  order?: number;
  isActive?: boolean;
};

export async function getServiceTemplates(type?: string) {
  await requireAuth();
  return prisma.serviceTemplate.findMany({
    where: { ...(type ? { type } : {}), isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getAllServiceTemplates() {
  await requireAuth();
  return prisma.serviceTemplate.findMany({ orderBy: { type: "asc", order: "asc" } });
}

export async function createServiceTemplate(data: ServiceTemplateInput) {
  await requireAuth();
  return prisma.serviceTemplate.create({ data });
}

export async function updateServiceTemplate(id: string, data: Partial<ServiceTemplateInput>) {
  await requireAuth();
  return prisma.serviceTemplate.update({ where: { id }, data });
}

export async function deleteServiceTemplate(id: string) {
  await requireAuth();
  await prisma.serviceTemplate.delete({ where: { id } });
}

// ===== HOME BLOCKS =====
export type HomeBlockInput = {
  title: string;
  subtitle?: string;
  layout: string;
  filterType: string;
  filterValue?: string;
  order?: number;
  isActive?: boolean;
};

export async function getHomeBlocks() {
  return prisma.homeBlock.findMany({ orderBy: { order: "asc" } });
}

export async function getActiveHomeBlocks() {
  return prisma.homeBlock.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function createHomeBlock(data: HomeBlockInput) {
  await requireAuth();
  return prisma.homeBlock.create({ data });
}

export async function updateHomeBlock(id: string, data: Partial<HomeBlockInput>) {
  await requireAuth();
  await prisma.homeBlock.update({ where: { id }, data });
  revalidatePath("/admin/home-blocks");
  revalidatePath("/");
}

export async function deleteHomeBlock(id: string) {
  await requireAuth();
  await prisma.homeBlock.delete({ where: { id } });
  revalidatePath("/admin/home-blocks");
  revalidatePath("/");
}

// ===== MENU SETTINGS =====
export type MenuSettingInput = {
  location: string;
  logo?: string;
  title?: string;
  subtitle?: string;
  isActive?: boolean;
};

export async function getMenuSettings() {
  return prisma.menuSetting.findMany({ orderBy: { location: "asc" } });
}

export async function getPublicMenuSettings() {
  return prisma.menuSetting.findMany({ where: { isActive: true } });
}

export async function upsertMenuSetting(data: MenuSettingInput) {
  await requireAuth();
  const existing = await prisma.menuSetting.findUnique({ where: { location: data.location } });
  if (existing) {
    return prisma.menuSetting.update({ where: { location: data.location }, data });
  }
  return prisma.menuSetting.create({ data });
}

export async function deleteMenuSetting(id: string) {
  await requireAuth();
  await prisma.menuSetting.delete({ where: { id } });
}
