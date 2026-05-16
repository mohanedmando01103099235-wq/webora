import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Code2,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  Languages,
  Sparkles,
  Send,
  Bot,
  User,
  X,
  Trash2,
  Moon,
  Sun,
  Lock,
  LogOut,
  ImagePlus,
  Plus,
  ShieldCheck,
  Settings,
} from "lucide-react";

const PHONE = "01103099235";
const PHONE_INT = "201103099235";
const EMAIL = "mohaned01103099235@gmail.com";
const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD;
const REVIEWS_KEY = "webora_reviews";
const CHAT_KEY = "webora_chat_messages";
const PROJECTS_KEY = "webora_projects";
const THEME_KEY = "webora_theme";
const ADMIN_KEY = "webora_admin_logged";

const getAdminPasswordHash = async () => {
  const data = new TextEncoder().encode(ADMIN_PASSWORD);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
};

const getGeminiApiKey = () => {
  return import.meta?.env?.VITE_GEMINI_API_KEY || "";
};

const defaultProjects = {
  ar: [
    {
      title: "موقع جيم",
      desc: "موقع جذاب يعرض الاشتراكات والبرامج التدريبية وطرق التواصل.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "موقع مطعم",
      desc: "واجهة حديثة لعرض المنيو والعروض وصور الأكلات.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "موقع شركة",
      desc: "صفحة تعريفية احترافية تعرض خدمات الشركة وتزيد ثقة العملاء.",
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "متجر إلكتروني",
      desc: "متجر احترافي لعرض المنتجات وعمليات الشراء أونلاين.",
      img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "لوحة تحكم ونظام إدارة",
      desc: "أنظمة ولوحات تحكم حديثة لإدارة المشاريع والبيانات.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
    },
  ],
  en: [
    {
      title: "Gym Website",
      desc: "A modern website for memberships, training programs, and contact options.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Restaurant Website",
      desc: "A clean website for menus, offers, and food photos.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Business Website",
      desc: "A professional landing page that presents business services.",
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "E-Commerce Store",
      desc: "Professional online store for products and online payments.",
      img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Dashboard System",
      desc: "Modern dashboard and management systems for businesses.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
    },
  ],
};

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value || "");
  } catch {
    return fallback;
  }
};

