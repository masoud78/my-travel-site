# ریوان سفر — وب‌سایت آژانس مسافرتی

وب‌سایت کامل آژانس مسافرتی **ریوان سفر** با مدل فروش تلفنی، ساخته شده با Next.js 16 و Prisma.

## 🚀 فناوری‌های استفاده‌شده

| بخش | تکنولوژی | نسخه |
|---|---|---|
| **Framework** | Next.js (App Router + Turbopack) | 16.2.9 |
| **UI** | React + Tailwind CSS 4 + shadcn/ui | 19.2.4 / 4.x |
| **Database** | Prisma + SQLite (dev) / PostgreSQL (prod) | 5.22.0 |
| **Auth** | JWT + bcrypt | Custom |
| **Forms** | react-hook-form + Zod | 7.x / 3.x |
| **Date** | dayjs + jalaliday | شمسی |
| **Icons** | Lucide React | 0.460.0 |
| **Fonts** | Vazirmatn (preloaded) | 33.003 |

## 📦 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 20+ 
- npm یا yarn

### مراحل نصب

```bash
# 1. کلون پروژه
git clone <repository-url>
cd rivansafar

# 2. نصب dependencies
npm install

# 3. تنظیم .env
cp .env.example .env
# ویرایش .env و تنظیم DATABASE_URL و سایر متغیرها

# 4. migrate دیتابیس
npm run db:migrate

# 5. seed دیتابیس (محتوای نمونه)
npm run db:seed

# 6. اجرای dev server
npm run dev
```

سایت روی `http://localhost:3000` در دسترس خواهد بود.

### اطلاعات ورود پنل ادمین (بعد از seed)

- **URL:** `http://localhost:3000/admin`
- **ایمیل:** `admin@rivansafar.com`
- **رمز عبور:** `admin123`

⚠️ **هشدار امنیتی:** حتماً رمز عبور را در production تغییر دهید.

## 🗂 ساختار پروژه

```
rivansafar/
├── src/
│   ├── app/                 # صفحات Next.js (App Router)
│   │   ├── page.tsx         # صفحه اصلی
│   │   ├── layout.tsx       # Layout اصلی
│   │   ├── globals.css      # استایل‌های سراسری + Tailwind
│   │   └── fonts/           # فونت Vazirmatn
│   ├── components/          # کامپوننت‌های React
│   │   ├── layout/          # Header, Footer, MobileCTABar
│   │   ├── tour/            # TourCard و کامپوننت‌های تور
│   │   ├── common/          # کامپوننت‌های مشترک
│   │   └── ui/              # Primitive UI components (shadcn)
│   └── lib/                 # توابع کمکی و تنظیمات
│       ├── prisma.ts        # Prisma client
│       ├── auth.ts          # Authentication + RBAC
│       ├── seo.ts           # Schema.org JSON-LD generators
│       ├── jalali.ts        # تاریخ شمسی
│       ├── utils.ts         # توابع عمومی
│       ├── validations.ts   # Zod schemas
│       └── site-config.ts   # تنظیمات ثابت سایت
├── prisma/
│   ├── schema.prisma        # Schema دیتابیس (۲۰+ model)
│   └── seed.ts              # محتوای نمونه
├── public/                  # فایل‌های استاتیک
└── package.json
```

## 🎨 طراحی و رنگ‌بندی

پالت رنگ بر اساس **روان‌شناسی رنگ** برای آژانس مسافرتی:

| نقش | رنگ | دلیل انتخاب |
|---|---|---|
| **Primary** | آبی عمیق `#0c4a6e` | اعتماد، تخصص، آرامش |
| **Secondary (CTA)** | نارنجی `#f97316` | اشتیاق، ماجراجویی، کنتراست قوی |
| **Accent** | فیروزه‌ای `#14b8a6` | طبیعت، سفر، طراوت |
| **Background** | کرم گرم `#fafaf9` | راحتی چشم |

**فونت:** Vazirmatn (variable, preload) — بهترین خوانایی روی موبایل

## 📊 دیتابیس

### مدل‌های اصلی (۲۰+ جدول)

