import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Admin
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@rivansafar.com" },
    update: {},
    create: {
      email: "admin@rivansafar.com",
      passwordHash: adminPassword,
      name: "مدیر سیستم",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log("✅ Admin user:", admin.email);

  // 2. Destinations
  const destData = [
    { name: "ترکیه", nameEn: "Turkey", slug: "turkey", type: "COUNTRY", parentSlug: null, image: "/images/destinations/antalya.jpg", description: "کشور چهارفصل با فرهنگی ترکیبی از شرق و غرب." },
    { name: "آنتالیا", nameEn: "Antalya", slug: "antalya", type: "CITY", parentSlug: "turkey", image: "/images/destinations/antalya.jpg", description: "پرطرفدارترین مقصد ساحلی ترکیه با هتل‌های متنوع." },
    { name: "استانبول", nameEn: "Istanbul", slug: "istanbul", type: "CITY", parentSlug: "turkey", image: "/images/destinations/istanbul.jpg", description: "شهری تاریخی روی دو قاره آسیا و اروپا." },
    { name: "دبی", nameEn: "Dubai", slug: "dubai", type: "CITY", parentSlug: null, image: "/images/destinations/dubai.jpg", description: "شهر مدرن امارات با جاذبه‌های لوکس و خرید." },
    { name: "مشهد", nameEn: "Mashhad", slug: "mashhad", type: "CITY", parentSlug: null, image: "/images/destinations/mashhad.jpg", description: "شهر مقدس ایران و مقصد زیارتی اصلی." },
    { name: "شیراز", nameEn: "Shiraz", slug: "shiraz", type: "CITY", parentSlug: null, image: "/images/destinations/shiraz.jpg", description: "شهر عشق و ادب با آثار تاریخی هخامنشی و صفوی." },
    { name: "کیش", nameEn: "Kish", slug: "kish", type: "CITY", parentSlug: null, image: "/images/destinations/kish.jpg", description: "جزیره مرجانی خلیج فارس با مراکز خرید و تفریحات دریایی." },
    { name: "گرجستان", nameEn: "Georgia", slug: "georgia", type: "COUNTRY", parentSlug: null, image: "/images/destinations/tbilisi.jpg", description: "مقصدی مقرون‌به‌صرفه با طبیعت خیره‌کننده و معماری اروپایی." },
    { name: "تفلیس", nameEn: "Tbilisi", slug: "tbilisi", type: "CITY", parentSlug: "georgia", image: "/images/destinations/tbilisi.jpg", description: "پایتخت گرجستان با کوچه‌های سنگفرش و حمام‌های گوگردی." },
    { name: "تایلند", nameEn: "Thailand", slug: "thailand", type: "COUNTRY", parentSlug: null, image: "/images/destinations/bangkok.jpg", description: "سرزمین لبخند با سواحل استوایی و معابد طلایی." },
    { name: "پوکت", nameEn: "Phuket", slug: "phuket", type: "CITY", parentSlug: "thailand", image: "/images/destinations/bangkok.jpg", description: "بزرگ‌ترین جزیره تایلند با سواحل کریستالی." },
    { name: "ایتالیا", nameEn: "Italy", slug: "italy", type: "COUNTRY", parentSlug: null, image: "/images/destinations/rome.jpg", description: "میهن هنر، تاریخ و غذاهای لذیذ." },
    { name: "رم", nameEn: "Rome", slug: "rome", type: "CITY", parentSlug: "italy", image: "/images/destinations/rome.jpg", description: "شهر ابدی با کولوسئوم، واتیکان و فواره‌ها." },
  ];

  const destMap = new Map<string, string>();
  for (const d of destData) {
    let parentId: string | null = null;
    if (d.parentSlug) {
      const parent = await prisma.destination.findUnique({ where: { slug: d.parentSlug } });
      parentId = parent?.id ?? null;
    }
    const rec = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        name: d.name,
        nameEn: d.nameEn,
        slug: d.slug,
        type: d.type,
        description: d.description,
        parentId,
        isActive: true,
        image: d.image || null,
      },
    });
    destMap.set(d.slug, rec.id);
  }
  console.log("✅ Destinations:", destMap.size);

  // 3. Transports
  const transportData = [
    { id: "mahan", name: "ماهان", type: "AIRLINE" },
    { id: "iran-air", name: "ایران ایر", type: "AIRLINE" },
    { id: "turkish", name: "ترکیش ایرلاینز", type: "AIRLINE" },
    { id: "flydubai", name: "فلای دبی", type: "AIRLINE" },
    { id: "emirates", name: "امارات", type: "AIRLINE" },
    { id: "raja", name: "رجا (قطار)", type: "TRAIN" },
    { id: "noor", name: "نورالرضا (قطار)", type: "TRAIN" },
    { id: "royal-safari", name: "سلامت/آسوده (اتوبوس VIP)", type: "BUS" },
  ];
  for (const t of transportData) {
    await prisma.transport.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, name: t.name, type: t.type, isActive: true },
    });
  }
  console.log("✅ Transports:", transportData.length);

  // 4. Hotels
  const hotelData = [
    { name: "هتل آکرا آنتالیا", city: "آنتالیا", stars: 5 },
    { name: "هتل دیوان استانبول", city: "استانبول", stars: 5 },
    { name: "هتل آتلانتیس دبی", city: "دبی", stars: 5 },
    { name: "هتل مدینه الرضا مشهد", city: "مشهد", stars: 4 },
    { name: "هتل هما شیراز", city: "شیراز", stars: 5 },
    { name: "هتل داریوش کیش", city: "کیش", stars: 5 },
    { name: "هتل رومز تفلیس", city: "تفلیس", stars: 4 },
    { name: "هتل پاتونگ پوکت", city: "پوکت", stars: 4 },
  ];
  const hotels: { id: string; name: string; city: string }[] = [];
  for (const h of hotelData) {
    const rec = await prisma.hotel.upsert({
      where: { id: `hotel-${h.name.replace(/\s+/g, "-").toLowerCase()}` },
      update: {},
      create: {
        id: `hotel-${h.name.replace(/\s+/g, "-").toLowerCase()}`,
        name: h.name,
        stars: h.stars,
        city: h.city,
      },
    });
    hotels.push({ id: rec.id, name: rec.name, city: rec.city || "" });
  }
  console.log("✅ Hotels:", hotels.length);

  // 5. Tours
  const toursInput = [
    {
      title: "تور آنتالیا ۷ شب با پرواز مستقیم",
      slug: "tour-antalya-7-nights",
      category: "TURKEY",
      destinationSlug: "antalya",
      transportId: "mahan",
      duration: 8, nights: 7,
      transportType: "PLANE",
      startPrice: 16500000,
      thumbnail: "/images/tours/antalya-beach.jpg",
      shortDesc: "۷ شب و ۸ روز آنتالیا با اقامت در هتل ۵ ستاره و صبحانه و شام",
      description: "تور آنتالیا با پرواز مستقیم ماهان، ترانسفر فرودگاهی، اقامت در هتل ۵ ستاره آکرا با رژیم UAll، راهنمای فارسی‌زبان و بیمه مسافرتی.",
      isFeatured: true,
    },
    {
      title: "تور استانبول ۵ شب نوروز ۱۴۰۵",
      slug: "tour-istanbul-5-nights",
      category: "TURKEY",
      destinationSlug: "istanbul",
      transportId: "turkish",
      duration: 6, nights: 5,
      transportType: "PLANE",
      startPrice: 18900000,
      thumbnail: "/images/tours/istanbul-old-city.jpg",
      shortDesc: "استانبول با پرواز ترکیش، هتل ۵ ستاره و تور شهری کامل",
      description: "بازدید از ایاصوفیه، کاخ توپکاپی، بازار بزرگ، برج گالاتا و کروز تنگه بسفر. اقامت در هتل دیوان با صبحانه.",
      isFeatured: true,
    },
    {
      title: "تور دبی ۵ شب (ویژه نوروز)",
      slug: "tour-dubai-5-nights",
      category: "ASIA",
      destinationSlug: "dubai",
      transportId: "flydubai",
      duration: 6, nights: 5,
      transportType: "PLANE",
      startPrice: 13200000,
      thumbnail: "/images/tours/dubai-luxury.jpg",
      shortDesc: "۵ شب و ۶ روز دبی با هتل ۴ ستاره و ویزای رایگان",
      description: "شامل بازدید از برج خلیفه، دبی مال، کویر سفاری، کروز شام و فرودگاهی، اقامت در هتل ۴ ستاره.",
      isFeatured: true,
      isLastMinute: true,
    },
    {
      title: "تور مشهد با قطار ۳ شب",
      slug: "tour-mashhad-train-3-nights",
      category: "INTERNAL",
      destinationSlug: "mashhad",
      transportId: "raja",
      duration: 4, nights: 3,
      transportType: "TRAIN",
      startPrice: 3800000,
      thumbnail: "/images/tours/mashhad-pilgrimage.jpg",
      shortDesc: "۳ شب مشهد با قطار درجه یک، هتل نزدیک حرم",
      description: "رفت و برگشت با قطار ۵ ستاره رجا، اقامت در هتل ۳/۴ ستاره نزدیک حرم مطهر، صبحانه و بیمه.",
      isFeatured: true,
    },
    {
      title: "تور شیراز و تخت جمشید ۳ شب",
      slug: "tour-shiraz-3-nights",
      category: "INTERNAL",
      destinationSlug: "shiraz",
      transportId: "iran-air",
      duration: 4, nights: 3,
      transportType: "PLANE",
      startPrice: 6200000,
      thumbnail: "/images/tours/shiraz-culture.jpg",
      shortDesc: "شیراز، تخت جمشید، پاسارگاد و باغ ارم",
      description: "بازدید از آثار هخامنشی و صفوی شیراز، اقامت در هتل ۴ ستاره با صبحانه و ترانسفر.",
      isFeatured: false,
    },
    {
      title: "تور کیش ۴ شب ویژه تابستان",
      slug: "tour-kish-4-nights",
      category: "INTERNAL",
      destinationSlug: "kish",
      transportId: "iran-air",
      duration: 5, nights: 4,
      transportType: "PLANE",
      startPrice: 5800000,
      thumbnail: "/images/tours/kish-relax.jpg",
      shortDesc: "۴ شب کیش با هتل ساحلی و تفریحات دریایی",
      description: "اقامت در هتل ۴/۵ ستاره ساحلی، صبحانه، ترانسفر فرودگاهی و مشاوره برای تفریحات دریایی.",
      isFeatured: true,
    },
    {
      title: "تور تفلیس و باتومی ۶ شب",
      slug: "tour-tbilisi-batumi-6-nights",
      category: "EUROPE",
      destinationSlug: "tbilisi",
      transportId: "mahan",
      duration: 7, nights: 6,
      transportType: "PLANE",
      startPrice: 21500000,
      thumbnail: "/images/tours/tbilisi-adventure.jpg",
      shortDesc: "۶ شب گرجستان با پرواز مستقیم و هتل ۴ ستاره",
      description: "بازدید از تفلیس، باتومی، کلیسای سامبا، خیابان رستاولی و ساحل دریای سیاه. ویزا رایگان برای ایرانیان.",
      isFeatured: true,
    },
    {
      title: "تور پوکت ۷ شب (اقساطی)",
      slug: "tour-phuket-7-nights",
      category: "ASIA",
      destinationSlug: "phuket",
      transportId: "emirates",
      duration: 8, nights: 7,
      transportType: "PLANE",
      startPrice: 42500000,
      thumbnail: "/images/tours/bangkok-temples.jpg",
      shortDesc: "۷ شب پوکت با اقامت در هتل ۴ ستاره و صبحانه",
      description: "تور پوکت با پرواز امارات، اقامت در هتل ۴ ستاره پاتونگ، صبحانه، ترانسفر و پشتیبانی فارسی‌زبان.",
      isFeatured: false,
    },
    {
      title: "تور رم و واتیکان ۷ شب",
      slug: "tour-rome-7-nights",
      category: "EUROPE",
      destinationSlug: "rome",
      transportId: "turkish",
      duration: 8, nights: 7,
      transportType: "PLANE",
      startPrice: 68500000,
      thumbnail: "/images/tours/rome-history.jpg",
      shortDesc: "۷ شب ایتالیا با پرواز ترکیش و هتل ۴ ستاره",
      description: "بازدید از کولوسئوم، فروم رم، واتیکان، تریوی و موزه‌های معروف رم. ویزای شینگن لازم است.",
      isFeatured: false,
    },
    {
      title: "تور دبی ۳ شب لحظه‌آخری",
      slug: "tour-dubai-3-nights-last-minute",
      category: "ASIA",
      destinationSlug: "dubai",
      transportId: "flydubai",
      duration: 4, nights: 3,
      transportType: "PLANE",
      startPrice: 8900000,
      thumbnail: "/images/tours/dubai-luxury.jpg",
      shortDesc: "۳ شب دبی با قیمت استثنایی و اقامت ۳ ستاره",
      description: "مناسب سفرهای اقتصادی. هتل ۳ ستاره، صبحانه، ترانسفر و راهنمای فارسی.",
      isFeatured: false,
      isLastMinute: true,
    },
  ];

  const includesList = JSON.stringify(["پرواز/قطار رفت و برگشت", "اقامت در هتل انتخابی", "صبحانه", "ترانسفر فرودگاهی", "بیمه مسافرتی", "راهنمای فارسی‌زبان"]);
  const excludesList = JSON.stringify(["ویزا (در صورت نیاز)", "ناهار و شام (مگر ذکر شده)", "بازدیدهای اختیاری", "هزینه‌های شخصی"]);
  const reqsList = JSON.stringify(["گذرنامه با ۶ ماه اعتبار", "عکس ۴×۶ رنگی", "کارت واکسن یا تست در صورت لزوم"]);

  const tourIds: string[] = [];
  for (const t of toursInput) {
    const destId = destMap.get(t.destinationSlug);
    if (!destId) continue;
    const rec = await prisma.tour.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        title: t.title,
        slug: t.slug,
        category: t.category,
        destination: { connect: { id: destId } },
        transport: t.transportId ? { connect: { id: t.transportId } } : undefined,
        duration: t.duration,
        nights: t.nights,
        transportType: t.transportType,
        startPrice: t.startPrice,
        shortDesc: t.shortDesc,
        description: t.description,
        includes: includesList,
        excludes: excludesList,
        requirements: reqsList,
        status: "PUBLISHED",
        isFeatured: t.isFeatured,
        isLastMinute: t.isLastMinute ?? false,
        author: { connect: { id: admin.id } },
        publishedAt: new Date(),
        thumbnail: t.thumbnail || null,
        images: JSON.stringify(t.thumbnail ? [t.thumbnail] : []),
      },
    });
    tourIds.push(rec.id);
  }
  console.log("✅ Tours:", tourIds.length);

  // Tour dates
  const today = new Date();
  const dateBase = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
  for (let i = 0; i < tourIds.length; i++) {
    const tourId = tourIds[i];
    const departDate = new Date(dateBase);
    departDate.setDate(dateBase.getDate() + i * 7);
    const returnDate = new Date(departDate);
    returnDate.setDate(departDate.getDate() + (toursInput[i]?.nights ?? 5));
    await prisma.tourDate.create({
      data: {
        tour: { connect: { id: tourId } },
        departDate,
        returnDate,
        capacity: 25,
        remaining: 18,
        price: toursInput[i]?.startPrice ?? 0,
      },
    });
  }
  console.log("✅ Tour dates created");

  // 6. Reviews
  const reviewData = [
    { tourIndex: 0, name: "علی احمدی", rating: 5, title: "تور عالی و بی‌نقص", content: "آنتالیا عالی بود. هتل و خدمات ریوان سفر حرفه‌ای بود." },
    { tourIndex: 1, name: "سارا کریمی", rating: 5, title: "استانبول رویایی", content: "برنامه‌ریزی تور عالی بود. راهنما باتجربه و خوش‌برخورد بود." },
    { tourIndex: 2, name: "محمد رضایی", rating: 4, title: "دبی خوب بود", content: "سافاری و برج خلیفه عالی بودند." },
    { tourIndex: 3, name: "نرگس محمدی", rating: 5, title: "مشهد با قطار راحت", content: "قطار ۵ ستاره، هتل نزدیک حرم. همه چیز خوب بود." },
    { tourIndex: 6, name: "رضا نوری", rating: 5, title: "گرجستان شگفت‌انگیز", content: "طبیعت گرجستان و خدمات ریوان سفر عالی بود." },
    { tourIndex: 5, name: "مریم سلیمی", rating: 4, title: "کیش تابستانی", content: "هتل ساحلی خوب بود. تفریحات دریایی پیشنهاد می‌شود." },
  ];
  for (const r of reviewData) {
    const tourId = tourIds[r.tourIndex];
    if (!tourId) continue;
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) continue;
    await prisma.review.create({
      data: {
        tour: { connect: { id: tourId } },
        authorName: r.name,
        authorEmail: `${r.name.replace(/\s+/g, "").toLowerCase()}@example.com`,
        rating: r.rating,
        title: r.title,
        content: r.content,
        status: "APPROVED",
        tourTitle: tour.title,
      },
    });
  }
  console.log("✅ Reviews created");

  // 7. Branches
  const branchData = [
    { name: "دفتر مرکزی تهران", phone: "021-91012345", address: "خیابان ولیعصر، نرسیده به میدان ونک، ساختمان ریوان" },
    { name: "شعبه مشهد", phone: "051-38612345", address: "خیابان امام خمینی، نبش امام خمینی ۱۰" },
    { name: "شعبه اصفهان", phone: "031-34456789", address: "خیابان چهارباغ بالا، ساختمان سفیر" },
    { name: "شعبه شیراز", phone: "071-36234567", address: "خیابان زند، روبروی پارک آزادی" },
  ];
  for (const b of branchData) {
    await prisma.branch.upsert({
      where: { id: `branch-${b.name.replace(/\s+/g, "-").toLowerCase()}` },
      update: {},
      create: { id: `branch-${b.name.replace(/\s+/g, "-").toLowerCase()}`, name: b.name, phone: b.phone, address: b.address, isActive: true },
    });
  }
  console.log("✅ Branches created");

  // 8. Team members (Consultants)
  const teamData = [
    { name: "امیر رضایی", title: "مدیرعامل", bio: "بنیان‌گذار ریوان سفر با ۱۵ سال تجربه در صنعت گردشگری", image: "/images/team/ceo.jpg" },
    { name: "نگار صادقی", title: "مدیر فروش", bio: "متخصص برنامه‌ریزی تورهای لوکس و اروپایی", image: "/images/team/sales-manager.jpg" },
    { name: "حسن محمدی", title: "سرپرست تور", bio: "راهنمای بین‌المللی با تسلط به زبان‌های ترکی و انگلیسی", image: "/images/team/tour-leader.jpg" },
    { name: "مینا کریمی", title: "مشاور ویزا", bio: "کارشناس امور ویزا و پاسپورت", image: "/images/team/marketing.jpg" },
  ];
  for (const t of teamData) {
    await prisma.consultant.upsert({
      where: { id: `consultant-${t.name.replace(/\s+/g, "-").toLowerCase()}` },
      update: {},
      create: { id: `consultant-${t.name.replace(/\s+/g, "-").toLowerCase()}`, name: t.name, title: t.title, bio: t.bio, avatar: t.image, isActive: true },
    });
  }
  console.log("✅ Team created");

  // 9. Blog posts
  const blogData = [
    { title: "راهنمای کامل سفر به آنتالیا", slug: "guide-to-antalya", category: "GUIDE", excerpt: "همه چیز درباره سفر به آنتالیا: بهترین زمان، جاذبه‌ها و نکات", image: "/images/blog/antalya-guide.jpg" },
    { title: "شرایط ویزای دبی برای ایرانیان", slug: "dubai-visa-guide", category: "VISA", excerpt: "آیا برای سفر به دبی ویزا لازم است؟", image: "/images/blog/dubai-visa-guide.jpg" },
    { title: "بهترین زمان سفر به گرجستان", slug: "best-time-georgia", category: "GUIDE", excerpt: "گرجستان در چه فصلی زیباتر است؟", image: "/images/blog/best-time-georgia.jpg" },
    { title: "۱۰ نکته طلایی برای خرید تور ارزان", slug: "cheap-tour-tips", category: "TIPS", excerpt: "چطور تور مورد نظر را با بهترین قیمت بخرید", image: "/images/blog/travel-tips.jpg" },
  ];
  for (const b of blogData) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: `# ${b.title}\n\n${b.excerpt}\n\nمحتوای کامل مقاله در اینجا قرار می‌گیرد.`,
        category: b.category,
        status: "PUBLISHED",
        author: { connect: { id: admin.id } },
        publishedAt: new Date(),
        thumbnail: b.image,
      },
    });
  }
  console.log("✅ Blog posts created");

  // 10. Pages
  const pageData = [
    { title: "درباره ما", slug: "about", type: "STATIC", content: "# درباره ریوان سفر\n\nریوان سفر از سال ۱۳۹۵ فعالیت خود را در زمینه گردشگری آغاز کرده است. ما با تیمی متخصص، بهترین تورهای داخلی و خارجی را با قیمت رقابتی ارائه می‌دهیم." },
    { title: "قوانین و مقررات", slug: "terms", type: "STATIC", content: "# قوانین و مقررات\n\n۱. ثبت‌نام در تور به منزله پذیرش کلیه قوانین است.\n۲. کنسلی تور طبق قوانین سازمان هواپیمایی کشوری محاسبه می‌شود." },
    { title: "حریم خصوصی", slug: "privacy", type: "STATIC", content: "# حریم خصوصی\n\nاطلاعات شخصی شما نزد ریوان سفر محفوظ است و بدون اجازه در اختیار شخص ثالث قرار نمی‌گیرد." },
    { title: "سوالات متداول", slug: "faq", type: "STATIC", content: "# سوالات متداول\n\n## چطور تور رزرو کنم؟\nفرم مشاوره را پر کنید تا کارشناسان ما با شما تماس بگیرند." },
    { title: "شرایط کنسلی", slug: "cancellation", type: "STATIC", content: "# شرایط کنسلی\n\nکنسلی تا ۴۸ ساعت پیش از پرواز مشمول جریمه ۱۰٪، تا ۲۴ ساعت مشمول ۳۰٪ و پس از آن مشمول ۵۰٪ جریمه است." },
    { title: "همکاری با آژانس‌ها (B2B)", slug: "b2b", type: "STATIC", content: "# همکاری با آژانس‌های مسافرتی\n\nاگر آژانس مسافرتی دارید، با ثبت‌نام در پنل B2B ریوان سفر از تخفیفات ویژه و پورسانت استفاده کنید." },
    { title: "فرصت‌های شغلی", slug: "careers", type: "STATIC", content: "# فرصت‌های شغلی\n\nما همیشه به دنبال افراد باانگیزه و متخصص هستیم. رزومه خود را ارسال کنید." },
    { title: "کمپین تابستانه", slug: "summer-sale", type: "LANDING", campaignCta: "تخفیف‌های ویژه تابستان را از دست ندهید", campaignBanner: null, content: "# کمپین تابستانه ریوان سفر\n\nتخفیف ویژه تورهای داخلی و خارجی تا ۳۰٪" },
  ];
  for (const p of pageData) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        type: p.type,
        content: p.content,
        status: "PUBLISHED",
        campaignCta: p.campaignCta ?? null,
        campaignBanner: p.campaignBanner ?? null,
      },
    });
  }
  console.log("✅ Pages created");

  // 11. Global FAQs
  const faqData = [
    { question: "چطور می‌توانم تور مورد نظرم را رزرو کنم؟", answer: "فرم مشاوره را پر کنید. کارشناسان ما در کمتر از ۳۰ دقیقه با شما تماس می‌گیرند.", order: 1 },
    { question: "آیا امکان پرداخت اقساطی وجود دارد؟", answer: "بله، برای بسیاری از تورها امکان پرداخت چندمرحله‌ای وجود دارد.", order: 2 },
    { question: "مدارک لازم برای سفر خارجی چیست؟", answer: "گذرنامه معتبر، عکس و در صورت نیاز ویزا. مدارک دقیق هر تور در توضیحات آمده است.", order: 3 },
    { question: "شرایط کنسلی تور چگونه است؟", answer: "طبق قوانین سازمان هواپیمایی؛ جزئیات در صفحه شرایط کنسلی آمده است.", order: 4 },
  ];
  for (const f of faqData) {
    await prisma.tourFaq.create({
      data: { question: f.question, answer: f.answer, order: f.order, isGlobal: true },
    });
  }
  console.log("✅ FAQs created");

  // 12. Gallery items
  const galleryData = [
    { title: "ساحل کونیالتی آنتالیا", destination: "آنتالیا", image: "/images/gallery/gallery-1.jpg" },
    { title: "مسجد آبی استانبول", destination: "استانبول", image: "/images/gallery/gallery-2.jpg" },
    { title: "برج خلیفه دبی", destination: "دبی", image: "/images/gallery/gallery-3.jpg" },
    { title: "حرم مطهر مشهد", destination: "مشهد", image: "/images/gallery/gallery-4.jpg" },
    { title: "باغ ارم شیراز", destination: "شیراز", image: "/images/gallery/gallery-5.jpg" },
    { title: "پل صلح تفلیس", destination: "تفلیس", image: "/images/gallery/gallery-6.jpg" },
    { title: "سواحل کریستالی پوکت", destination: "پوکت", image: "/images/gallery/gallery-7.jpg" },
    { title: "دریاچه‌ای کوهستانی", destination: "طبیعت", image: "/images/gallery/gallery-8.jpg" },
    { title: "شفق‌های شمالی", destination: "طبیعت", image: "/images/gallery/gallery-9.jpg" },
    { title: "سواحل استوایی", destination: "استوایی", image: "/images/gallery/gallery-10.jpg" },
    { title: "پل گلدن گیت", destination: "آمریکا", image: "/images/gallery/gallery-11.jpg" },
    { title: "روستای کوهستانی", destination: "طبیعت", image: "/images/gallery/gallery-12.jpg" },
  ];
  for (const g of galleryData) {
    await prisma.galleryItem.create({
      data: { title: g.title, destination: g.destination, image: g.image },
    });
  }
  console.log("✅ Gallery created");

  // 13. Jobs
  const jobData = [
    { title: "کارشناس فروش تور", slug: "sales-specialist", type: "FULL_TIME", city: "تهران", department: "فروش" },
    { title: "مدیر محتوا", slug: "content-manager", type: "FULL_TIME", city: "تهران", department: "مارکتینگ" },
    { title: "کارآموز دیجیتال مارکتینگ", slug: "digital-marketing-intern", type: "INTERN", city: "تهران", department: "مارکتینگ" },
  ];
  for (const j of jobData) {
    await prisma.job.upsert({
      where: { slug: j.slug },
      update: {},
      create: { title: j.title, slug: j.slug, type: j.type, city: j.city, department: j.department, description: "جزئیات شغل", isActive: true },
    });
  }
  console.log("✅ Jobs created");

  // 14. Settings
  const settingData = [
    { key: "site_name", value: "ریوان سفر", group: "GENERAL", label: "نام سایت" },
    { key: "phone_primary", value: "021-91012345", group: "CONTACT", label: "تلفن اصلی" },
    { key: "phone_secondary", value: "021-91012346", group: "CONTACT", label: "تلفن دوم" },
    { key: "email", value: "info@rivansafar.com", group: "CONTACT", label: "ایمیل" },
    { key: "address", value: "تهران، خیابان ولیعصر، ساختمان ریوان", group: "CONTACT", label: "آدرس" },
    { key: "whatsapp", value: "+989101234567", group: "CONTACT", label: "واتساپ" },
    { key: "instagram", value: "https://instagram.com/rivansafar", group: "SOCIAL", label: "اینستاگرام" },
    { key: "telegram", value: "https://t.me/rivansafar", group: "SOCIAL", label: "تلگرام" },
  ];
  for (const s of settingData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value, group: s.group, label: s.label },
    });
  }
  console.log("✅ Settings created");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
