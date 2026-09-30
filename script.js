const root = document.documentElement;
const langButton = document.getElementById("lang-toggle");
const nav = document.getElementById("site-nav");
const navToggle = document.getElementById("nav-toggle");
const years = document.querySelectorAll(".year");

const titles = {
    en: "Renqiang He",
    zh: "和任强"
};

function applyLang(lang) {
    const zh = lang === "zh";
    root.classList.toggle("zh", zh);
    root.lang = zh ? "zh-CN" : "en";
    langButton.textContent = zh ? "EN" : "中文";
    document.title = titles[zh ? "zh" : "en"];
    try { localStorage.setItem("lang", zh ? "zh" : "en"); } catch (e) {}
}

const requested = new URLSearchParams(location.search).get("lang");
applyLang(requested === "zh" || requested === "en" ? requested : (root.classList.contains("zh") ? "zh" : "en"));

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

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
});

years.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});