- **User** — کاربران پنل (۵ نقش: SUPER_ADMIN, TOUR_MANAGER, CONTENT_EDITOR, SALES, SEO_MANAGER)
- **Tour** — تورهای مسافرتی
- **TourDate** — تاریخ‌های برگزاری
- **Hotel** — هتل‌ها
- **Destination** — مقصدها (سلسله‌مراتبی)
- **Transport** — ایرلاین‌ها و حمل‌ونقل
- **Review** — نظرات مشتریان
- **BlogPost** — مقالات بلاگ
- **ContactRequest** — درخواست‌های تماس
- **Setting** — تنظیمات سایت (key-value)
- **Page** — صفحات استاتیک
- **Menu** — منوها
- **Branch** — شعب
- **Consultant** — تیم مشاورها
- **Banner** — بنرها
- **Job** — فرصت‌های شغلی
- **GalleryItem** — گالری
- **MediaLogo** — لوگوی رسانه‌ها
- **Redirect** — ریدایرکت‌های 301/302
- **Newsletter** — خبرنامه

### اسکریپت‌های دیتابیس

```bash
npm run db:generate     # تولید Prisma Client
npm run db:migrate      # اجرای migration
npm run db:seed         # seed با محتوای نمونه
npm run db:studio       # باز کردن Prisma Studio
npm run db:reset        # reset کامل دیتابیس
```

## 🔐 احراز هویت

- **JWT-based** با bcrypt برای hash کردن رمز
- **RBAC** (Role-Based Access Control) با ۵ نقش
- **Session:** کوکی httpOnly با عمر ۷ روز

### نقش‌ها و دسترسی‌ها

| نقش | دسترسی |
|---|---|
| **SUPER_ADMIN** | همه‌چیز |
| **TOUR_MANAGER** | تورها، مقصدها، هتل‌ها، حمل‌ونقل |
| **CONTENT_EDITOR** | صفحات، بلاگ، بنرها، رسانه |
| **SALES** | درخواست‌ها، نظرات |
| **SEO_MANAGER** | تنظیمات SEO، منوها، redirects |

## 🌐 SEO فنی

✅ **پیاده‌سازی‌شده:**
- Metadata کامل (title, description, OG, Twitter Card)
- Schema.org JSON-LD (۱۰+ نوع: Organization, WebSite, TouristTrip, FAQPage, Review, LocalBusiness, BlogPosting, JobPosting)
- RTL کامل
- تاریخ شمسی
- Font preload (Vazirmatn)
- Security headers (HSTS, X-Frame-Options, CSP-ready)

⏳ **در صف توسعه:**
- sitemap.xml داینامیک
- robots.txt
- Breadcrumb Schema
- Core Web Vitals optimization (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Image optimization (WebP/AVIF)

## 📱 صفحات پیاده‌سازی‌شده

### ✅ آماده
- **صفحه اصلی** — Hero, Featured Tours, Stats, Why Us, Reviews, CTA
- **Header** — Mega-menu (موبایل + دسکتاپ), Sticky, شماره تماس
- **Footer** — لینک‌ها، Newsletter، شبکه‌های اجتماعی
- **Mobile CTA Bar** — دکمه‌های تماس فوری و واتساپ

### 🔨 در حال توسعه
- صفحات Listing (دسته‌بندی تورها)
- صفحه Detail تور
- صفحه جستجوی پیشرفته
- Landing Pages کمپینی
- About, Team, Reviews, Gallery
- Blog + مقاله
- FAQ, Cancellation, Privacy, Terms
- Contact, Branches, Jobs, B2B
- 404, Thank You, Sitemap
- **پنل ادمین CMS** (۱۷ بخش مدیریتی)

## 🛠 اسکریپت‌های npm

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run start        # اجرای production
npm run lint         # ESLint

npm run db:generate  # Prisma generate
npm run db:migrate   # Prisma migrate
npm run db:seed      # seed دیتابیس
npm run db:studio    # Prisma Studio
npm run db:reset     # reset دیتابیس
```

## 🚀 دیپلوی

### Vercel (پیشنهادی)
1. Push کد به GitHub
2. Import در Vercel
3. تنظیم Environment Variables:
   - `DATABASE_URL` (PostgreSQL از Vercel Postgres یا Supabase)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy

### سرور شخصی
```bash
npm run build
npm run start
```

نیاز به PostgreSQL و تنظیم `DATABASE_URL` در `.env.production`

## 📄 لایسنس

این پروژه برای **ریوان سفر** ساخته شده است.

---

**توسعه‌دهنده:** Hermes Agent (Nous Research)  
**تاریخ:** ۱۰ تیر ۱۴۰۵  
**نسخه:** 0.1.0
