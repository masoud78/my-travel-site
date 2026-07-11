# ریوان سفر — وب‌سایت آژانس مسافرتی

وب‌سایت کامل آژانس مسافرتی **ریوان سفر** با مدل فروش تلفنی، ساخته شده با Next.js 16 و Prisma.

## 🚀 فناوری‌های استفاده‌شده

| بخش | تکنولوژی | نسخه |
|---|---|---|
| **Framework** | Next.js (App Router + Turbopack) | 16.2.9 |
| **UI** | React + Tailwind CSS 4 + shadcn/ui | 19.2.4 / 4.x |
| **Database** | Prisma + PostgreSQL (online) / SQLite (legacy dev) | 5.22.0 |
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

طراحی با **تم Modern**: نچرال‌های آرام (zinc) + یک اکسنت ظریف teal/cyan + کارت‌های لایه‌ای نرم.
ترکیبی از اعتماد (teal) + سفر (cyan) + آرامش بصری (نچرال‌های خنثی) — سبک، حرفه‌ای و اپ‌مانند.

| نقش | رنگ | دلیل انتخاب |
|---|---|---|
| **Primary** | teal تیره `#0f766e` | اعتماد، تخصص، آرامش |
| **Secondary (CTA)** | cyan `#0891b2` | اکسنت ظریف و مدرن برای دکمه‌های تبدیل |
| **Accent** | teal `#14b8a6` | طبیعت، سفر، طراوت |
| **Background** | نچرال روشن `#fcfcfd` | راحتی چشم، فضای سفید کافی |
| **Border/Muted** | zinc `#e4e4e7` | لایه‌بندی نرم و شیک |

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

## 🚀 دیپلوی روی Supabase (PostgreSQL)

پروژه برای PostgreSQL نوشته شده و Supabase دقیقاً همان است — نیازی به تغییر کد نیست.

### ۱- گرفتن رشته اتصال از Supabase

۱. به [supabase.com/dashboard](https://supabase.com/dashboard) برو → پروژه خودت (یا بساز).
۲. **Project Settings → Database → Connection string** → تب **URI**.
۳. رشته‌ای شبیه این کپی کن (شامل رمز دیتابیس):

```
postgresql://postgres:YOUR_PASSWORD@db.rtrdjphgqhwugesnuobx.supabase.co:5432/postgres?sslmode=require
```

⚠️ کدهای Dashboard (Publishable / Secret / Anon / Service-role) برای اتصال دیتابیس کافی **نیستند** — فقط رشته اتصال Postgres معتبر است.

### ۲- تنظیم متغیرها

در `.env` (لوکال) یا Environment Variables پلتفرم (Vercel) این را ست کن:

```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.rtrdjphgqhwugesnuobx.supabase.co:5432/postgres?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://postgres:YOUR_PASSWORD@db.rtrdjphgqhwugesnuobx.supabase.co:5432/postgres?sslmode=require"
```

> نکته: Supabase پولرهای «Session» و «Transaction» دارد. هر دو با `?sslmode=require` کار می‌کنند.
> کد در `src/lib/prisma.ts` پارامترهای `pgbouncer` و `channel_binding` را خودکار تنظیم می‌کند.

### ۳- اعمال schema و seed

```bash
# لوکال (با .env تنظیم‌شده به Supabase):
npx prisma db push --accept-data-loss
npm run seed

# یا روی Vercel (Build Command = npm run vercel-build):
# vercel-build.js خودکار db push + seed را اجرا می‌کند
```

### ۴- تنظیمات احراز هویت Supabase (اختیاری)

اگر می‌خواهی احراز هویت کاربران نهایی را به Supabase Auth بدهی (به‌جای JWT داخلی)،
کدهای `SUPABASE_URL` و `SUPABASE_ANON_KEY` را در `.env` اضافه کن. فعلاً پروژه از
احراز هویت سفارشی (JWT + bcrypt) برای پنل ادمین استفاده می‌کند.

---

## 🚀 دیپلوی روی Vercel (اختیاری)

اگر می‌خواهی روی Vercel دیپلوی کنی، متغیرها را همانند بالا ست کن و Build Command را
`npm run vercel-build` بگذار. `vercel-build.js` موارد زیر را اجرا می‌کند:

```
npx prisma generate
npx prisma db push --accept-data-loss
next build
```

---

این پروژه برای **ریوان سفر** ساخته شده است.

---

**توسعه‌دهنده:** Hermes Agent (Nous Research)  
**تاریخ:** ۱۰ تیر ۱۴۰۵  
**نسخه:** 0.1.0
