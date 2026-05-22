import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

const PHONE = "01103099235";
const PHONE_INT = "201103099235";
const EMAIL = "mohaned01103099235@gmail.com";
const REVIEWS_KEY = "mohaned_portfolio_reviews";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [language, setLanguage] = useState("ar");
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "أهلاً بك 👋 أنا مساعد موقع Webora. اسألني عن الخدمات، الأسعار، مدة تنفيذ الموقع، أو طرق التواصل.",
    },
  ]);

  const isArabic = language === "ar";

  useEffect(() => {
    document.title = "Web Ora";
  }, []);

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
    setReviews(savedReviews);
  }, []);

  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: isArabic
          ? "أهلاً بك 👋 أنا مساعد موقع Webora. اسألني عن الخدمات، الأسعار، مدة تنفيذ الموقع، أو طرق التواصل."
          : "Hello 👋 I am Webora assistant. Ask me about services, pricing, delivery time, or contact methods.",
      },
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);


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
        ? `Mohaned Hussein Portfolio يشكرك يا ${newReview.name} على تقييمك الجميل ❤️`
        : `Mohaned Hussein Portfolio thanks you, ${newReview.name}, for your review ❤️`
    );

    setReviewName("");
    setReviewText("");
  };

  const getLocalBotReply = (question) => {
    const q = question.toLowerCase();

    const smartReplies = {
      pricing: isArabic
        ? "أسعار المواقع في Webora بتتحدد حسب نوع الموقع وعدد الصفحات والمميزات المطلوبة. ابعت تفاصيل فكرتك على واتساب، وهنحددلك السعر المناسب."
        : "Webora pricing depends on the website type, number of pages, and requested features. Send your project details on WhatsApp and we will suggest a suitable price.",

      delivery: isArabic
        ? "مدة التنفيذ بتختلف حسب حجم المشروع. الموقع التعريفي أو صفحة الهبوط غالباً بتاخد أيام قليلة، والمتجر أو النظام الكبير بيحتاج وقت أكتر حسب التفاصيل."
        : "Delivery time depends on project size. Landing pages or business websites usually take a few days, while stores and larger systems need more time.",

      services: isArabic
        ? "Webora بيصمم ويطور جميع أنواع المواقع: مواقع شركات، متاجر إلكترونية، مواقع مطاعم، مواقع جيم، بروفايلات شخصية، صفحات هبوط، ولوحات تحكم."
        : "Webora builds all types of websites: business websites, e-commerce stores, restaurant websites, gym websites, portfolios, landing pages, and dashboards.",

      contact: isArabic
        ? `تقدر تتواصل مع Webora على واتساب أو الهاتف: ${PHONE}، أو عبر البريد الإلكتروني: ${EMAIL}.`
        : `You can contact Webora by WhatsApp or phone: ${PHONE}, or by email: ${EMAIL}.`,

      projects: isArabic
        ? "قسم الأعمال فيه نماذج لمواقع مختلفة، وWebora يقدر ينفذ أي فكرة موقع حسب نشاطك واحتياجك."
        : "The projects section shows sample websites, and Webora can build any website idea based on your business needs.",

      greeting: isArabic
        ? "أهلاً بيك 👋 اسألني عن أي حاجة تخص Webora: الخدمات، الأسعار، مدة التنفيذ، أو طريقة التواصل."
        : "Hello 👋 Ask me anything about Webora: services, pricing, delivery time, or contact methods.",
    };

    if (q.includes("السلام") || q.includes("اهلا") || q.includes("أهلا") || q.includes("مرحبا") || q.includes("hello") || q.includes("hi")) {
      return smartReplies.greeting;
    }

    if (q.includes("سعر") || q.includes("تكلفة") || q.includes("كام") || q.includes("بكام") || q.includes("price") || q.includes("cost") || q.includes("budget")) {
      return smartReplies.pricing;
    }

    if (q.includes("مدة") || q.includes("وقت") || q.includes("تسليم") || q.includes("امتى") || q.includes("time") || q.includes("delivery")) {
      return smartReplies.delivery;
    }

    if (q.includes("خدمات") || q.includes("بتعمل") || q.includes("تصمم") || q.includes("مواقع") || q.includes("خدمة") || q.includes("services") || q.includes("website")) {
      return smartReplies.services;
    }

    if (q.includes("واتساب") || q.includes("تواصل") || q.includes("رقم") || q.includes("ايميل") || q.includes("phone") || q.includes("contact") || q.includes("whatsapp") || q.includes("email")) {
      return smartReplies.contact;
    }

    if (q.includes("مشاريع") || q.includes("أعمال") || q.includes("اعمال") || q.includes("نماذج") || q.includes("portfolio") || q.includes("projects")) {
      return smartReplies.projects;
    }

    if (q.includes("لغة") || q.includes("english") || q.includes("عربي") || q.includes("language")) {
      return isArabic
        ? "الموقع يدعم العربية والإنجليزية، وتقدر تبدّل اللغة من الزر الموجود في الأعلى."
        : "The website supports Arabic and English, and you can switch languages from the top button.";
    }

    return isArabic
      ? `أقدر أساعدك في سؤالك عن "${question}". Webora متخصص في تصميم وتطوير المواقع، ابعتلي تفاصيل فكرتك وأنا أوضحلك أنسب نوع موقع وطريقة التنفيذ.`
      : `I can help with your question about "${question}". Webora specializes in website design and development. Send your idea details and I will explain the best website type and process.`;
  };

  const getBotReply = async (question) => {
    const siteContext = `
أنت مساعد ذكي خاص بموقع Webora.

معلومات الموقع:
- اسم الموقع: Webora.
- Webora متخصص في تصميم وتطوير جميع أنواع المواقع الإلكترونية الحديثة.
- الخدمات: مواقع شركات، متاجر إلكترونية، مواقع مطاعم، مواقع جيم، بروفايلات شخصية، صفحات هبوط، لوحات تحكم، أنظمة إدارة، تصميم UI/UX، وتطوير Front-End.
- رقم التواصل والواتساب: ${PHONE}.
- البريد الإلكتروني: ${EMAIL}.
- اللغة الحالية للموقع: ${isArabic ? "العربية" : "الإنجليزية"}.

طريقة الرد:
- لو اللغة الحالية عربية، رد باللهجة المصرية البسيطة.
- لو اللغة الحالية إنجليزية، رد بالإنجليزية.
- خليك محترف، مختصر، ومفيد.
- لا تخترع أسعار ثابتة. لو العميل سأل عن السعر، قل إن السعر بيتحدد حسب التفاصيل ونوع الموقع وعدد الصفحات والمميزات.
- لو العميل سأل سؤال خارج الموقع، جاوبه بلطف وحاول تربط الإجابة بخدمات Webora لو مناسب.
- لا تذكر أنك نموذج ذكاء اصطناعي.
- لا تستخدم تنسيق Markdown مبالغ فيه.
`;

    if (!GEMINI_API_KEY) {
      return getLocalBotReply(question);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${siteContext}\n\nسؤال العميل:\n${question}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Gemini API Error:", data);
        return getLocalBotReply(question);
      }

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!reply) {
        return getLocalBotReply(question);
      }

      return reply;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return getLocalBotReply(question);
    }
  };

  const sendChatMessage = async () => {
    const currentMessage = chatInput.trim();
    if (!currentMessage || chatLoading) return;

    const userMessage = {
      from: "user",
      text: currentMessage,
    };

    setChatInput("");
    setMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: isArabic ? "جاري التفكير..." : "Thinking...",
        loading: true,
      },
    ]);

    const reply = await getBotReply(currentMessage);

    setMessages((prev) => [
      ...prev.filter((msg) => !msg.loading),
      {
        from: "bot",
        text: reply,
      },
    ]);

    setChatLoading(false);
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
      email: "إرسال إيميل",
      review: "قيّم الموقع",
      reviewSmall: "رأيك يهمني ويساعدني أطور شغلي",
      send: "إرسال",
      placeholderName: "اسمك",
      placeholderReview: "اكتب رأيك باختصار",
      thanksTitle: "رسالة من Webora",
      savedReviews: "التقييمات",
      noReviews: "لا توجد تقييمات حتى الآن. كن أول من يقيّم الموقع.",
      chatbot: "مساعد الموقع",
      chatPlaceholder: "اسأل عن الخدمات أو الأسعار...",
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
      email: "Send Email",
      review: "Rate Website",
      reviewSmall: "Your feedback helps me improve my work",
      send: "Send",
      placeholderName: "Your name",
      placeholderReview: "Write a short review",
      thanksTitle: "Message from Webora",
      savedReviews: "Reviews",
      noReviews: "No reviews yet. Be the first to review the website.",
      chatbot: "Website Assistant",
      chatPlaceholder: "Ask about services or pricing...",
    },
  };

  const t = text[language];

  const navLinks = [
    { label: t.services, href: "#services" },
    { label: t.projects, href: "#projects" },
    { label: t.skills, href: "#skills" },
    { label: t.contact, href: "#contact" },
  ];

  const projects = [
    {
      title: isArabic ? "موقع جيم" : "Gym Website",
      desc: isArabic ? "موقع جذاب يعرض الاشتراكات والبرامج التدريبية وطرق التواصل." : "A modern website for memberships, training programs, and contact options.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: isArabic ? "موقع مطعم" : "Restaurant Website",
      desc: isArabic ? "واجهة حديثة لعرض المنيو والعروض وصور الأكلات." : "A clean website for menus, offers, and food photos.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: isArabic ? "موقع شركة" : "Business Website",
      desc: isArabic ? "صفحة تعريفية احترافية تعرض خدمات الشركة وتزيد ثقة العملاء." : "A professional landing page that presents business services.",
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: isArabic ? "متجر إلكتروني" : "E-Commerce Store",
      desc: isArabic ? "متجر احترافي لعرض المنتجات وعمليات الشراء أونلاين." : "Professional online store for products and online payments.",
      img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: isArabic ? "لوحة تحكم ونظام إدارة" : "Dashboard System",
      desc: isArabic ? "أنظمة ولوحات تحكم حديثة لإدارة المشاريع والبيانات." : "Modern dashboard and management systems for businesses.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
    },
  ];

  const styles = {
    page: {
      background: "linear-gradient(135deg, #06111f 0%, #071827 50%, #020617 100%)",
      minHeight: "100vh",
      color: "#f8fafc",
      fontFamily: isArabic ? "Tahoma, Arial, sans-serif" : "Inter, Arial, sans-serif",
      lineHeight: 1.8,
    },
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(2, 6, 23, 0.88)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
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
      color: "#e2e8f0",
      textDecoration: "none",
      padding: "10px 18px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      fontWeight: "700",
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
    },
  };

  return (
    <div dir={t.dir} style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        a:hover { transform: translateY(-2px); color: #67e8f9 !important; }
        button:hover { transform: translateY(-2px); filter: brightness(1.08); }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        @media (max-width: 700px) { h1 { font-size: 38px !important; } }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "16px", background: "linear-gradient(135deg, #2563eb, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Code2 size={25} />
            </div>
            <h2 style={{ margin: 0, color: "#f8fafc", fontWeight: 900 }}>Webora</h2>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={styles.navLink}>{link.label}</a>
            ))}
          </div>

          <button onClick={() => setLanguage(isArabic ? "en" : "ar")} style={{ ...styles.button, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", padding: "12px 18px" }}>
            <Languages size={18} /> {t.switch}
          </button>
        </div>
      </nav>

      <section style={{ maxWidth: "1200px", margin: "auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "60px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(34,211,238,.12)", color: "#67e8f9", padding: "10px 20px", borderRadius: "999px", marginBottom: "22px", border: "1px solid rgba(34,211,238,.18)", fontWeight: 800 }}>
            <Sparkles size={18} /> {t.title}
          </div>

          <h1 style={{ fontSize: "58px", lineHeight: 1.2, margin: "0 0 20px", color: "#ffffff", fontWeight: 900 }}>{t.name}</h1>
          <p style={{ fontSize: "22px", color: "#e2e8f0", marginBottom: "18px" }}>{t.desc}</p>
          <p style={{ color: "#cbd5e1", fontSize: "17px" }}>{t.about}</p>

          <div style={{ display: "flex", gap: "16px", marginTop: "34px", flexWrap: "wrap" }}>
            <button onClick={() => openWhatsApp(isArabic ? "السلام عليكم يا مهند، عايز أعمل موقع ويب" : "Hello Mohaned, I want a website")} style={{ ...styles.button, background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
              <MessageCircle size={19} /> {t.whatsapp}
            </button>
            <button onClick={openPhone} style={{ ...styles.button, background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
              <Phone size={19} /> {t.call}
            </button>
          </div>
        </div>

        <div style={{ padding: "12px", borderRadius: "34px", background: "linear-gradient(135deg, rgba(37,99,235,.4), rgba(6,182,212,.2))" }}>
          <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=900&auto=format&fit=crop" alt="programming" style={{ width: "100%", height: "440px", objectFit: "cover", borderRadius: "26px", display: "block" }} />
        </div>
      </section>

      <section id="services" style={{ maxWidth: "1200px", margin: "auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "30px", color: "#ffffff" }}>{t.services}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "20px" }}>
          {["Responsive Design", "Landing Pages", "Business Websites", "Modern UI/UX"].map((item) => (
            <div key={item} style={{ background: "rgba(255,255,255,.06)", padding: "28px", borderRadius: "24px", border: "1px solid rgba(255,255,255,.08)" }}>
              <CheckCircle color="#67e8f9" />
              <h3 style={{ marginTop: "18px", color: "#f8fafc" }}>{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" style={{ maxWidth: "1200px", margin: "auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "30px", color: "#ffffff" }}>{t.projects}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "26px" }}>
          {projects.map((project) => (
            <div key={project.title} style={{ background: "rgba(255,255,255,.06)", borderRadius: "26px", overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" }}>
              <img src={project.img} alt={project.title} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
              <div style={{ padding: "24px" }}>
                <h3 style={{ margin: 0, fontSize: "25px", color: "#ffffff" }}>{project.title}</h3>
                <p style={{ color: "#cbd5e1", minHeight: "70px" }}>{project.desc}</p>
                <button onClick={() => openWhatsApp(`Hello Mohaned, I want ${project.title}`)} style={{ ...styles.button, width: "100%", background: "white", color: "#07111f" }}>
                  <ExternalLink size={18} /> {t.whatsapp}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" style={{ maxWidth: "1200px", margin: "auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "30px", color: "#ffffff" }}>{t.skills}</h2>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {["HTML", "CSS", "JavaScript", "React", "Tailwind", "Responsive Design"].map((skill) => (
            <div key={skill} style={{ background: "rgba(56,189,248,.12)", color: "#a5f3fc", padding: "13px 22px", borderRadius: "16px", border: "1px solid rgba(56,189,248,.18)", fontWeight: 800 }}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="contact" style={{ maxWidth: "1000px", margin: "70px auto", padding: "50px 24px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,.22), rgba(6,182,212,.12))", border: "1px solid rgba(255,255,255,.08)", borderRadius: "32px", padding: "44px" }}>
          <h2 style={{ fontSize: "42px", color: "#ffffff", marginTop: 0 }}>{t.contact}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginTop: "26px" }}>
            <button onClick={() => openWhatsApp("Hello Mohaned, I want a website")} style={{ ...styles.button, background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>{t.whatsapp}</button>
            <button onClick={openPhone} style={{ ...styles.button, background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>{PHONE}</button>
            <button onClick={openEmail} style={{ ...styles.button, background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>{t.email}</button>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "820px", margin: "20px auto 70px", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "18px" }}>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "24px", padding: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <h2 style={{ margin: 0, fontSize: "26px", color: "#ffffff" }}>{t.review}</h2>
              <p style={{ margin: "6px 0 0", color: "#cbd5e1", fontSize: "14px" }}>{t.reviewSmall}</p>
            </div>

            {reviewMessage && (
              <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,.22), rgba(6,182,212,.15))", border: "1px solid rgba(34,197,94,.28)", color: "#dcfce7", borderRadius: "18px", padding: "14px", marginBottom: "16px" }}>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "4px" }}>{t.thanksTitle}</strong>
                <span>{reviewMessage}</span>
              </div>
            )}

            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} type="text" placeholder={t.placeholderName} style={{ width: "100%", padding: "13px 15px", marginBottom: "12px", borderRadius: "14px", border: "1px solid rgba(255,255,255,.12)", outline: "none", fontSize: "16px", background: "rgba(15,23,42,.9)", color: "white" }} />
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder={t.placeholderReview} style={{ width: "100%", height: "90px", padding: "13px 15px", borderRadius: "14px", border: "1px solid rgba(255,255,255,.12)", outline: "none", fontSize: "16px", marginBottom: "14px", background: "rgba(15,23,42,.9)", color: "white", resize: "none" }} />
            <button onClick={submitReview} style={{ ...styles.button, width: "100%", background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}><Send size={18} /> {t.send}</button>
          </div>

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "24px", padding: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 style={{ marginTop: 0, fontSize: "26px", color: "#ffffff" }}>{t.savedReviews}</h2>
            {reviews.length === 0 ? (
              <p style={{ color: "#cbd5e1" }}>{t.noReviews}</p>
            ) : (
              <div style={{ display: "grid", gap: "12px", maxHeight: "330px", overflowY: "auto", paddingInlineEnd: "4px" }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{ background: "rgba(15,23,42,.65)", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                    <strong style={{ color: "#67e8f9" }}>{review.name}</strong>
                    <p style={{ color: "#e2e8f0", margin: "6px 0" }}>{review.text}</p>
                    <small style={{ color: "#94a3b8" }}>{review.date}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {chatOpen && (
        <div style={{ position: "fixed", right: isArabic ? "auto" : "24px", left: isArabic ? "24px" : "auto", bottom: "90px", width: "min(360px, calc(100vw - 40px))", background: "#020617", border: "1px solid rgba(255,255,255,.14)", borderRadius: "24px", overflow: "hidden", zIndex: 200, boxShadow: "0 25px 70px rgba(0,0,0,.45)" }}>
          <div style={{ padding: "16px", background: "linear-gradient(135deg, #2563eb, #06b6d4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ display: "flex", alignItems: "center", gap: "8px" }}><Bot size={20} /> {t.chatbot}</strong>
            <button onClick={() => setChatOpen(false)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}><X size={20} /></button>
          </div>
          <div style={{ padding: "14px", height: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.from === "user" ? "#2563eb" : "rgba(255,255,255,.08)", color: "white", padding: "10px 12px", borderRadius: "16px", fontSize: "14px" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px", opacity: 0.9 }}>
                  {msg.from === "user" ? <User size={14} /> : <Bot size={14} />}
                  <small>{msg.from === "user" ? "You" : "Webora AI"}</small>
                </div>
                <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", gap: "8px" }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChatMessage()} disabled={chatLoading} placeholder={chatLoading ? (isArabic ? "انتظر الرد..." : "Please wait...") : t.chatPlaceholder} style={{ flex: 1, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", color: "white", borderRadius: "14px", padding: "11px", outline: "none", opacity: chatLoading ? 0.7 : 1 }} />
            <button onClick={sendChatMessage} disabled={chatLoading} style={{ ...styles.button, padding: "10px 13px", background: "#2563eb", opacity: chatLoading ? 0.6 : 1 }}><Send size={17} /></button>
          </div>
        </div>
      )}

      <button onClick={() => setChatOpen(true)} style={{ position: "fixed", right: isArabic ? "auto" : "24px", left: isArabic ? "24px" : "auto", bottom: "24px", width: "58px", height: "58px", borderRadius: "50%", border: "none", color: "white", background: "linear-gradient(135deg, #2563eb, #06b6d4)", cursor: "pointer", zIndex: 180, boxShadow: "0 18px 45px rgba(37,99,235,.35)", display: chatOpen ? "none" : "flex", alignItems: "center", justifyContent: "center" }}>
        <Bot size={27} />
      </button>

      <footer style={{ textAlign: "center", padding: "30px", borderTop: "1px solid rgba(255,255,255,.1)", color: "#cbd5e1" }}>
        © 2026 Webora - All Rights Reserved
      </footer>
    </div>
  );
}
