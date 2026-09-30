const root = document.documentElement;
const langButton = document.getElementById("lang-toggle");
const nav = document.getElementById("site-nav");
const navToggle = document.getElementById("nav-toggle");
const progress = document.getElementById("progress");
const year = document.getElementById("year");

const titles = {
    en: "Renqiang He · AI Algorithm Engineer",
    zh: "和任强 · AI 算法工程师"
};

function applyLang(lang) {
    const zh = lang === "zh";
    root.classList.toggle("zh", zh);
    root.lang = zh ? "zh-CN" : "en";
    langButton.textContent = zh ? "EN" : "中文";
    document.title = zh ? titles.zh : titles.en;
    try {
        localStorage.setItem("lang", zh ? "zh" : "en");
    } catch (e) {}
}

const requestedLang = new URLSearchParams(location.search).get("lang");
applyLang(requestedLang === "zh" || requestedLang === "en"
    ? requestedLang
    : (root.classList.contains("zh") ? "zh" : "en"));

langButton.addEventListener("click", () => {
    applyLang(root.classList.contains("zh") ? "en" : "zh");
});

function closeNav() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
});

const links = [...nav.querySelectorAll("a")];
const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });

sections.forEach((section) => spy.observe(section));

function onScroll() {
    const scrolled = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${height > 0 ? (scrolled / height) * 100 : 0}%`;
}

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio note from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:hrqdsg@163.com?subject=${subject}&body=${body}`;
});

year.textContent = String(new Date().getFullYear());
