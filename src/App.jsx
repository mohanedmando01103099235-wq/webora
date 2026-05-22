import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import "./index.css";

const REVIEWS_KEY = "webora_reviews_clean";
const REQUESTS_KEY = "webora_requests_clean";
const USER_KEY = "webora_user_clean";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "01103099235";
const PHONE = "01103099235";
const WHATSAPP = "201103099235";
const EMAIL = "mohaned01103099235@gmail.com";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebase =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId;

const firebaseApp = hasFirebase ? initializeApp(firebaseConfig) : null;
const auth = firebaseApp ? getAuth(firebaseApp) : null;

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value || "");
  } catch {
    return fallback;
  }
};

const makeId = () => `WB-${Math.floor(1000 + Math.random() * 9000)}`;

export default function App() {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [reviews, setReviews] = useState(() => safeParse(localStorage.getItem(REVIEWS_KEY), []));
  const [requests, setRequests] = useState(() => safeParse(localStorage.getItem(REQUESTS_KEY), []));
  const [currentUser, setCurrentUser] = useState(() => safeParse(localStorage.getItem(USER_KEY), null));

  const [review, setReview] = useState({ name: "", text: "", image: "" });
  const [request, setRequest] = useState({ name: "", phone: "", type: "", details: "" });
  const [message, setMessage] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState(null);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [loginMode, setLoginMode] = useState("login");
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ birth: "", gender: "", country: "" });
  const [adminTab, setAdminTab] = useState("requests");

  const ar = lang === "ar";

  const t = {
    home: ar ? "الرئيسية" : "Home",
    services: ar ? "الخدمات" : "Services",
    works: ar ? "الأعمال" : "Works",
    reviews: ar ? "آراء العملاء" : "Reviews",
    contact: ar ? "تواصل معنا" : "Contact",
    login: ar ? "تسجيل دخول" : "Login",
    dashboard: ar ? "لوحة التحكم" : "Dashboard",
    start: ar ? "ابدأ مشروعك" : "Start Project",
    hero1: ar ? "نحوّل فكرتك إلى" : "Turn Your Idea Into",
    hero2: ar ? "موقع احترافي" : "Professional Website",
    hero3: ar ? "باستخدام الذكاء الاصطناعي" : "Using Artificial Intelligence",
    heroDesc: ar
      ? "في Webora نستخدم أحدث تقنيات الذكاء الاصطناعي لتصميم وتطوير مواقع سريعة، احترافية، ومتجاوبة مع جميع الأجهزة."
      : "At Webora we use AI to design and develop fast, professional, responsive websites.",
    browse: ar ? "تصفح الأعمال" : "Browse Works",
    ourServices: ar ? "خدماتنا" : "Our Services",
    servicesSub: ar ? "نقدم مجموعة متكاملة من الخدمات الرقمية باستخدام الذكاء الاصطناعي" : "Integrated digital services powered by AI",
    ourWorks: ar ? "أعمالنا" : "Our Works",
    worksSub: ar ? "بعض من المشاريع التي نفخر بتنفيذها" : "Some projects we are proud of",
    testimonials: ar ? "ماذا يقول عملاؤنا" : "What Clients Say",
    request: ar ? "طلب مشروع" : "Project Request",
    track: ar ? "تتبع الطلب" : "Track Request",
    addReview: ar ? "أضف تقييمك" : "Add Review",
    ready: ar ? "جاهز لتحويل فكرتك إلى واقع؟" : "Ready to turn your idea into reality?",
    readySub: ar ? "ابدأ مشروعك الآن واحصل على استشارة مجانية" : "Start now and get a free consultation",
    footer: ar ? "نحوّل الأفكار إلى مواقع احترافية باستخدام الذكاء الاصطناعي" : "Turning ideas into professional websites using AI",
    allWorks: ar ? "عرض جميع الأعمال" : "View All Works",
    sendBtn: ar ? "إرسال" : "Send",
    trackBtn: ar ? "تتبع" : "Track",
    yourName: ar ? "اسمك" : "Your name",
    phoneLabel: ar ? "رقم الهاتف" : "Phone number",
    siteType: ar ? "نوع الموقع" : "Website type",
    companySite: ar ? "موقع شركة" : "Company Website",
    storeSite: ar ? "متجر إلكتروني" : "E-commerce Store",
    portfolioSite: ar ? "بورتفوليو" : "Portfolio",
    projectDetails: ar ? "تفاصيل المشروع" : "Project details",
    yourReview: ar ? "اكتب رأيك" : "Write your review",
    uploadPhoto: ar ? "ارفع صورتك" : "Upload your photo",
    quickLinks: ar ? "روابط سريعة" : "Quick Links",
    contactUs: ar ? "تواصل معنا" : "Contact Us",
    cairoEgypt: ar ? "القاهرة، مصر" : "Cairo, Egypt",
    whatsapp: ar ? "واتساب" : "WhatsApp",
    phoneWord: ar ? "هاتف" : "Phone",
    callWord: ar ? "اتصال" : "Call",
    startFree: ar ? "ابدأ الآن مجاناً" : "Start Free",
    adminPassword: ar ? "كلمة سر لوحة التحكم" : "Dashboard password",
    enterDashboard: ar ? "دخول" : "Enter",
    clientRequests: ar ? "طلبات العملاء" : "Client Requests",
    noRequests: ar ? "لا توجد طلبات حتى الآن" : "No requests yet",
    clientReviews: ar ? "تقييمات العملاء" : "Client Reviews",
    deleteWord: ar ? "حذف" : "Delete",
    deleteRequest: ar ? "حذف الطلب" : "Delete Request",
    deleteReview: ar ? "حذف التقييم" : "Delete Review",
    updatePlaceholder: ar ? "اكتب تحديث واضغط Enter" : "Write update and press Enter",
    contactWhatsApp: ar ? "تواصل واتساب" : "Contact via WhatsApp",
    siteSettings: ar ? "إعدادات الموقع" : "Site Settings",
    manageRequests: ar ? "إدارة الطلبات" : "Manage Requests",
    manageReviews: ar ? "إدارة التقييمات" : "Manage Reviews",
    manageSite: ar ? "إعدادات الموقع" : "Site Settings",
    adminLogout: ar ? "خروج الأدمن" : "Admin Logout",
    dashboardDesc: ar ? "تحكم كامل في الطلبات والتقييمات والتواصل مع العملاء." : "Full control over requests, reviews, and client communication.",
    tracked: ar ? "قيد المتابعة" : "Tracked",
    noUserReviews: ar ? "لا توجد تقييمات مضافة من المستخدمين" : "No user reviews yet",
    switchEnglish: ar ? "تحويل للإنجليزية" : "Switch to English",
    switchArabic: ar ? "تحويل للعربية" : "Switch to Arabic",
    changeBackground: ar ? "تغيير الخلفية" : "Change Background",
    createAccount: ar ? "أنشئ حساباً" : "Create Account",
    welcomeBack: ar ? "مرحباً بعودتك" : "Welcome Back",
    authSubtitleLogin: ar ? "سجل الدخول للوصول إلى حسابك وخدماتك" : "Sign in to access your account and services",
    authSubtitleSignup: ar ? "ابدأ حسابك للوصول إلى خدمات Webora" : "Create your account to access Webora services",
    continueGoogle: ar ? "المتابعة باستخدام Google" : "Continue with Google",
    continueApple: ar ? "المتابعة باستخدام Apple" : "Continue with Apple",
    orWord: ar ? "أو" : "or",
    emailLabel: ar ? "البريد الإلكتروني" : "Email",
    passwordLabel: ar ? "كلمة المرور" : "Password",
    signIn: ar ? "تسجيل الدخول" : "Sign In",
    noAccount: ar ? "ليس لديك حساب؟ أنشئ حساباً" : "No account? Create one",
    haveAccount: ar ? "هل لديك حساب؟ تسجيل الدخول" : "Already have an account? Sign in",
    continueFacebook: ar ? "تسجيل الدخول بفيسبوك" : "Continue with Facebook",
    authPrivacy: ar ? "باستمرارك فأنت توافق على شروط الخدمة وسياسة الخصوصية." : "By continuing, you agree to our terms and privacy policy.",
    completeProfile: ar ? "أكمل ملفك الشخصي" : "Complete Your Profile",
    profileOptional: ar ? "اختياري — يساعدنا على تخصيص تجربتك" : "Optional — helps us personalize your experience",
    birthDate: ar ? "تاريخ الميلاد" : "Date of Birth",
    gender: ar ? "النوع" : "Gender",
    selectGender: ar ? "اختر النوع" : "Select gender",
    male: ar ? "ذكر" : "Male",
    female: ar ? "أنثى" : "Female",
    country: ar ? "الدولة" : "Country",
    selectCountry: ar ? "اختر الدولة" : "Select country",
    egypt: ar ? "مصر" : "Egypt",
    saudi: ar ? "السعودية" : "Saudi Arabia",
    uae: ar ? "الإمارات" : "UAE",
    save: ar ? "حفظ" : "Save",
    skip: ar ? "تخطي" : "Skip",
    contactBadge: ar ? "تواصل معنا" : "Contact Us",
    contactTitle: ar ? "جاهز نبدأ مشروعك؟" : "Ready to start your project?",
    contactDesc: ar ? "اختار طريقة التواصل المناسبة أو ابعت تقييمك، وفريق Webora هيتابع معاك بسرعة." : "Choose your preferred contact method or leave a review, and Webora will follow up quickly.",
    directCall: ar ? "اتصال مباشر" : "Direct Call",
    reviewHint: ar ? "اكتب رأيك وسيظهر في قسم آراء العملاء." : "Write your review and it will appear in the reviews section.",
    review1Name: ar ? "أحمد محمد" : "Ahmed Mohamed",
    review2Name: ar ? "سارة علي" : "Sara Ali",
    review3Name: ar ? "محمد خالد" : "Mohamed Khaled",
    review1Text: ar ? "تعامل راقي وسرعة في التنفيذ، الموقع فاق توقعاتي." : "Professional service and fast delivery. The website exceeded my expectations.",
    review2Text: ar ? "تصميم احترافي ومنظم جدًا، أنصح الجميع بالتعامل معهم." : "A very professional and organized design. I recommend working with them.",
    review3Text: ar ? "خدمة ممتازة وتنفيذ منظم واحترافي." : "Excellent service with organized and professional execution.",
    footerHome: ar ? "الرئيسية" : "Home",
    footerServices: ar ? "الخدمات" : "Services",
    footerWorks: ar ? "الأعمال" : "Works",
    requestReceived: ar ? "تم استلام الطلب" : "Request received",
    requestSent: ar ? "تم إرسال طلبك ✅ رقم التتبع:" : "Request sent ✅ Tracking ID:",
    requiredLoginError: ar ? "اكتب البريد الإلكتروني وكلمة المرور" : "Enter email and password",
    missingFirebase: ar ? "بيانات Firebase غير موجودة في ملف .env" : "Firebase config is missing in .env",
  };

  const services = [
    ["🏢", ar ? "مواقع الشركات" : "Company Websites", ar ? "تصميم مواقع احترافية للشركات تعكس هوية علامتك التجارية." : "Professional company websites that reflect your brand."],
    ["🛒", ar ? "متاجر إلكترونية" : "E-Commerce Stores", ar ? "متاجر احترافية آمنة وسريعة لزيادة مبيعاتك أونلاين." : "Fast secure stores to increase online sales."],
    ["🧠", ar ? "مواقع الذكاء الاصطناعي" : "AI Websites", ar ? "مواقع ذكية متكاملة مع تقنيات AI الحديثة." : "Smart websites integrated with modern AI."],
    ["👤", ar ? "بورتفوليو شخصي" : "Personal Portfolio", ar ? "اعرض أعمالك باحترافية واجذب عملاء أكثر." : "Showcase your work professionally."],
    ["💬", ar ? "شات بوت ذكي" : "AI Chatbot", ar ? "أنظمة رد تلقائي مخصصة لاحتياج مشروعك." : "Custom auto-reply systems for your business."],
    ["📈", ar ? "تحسين محركات البحث" : "SEO Optimization", ar ? "نرفع موقعك في نتائج البحث ونزيد عدد الزوار." : "Improve ranking and increase visitors."],
  ];

  const works = [
    [ar ? "موقع شركة مقاولات" : "Contracting Company Website", ar ? "موقع شركات" : "Business Website", "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop"],
    [ar ? "متجر إلكتروني للأزياء" : "Fashion E-commerce Store", ar ? "متجر إلكتروني" : "E-commerce", "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop"],
    [ar ? "منصة تعليمية" : "Educational Platform", ar ? "موقع تعليمي" : "Education Website", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop"],
    [ar ? "موقع ذكاء اصطناعي" : "AI Website", "AI", "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=900&auto=format&fit=crop"],
  ];

  const defaultReviews = [
    [t.review1Name, t.review1Text, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"],
    [t.review2Name, t.review2Text, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"],
    [t.review3Name, t.review3Text, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"],
  ].map(([name, text, image], index) => ({ id: index + 1, name, text, image }));

  const shownReviews = reviews.length ? reviews : defaultReviews;

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(USER_KEY);
  }, [currentUser]);

  useEffect(() => {
    if (window.location.pathname.includes("contact")) {
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }
  }, []);


  const saveLoggedUser = (user) => {
    completeLogin(user);
  };

  useEffect(() => {
    if (!auth) return;

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) saveLoggedUser(result.user);
      })
      .catch((err) => {
        setAuthError(err.message);
      });
  }, []);

  const providerLogin = async (type) => {
    setAuthError("");

    if (!auth) {
      setAuthError(ar ? "بيانات Firebase غير موجودة في ملف .env" : "Firebase config is missing in .env");
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);

      let provider;

      if (type === "facebook") {
        provider = new FacebookAuthProvider();

        // مهم: لا تطلب صلاحية email من Facebook لأنها كانت سبب الخطأ Invalid Scopes: email
        // نطلب public_profile فقط.
        provider.addScope("public_profile");

        provider.setCustomParameters({
          display: "popup",
        });
      } else {
        provider = new GoogleAuthProvider();

        provider.setCustomParameters({
          prompt: "select_account",
        });
      }

      const result = await signInWithPopup(auth, provider);
      saveLoggedUser(result.user);
    } catch (err) {
      const code = err?.code || "";

      if (code === "auth/popup-closed-by-user") {
        setAuthError(ar ? "تم إغلاق نافذة التسجيل قبل إكمال الدخول. اضغط مرة أخرى وكمل اختيار الحساب." : "The sign-in popup was closed before completion. Click again and complete sign-in.");
        return;
      }

      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        try {
          let provider;

          if (type === "facebook") {
            provider = new FacebookAuthProvider();
            provider.addScope("public_profile");
            provider.setCustomParameters({
              display: "popup",
            });
          } else {
            provider = new GoogleAuthProvider();
            provider.setCustomParameters({
              prompt: "select_account",
            });
          }

          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr) {
          setAuthError(redirectErr.message);
          return;
        }
      }

      if (code === "auth/unauthorized-domain") {
        setAuthError(ar ? "الدومين غير مضاف في Firebase Authorized domains." : "This domain is not added in Firebase Authorized domains.");
        return;
      }

      setAuthError(err?.message || (ar ? "حدث خطأ أثناء تسجيل الدخول" : "Login error"));
    }
  };

  const logoutUser = async () => {
    try {
      if (auth) await signOut(auth);
    } catch {}
    setCurrentUser(null);
  };

  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReview((p) => ({ ...p, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const addReview = () => {
    if (!review.name.trim() || !review.text.trim()) return;
    setReviews([
      {
        id: Date.now(),
        name: review.name,
        text: review.text,
        image: review.image || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=300&auto=format&fit=crop",
      },
      ...reviews,
    ]);
    setReview({ name: "", text: "", image: "" });
  };

  const submitRequest = () => {
    if (!request.name || !request.phone || !request.type || !request.details) return;
    const id = makeId();
    const status = t.requestReceived;
    setRequests([
      {
        id,
        ...request,
        status,
        updates: [{ id: Date.now(), text: status, date: new Date().toLocaleString(ar ? "ar-EG" : "en-US") }],
      },
      ...requests,
    ]);
    setRequest({ name: "", phone: "", type: "", details: "" });
    setMessage(`${t.requestSent} ${id}`);
  };

  const trackRequest = () => {
    setTrackResult(requests.find((r) => r.id.toLowerCase() === trackCode.trim().toLowerCase()) || null);
  };

  const addUpdate = (id, value) => {
    if (!value.trim()) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: value,
              updates: [
                { id: Date.now(), text: value, date: new Date().toLocaleString(ar ? "ar-EG" : "en-US") },
                ...(r.updates || []),
              ],
            }
          : r
      )
    );
  };


  const openWhatsAppToClient = (phone, id) => {
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const target = cleanPhone.startsWith("20") ? cleanPhone : `2${cleanPhone}`;
    const msg = ar
      ? `مرحباً، معك Webora بخصوص مشروعك رقم ${id}. نحب نبلغك بآخر تطورات الموقع.`
      : `Hello, this is Webora regarding your project ${id}. We would like to update you on the project progress.`;
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const callClient = (phone) => {
    window.location.href = `tel:${phone}`;
  };


  const applyTheme = (mode) => {
    setThemeMenuOpen(false);
    if (mode === "system") {
      const isDarkSystem = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDarkSystem ? "dark" : "light");
      return;
    }
    setTheme(mode);
  };

  const completeLogin = (user) => {
    setCurrentUser({
      name: user.displayName || user.email?.split("@")[0] || "Webora User",
      email: user.email || "",
      photo: user.photoURL || "",
    });
    setLoginOpen(false);
    setProfileOpen(true);
    setAuthError("");
  };

  const emailPasswordAuth = async () => {
    setAuthError("");
    if (!auth) {
      setAuthError(ar ? "بيانات Firebase غير موجودة في ملف .env" : "Firebase config is missing in .env");
      return;
    }
    if (!emailForm.email.trim() || !emailForm.password.trim()) {
      setAuthError(ar ? "اكتب البريد الإلكتروني وكلمة المرور" : "Enter email and password");
      return;
    }
    try {
      const result = loginMode === "signup"
        ? await createUserWithEmailAndPassword(auth, emailForm.email, emailForm.password)
        : await signInWithEmailAndPassword(auth, emailForm.email, emailForm.password);

      completeLogin(result.user);
      setEmailForm({ email: "", password: "" });
    } catch (err) {
      setAuthError(err?.message || (ar ? "حدث خطأ في تسجيل الدخول" : "Login error"));
    }
  };

  return (
    <main className={`app ${theme}`} dir={ar ? "rtl" : "ltr"}>
      <nav className="top-nav">
        <a className="logo" href="#home"><span>W</span> WEBORA</a>
        <div className="links">
          <a className="active" href="#home"><span className="tab-icon">🏠</span>{t.home}</a>
          <a href="#services"><span className="tab-icon">🧩</span>{t.services}</a>
          <a href="#works"><span className="tab-icon">💼</span>{t.works}</a>
          <a href="#reviews"><span className="tab-icon">⭐</span>{t.reviews}</a>
          <a href="#contact"><span className="tab-icon">📞</span>{t.contact}</a>
        </div>
        <div className="actions">
          <button onClick={() => setLang(ar ? "en" : "ar")}>{ar ? "English" : "العربية"}</button>
          <div className="theme-picker">
            <button onClick={() => setThemeMenuOpen(!themeMenuOpen)}>☀️</button>
            {themeMenuOpen && (
              <div className="theme-dropdown">
                <button className={theme === "light" ? "selected" : ""} onClick={() => applyTheme("light")}>Light Mode</button>
                <button className={theme === "dark" ? "selected" : ""} onClick={() => applyTheme("dark")}>Dark Mode</button>
                <button onClick={() => applyTheme("system")}>System</button>
              </div>
            )}
          </div>
          <button onClick={() => setAdminOpen(true)}>{t.dashboard}</button>
          {currentUser ? (
            <div className="user-menu">
              {currentUser.photo ? (
                <img src={currentUser.photo} alt={currentUser.name} />
              ) : (
                <span className="user-avatar-letter">{(currentUser.name || "U").charAt(0)}</span>
              )}
              <div>
                <b>{currentUser.name}</b>
                <small>{currentUser.email}</small>
              </div>
              <button onClick={logoutUser}>{ar ? "خروج" : "Logout"}</button>
            </div>
          ) : (
            <button onClick={() => setLoginOpen(true)}>{t.login}</button>
          )}
          <a href="#request">{t.start}</a>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-text">
          <h1>{t.hero1}<br/><span>{t.hero2}</span><small>{t.hero3}</small></h1>
          <p>{t.heroDesc}</p>
          <div className="hero-buttons">
            <a className="btn main" href="#request">{t.start}</a>
            <a className="btn ghost" href="#works">{t.browse}</a>
          </div>
          <div className="features">
            <span>🖥️ {ar ? "تصميم متجاوب" : "Responsive"}</span>
            <span>⚡ {ar ? "تسليم سريع" : "Fast delivery"}</span>
            <span>🎧 {ar ? "دعم فني 24/7" : "24/7 Support"}</span>
          </div>
          {currentUser && <p className="welcome">{ar ? "مرحباً" : "Welcome"} {currentUser.name}</p>}
        </div>

        <div className="hero-art">
          <div className="screen-card">
            <div className="screen-top"><b>WEBORA</b><i></i><i></i><i></i></div>
            <h2>AI POWERED<br/>WEB SOLUTIONS</h2>
            <p></p><p></p><p className="small"></p>
            <button>Get Started</button>
          </div>
          <div className="robot">
            <div className="robot-head"><b></b><b></b></div>
            <div className="robot-body"></div>
          </div>
          <div className="bubble">👋 مرحباً!<br/><small>كيف أساعدك اليوم؟</small></div>
        </div>
      </section>

      <section id="services" className="panel">
        <header>
          <h2>{t.ourServices}</h2>
          <p>{t.servicesSub}</p>
        </header>
        <div className="services">
          {services.map(([icon, title, desc]) => (
            <article key={title}>
              <div className="service-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="works" className="panel">
        <header>
          <h2>{t.ourWorks}</h2>
          <p>{t.worksSub}</p>
        </header>
        <div className="works">
          {works.map(([title, tag, img]) => (
            <article key={title}>
              <img src={img} alt={title}/>
              <h3>{title}</h3>
              <p>{tag}</p>
            </article>
          ))}
        </div>
        <div className="center"><a className="btn ghost" href="#request">{t.allWorks}</a></div>
      </section>

      <section id="reviews" className="panel">
        <header>
          <h2>{t.testimonials}</h2>
          <p>{ar ? "ثقة عملائنا هي ما يدفعنا للاستمرار في التميز" : "Our clients' trust drives us forward"}</p>
        </header>
        <div className="reviews">
          {shownReviews.slice(0, 3).map((r) => (
            <article key={r.id}>
              <div className="person">
                <img src={r.image} alt={r.name}/>
                <div><h3>{r.name}</h3><span>{ar ? "عميل Webora" : "Webora Client"}</span></div>
              </div>
              <div className="stars">★★★★★</div>
              <p>"{r.text}"</p>
            </article>
          ))}
        </div>
      </section>

      <section id="request" className="forms">
        <div className="box">
          <h2>{t.request}</h2>
          {message && <p className="success">{message}</p>}
          <div className="grid">
            <input className="field-name" placeholder={t.yourName} value={request.name} onChange={(e) => setRequest({ ...request, name: e.target.value })}/>
            <input className="field-phone" placeholder={t.phoneLabel} value={request.phone} onChange={(e) => setRequest({ ...request, phone: e.target.value })}/>
            <select className="field-type" value={request.type} onChange={(e) => setRequest({ ...request, type: e.target.value })}>
              <option value="">{t.siteType}</option>
              <option>{t.companySite}</option>
              <option>{t.storeSite}</option>
              <option>{t.portfolioSite}</option>
            </select>
          </div>
          <textarea className="field-details" placeholder={t.projectDetails} value={request.details} onChange={(e) => setRequest({ ...request, details: e.target.value })}></textarea>
          <button className="btn main" onClick={submitRequest}>{t.sendBtn}</button>
        </div>

        <div className="box">
          <h2>{t.track}</h2>
          <div className="track">
            <input className="field-track" placeholder="WB-1234" value={trackCode} onChange={(e) => setTrackCode(e.target.value)}/>
            <button className="btn main" onClick={trackRequest}>{t.trackBtn}</button>
          </div>
          {trackResult && (
            <div className="result">
              <h3>{trackResult.id}</h3>
              <p>{trackResult.status}</p>
              {(trackResult.updates || []).map((u) => <div key={u.id} className="update"><b>{u.text}</b><small>{u.date}</small></div>)}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="contact contact-page">
        <div className="contact-hero-card">
          <span className="contact-badge">{t.contactBadge}</span>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactDesc}</p>

          <div className="contact-methods">
            <a className="method-card whatsapp-method" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
              <div>
                <b>WhatsApp</b>
                <span>{PHONE}</span>
              </div>
            </a>

            <a className="method-card phone-method" href={`tel:${PHONE}`}>
              <span className="method-icon">☎</span>
              <div>
                <b>{t.directCall}</b>
                <span>{PHONE}</span>
              </div>
            </a>

            <a className="method-card mail-method email-card" href={`mailto:${EMAIL}`}>
              <span className="method-icon">✉</span>
              <div className="method-info">
                <b>Email</b>
                <span className="email-address">{EMAIL}</span>
              </div>
            </a>
          </div>

          <a className="btn main contact-main-btn" href="#request">{t.start}</a>
          <span className="rocket">🚀</span>
        </div>

        <div className="box review-box">
          <h2>{t.addReview}</h2>
          <p className="box-subtitle">{t.reviewHint}</p>
          <input className="field-name" placeholder={t.yourName} value={review.name} onChange={(e) => setReview({ ...review, name: e.target.value })}/>
          <label className="upload">📷 {t.uploadPhoto}<input type="file" accept="image/*" onChange={uploadImage}/></label>
          {review.image && <img className="preview" src={review.image} alt="preview"/>}
          <textarea className="field-review" placeholder={t.yourReview} value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })}></textarea>
          <button className="btn main" onClick={addReview}>{t.sendBtn}</button>
        </div>
      </section>

      <footer>
        <div>
          <a className="logo" href="#home"><span>W</span> WEBORA</a>
          <p>{t.footer}</p>
        </div>
        <div><h3>{t.quickLinks}</h3><a href="#home">{t.footerHome}</a><a href="#services">{t.footerServices}</a><a href="#works">{t.footerWorks}</a></div>
        <div><h3>{t.ourServices}</h3><a>{t.companySite}</a><a>{t.storeSite}</a><a>{ar ? "مواقع الذكاء الاصطناعي" : "AI Websites"}</a></div>
        <div>
          <h3>{t.contactUs}</h3>
          <a className="footer-contact" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
            {t.whatsapp}: {PHONE}
          </a>
          <a className="footer-contact" href={`tel:${PHONE}`}>
            <span>☎</span>
            {t.phoneWord}: {PHONE}
          </a>
          <a className="footer-contact email-footer" href={`mailto:${EMAIL}`}>
            <span>✉</span>
            <em>{EMAIL}</em>
          </a>
          <a>{t.cairoEgypt}</a>
        </div>
      </footer>

      {loginOpen && (
        <div className="modal login-overlay">
          <div className="admin login-modal">
            <button className="close" onClick={() => setLoginOpen(false)}>×</button>
            <div className="auth-logo">✈️</div>
            <h2>{loginMode === "login" ? t.welcomeBack : t.createAccount}</h2>
            <p className="auth-subtitle">{loginMode === "login" ? t.authSubtitleLogin : t.authSubtitleSignup}</p>

            {authError && <p className="error auth-error">{authError}</p>}

            <button className="auth-provider-btn" onClick={() => providerLogin("google")}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              {t.continueGoogle}
            </button>

            <button className="auth-provider-btn apple-btn" type="button">
              <span className="apple-icon">●</span>
              {t.continueApple}
            </button>

            <div className="auth-divider"><span>{t.orWord}</span></div>

            <label className="auth-label">{t.emailLabel}</label>
            <input
              className="auth-field"
              type="email"
              placeholder="email@example.com"
              value={emailForm.email}
              onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
            />

            <label className="auth-label">{t.passwordLabel}</label>
            <div className="password-field">
              <input
                className="auth-field"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>👁</button>
            </div>

            <button className="auth-main-btn" onClick={emailPasswordAuth}>
              {loginMode === "login" ? t.signIn : t.startFree}
            </button>

            <button className="auth-link-btn" onClick={() => setLoginMode(loginMode === "login" ? "signup" : "login")}>
              {loginMode === "login" ? t.noAccount : t.haveAccount}
            </button>

            <button className="facebook-mini-btn" onClick={() => providerLogin("facebook")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" />
              {t.continueFacebook}
            </button>

            <p className="auth-privacy">
              {t.authPrivacy}
            </p>
          </div>
        </div>
      )}


      {profileOpen && (
        <div className="modal profile-overlay">
          <div className="profile-modal">
            <button className="profile-close" onClick={() => setProfileOpen(false)}>×</button>
            <h2>{t.completeProfile}</h2>
            <p>{t.profileOptional}</p>

            <label>{t.birthDate}</label>
            <input type="date" value={profileForm.birth} onChange={(e) => setProfileForm({ ...profileForm, birth: e.target.value })} />

            <label>{t.gender}</label>
            <select value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}>
              <option value="">{t.selectGender}</option>
              <option>{t.male}</option>
              <option>{t.female}</option>
            </select>

            <label>{t.country}</label>
            <select value={profileForm.country} onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}>
              <option value="">{t.selectCountry}</option>
              <option>{t.egypt}</option>
              <option>{t.saudi}</option>
              <option>{t.uae}</option>
            </select>

            <div className="profile-actions">
              <button onClick={() => setProfileOpen(false)}>{t.save}</button>
              <button className="skip-btn" onClick={() => setProfileOpen(false)}>{t.skip}</button>
            </div>
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="modal">
          <div className="admin dashboard-modal">
            <button className="close" onClick={() => setAdminOpen(false)}>×</button>
            {!isAdmin ? (
              <>
                <h2>{t.dashboard}</h2>
                <input type="password" placeholder={t.adminPassword} value={adminPass} onChange={(e) => setAdminPass(e.target.value)}/>
                <button className="btn main" onClick={() => setIsAdmin(adminPass === ADMIN_PASSWORD)}>{t.enterDashboard}</button>
              </>
            ) : (
              <>
                <div className="dashboard-head">
                  <div>
                    <h2>{t.dashboard}</h2>
                    <p>{t.dashboardDesc}</p>
                  </div>
                  <button className="logout-admin" onClick={() => setIsAdmin(false)}>{t.adminLogout}</button>
                </div>

                <div className="dashboard-stats">
                  <div><b>{requests.length}</b><span>{t.clientRequests}</span></div>
                  <div><b>{reviews.length}</b><span>{t.clientReviews}</span></div>
                  <div><b>{requests.filter((r) => r.status).length}</b><span>{t.tracked}</span></div>
                </div>

                <div className="dashboard-tabs">
                  <button className={adminTab === "requests" ? "active-tab" : ""} onClick={() => setAdminTab("requests")}>
                    {t.manageRequests}
                  </button>
                  <button className={adminTab === "reviews" ? "active-tab" : ""} onClick={() => setAdminTab("reviews")}>
                    {t.manageReviews}
                  </button>
                  <button className={adminTab === "site" ? "active-tab" : ""} onClick={() => setAdminTab("site")}>
                    {t.siteSettings}
                  </button>
                </div>

                {adminTab === "requests" && (
                  <div>
                    <h3>{t.clientRequests}</h3>
                    {requests.length === 0 && <p>{t.noRequests}</p>}
                    {requests.map((r) => (
                      <div className="admin-item request-admin-card" key={r.id}>
                        <div className="admin-row">
                          <div>
                            <b>{r.id}</b>
                            <p>{r.name} - {r.phone}</p>
                            <p>{r.type}</p>
                            <small>{r.details}</small>
                          </div>
                          <span className="status-badge">{r.status}</span>
                        </div>

                        <input
                          placeholder={t.updatePlaceholder}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addUpdate(r.id, e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />

                        <div className="admin-actions">
                          <button className="whatsapp-action" onClick={() => openWhatsAppToClient(r.phone, r.id)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                            {t.contactWhatsApp}
                          </button>
                          <button className="call-action" onClick={() => callClient(r.phone)}>
                            ☎ {t.callWord}
                          </button>
                          <button className="delete-action" onClick={() => setRequests(requests.filter((x) => x.id !== r.id))}>
                            {t.deleteRequest}
                          </button>
                        </div>

                        <div className="updates-list">
                          {(r.updates || []).slice(0, 4).map((u) => (
                            <div className="update-mini" key={u.id}>
                              <b>{u.text}</b>
                              <small>{u.date}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {adminTab === "reviews" && (
                  <div>
                    <h3>{t.clientReviews}</h3>
                    {reviews.length === 0 && <p>{t.noUserReviews}</p>}
                    {reviews.map((r) => (
                      <div className="admin-item review-admin-card" key={r.id}>
                        <div className="review-admin-user">
                          {r.image && <img src={r.image} alt={r.name} />}
                          <div>
                            <b>{r.name}</b>
                            <p>{r.text}</p>
                          </div>
                        </div>
                        <button className="delete-action" onClick={() => setReviews(reviews.filter((x) => x.id !== r.id))}>
                          {t.deleteReview}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {adminTab === "site" && (
                  <div className="admin-item">
                    <h3>{t.siteSettings}</h3>
                    <p>{t.siteSettings}</p>
                    <div className="admin-actions">
                      <button onClick={() => setLang(ar ? "en" : "ar")}>{ar ? t.switchEnglish : t.switchArabic}</button>
                      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{t.changeBackground}</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
