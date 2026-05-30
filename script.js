const PUBLIC_SURVEY_URL = "https://tally.so/r/xXvZYJ";
const INDUSTRY_SURVEY_URL = "https://tally.so/r/xXvXKE";

const preloader = document.getElementById("preloader");
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const timeline = document.getElementById("timeline");
const timelineProgress = document.getElementById("timelineProgress");
const statsSection = document.getElementById("stats");

document.querySelectorAll(".public-survey-link").forEach((link) => {
  link.href = PUBLIC_SURVEY_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll(".industry-survey-link").forEach((link) => {
  link.href = INDUSTRY_SURVEY_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

window.addEventListener("load", () => {
  window.setTimeout(() => {
    preloader?.classList.add("is-hidden");
  }, 450);
});

const setHeaderState = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setMenuPosition = () => {
  if (!siteHeader) return;
  const headerBottom = siteHeader.getBoundingClientRect().bottom;
  document.documentElement.style.setProperty("--mobile-menu-top", `${headerBottom + 12}px`);
};

setHeaderState();
setMenuPosition();
window.addEventListener("scroll", () => {
  setHeaderState();
  setMenuPosition();
}, { passive: true });
window.addEventListener("resize", setMenuPosition);

const closeMenu = () => {
  menuToggle?.classList.remove("is-open");
  navMenu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation menu");
};

menuToggle?.addEventListener("click", () => {
  setMenuPosition();
  const isOpen = navMenu.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const panel = item.querySelector(".faq-panel");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".faq-item button").forEach((otherButton) => {
      if (otherButton !== button) {
        otherButton.setAttribute("aria-expanded", "false");
        otherButton.closest(".faq-item").querySelector(".faq-panel").style.maxHeight = "0px";
      }
    });

    button.setAttribute("aria-expanded", String(!isOpen));
    panel.style.maxHeight = isOpen ? "0px" : `${panel.scrollHeight}px`;
  });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || 0);
  const suffix = counter.dataset.suffix || "";
  const duration = 1300;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    counter.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

let countersStarted = false;
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statsSection.querySelectorAll("[data-count]").forEach(animateCounter);
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.35 }
);

if (statsSection) statsObserver.observe(statsSection);

const updateTimelineProgress = () => {
  if (!timeline || !timelineProgress) return;

  const rect = timeline.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const total = rect.height + viewport * 0.6;
  const seen = viewport * 0.72 - rect.top;
  const progress = Math.max(0, Math.min(seen / total, 1)) * 100;

  if (window.matchMedia("(max-width: 1024px)").matches) {
    timelineProgress.style.width = "100%";
    timelineProgress.style.height = `${progress}%`;
  } else {
    timelineProgress.style.height = "100%";
    timelineProgress.style.width = `${progress}%`;
  }
};

updateTimelineProgress();
window.addEventListener("scroll", updateTimelineProgress, { passive: true });
window.addEventListener("resize", updateTimelineProgress);
