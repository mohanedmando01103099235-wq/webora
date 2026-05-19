import React, { useEffect, useMemo, useState } from "react";
import {
  Code2,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  Languages,
  Sparkles,
  Send,
  Trash2,
  Moon,
  Sun,
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  Settings,
  Star,
  Brain,
  Wand2,
  Rocket,
  LayoutTemplate,
  Store,
  Building2,
  Utensils,
  Dumbbell,
  UserRound,
  MonitorCog,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Search,
  Bell,
  ImagePlus,
} from "lucide-react";

const PHONE = "01103099235";
const PHONE_INT = "201103099235";
const EMAIL = "mohaned01103099235@gmail.com";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "01103099235";

const REVIEWS_KEY = "webora_reviews";
const SERVICES_KEY = "webora_services";
const REQUESTS_KEY = "webora_project_requests";
const THEME_KEY = "webora_theme";

const getGeminiApiKey = () => import.meta?.env?.VITE_GEMINI_API_KEY || "";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value || "");
  } catch {
    return fallback;
  }
};

const defaultServices = [
  {
    titleAr: "مواقع شركات",
    titleEn: "Business Websites",
    descAr: "مواقع احترافية تعرض خدمات الشركة وتزيد ثقة العملاء.",
    descEn: "Professional websites that present company services and build customer trust.",
    icon: "company",
  },
  {
    titleAr: "متاجر إلكترونية",
    titleEn: "E-Commerce Stores",
    descAr: "متاجر حديثة لعرض المنتجات وتجهيز تجربة شراء سهلة.",
    descEn: "Modern stores for displaying products and creating a smooth buying experience.",
    icon: "store",
  },
  {
    titleAr: "مواقع مطاعم",
    titleEn: "Restaurant Websites",
    descAr: "عرض المنيو، العروض، الصور، وطرق التواصل والحجز.",
    descEn: "Show menu, offers, photos, contact options, and reservations.",
    icon: "restaurant",
  },
  {
    titleAr: "مواقع جيم",
    titleEn: "Gym Websites",
    descAr: "عرض الاشتراكات، المدربين، البرامج التدريبية ووسائل التواصل.",
    descEn: "Display memberships, trainers, training programs, and contact methods.",
    icon: "gym",
  },
  {
    titleAr: "بروفايل شخصي",
    titleEn: "Personal Portfolio",
    descAr: "صفحة شخصية احترافية لعرض المهارات والأعمال والخبرات.",
    descEn: "A professional personal page to show skills, work, and experience.",
    icon: "profile",
  },
  {
    titleAr: "لوحات تحكم",
    titleEn: "Dashboards",
    descAr: "تصميم واجهات أنظمة ولوحات إدارة بشكل واضح وسهل الاستخدام.",
    descEn: "Clear and easy-to-use interfaces for systems and admin dashboards.",
    icon: "dashboard",
  },
];

const serviceIcons = {
  company: Building2,
  store: Store,
  restaurant: Utensils,
  gym: Dumbbell,
  profile: UserRound,
  dashboard: MonitorCog,
};

