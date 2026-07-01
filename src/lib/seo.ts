/**
 * JSON-LD Schema generators for SEO.
 * Each function returns a plain object ready to serialize.
 */
import { SITE_CONFIG } from "./site-config";

type SchemaObj = Record<string, unknown>;

export function organizationSchema(): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.nameEn,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.defaultPhone,
    email: SITE_CONFIG.email,
    sameAs: Object.values(SITE_CONFIG.socials),
    address: {
      "@type": "PostalAddress",
      addressCountry: "IR",
      addressLocality: "Tehran",
    },
  };
}

export function websiteSchema(): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export interface TourSchemaInput {
  name: string;
  description: string;
  image: string[];
  price: number;
  duration: number;
  url: string;
  destination: string;
  startDate?: string;
  endDate?: string;
}

export function touristTripSchema(tour: TourSchemaInput): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.description,
    image: tour.image,
    url: tour.url.startsWith("http") ? tour.url : `${SITE_CONFIG.url}${tour.url}`,
    touristType: tour.destination,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.duration,
    },
    ...(tour.startDate && { startDate: tour.startDate }),
    ...(tour.endDate && { endDate: tour.endDate }),
    provider: {
      "@type": "TravelAgency",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "IRR",
      availability: "https://schema.org/InStock",
      url: tour.url.startsWith("http") ? tour.url : `${SITE_CONFIG.url}${tour.url}`,
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  image: string;
  author: string;
  publishDate: string;
  modifyDate?: string;
  url: string;
}

export function articleSchema(a: ArticleSchemaInput): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    image: a.image,
    datePublished: a.publishDate,
    dateModified: a.modifyDate || a.publishDate,
    author: { "@type": "Person", name: a.author },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
  };
}

export interface ReviewSchemaInput {
  rating: number;
  author: string;
  reviewBody: string;
  datePublished: string;
}

export function aggregateRatingSchema(reviews: ReviewSchemaInput[]): SchemaObj {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / Math.max(reviews.length, 1);
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: avg.toFixed(1),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}

export interface LocalBusinessInput {
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat?: number;
  lng?: number;
}

export function localBusinessSchema(b: LocalBusinessInput): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: b.name,
    telephone: b.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressCountry: "IR",
    },
    openingHours: b.hours,
    ...(b.lat &&
      b.lng && {
        geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
      }),
  };
}

export interface JobPostingInput {
  title: string;
  description: string;
  city: string;
  employmentType: string;
  datePosted: string;
}

export function jobPostingSchema(j: JobPostingInput): SchemaObj {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: j.description,
    datePosted: j.datePosted,
    employmentType: j.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      sameAs: SITE_CONFIG.url,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: j.city, addressCountry: "IR" },
    },
  };
}

/** Helper component-like fn to serialize to <script> tag content */
export function jsonLd(obj: SchemaObj | SchemaObj[]): string {
  return JSON.stringify(obj);
}