export default function App() {
  const [language, setLanguage] = useState("ar");
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", desc: "", img: "" });
  const chatEndRef = useRef(null);

  const isArabic = language === "ar";
  const isDark = theme === "dark";

  const welcomeMessage = useMemo(
    () => ({
      from: "bot",
      text: isArabic
        ? "أهلاً بك 👋 أنا مساعد Webora الذكي. اسألني عن الخدمات، الأسعار، مدة التنفيذ، أو أي فكرة موقع عندك."
        : "Hello 👋 I am Webora AI assistant. Ask me about services, pricing, delivery time, or your website idea.",
    }),
    [isArabic]
  );

  const [messages, setMessages] = useState(() => {
    const saved = safeParse(localStorage.getItem(CHAT_KEY), []);
    return saved.length ? saved : [{ from: "bot", text: "أهلاً بك 👋 أنا مساعد Webora الذكي. اسألني عن الخدمات، الأسعار، مدة التنفيذ، أو أي فكرة موقع عندك." }];
  });

  useEffect(() => {
    document.title = "Webora";
  }, []);

  useEffect(() => {
    const savedReviews = safeParse(localStorage.getItem(REVIEWS_KEY), []);
    setReviews(savedReviews);

    const savedProjects = safeParse(localStorage.getItem(PROJECTS_KEY), []);
    setProjects(savedProjects.length ? savedProjects : defaultProjects.ar);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (projects.length) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  }, [projects]);

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
    if (!reviewName.trim()) {
      setReviewMessage(isArabic ? "اكتب اسمك الأول من فضلك" : "Please enter your name first");
      return;
    }

    if (!reviewText.trim()) {
      setReviewMessage(isArabic ? "اكتب تقييمك الأول من فضلك" : "Please write your review first");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      text: reviewText.trim(),
      date: new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US"),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));

    setReviewMessage(
      isArabic
        ? `Webora يشكرك يا ${newReview.name} على تقييمك الجميل ❤️`
        : `Webora thanks you, ${newReview.name}, for your review ❤️`
    );

    setReviewName("");
    setReviewText("");
  };

  const deleteReview = (id) => {
    if (!isAdmin) {
      alert(isArabic ? "الحذف متاح للأدمن فقط" : "Delete is admin only");
      return;
    }

    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
  };

  const buildLocalReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("سعر") || q.includes("تكلفة") || q.includes("كام") || q.includes("price") || q.includes("cost")) {
      return isArabic
        ? "السعر بيتحدد حسب نوع الموقع وعدد الصفحات والمميزات المطلوبة. ابعتلنا فكرتك على واتساب وهنقولك أنسب تكلفة."
        : "Pricing depends on website type, pages, and features. Send your idea on WhatsApp and we will suggest the best cost.";
    }

    if (q.includes("مدة") || q.includes("وقت") || q.includes("تسليم") || q.includes("delivery") || q.includes("time")) {
      return isArabic
        ? "مدة التنفيذ بتختلف حسب حجم المشروع. المواقع التعريفية غالبًا بتخلص خلال أيام قليلة، والمتاجر أو الأنظمة بتحتاج تفاصيل أكتر."
        : "Delivery time depends on project size. Simple websites can be finished in a few days, while stores and systems need more details.";
    }

    if (q.includes("خدمات") || q.includes("بتعمل") || q.includes("مواقع") || q.includes("services") || q.includes("website")) {
      return isArabic
        ? "Webora بيعمل مواقع شركات، متاجر إلكترونية، مواقع مطاعم وجيمات، بروفايلات شخصية، صفحات هبوط، ولوحات تحكم."
        : "Webora builds company websites, e-commerce stores, restaurant and gym websites, portfolios, landing pages, and dashboards.";
    }

    if (q.includes("تواصل") || q.includes("واتساب") || q.includes("رقم") || q.includes("phone") || q.includes("contact")) {
      return isArabic
        ? `تقدر تتواصل واتساب أو اتصال على ${PHONE} أو عبر البريد ${EMAIL}.`
        : `You can contact us by WhatsApp or phone at ${PHONE}, or email ${EMAIL}.`;
    }

    return isArabic
      ? `فهمت سؤالك عن "${question}". Webora يقدر يساعدك في تحويل فكرتك لموقع احترافي. ممكن توضح نوع الموقع اللي عايزه؟`
      : `I understand your question about "${question}". Webora can help turn your idea into a professional website. What type of website do you need?`;
  };

  const getBotReply = async (question) => {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      return buildLocalReply(question);
    }

    const prompt = `
أنت مساعد ذكي خاص بموقع Webora.

معلومات الموقع:
- اسم الموقع: Webora.
- متخصص في تصميم وتطوير جميع أنواع المواقع الإلكترونية الحديثة.
- الخدمات: مواقع شركات، متاجر إلكترونية، مواقع مطاعم، مواقع جيم، صفحات هبوط، لوحات تحكم، أنظمة إدارة، تصميم UI/UX، وتطوير Front-End.
- وسائل التواصل: واتساب/هاتف ${PHONE}، البريد ${EMAIL}.
- اللغة الحالية للموقع: ${isArabic ? "العربية" : "English"}.

تعليمات الرد:
- رد بنفس لغة المستخدم أو لغة الموقع.
- لو الرد عربي استخدم عامية مصرية مهذبة وبسيطة.
- خلي الرد قصير ومفيد ومقنع.
- لا تخترع أسعار ثابتة، قل إن السعر حسب التفاصيل.
- لو المستخدم يسأل خارج مجال الموقع، جاوب بلطف ثم اربط الإجابة بخدمات Webora.
- لو المستخدم عنده فكرة موقع، اسأله عن عدد الصفحات والمميزات المطلوبة.

سؤال المستخدم:
${question}
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.85,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 320,
            },
          }),
        }
      );

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) return reply;

      return buildLocalReply(question);
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return buildLocalReply(question);
    }
  };

  const sendChatMessage = async () => {
    const currentMessage = chatInput.trim();
    if (!currentMessage || isThinking) return;

    setChatInput("");
    setIsThinking(true);

    setMessages((prev) => [
      ...prev,
      { from: "user", text: currentMessage },
      { from: "bot", text: isArabic ? "جاري التفكير..." : "Thinking...", loading: true },
    ]);

    const reply = await getBotReply(currentMessage);

    setMessages((prev) => [
      ...prev.filter((msg) => !msg.loading),
      { from: "bot", text: reply },
    ]);

    setIsThinking(false);
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
    localStorage.setItem(CHAT_KEY, JSON.stringify([welcomeMessage]));
  };

  const sha256 = async (text) => {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

const loginAdmin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword("");
      setAdminMsg(
        isArabic
          ? "تم تسجيل الدخول بنجاح ✅"
          : "Logged in successfully ✅"
      );
    } else {
      setAdminMsg(
        isArabic
          ? "كلمة السر غير صحيحة"
          : "Wrong password"
      );
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  };

  const addProject = () => {
    if (!newProject.title.trim() || !newProject.desc.trim() || !newProject.img.trim()) {
      setAdminMsg(isArabic ? "اكتب اسم المشروع والوصف ورابط الصورة" : "Please add title, description, and image");
      return;
    }

    setProjects((prev) => [{ ...newProject, title: newProject.title.trim(), desc: newProject.desc.trim(), img: newProject.img.trim() }, ...prev]);
    setNewProject({ title: "", desc: "", img: "" });
    setAdminMsg(isArabic ? "تم إضافة المشروع ✅" : "Project added ✅");
  };

  const deleteProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProjectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewProject((prev) => ({ ...prev, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const resetProjects = () => {
    const defaults = isArabic ? defaultProjects.ar : defaultProjects.en;
    setProjects(defaults);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaults));
  };

  const text = {
    ar: {
      dir: "rtl",
      switch: "English",
      name: "Webora",
      title: "Front-End Web Developer",
      desc: "أصمم مواقع ويب حديثة وسريعة ومتجاوبة تساعد أصحاب المشاريع على عرض خدماتهم وجذب العملاء بسهولة.",
      about: "هذا الموقع متخصص في تصميم وتطوير جميع أنواع مواقع الويب الحديثة مثل مواقع الشركات والمتاجر الإلكترونية والجيمات والمطاعم والبروفايلات الشخصية والأنظمة الإدارية وصفحات الهبوط الاحترافية.",
      services: "الخدمات",
      projects: "الأعمال",
      skills: "المهارات",
      contact: "تواصل",
      whatsapp: "تواصل واتساب",
      call: "اتصال مباشر",
      email: "Gmail",
      review: "قيّم الموقع",
      reviewSmall: "رأيك يهمني ويساعدني أطور شغلي",
      send: "إرسال",
      placeholderName: "اسمك",
      placeholderReview: "اكتب رأيك باختصار",
      thanksTitle: "رسالة من Webora",
      savedReviews: "التقييمات",
      noReviews: "لا توجد تقييمات حتى الآن. كن أول من يقيّم الموقع.",
      chatbot: "مساعد الموقع الذكي",
      chatPlaceholder: "اسأل عن الخدمات أو الأسعار...",
      admin: "لوحة التحكم",
      adminPassword: "كلمة سر الأدمن",
      login: "دخول",
      logout: "خروج",
      addProject: "إضافة مشروع",
      projectTitle: "اسم المشروع",
      projectDesc: "وصف المشروع",
      projectImage: "رابط الصورة أو ارفع صورة",
      clearChat: "مسح الشات",
      resetProjects: "استرجاع المشاريع الأساسية",
    },
    en: {
      dir: "ltr",
      switch: "العربية",
      name: "Webora",
      title: "Front-End Web Developer",
      desc: "I build modern responsive websites that help businesses present their services and attract customers.",
      about: "Webora provides professional web development services for all types of modern websites including business websites, e-commerce stores, gym websites, restaurant websites, landing pages, and custom systems.",
      services: "Services",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
      whatsapp: "WhatsApp",
      call: "Call Now",
      email: "Gmail",
      review: "Rate Website",
      reviewSmall: "Your feedback helps me improve my work",
      send: "Send",
      placeholderName: "Your name",
      placeholderReview: "Write a short review",
      thanksTitle: "Message from Webora",
      savedReviews: "Reviews",
      noReviews: "No reviews yet. Be the first to review the website.",
      chatbot: "Smart Website Assistant",
      chatPlaceholder: "Ask about services or pricing...",
      admin: "Admin Panel",
      adminPassword: "Admin password",
      login: "Login",
      logout: "Logout",
      addProject: "Add Project",
      projectTitle: "Project title",
      projectDesc: "Project description",
      projectImage: "Image URL or upload image",
      clearChat: "Clear chat",
      resetProjects: "Reset default projects",
    },
  };

  const t = text[language];

  const navLinks = [
    { label: t.services, href: "#services" },
    { label: t.projects, href: "#projects" },
    { label: t.skills, href: "#skills" },
    { label: t.contact, href: "#contact" },
  ];

  const colors = {
    pageBg: isDark
      ? "linear-gradient(135deg, #06111f 0%, #071827 50%, #020617 100%)"
      : "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #ffffff 100%)",
    text: isDark ? "#f8fafc" : "#0f172a",
    muted: isDark ? "#cbd5e1" : "#475569",
    card: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.88)",
    card2: isDark ? "rgba(15,23,42,.72)" : "rgba(241,245,249,.92)",
    border: isDark ? "rgba(255,255,255,.12)" : "rgba(15,23,42,.12)",
    nav: isDark ? "rgba(2, 6, 23, 0.88)" : "rgba(255,255,255,.88)",
    input: isDark ? "rgba(15,23,42,.9)" : "rgba(255,255,255,.95)",
  };

  const styles = {
    page: {
      background: colors.pageBg,
      minHeight: "100vh",
      color: colors.text,
      fontFamily: isArabic ? "Tahoma, Arial, sans-serif" : "Inter, Arial, sans-serif",
      lineHeight: 1.8,
      transition: "background .35s ease, color .35s ease",
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
      fontWeight: "700",
      transition: ".25s ease",
    },
    button: {
      border: "none",
      borderRadius: "16px",
      padding: "14px 24px",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "800",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: ".25s ease",
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
    card: {
      background: colors.card,
      borderRadius: "24px",
      padding: "24px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark ? "none" : "0 20px 50px rgba(15,23,42,.08)",
    },
  };

  return (
    <div dir={t.dir} style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        a:hover { transform: translateY(-2px); color: #06b6d4 !important; }
        button:hover { transform: translateY(-2px); filter: brightness(1.08); }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        .fade-up { animation: fadeUp .7s ease both; }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 700px) {
          h1 { font-size: 38px !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "16px", background: "linear-gradient(135deg, #2563eb, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <Code2 size={25} />
            </div>
            <h2 style={{ margin: 0, color: colors.text, fontWeight: 900 }}>Webora</h2>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={styles.navLink}>{link.label}</a>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{ ...styles.button, background: isDark ? "#f59e0b" : "#0f172a", padding: "12px 15px" }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setAdminOpen(true)} style={{ ...styles.button, background: "linear-gradient(135deg, #7c3aed, #2563eb)", padding: "12px 15px" }}>
              <Settings size={18} />
            </button>
            <button onClick={() => setLanguage(isArabic ? "en" : "ar")} style={{ ...styles.button, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", padding: "12px 18px" }}>
              <Languages size={18} /> {t.switch}
            </button>
          </div>
        </div>
      </nav>

      <section className="fade-up" style={{ maxWidth: "1200px", margin: "auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "60px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(34,211,238,.12)", color: "#0891b2", padding: "10px 20px", borderRadius: "999px", marginBottom: "22px", border: "1px solid rgba(34,211,238,.18)", fontWeight: 800 }}>
            <Sparkles size={18} /> {t.title}
          </div>

          <h1 style={{ fontSize: "58px", lineHeight: 1.2, margin: "0 0 20px", color: colors.text, fontWeight: 900 }}>{t.name}</h1>
          <p style={{ fontSize: "22px", color: colors.muted, marginBottom: "18px" }}>{t.desc}</p>
          <p style={{ color: colors.muted, fontSize: "17px" }}>{t.about}</p>

          <div style={{ display: "flex", gap: "16px", marginTop: "34px", flexWrap: "wrap" }}>
            <button onClick={() => openWhatsApp(isArabic ? "السلام عليكم، عايز أعمل موقع ويب" : "Hello, I want a website")} style={{ ...styles.button, background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
              <img
  src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
  alt="whatsapp"
  style={{
    width: "19px",
    height: "19px",
  }}
/> {t.whatsapp}
            </button>
            <button onClick={openPhone} style={{ ...styles.button, background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
              <img
  src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
  alt="phone"
  style={{
    width: "19px",
    height: "19px",
  }}
/> {t.call}
            </button>
            <button onClick={openEmail} style={{ ...styles.button, background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
              <img
  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
  alt="gmail"
  style={{
    width: "19px",
    height: "19px",
  }}
/> {t.email}
            </button>
          </div>
        </div>

        <div className="float" style={{ padding: "12px", borderRadius: "34px", background: "linear-gradient(135deg, rgba(37,99,235,.4), rgba(6,182,212,.2))" }}>
          <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=900&auto=format&fit=crop" alt="programming" style={{ width: "100%", height: "440px", objectFit: "cover", borderRadius: "26px", display: "block" }} />
        </div>
      </section>

      <section id="services" className="fade-up" style={{ maxWidth: "1200px", margin: "auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "30px", color: colors.text }}>{t.services}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "20px" }}>
          {["Responsive Design", "Landing Pages", "Business Websites", "Modern UI/UX"].map((item) => (
            <div key={item} style={styles.card}>
              <CheckCircle color="#06b6d4" />
              <h3 style={{ marginTop: "18px", color: colors.text }}>{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="fade-up" style={{ maxWidth: "1200px", margin: "auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "30px", color: colors.text }}>{t.projects}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "26px" }}>
          {projects.map((project, index) => (
            <div key={`${project.title}-${index}`} style={{ background: colors.card, borderRadius: "26px", overflow: "hidden", border: `1px solid ${colors.border}`, boxShadow: isDark ? "none" : "0 20px 50px rgba(15,23,42,.08)" }}>
              <img src={project.img} alt={project.title} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
              <div style={{ padding: "24px" }}>
                <h3 style={{ margin: 0, fontSize: "25px", color: colors.text }}>{project.title}</h3>
                <p style={{ color: colors.muted, minHeight: "70px" }}>{project.desc}</p>
                <button onClick={() => openWhatsApp(`${isArabic ? "عايز مشروع مثل" : "I want a project like"} ${project.title}`)} style={{ ...styles.button, width: "100%", background: isDark ? "white" : "#0f172a", color: isDark ? "#07111f" : "white" }}>
                  <ExternalLink size={18} /> {t.whatsapp}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" className="fade-up" style={{ maxWidth: "1200px", margin: "auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "30px", color: colors.text }}>{t.skills}</h2>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {["HTML", "CSS", "JavaScript", "React", "Tailwind", "Responsive Design", "Admin Dashboard", "AI Chatbot"].map((skill) => (
            <div key={skill} style={{ background: "rgba(56,189,248,.12)", color: "#0891b2", padding: "13px 22px", borderRadius: "16px", border: "1px solid rgba(56,189,248,.18)", fontWeight: 800 }}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="contact" className="fade-up" style={{ maxWidth: "1000px", margin: "70px auto", padding: "50px 24px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,.22), rgba(6,182,212,.12))", border: `1px solid ${colors.border}`, borderRadius: "32px", padding: "44px" }}>
          <h2 style={{ fontSize: "42px", color: colors.text, marginTop: 0 }}>{t.contact}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginTop: "26px" }}>
            <button onClick={() => openWhatsApp("Hello, I want a website")} style={{ ...styles.button, background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}><MessageCircle size={18} /> {t.whatsapp}</button>
            <button onClick={openPhone} style={{ ...styles.button, background: "linear-gradient(135deg, #16a34a, #22c55e)" }}><Phone size={18} /> {PHONE}</button>
            <button onClick={openEmail} style={{ ...styles.button, background: "linear-gradient(135deg, #dc2626, #ef4444)" }}><Mail size={18} /> {t.email}</button>
          </div>
        </div>
      </section>

      <section className="fade-up" style={{ maxWidth: "900px", margin: "20px auto 70px", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "18px" }}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <h2 style={{ margin: 0, fontSize: "26px", color: colors.text }}>{t.review}</h2>
              <p style={{ margin: "6px 0 0", color: colors.muted, fontSize: "14px" }}>{t.reviewSmall}</p>
            </div>

            {reviewMessage && (
              <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,.22), rgba(6,182,212,.15))", border: "1px solid rgba(34,197,94,.28)", color: isDark ? "#dcfce7" : "#166534", borderRadius: "18px", padding: "14px", marginBottom: "16px" }}>
                <strong style={{ display: "block", color: colors.text, marginBottom: "4px" }}>{t.thanksTitle}</strong>
                <span>{reviewMessage}</span>
              </div>
            )}

            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} type="text" placeholder={t.placeholderName} style={styles.input} />
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder={t.placeholderReview} style={{ ...styles.input, height: "90px", resize: "none" }} />
            <button onClick={submitReview} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}><Send size={18} /> {t.send}</button>
          </div>

          <div style={styles.card}>
            <h2 style={{ marginTop: 0, fontSize: "26px", color: colors.text }}>{t.savedReviews}</h2>
            {reviews.length === 0 ? (
              <p style={{ color: colors.muted }}>{t.noReviews}</p>
            ) : (
              <div style={{ display: "grid", gap: "12px", maxHeight: "330px", overflowY: "auto", paddingInlineEnd: "4px" }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{ background: colors.card2, borderRadius: "16px", padding: "14px", border: `1px solid ${colors.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
                      <strong style={{ color: "#0891b2" }}>{review.name}</strong>
                      {isAdmin && (
  <button
  onClick={() => deleteReview(review.id)}
  title="Delete"
  style={{
    background: "rgba(239,68,68,.14)",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,.25)",
    borderRadius: "10px",
    padding: "7px",
    cursor: "pointer",
  }}
>
  <Trash2 size={15} />
</button>
)}
                    </div>
                    <p style={{ color: colors.text, margin: "6px 0" }}>{review.text}</p>
                    <small style={{ color: "#64748b" }}>{review.date}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {adminOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,.62)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ width: "min(950px, 100%)", maxHeight: "92vh", overflowY: "auto", background: isDark ? "#020617" : "#ffffff", color: colors.text, borderRadius: "26px", border: `1px solid ${colors.border}`, boxShadow: "0 30px 90px rgba(0,0,0,.45)" }}>
            <div style={{ padding: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.border}` }}>
              <strong style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "20px" }}><ShieldCheck size={22} /> {t.admin}</strong>
              <button onClick={() => setAdminOpen(false)} style={{ background: "transparent", border: "none", color: colors.text, cursor: "pointer" }}><X /></button>
            </div>

            <div style={{ padding: "22px" }}>
              {!isAdmin ? (
                <div style={{ maxWidth: "430px", margin: "auto" }}>
<div style={{ textAlign: "center", marginBottom: "22px" }}>
  <div
    style={{
      width: "75px",
      height: "75px",
      margin: "0 auto 16px",
      borderRadius: "24px",
      background: "linear-gradient(135deg,#7c3aed,#2563eb)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      boxShadow: "0 15px 40px rgba(124,58,237,.35)",
    }}
  >
    <ShieldCheck size={36} />
  </div>

  <h2
    style={{
      margin: "0 0 8px",
      color: colors.text,
      fontSize: "28px",
      fontWeight: "900",
    }}
  >
    Admin Panel
  </h2>

  <p
    style={{
      margin: 0,
      color: colors.muted,
      fontSize: "15px",
    }}
  >
    Secure access for Webora management
  </p>
</div>                  <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loginAdmin()} placeholder={t.adminPassword} style={styles.input} />
                  <button onClick={loginAdmin} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}><Lock size={18} /> {t.login}</button>
                  {adminMsg && <p style={{ color: "#ef4444" }}>{adminMsg}</p>}
                  <small style={{ color: colors.muted }}>{isArabic ? "ضع كلمة السر في ملف .env باسم VITE_ADMIN_PASSWORD" : "Put the password in .env as VITE_ADMIN_PASSWORD"}</small>
                </div>
              ) : (
                <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={styles.card}>
                    <h3 style={{ marginTop: 0 }}>{t.addProject}</h3>
                    <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder={t.projectTitle} style={styles.input} />
                    <textarea value={newProject.desc} onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })} placeholder={t.projectDesc} style={{ ...styles.input, height: "92px", resize: "none" }} />
                    <input value={newProject.img} onChange={(e) => setNewProject({ ...newProject, img: e.target.value })} placeholder={t.projectImage} style={styles.input} />
                    <label style={{ ...styles.button, width: "100%", background: "#0f766e", marginBottom: "12px" }}>
                      <ImagePlus size={18} />
                      {isArabic ? "رفع صورة من الجهاز" : "Upload image"}
                      <input type="file" accept="image/*" onChange={handleProjectFile} style={{ display: "none" }} />
                    </label>
                    {newProject.img && <img src={newProject.img} alt="preview" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "18px", marginBottom: "12px" }} />}
                    <button onClick={addProject} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}><Plus size={18} /> {t.addProject}</button>
                    {adminMsg && <p style={{ color: "#22c55e" }}>{adminMsg}</p>}
                  </div>

                  <div style={styles.card}>
                    <h3 style={{ marginTop: 0 }}>{isArabic ? "إعدادات وإدارة" : "Settings & Manage"}</h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <button onClick={clearChat} style={{ ...styles.button, background: "#dc2626" }}><Trash2 size={18} /> {t.clearChat}</button>
                      <button onClick={resetProjects} style={{ ...styles.button, background: "#0891b2" }}>{t.resetProjects}</button>
                      <button onClick={logoutAdmin} style={{ ...styles.button, background: "#475569" }}><LogOut size={18} /> {t.logout}</button>
                    </div>

                    <h3>{isArabic ? "المشاريع الحالية" : "Current Projects"}</h3>
                    <div style={{ display: "grid", gap: "10px", maxHeight: "380px", overflowY: "auto" }}>
                      {projects.map((project, index) => (
                        <div key={`${project.title}-admin-${index}`} style={{ background: colors.card2, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "12px", display: "grid", gridTemplateColumns: "70px 1fr auto", gap: "10px", alignItems: "center" }}>
                          <img src={project.img} alt={project.title} style={{ width: "70px", height: "55px", objectFit: "cover", borderRadius: "10px" }} />
                          <div>
                            <strong>{project.title}</strong>
                            <p style={{ margin: 0, color: colors.muted, fontSize: "13px" }}>{project.desc.slice(0, 70)}...</p>
                          </div>
                          <button onClick={() => deleteProject(index)} style={{ background: "rgba(239,68,68,.14)", color: "#ef4444", border: "1px solid rgba(239,68,68,.25)", borderRadius: "10px", padding: "8px", cursor: "pointer" }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {chatOpen && (
        <div style={{ position: "fixed", right: isArabic ? "auto" : "24px", left: isArabic ? "24px" : "auto", bottom: "90px", width: "min(380px, calc(100vw - 40px))", background: isDark ? "#020617" : "#ffffff", border: `1px solid ${colors.border}`, borderRadius: "24px", overflow: "hidden", zIndex: 200, boxShadow: "0 25px 70px rgba(0,0,0,.45)" }}>
          <div style={{ padding: "16px", background: "linear-gradient(135deg, #2563eb, #06b6d4)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
            <strong style={{ display: "flex", alignItems: "center", gap: "8px" }}><Bot size={20} /> {t.chatbot}</strong>
            <div style={{ display: "flex", gap: "8px" }}>
              {isAdmin && (
                <button onClick={clearChat} title={t.clearChat} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", cursor: "pointer", borderRadius: "10px", padding: "5px" }}><Trash2 size={17} /></button>
              )}
              <button onClick={() => setChatOpen(false)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}><X size={20} /></button>
            </div>
          </div>
          <div style={{ padding: "14px", height: "330px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.from === "user" ? "#2563eb" : colors.card2, color: msg.from === "user" ? "white" : colors.text, padding: "10px 12px", borderRadius: "16px", fontSize: "14px", border: msg.from === "user" ? "none" : `1px solid ${colors.border}` }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px", opacity: 0.9 }}>
                  {msg.from === "user" ? <User size={14} /> : <Bot size={14} />}
                  <small>{msg.from === "user" ? "You" : "Webora AI"}</small>
                </div>
                <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "12px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: "8px" }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChatMessage()} placeholder={t.chatPlaceholder} disabled={isThinking} style={{ flex: 1, background: colors.input, border: `1px solid ${colors.border}`, color: colors.text, borderRadius: "14px", padding: "11px", outline: "none" }} />
            <button onClick={sendChatMessage} disabled={isThinking} style={{ ...styles.button, padding: "10px 13px", background: isThinking ? "#64748b" : "#2563eb" }}><Send size={17} /></button>
          </div>
        </div>
      )}

      <button onClick={() => setChatOpen(true)} style={{ position: "fixed", right: isArabic ? "auto" : "24px", left: isArabic ? "24px" : "auto", bottom: "24px", width: "58px", height: "58px", borderRadius: "50%", border: "none", color: "white", background: "linear-gradient(135deg, #2563eb, #06b6d4)", cursor: "pointer", zIndex: 180, boxShadow: "0 18px 45px rgba(37,99,235,.35)", display: chatOpen ? "none" : "flex", alignItems: "center", justifyContent: "center" }}>
        <Bot size={27} />
      </button>

      <footer style={{ textAlign: "center", padding: "30px", borderTop: `1px solid ${colors.border}`, color: colors.muted }}>
        © 2026 Webora - All Rights Reserved
      </footer>
    </div>
  );
}