const generateRequestId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WB-${random}`;
};

export default function App() {
  const [language, setLanguage] = useState("ar");
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");
  const [loading, setLoading] = useState(true);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    titleAr: "",
    titleEn: "",
    descAr: "",
    descEn: "",
    icon: "company",
  });

  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const [advisor, setAdvisor] = useState({
    activity: "",
    goal: "",
    budget: "",
    speed: "",
    features: [],
  });
  const [advisorResult, setAdvisorResult] = useState("");

  const [requests, setRequests] = useState([]);
  const [requestForm, setRequestForm] = useState({
    name: "",
    phone: "",
    type: "",
    budget: "",
    deadline: "",
    description: "",
  });
  const [requestMessage, setRequestMessage] = useState("");

  const [trackingCode, setTrackingCode] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const isArabic = language === "ar";
  const isDark = theme === "dark";

  useEffect(() => {
    document.title = "Webora";
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const savedServices = safeParse(localStorage.getItem(SERVICES_KEY), []);
    const hasOldArabicOnlyServices =
      savedServices.length > 0 &&
      savedServices.some((service) => service.title && !service.titleEn);

    if (hasOldArabicOnlyServices) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
      setServices(defaultServices);
    } else {
      setServices(savedServices.length ? savedServices : defaultServices);
    }

    const savedReviews = safeParse(localStorage.getItem(REVIEWS_KEY), []);
    setReviews(savedReviews);

    const savedRequests = safeParse(localStorage.getItem(REQUESTS_KEY), []);
    setRequests(savedRequests);
  }, []);

  useEffect(() => {
    if (services.length) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    }
  }, [services]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }, [requests]);



  const t = {
    dir: isArabic ? "rtl" : "ltr",
    switch: isArabic ? "English" : "العربية",
    services: isArabic ? "الخدمات" : "Services",
    skills: isArabic ? "المهارات" : "Skills",
    contact: isArabic ? "تواصل" : "Contact",
    about: isArabic ? "من نحن" : "About Us",
    aiTools: isArabic ? "أدوات AI" : "AI Tools",
    startProject: isArabic ? "ابدأ مشروعك" : "Start Project",
    viewServices: isArabic ? "شاهد الخدمات" : "View Services",
    admin: isArabic ? "لوحة التحكم" : "Admin Panel",
    login: isArabic ? "دخول" : "Login",
    logout: isArabic ? "خروج" : "Logout",
    addService: isArabic ? "إضافة خدمة" : "Add Service",
    serviceTitleAr: isArabic ? "اسم الخدمة بالعربي" : "Arabic service title",
    serviceTitleEn: isArabic ? "اسم الخدمة بالإنجليزي" : "English service title",
    serviceDescAr: isArabic ? "وصف الخدمة بالعربي" : "Arabic service description",
    serviceDescEn: isArabic ? "وصف الخدمة بالإنجليزي" : "English service description",
    reviews: isArabic ? "شهادات العملاء" : "Testimonials",
    review: isArabic ? "أضف شهادتك" : "Add Testimonial",
    name: isArabic ? "اسمك" : "Your name",
    image: isArabic ? "صورتك اختيارية" : "Your photo optional",
    opinion: isArabic ? "اكتب رأيك باختصار" : "Write your opinion",
    send: isArabic ? "إرسال" : "Send",
    manageReviews: isArabic ? "إدارة التقييمات" : "Manage Reviews",
    currentServices: isArabic ? "الخدمات الحالية" : "Current Services",
    resetServices: isArabic ? "استرجاع الخدمات الأساسية" : "Reset default services",
    projectRequest: isArabic ? "طلب مشروع" : "Project Request",
    trackRequest: isArabic ? "تتبع الطلب" : "Track Request",
    requests: isArabic ? "طلبات العملاء" : "Client Requests",
    clientName: isArabic ? "اسم العميل" : "Client name",
    phoneNumber: isArabic ? "رقم الهاتف" : "Phone number",
    websiteType: isArabic ? "نوع الموقع" : "Website type",
    expectedBudget: isArabic ? "الميزانية المتوقعة" : "Expected budget",
    requiredDeadline: isArabic ? "موعد التسليم المطلوب" : "Required deadline",
    projectDescription: isArabic ? "اكتب وصف المشروع والمميزات المطلوبة" : "Describe your project and required features",
    submitRequest: isArabic ? "إرسال الطلب" : "Submit Request",
    chooseWebsiteType: isArabic ? "اختار نوع الموقع" : "Choose website type",
    ideaDetails: isArabic ? "اكتب تفاصيل فكرتك..." : "Write your idea details...",
    updateCurrentStatus: isArabic ? "تغيير الحالة الحالية" : "Update current status",
    writeClientUpdate: isArabic ? "اكتب تحديث جديد للعميل..." : "Write a new client update...",
    enterToAddUpdate: isArabic ? "اضغط Enter لإضافة التحديث" : "Press Enter to add update",
    delete: isArabic ? "حذف" : "Delete",
    noRequests: isArabic ? "لا توجد طلبات حالياً." : "No requests yet.",
    noReviews: isArabic ? "لا توجد تقييمات حالياً." : "No reviews yet.",
    uploadPhoto: isArabic ? "ارفع صورتك من الجهاز" : "Upload your photo",
    advisorTitle: isArabic ? "مستشار اختيار نوع الموقع" : "Smart Website Advisor",
    advisorDesc: isArabic
      ? "جاوب على الاختيارات التالية، والموقع هيقترح أنسب نوع موقع وأقسام ومميزات لمشروعك بدون ردود ثابتة."
      : "Answer the options below, and the site will recommend the best website type, sections, and features without fixed replies.",
    activityType: isArabic ? "نوع النشاط" : "Business activity",
    mainGoal: isArabic ? "هدف الموقع" : "Website goal",
    budgetLevel: isArabic ? "الميزانية" : "Budget",
    deliverySpeed: isArabic ? "سرعة التنفيذ" : "Delivery speed",
    neededFeatures: isArabic ? "المميزات المطلوبة" : "Needed features",
    getRecommendation: isArabic ? "اعرض التوصية" : "Get Recommendation",
    chooseOption: isArabic ? "اختار" : "Choose",
  };

  const websiteTypes = [
    { value: "landing-page", ar: "صفحة هبوط", en: "Landing Page" },
    { value: "business-website", ar: "موقع شركة", en: "Business Website" },
    { value: "ecommerce-store", ar: "متجر إلكتروني", en: "E-Commerce Store" },
    { value: "restaurant-website", ar: "موقع مطعم", en: "Restaurant Website" },
    { value: "gym-website", ar: "موقع جيم", en: "Gym Website" },
    { value: "personal-portfolio", ar: "بروفايل شخصي", en: "Personal Portfolio" },
    { value: "dashboard-system", ar: "لوحة تحكم", en: "Dashboard System" },
  ];

  const getWebsiteTypeLabel = (value) => {
    const item = websiteTypes.find((type) => type.value === value);
    if (!item) return value || "";
    return isArabic ? item.ar : item.en;
  };

  const advisorOptions = {
    activities: [
      { value: "restaurant", ar: "مطعم أو كافيه", en: "Restaurant or Cafe" },
      { value: "store", ar: "متجر أو بيع منتجات", en: "Store or Products" },
      { value: "company", ar: "شركة أو خدمة", en: "Company or Service" },
      { value: "gym", ar: "جيم أو مركز تدريب", en: "Gym or Training Center" },
      { value: "personal", ar: "بروفايل شخصي", en: "Personal Portfolio" },
    ],
    goals: [
      { value: "sales", ar: "زيادة المبيعات", en: "Increase sales" },
      { value: "trust", ar: "تعريف العملاء بالخدمة", en: "Build trust and explain services" },
      { value: "booking", ar: "استقبال حجوزات أو طلبات", en: "Receive bookings or requests" },
      { value: "portfolio", ar: "عرض الأعمال والخبرات", en: "Show portfolio and experience" },
    ],
    budgets: [
      { value: "low", ar: "اقتصادية", en: "Low" },
      { value: "medium", ar: "متوسطة", en: "Medium" },
      { value: "high", ar: "مفتوحة", en: "Flexible" },
    ],
    speeds: [
      { value: "fast", ar: "سريع", en: "Fast" },
      { value: "normal", ar: "عادي", en: "Normal" },
      { value: "advanced", ar: "مهم الجودة حتى لو وقت أطول", en: "Quality first" },
    ],
    features: [
      { value: "whatsapp", ar: "زر واتساب", en: "WhatsApp Button" },
      { value: "reviews", ar: "تقييمات العملاء", en: "Customer Reviews" },
      { value: "admin", ar: "لوحة تحكم", en: "Admin Dashboard" },
      { value: "tracking", ar: "تتبع الطلبات", en: "Order Tracking" },
      { value: "gallery", ar: "معرض صور", en: "Gallery" },
    ],
  };

  const getAdvisorLabel = (list, value) => {
    const item = list.find((option) => option.value === value);
    if (!item) return "";
    return isArabic ? item.ar : item.en;
  };

  const getDefaultServiceByIcon = (icon) => {
    return defaultServices.find((service) => service.icon === icon);
  };

  const getServiceTitle = (service) => {
    const fallback = getDefaultServiceByIcon(service.icon);

    if (isArabic) {
      return service.titleAr || fallback?.titleAr || service.title || "";
    }

    return service.titleEn || fallback?.titleEn || service.title || "";
  };

  const getServiceDesc = (service) => {
    const fallback = getDefaultServiceByIcon(service.icon);

    if (isArabic) {
      return service.descAr || fallback?.descAr || service.desc || "";
    }

    return service.descEn || fallback?.descEn || service.desc || "";
  };

  const colors = {
    pageBg: isDark
      ? "linear-gradient(135deg, #06111f 0%, #071827 48%, #020617 100%)"
      : "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 55%, #ffffff 100%)",
    text: isDark ? "#f8fafc" : "#0f172a",
    muted: isDark ? "#cbd5e1" : "#475569",
    card: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.9)",
    card2: isDark ? "rgba(15,23,42,.78)" : "rgba(241,245,249,.95)",
    border: isDark ? "rgba(255,255,255,.12)" : "rgba(15,23,42,.12)",
    nav: isDark ? "rgba(2,6,23,.9)" : "rgba(255,255,255,.9)",
    input: isDark ? "rgba(15,23,42,.9)" : "rgba(255,255,255,.95)",
  };

  const styles = {
    page: {
      background: colors.pageBg,
      minHeight: "100vh",
      color: colors.text,
      fontFamily: isArabic ? "Tahoma, Arial, sans-serif" : "Inter, Arial, sans-serif",
      lineHeight: 1.8,
      transition: ".35s ease",
    },
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: colors.nav,
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${colors.border}`,
    },
    navInner: {
      maxWidth: "1200px",
      margin: "auto",
      padding: "18px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "18px",
      flexWrap: "wrap",
    },
    navLink: {
      color: colors.text,
      textDecoration: "none",
      padding: "10px 18px",
      borderRadius: "999px",
      background: colors.card,
      border: `1px solid ${colors.border}`,
      fontWeight: 800,
      transition: ".25s ease",
    },
    button: {
      border: "none",
      borderRadius: "16px",
      padding: "14px 24px",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: 800,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: ".25s ease",
      textDecoration: "none",
    },
    card: {
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: "26px",
      padding: "24px",
      boxShadow: isDark ? "none" : "0 20px 50px rgba(15,23,42,.08)",
    },
    input: {
      width: "100%",
      padding: "13px 15px",
      marginBottom: "12px",
      borderRadius: "14px",
      border: `1px solid ${colors.border}`,
      outline: "none",
      fontSize: "16px",
      background: colors.input,
      color: colors.text,
    },
    section: {
      maxWidth: "1200px",
      margin: "auto",
      padding: "70px 24px",
    },
  };

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${PHONE_INT}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const openPhone = () => {
    window.location.href = `tel:+${PHONE_INT}`;
  };

  const openEmail = () => {
    window.location.href = `mailto:${EMAIL}`;
  };

  const submitReview = () => {
    if (!reviewName.trim() || !reviewText.trim()) {
      setReviewMessage(isArabic ? "اكتب الاسم والرأي أولاً" : "Please enter name and opinion first");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      image:
        reviewImage.trim() ||
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=300&auto=format&fit=crop",
      text: reviewText.trim(),
      stars: 5,
      role: isArabic ? "عميل Webora" : "Webora Client",
      date: new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US"),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));

    setReviewName("");
    setReviewText("");
    setReviewImage("");
    setReviewMessage(isArabic ? "تم إضافة تقييمك بنجاح ✅" : "Your testimonial has been added ✅");
  };

  const deleteReview = (id) => {
    if (!isAdmin) return;
    const updated = reviews.filter((review) => review.id !== id);
    setReviews(updated);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  };

  const handleReviewImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setReviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const loginAdmin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword("");
      setAdminMsg(isArabic ? "تم تسجيل الدخول بنجاح ✅" : "Logged in successfully ✅");
    } else {
      setAdminMsg(isArabic ? "كلمة السر غير صحيحة" : "Wrong password");
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminMsg("");
  };

  const addService = () => {
    if (
      !newService.titleAr.trim() ||
      !newService.titleEn.trim() ||
      !newService.descAr.trim() ||
      !newService.descEn.trim()
    ) {
      setAdminMsg(isArabic ? "اكتب بيانات الخدمة بالعربي والإنجليزي" : "Please add service data in Arabic and English");
      return;
    }

    setServices((prev) => [
      {
        ...newService,
        titleAr: newService.titleAr.trim(),
        titleEn: newService.titleEn.trim(),
        descAr: newService.descAr.trim(),
        descEn: newService.descEn.trim(),
      },
      ...prev,
    ]);

    setNewService({
      titleAr: "",
      titleEn: "",
      descAr: "",
      descEn: "",
      icon: "company",
    });

    setAdminMsg(isArabic ? "تم إضافة الخدمة ✅" : "Service added ✅");
  };

  const deleteService = (index) => {
    if (!isAdmin) return;
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const resetServices = () => {
    setServices(defaultServices);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
  };


  const submitProjectRequest = () => {
    if (!requestForm.name.trim() || !requestForm.phone.trim() || !requestForm.type.trim() || !requestForm.description.trim()) {
      setRequestMessage(isArabic ? "اكتب الاسم والرقم ونوع الموقع والوصف" : "Please add name, phone, website type, and description");
      return;
    }

    const initialStatus = isArabic ? "تم استلام الطلب" : "Request received";

    const newRequest = {
      id: generateRequestId(),
      ...requestForm,
      status: initialStatus,
      createdAt: new Date().toLocaleString(isArabic ? "ar-EG" : "en-US"),
      updates: [
        {
          id: Date.now(),
          text: initialStatus,
          date: new Date().toLocaleString(isArabic ? "ar-EG" : "en-US"),
        },
      ],
    };

    setRequests((prev) => [newRequest, ...prev]);
    setRequestForm({ name: "", phone: "", type: "", budget: "", deadline: "", description: "" });
    setRequestMessage(
      isArabic
        ? `تم إرسال طلبك بنجاح ✅ رقم التتبع: ${newRequest.id}`
        : `Your request was sent ✅ Tracking ID: ${newRequest.id}`
    );
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
  };

  const addRequestUpdate = (id, updateText) => {
    const cleanUpdate = updateText.trim();

    if (!cleanUpdate) {
      alert(isArabic ? "اكتب التحديث أولاً" : "Write the update first");
      return;
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: cleanUpdate,
              updates: [
                {
                  id: Date.now(),
                  text: cleanUpdate,
                  date: new Date().toLocaleString(isArabic ? "ar-EG" : "en-US"),
                },
                ...(req.updates || []),
              ],
            }
          : req
      )
    );
  };

  const deleteRequest = (id) => {
    if (!isAdmin) return;
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const trackRequest = () => {
    const found = requests.find((req) => req.id.toLowerCase() === trackingCode.trim().toLowerCase());
    setTrackingResult(found || null);
  };


  const toggleAdvisorFeature = (feature) => {
    setAdvisor((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((item) => item !== feature)
          : [...prev.features, feature],
      };
    });
  };

  const generateAdvisorRecommendation = () => {
    if (!advisor.activity || !advisor.goal || !advisor.budget || !advisor.speed) {
      setAdvisorResult(
        isArabic
          ? "من فضلك اختار نوع النشاط والهدف والميزانية وسرعة التنفيذ أولاً."
          : "Please choose activity, goal, budget, and delivery speed first."
      );
      return;
    }

    let websiteType = isArabic ? "موقع تعريفي احترافي" : "Professional Business Website";
    let complexity = isArabic ? "متوسط" : "Medium";
    let advice = isArabic
      ? "ابدأ بنسخة بسيطة قابلة للتطوير ثم أضف مميزات أكثر بعد تجربة العملاء."
      : "Start with a simple scalable version, then add advanced features after customer feedback.";

    const sections = [
      isArabic ? "واجهة رئيسية قوية" : "Strong Hero Section",
      isArabic ? "نبذة عن المشروع" : "About Section",
      isArabic ? "الخدمات" : "Services",
      isArabic ? "تواصل سريع" : "Quick Contact",
    ];

    const features = [...advisor.features];

    if (advisor.activity === "store" || advisor.goal === "sales") {
      websiteType = isArabic ? "متجر إلكتروني أو صفحة بيع" : "E-Commerce Store or Sales Page";
      sections.push(isArabic ? "المنتجات" : "Products", isArabic ? "العروض" : "Offers");
      if (!features.includes("whatsapp")) features.push("whatsapp");
      complexity = advisor.budget === "low" ? (isArabic ? "متوسط" : "Medium") : (isArabic ? "عالي" : "High");
    }

    if (advisor.activity === "restaurant") {
      websiteType = isArabic ? "موقع مطعم أو كافيه" : "Restaurant or Cafe Website";
      sections.push(isArabic ? "المنيو" : "Menu", isArabic ? "صور المكان" : "Place Photos");
      if (!features.includes("gallery")) features.push("gallery");
    }

    if (advisor.activity === "gym") {
      websiteType = isArabic ? "موقع جيم أو مركز تدريب" : "Gym or Training Center Website";
      sections.push(isArabic ? "الاشتراكات" : "Memberships", isArabic ? "المدربين" : "Trainers");
    }

    if (advisor.activity === "personal" || advisor.goal === "portfolio") {
      websiteType = isArabic ? "بروفايل شخصي احترافي" : "Professional Portfolio Website";
      sections.push(isArabic ? "المهارات" : "Skills", isArabic ? "الأعمال السابقة" : "Previous Work");
      complexity = isArabic ? "بسيط إلى متوسط" : "Simple to Medium";
    }

    if (advisor.goal === "booking") {
      sections.push(isArabic ? "نموذج طلب / حجز" : "Request / Booking Form");
      if (!features.includes("tracking")) features.push("tracking");
      complexity = isArabic ? "متوسط إلى عالي" : "Medium to High";
    }

    if (advisor.budget === "low") {
      advice = isArabic
        ? "الأفضل تبدأ بصفحة تعريفية Landing Page فيها الخدمات والتواصل والتقييمات، وبعدها تطورها."
        : "Start with a Landing Page that includes services, contact, and reviews, then expand later.";
    } else if (advisor.budget === "high") {
      advice = isArabic
        ? "مناسب تعمل موقع كامل بلوحة تحكم وتتبع طلبات وتجربة مستخدم قوية."
        : "A full website with admin dashboard, request tracking, and strong UX is suitable.";
    }

    const featureLabels = features.length
      ? features.map((feature) => getAdvisorLabel(advisorOptions.features, feature)).filter(Boolean)
      : [isArabic ? "زر تواصل سريع" : "Quick contact button"];

    const result = isArabic
      ? `✅ نوع الموقع المناسب لك:\n${websiteType}\n\n🎯 الهدف:\n${getAdvisorLabel(advisorOptions.goals, advisor.goal)}\n\n📌 الأقسام المقترحة:\n- ${sections.join("\n- ")}\n\n⚙️ المميزات المناسبة:\n- ${featureLabels.join("\n- ")}\n\n📊 درجة التعقيد:\n${complexity}\n\n💡 النصيحة:\n${advice}`
      : `✅ Recommended Website Type:\n${websiteType}\n\n🎯 Goal:\n${getAdvisorLabel(advisorOptions.goals, advisor.goal)}\n\n📌 Suggested Sections:\n- ${sections.join("\n- ")}\n\n⚙️ Suitable Features:\n- ${featureLabels.join("\n- ")}\n\n📊 Complexity:\n${complexity}\n\n💡 Advice:\n${advice}`;

    setAdvisorResult(result);
  };

  const currentTestimonial = useMemo(() => {
    if (!reviews.length) return null;
    return reviews[testimonialIndex % reviews.length];
  }, [reviews, testimonialIndex]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#020617,#071827)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "22px",
            background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 1.2s infinite",
          }}
        >
          <Code2 size={34} />
        </div>
        <h2 style={{ margin: 0 }}>Webora loading...</h2>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: .8; }
            50% { transform: scale(1.08); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div dir={t.dir} style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        a:hover, button:hover { transform: translateY(-2px); filter: brightness(1.08); }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        .fade-up { animation: fadeUp .7s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 700px) {
          h1 { font-size: 42px !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                background: "linear-gradient(135deg,#2563eb,#06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Code2 size={25} />
            </div>
            <h2
  style={{
    margin: 0,
    fontWeight: "900",
    fontSize: "34px",
    color: "#38bdf8",
    textShadow: "0 0 18px rgba(56,189,248,.85)",
    letterSpacing: "1px",
  }}
>
  Webora
</h2>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: t.services, href: "#services" },
              { label: t.projectRequest, href: "#request" },
              { label: t.trackRequest, href: "#tracking" },
              { label: t.contact, href: "#contact" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={styles.navLink}>
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setLanguage(isArabic ? "en" : "ar")}
              style={{ ...styles.button, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", padding: "12px 18px" }}
            >
              <Languages size={18} /> {t.switch}
            </button>
            <button
              onClick={() => setAdminOpen(true)}
              style={{ ...styles.button, background: "linear-gradient(135deg,#7c3aed,#2563eb)", padding: "12px 15px" }}
            >
              <Settings size={18} />
            </button>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              style={{ ...styles.button, background: isDark ? "#f59e0b" : "#0f172a", padding: "12px 15px" }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <section
        className="fade-up"
        style={{
          ...styles.section,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "60px",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(34,211,238,.12)",
              color: "#06b6d4",
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid rgba(34,211,238,.18)",
              fontWeight: 900,
              marginBottom: 22,
            }}
          >
            <Sparkles size={18} /> AI Powered Web Development
          </div>

          <h1 style={{ fontSize: 62, lineHeight: 1.12, margin: "0 0 20px", fontWeight: 950 }}>
            Build Smart Websites With AI
          </h1>

          <p style={{ fontSize: 21, color: colors.muted, marginBottom: 20 }}>
            {isArabic
              ? "Webora يساعد أصحاب المشاريع على بناء مواقع ويب حديثة وسريعة ومدعومة بأدوات الذكاء الاصطناعي، مع تصميم مناسب لطبيعة كل نشاط."
              : "Webora helps businesses build modern, fast, AI-powered websites with designs tailored to each business type."}
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: 30 }}>
            <a href="#request" style={{ ...styles.button, background: "linear-gradient(135deg,#2563eb,#06b6d4)" }}>
              <Rocket size={19} /> {t.startProject}
            </a>
            <a
              href="#services"
              style={{ ...styles.button, background: isDark ? "white" : "#0f172a", color: isDark ? "#020617" : "white" }}
            >
              <LayoutTemplate size={19} /> {t.viewServices}
            </a>
          </div>
        </div>

        <div
          className="float"
          style={{
            ...styles.card,
            padding: 12,
            background: "linear-gradient(135deg,rgba(37,99,235,.35),rgba(6,182,212,.16))",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"
            alt="AI website"
            style={{ width: "100%", height: 440, objectFit: "cover", borderRadius: 22, display: "block" }}
          />
        </div>
      </section>

      <section id="services" style={styles.section}>
        <h2 style={{ fontSize: 42, marginBottom: 12 }}>{t.services}</h2>
        <p style={{ color: colors.muted, fontSize: 18, marginBottom: 30 }}>
          {isArabic
            ? "الموقع يوضح للعميل أنواع المواقع والخدمات التي يمكن تنفيذها بشكل احترافي."
            : "The website explains the types of websites and services Webora can build professionally."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(245px,1fr))", gap: 20 }}>
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon] || CheckCircle;
            return (
              <div key={`${service.title}-${index}`} style={styles.card}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    background: "rgba(6,182,212,.12)",
                    color: "#06b6d4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Icon size={26} />
                </div>
                <h3 style={{ margin: "0 0 8px" }}>{getServiceTitle(service)}</h3>
                <p style={{ color: colors.muted, margin: 0 }}>{getServiceDesc(service)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="request" style={styles.section}>
        <div style={{ ...styles.card, background: "linear-gradient(135deg,rgba(37,99,235,.18),rgba(6,182,212,.10))" }}>
          <h2 style={{ fontSize: 38, marginTop: 0 }}>
            <ClipboardList size={32} /> {t.projectRequest}
          </h2>
          <p style={{ color: colors.muted }}>
            {isArabic
              ? "املأ بيانات مشروعك، وهيظهر لك رقم تتبع تقدر تستخدمه لمعرفة حالة الطلب."
              : "Fill in your project details and get a tracking ID to check request status."}
          </p>

          {requestMessage && <p style={{ color: "#22c55e", fontWeight: 800 }}>{requestMessage}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
            <input
              value={requestForm.name}
              onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
              placeholder={t.clientName}
              style={styles.input}
            />
            <input
              value={requestForm.phone}
              onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
              placeholder={t.phoneNumber}
              style={styles.input}
            />
            <select
              value={requestForm.type}
              onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
              style={styles.input}
            >
              <option value="">{t.websiteType}</option>
              {websiteTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {isArabic ? type.ar : type.en}
                </option>
              ))}
            </select>
            <input
              value={requestForm.budget}
              onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
              placeholder={t.expectedBudget}
              style={styles.input}
            />
            <input
              value={requestForm.deadline}
              onChange={(e) => setRequestForm({ ...requestForm, deadline: e.target.value })}
              placeholder={t.requiredDeadline}
              style={styles.input}
            />
          </div>

          <textarea
            value={requestForm.description}
            onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
            placeholder={t.projectDescription}
            style={{ ...styles.input, height: 110, resize: "none" }}
          />

          <button onClick={submitProjectRequest} style={{ ...styles.button, background: "linear-gradient(135deg,#2563eb,#06b6d4)" }}>
            <Send size={18} /> {t.submitRequest}
          </button>
        </div>
      </section>

      <section id="tracking" style={{ ...styles.section, paddingTop: 20 }}>
        <div style={styles.card}>
          <h2 style={{ fontSize: 34, marginTop: 0 }}>
            <Search size={28} /> {t.trackRequest}
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="WB-1234"
              style={{ ...styles.input, flex: 1, minWidth: 220, marginBottom: 0 }}
            />
            <button onClick={trackRequest} style={{ ...styles.button, background: "#2563eb" }}>
              <Search size={18} /> {isArabic ? "تتبع" : "Track"}
            </button>
          </div>

          {trackingCode && !trackingResult && (
            <p style={{ color: colors.muted }}>{isArabic ? "اكتب رقم التتبع واضغط تتبع." : "Enter tracking ID and click Track."}</p>
          )}

          {trackingResult && (
            <div style={{ background: colors.card2, border: `1px solid ${colors.border}`, borderRadius: 18, padding: 18, marginTop: 18 }}>
              <h3 style={{ marginTop: 0 }}>{trackingResult.id}</h3>
              <p><strong>{isArabic ? "الحالة:" : "Status:"}</strong> {trackingResult.status}</p>
              <p><strong>{isArabic ? "نوع الموقع:" : "Type:"}</strong> {getWebsiteTypeLabel(trackingResult.type)}</p>
              <p><strong>{isArabic ? "تاريخ الإرسال:" : "Created:"}</strong> {trackingResult.createdAt}</p>

              <h4 style={{ marginBottom: "10px" }}>
                {isArabic ? "آخر تحديثات المشروع" : "Project Updates"}
              </h4>

              <div style={{ display: "grid", gap: "10px" }}>
                {(trackingResult.updates || []).length === 0 ? (
                  <p style={{ color: colors.muted }}>
                    {isArabic ? "لا توجد تحديثات حتى الآن." : "No updates yet."}
                  </p>
                ) : (
                  (trackingResult.updates || []).map((update) => (
                    <div
                      key={update.id}
                      style={{
                        background: colors.card,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "14px",
                        padding: "12px",
                      }}
                    >
                      <strong style={{ color: "#06b6d4" }}>{update.text}</strong>
                      <br />
                      <small style={{ color: colors.muted }}>{update.date}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="about" style={styles.section}>
        <div
          style={{
            ...styles.card,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 30,
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: 42, marginTop: 0 }}>{t.about}</h2>
            <p style={{ color: colors.muted, fontSize: 18 }}>
              {isArabic
                ? "Webora هو موقع تعريفي لخدمات تصميم وتطوير مواقع الويب باستخدام أدوات حديثة وذكاء اصطناعي. الهدف هو مساعدة العميل على فهم نوع الموقع المناسب لفكرته وطريقة تنفيذه بشكل احترافي."
                : "Webora is a service website for web design and development using modern tools and AI. The goal is to help clients understand the best website type and design for their idea."}
            </p>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {["Modern Design", "Responsive Layout", "AI Planning", "Fast Deployment"].map((item) => (
              <div
                key={item}
                style={{
                  background: colors.card2,
                  padding: 16,
                  borderRadius: 16,
                  border: `1px solid ${colors.border}`,
                  fontWeight: 900,
                }}
              >
                <CheckCircle size={18} color="#06b6d4" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-tools" style={styles.section}>
        <h2 style={{ fontSize: 42, marginBottom: 30 }}>{t.aiTools}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
          {["ChatGPT", "Gemini", "Firebase", "Canva AI", "Vercel"].map((tool) => (
            <div key={tool} style={{ ...styles.card, textAlign: "center" }}>
              <Brain color="#06b6d4" />
              <h3>{tool}</h3>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={{ ...styles.card, background: "linear-gradient(135deg,rgba(37,99,235,.22),rgba(6,182,212,.12))" }}>
          <h2 style={{ fontSize: 38, marginTop: 0 }}>
            <Wand2 size={32} /> {t.advisorTitle}
          </h2>

          <p style={{ color: colors.muted }}>
            {t.advisorDesc}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
            <select
              value={advisor.activity}
              onChange={(e) => setAdvisor({ ...advisor, activity: e.target.value })}
              style={styles.input}
            >
              <option value="">{t.activityType}</option>
              {advisorOptions.activities.map((option) => (
                <option key={option.value} value={option.value}>
                  {isArabic ? option.ar : option.en}
                </option>
              ))}
            </select>

            <select
              value={advisor.goal}
              onChange={(e) => setAdvisor({ ...advisor, goal: e.target.value })}
              style={styles.input}
            >
              <option value="">{t.mainGoal}</option>
              {advisorOptions.goals.map((option) => (
                <option key={option.value} value={option.value}>
                  {isArabic ? option.ar : option.en}
                </option>
              ))}
            </select>

            <select
              value={advisor.budget}
              onChange={(e) => setAdvisor({ ...advisor, budget: e.target.value })}
              style={styles.input}
            >
              <option value="">{t.budgetLevel}</option>
              {advisorOptions.budgets.map((option) => (
                <option key={option.value} value={option.value}>
                  {isArabic ? option.ar : option.en}
                </option>
              ))}
            </select>

            <select
              value={advisor.speed}
              onChange={(e) => setAdvisor({ ...advisor, speed: e.target.value })}
              style={styles.input}
            >
              <option value="">{t.deliverySpeed}</option>
              {advisorOptions.speeds.map((option) => (
                <option key={option.value} value={option.value}>
                  {isArabic ? option.ar : option.en}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ marginBottom: "10px" }}>{t.neededFeatures}</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
            {advisorOptions.features.map((feature) => {
              const selected = advisor.features.includes(feature.value);

              return (
                <button
                  key={feature.value}
                  onClick={() => toggleAdvisorFeature(feature.value)}
                  style={{
                    ...styles.button,
                    padding: "10px 14px",
                    background: selected
                      ? "linear-gradient(135deg,#2563eb,#06b6d4)"
                      : colors.card2,
                    color: selected ? "white" : colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {isArabic ? feature.ar : feature.en}
                </button>
              );
            })}
          </div>

          <button
            onClick={generateAdvisorRecommendation}
            style={{
              ...styles.button,
              background: "linear-gradient(135deg,#7c3aed,#2563eb)",
            }}
          >
            <Wand2 size={18} /> {t.getRecommendation}
          </button>

          {advisorResult && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: colors.card2,
                border: `1px solid ${colors.border}`,
                color: colors.text,
                padding: 18,
                borderRadius: 18,
                marginTop: 18,
                fontFamily: "inherit",
                lineHeight: 1.8,
              }}
            >
              {advisorResult}
            </pre>
          )}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={{ fontSize: 42, marginBottom: 30 }}>{t.reviews}</h2>

        {!reviews.length ? (
          <div style={{ ...styles.card, textAlign: "center" }}>
            <p style={{ color: colors.muted, fontSize: 18, margin: 0 }}>
              {isArabic ? "لا توجد شهادات عملاء حتى الآن. كن أول من يضيف رأيه." : "No customer testimonials yet. Be the first to add yours."}
            </p>
          </div>
        ) : (
          currentTestimonial && (
            <div style={{ ...styles.card, textAlign: "center", maxWidth: 760, margin: "auto" }}>
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #06b6d4",
                }}
              />

              <h3 style={{ marginBottom: 0 }}>{currentTestimonial.name}</h3>
              <p style={{ color: colors.muted, marginTop: 0 }}>{currentTestimonial.role}</p>

              <div style={{ display: "flex", justifyContent: "center", gap: 4, color: "#f59e0b", marginBottom: 12 }}>
                {Array.from({ length: currentTestimonial.stars || 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p style={{ fontSize: 18, color: colors.muted }}>"{currentTestimonial.text}"</p>

              {reviews.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                  <button
                    onClick={() => setTestimonialIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                    style={{ ...styles.button, background: "#334155", padding: "10px 14px" }}
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setTestimonialIndex((prev) => (prev + 1) % reviews.length)}
                    style={{ ...styles.button, background: "#2563eb", padding: "10px 14px" }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </section>

      <section id="contact" style={{ ...styles.section, paddingTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>{t.review}</h2>

            {reviewMessage && <p style={{ color: "#22c55e" }}>{reviewMessage}</p>}

            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder={t.name} style={styles.input} />
            <label
              style={{
                ...styles.button,
                width: "100%",
                background: "#0f766e",
                marginBottom: "12px",
              }}
            >
              <ImagePlus size={18} />
              {t.uploadPhoto}
              <input type="file" accept="image/*" onChange={handleReviewImageFile} style={{ display: "none" }} />
            </label>
            {reviewImage && (
              <img
                src={reviewImage}
                alt="review preview"
                style={{
                  width: "82px",
                  height: "82px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #06b6d4",
                  marginBottom: "12px",
                }}
              />
            )}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t.opinion}
              style={{ ...styles.input, height: 100, resize: "none" }}
            />

            <button onClick={submitReview} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg,#2563eb,#06b6d4)" }}>
              <Send size={18} /> {t.send}
            </button>
          </div>

          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>{t.contact}</h2>

            <div style={{ display: "grid", gap: 12 }}>
              <button
                onClick={() => openWhatsApp("Hello, I want a smart website")}
                style={{ ...styles.button, background: "linear-gradient(135deg,#2563eb,#06b6d4)" }}
              >
                <MessageCircle size={18} /> WhatsApp
              </button>

              <button onClick={openPhone} style={{ ...styles.button, background: "linear-gradient(135deg,#16a34a,#22c55e)" }}>
                <Phone size={18} /> {PHONE}
              </button>

              <button onClick={openEmail} style={{ ...styles.button, background: "linear-gradient(135deg,#dc2626,#ef4444)" }}>
                <Mail size={18} /> Gmail
              </button>
            </div>
          </div>
        </div>
      </section>

      {adminOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            background: "rgba(0,0,0,.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "min(1100px,100%)",
              maxHeight: "92vh",
              overflowY: "auto",
              background: isDark ? "#020617" : "#ffffff",
              color: colors.text,
              borderRadius: 26,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 30px 90px rgba(0,0,0,.45)",
            }}
          >
            <div
              style={{
                padding: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <strong style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 20 }}>
                <ShieldCheck size={22} /> {t.admin}
              </strong>

              <button
                onClick={() => setAdminOpen(false)}
                style={{ background: "transparent", border: "none", color: colors.text, cursor: "pointer", fontSize: 22 }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 22 }}>
              {!isAdmin ? (
                <div style={{ maxWidth: 430, margin: "auto" }}>
                  <div style={{ textAlign: "center", marginBottom: 22 }}>
                    <div
                      style={{
                        width: 75,
                        height: 75,
                        margin: "0 auto 16px",
                        borderRadius: 24,
                        background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <ShieldCheck size={36} />
                    </div>

                    <h2 style={{ margin: "0 0 8px" }}>Admin Panel</h2>
                    <p style={{ margin: 0, color: colors.muted }}>Secure access for Webora management</p>
                  </div>

                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loginAdmin()}
                    placeholder={isArabic ? "كلمة سر الأدمن" : "Admin password"}
                    style={styles.input}
                  />

                  <button onClick={loginAdmin} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                    <Lock size={18} /> {t.login}
                  </button>

                  {adminMsg && <p style={{ color: "#ef4444" }}>{adminMsg}</p>}
                </div>
              ) : (
                <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={styles.card}>
                    <h3 style={{ marginTop: 0 }}>{t.addService}</h3>

                    <input
                      value={newService.titleAr}
                      onChange={(e) => setNewService({ ...newService, titleAr: e.target.value })}
                      placeholder={t.serviceTitleAr}
                      style={styles.input}
                    />

                    <input
                      value={newService.titleEn}
                      onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                      placeholder={t.serviceTitleEn}
                      style={styles.input}
                    />

                    <textarea
                      value={newService.descAr}
                      onChange={(e) => setNewService({ ...newService, descAr: e.target.value })}
                      placeholder={t.serviceDescAr}
                      style={{ ...styles.input, height: 90, resize: "none" }}
                    />

                    <textarea
                      value={newService.descEn}
                      onChange={(e) => setNewService({ ...newService, descEn: e.target.value })}
                      placeholder={t.serviceDescEn}
                      style={{ ...styles.input, height: 90, resize: "none" }}
                    />

                    <select value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} style={styles.input}>
                      <option value="company">{isArabic ? "شركة" : "Company"}</option>
                      <option value="store">{isArabic ? "متجر" : "Store"}</option>
                      <option value="restaurant">{isArabic ? "مطعم" : "Restaurant"}</option>
                      <option value="gym">{isArabic ? "جيم" : "Gym"}</option>
                      <option value="profile">{isArabic ? "بروفايل" : "Profile"}</option>
                      <option value="dashboard">{isArabic ? "لوحة تحكم" : "Dashboard"}</option>
                    </select>

                    <button onClick={addService} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg,#2563eb,#06b6d4)" }}>
                      <Plus size={18} /> {t.addService}
                    </button>

                    {adminMsg && <p style={{ color: "#22c55e" }}>{adminMsg}</p>}
                  </div>

                  <div style={styles.card}>
                    <h3 style={{ marginTop: 0 }}>{isArabic ? "إعدادات وإدارة" : "Settings & Manage"}</h3>

                    <div style={{ display: "grid", gap: 10 }}>
                      <button onClick={resetServices} style={{ ...styles.button, background: "#0891b2" }}>
                        {t.resetServices}
                      </button>

                      <button onClick={logoutAdmin} style={{ ...styles.button, background: "#475569" }}>
                        <LogOut size={18} /> {t.logout}
                      </button>
                    </div>

                    <h3 style={{ marginTop: 22 }}>
                      <Bell size={20} /> {t.requests}
                    </h3>
                    <div style={{ display: "grid", gap: 10, maxHeight: 280, overflowY: "auto", marginBottom: 18 }}>
                      {requests.length === 0 ? (
                        <p style={{ color: colors.muted }}>{t.noRequests}</p>
                      ) : (
                        requests.map((req) => (
                          <div key={req.id} style={{ background: colors.card2, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 12 }}>
                            <strong style={{ color: "#06b6d4" }}>{req.id}</strong>
                            <p style={{ margin: "4px 0" }}>{req.name} - {req.phone}</p>
                            <p style={{ margin: "4px 0", color: colors.muted }}>{getWebsiteTypeLabel(req.type)}</p>
                            <input
                              value={req.status}
                              onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                              placeholder={t.updateCurrentStatus}
                              style={{ ...styles.input, marginBottom: 8 }}
                            />

                            <textarea
                              placeholder={t.writeClientUpdate}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  addRequestUpdate(req.id, e.currentTarget.value);
                                  e.currentTarget.value = "";
                                }
                              }}
                              style={{
                                ...styles.input,
                                height: "72px",
                                resize: "none",
                                marginBottom: "8px",
                              }}
                            />

                            <small style={{ color: colors.muted }}>
                              {t.enterToAddUpdate}
                            </small>

                            <div style={{ display: "grid", gap: "6px", margin: "10px 0" }}>
                              {(req.updates || []).slice(0, 3).map((update) => (
                                <div
                                  key={update.id}
                                  style={{
                                    background: colors.card,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: "10px",
                                    padding: "8px",
                                  }}
                                >
                                  <strong style={{ color: "#06b6d4" }}>{update.text}</strong>
                                  <br />
                                  <small style={{ color: colors.muted }}>{update.date}</small>
                                </div>
                              ))}
                            </div>

                            <button onClick={() => deleteRequest(req.id)} style={{ ...styles.button, background: "#dc2626", padding: "8px 12px" }}>
                              <Trash2 size={16} /> {t.delete}
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <h3>{t.manageReviews}</h3>

                    <div style={{ display: "grid", gap: 10, maxHeight: 220, overflowY: "auto", marginBottom: 18 }}>
                      {reviews.length === 0 ? (
                        <p style={{ color: colors.muted, margin: 0 }}>{t.noReviews}</p>
                      ) : (
                        reviews.map((review) => (
                          <div key={review.id} style={{ background: colors.card2, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                              <strong style={{ color: "#06b6d4" }}>{review.name}</strong>

                              <button
                                onClick={() => deleteReview(review.id)}
                                style={{
                                  background: "rgba(239,68,68,.14)",
                                  color: "#ef4444",
                                  border: "1px solid rgba(239,68,68,.25)",
                                  borderRadius: 10,
                                  padding: 8,
                                  cursor: "pointer",
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <p style={{ margin: "6px 0", color: colors.text }}>{review.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <h3>{t.currentServices}</h3>

                    <div style={{ display: "grid", gap: 10, maxHeight: 260, overflowY: "auto" }}>
                      {services.map((service, index) => {
                        const Icon = serviceIcons[service.icon] || CheckCircle;

                        return (
                          <div
                            key={`${service.title}-admin-${index}`}
                            style={{
                              background: colors.card2,
                              border: `1px solid ${colors.border}`,
                              borderRadius: 14,
                              padding: 12,
                              display: "grid",
                              gridTemplateColumns: "40px 1fr auto",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            <Icon size={24} color="#06b6d4" />

                            <div>
                              <strong>{getServiceTitle(service)}</strong>
                              <p style={{ margin: 0, color: colors.muted, fontSize: 13 }}>{getServiceDesc(service).slice(0, 70)}...</p>
                            </div>

                            <button
                              onClick={() => deleteService(index)}
                              style={{
                                background: "rgba(239,68,68,.14)",
                                color: "#ef4444",
                                border: "1px solid rgba(239,68,68,.25)",
                                borderRadius: 10,
                                padding: 8,
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: 30, borderTop: `1px solid ${colors.border}`, color: colors.muted }}>
        © 2026 Webora - All Rights Reserved
      </footer>
    </div>
  );
}
