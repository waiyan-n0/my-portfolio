const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;
const moon = `<path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>`;
const sun = `<path d="M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM8 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 0zM8 14.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zM14.5 8a.5.5 0 0 1 .5.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zM0 8a.5.5 0 0 1 .5-.5H1a.5.5 0 0 1 0 1H.5A.5.5 0 0 1 0 8zM11.657 11.657a.5.5 0 0 1 .707 0l.708.708a.5.5 0 0 1-.707.707l-.708-.708a.5.5 0 0 1 0-.707zM2.93 2.929a.5.5 0 0 1 .707 0l.708.708a.5.5 0 0 1-.707.707L2.93 3.636a.5.5 0 0 1 0-.707zM11.657 4.343a.5.5 0 0 1 0-.707l.708-.708a.5.5 0 1 1 .707.707l-.708.708a.5.5 0 0 1-.707 0zM2.93 13.071a.5.5 0 0 1 0-.707l.708-.708a.5.5 0 1 1 .707.707l-.708.708a.5.5 0 0 1-.707 0z"/>`;
const translateToggle = document.getElementById('translateToggle');

const cursor = document.querySelector('.cursor');
        document.addEventListener('mousemove', e => {
            //console.log(e)
            cursor.setAttribute("style", "top:"+(e.pageY-10 )+"px; left:"+(e.pageX-10)+"px;")
        });
        document.addEventListener('click', () => {
            cursor.classList.add("expand");
            setTimeout(() => {
                cursor.classList.remove("expand");
            }, 500);
        });

const setTheme = (mode) => {
  if (mode === 'dark') {
    html.classList.add('dark');
    themeIcon.innerHTML = sun;
  } else {
    html.classList.remove('dark');
    themeIcon.innerHTML = moon;
  }
  localStorage.setItem('theme', mode);
};

themeToggle.addEventListener('click', () => {
  const isDark = html.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});

let translation = {};
let currentLang = 'en';

async function changeLanguage(lang) {
  try {
    const res = await fetch(`${lang}.json`);
    translation = await res.json();
    updateText();
    startTypingEffect(lang);
    localStorage.setItem('lang', lang);
    currentLang = lang;

    document.querySelectorAll('.title').forEach(el => {
      if (lang === 'mm') {
        el.classList.add('titleGap');
      } else {
        el.classList.remove('titleGap');
      }
    });
  } catch (err) {
    console.log("Error", err);
  }
}

function updateText() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translation[key]) {
      el.textContent = translation[key];
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const savedLanguage = localStorage.getItem('lang') || 'en';
  changeLanguage(savedLanguage);
});

translateToggle.addEventListener('click', (e) => {
  e.preventDefault();
  const newLang = currentLang === "en" ? "mm" : "en";
  changeLanguage(newLang);
});

const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.3 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

async function changeLanguage(lang) {
  try {
    const res = await fetch(`${lang}.json`, { cache: "no-store" });
    const data = await res.json();
    translation = data;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateText();
    await new Promise(r => setTimeout(r, 150));
    await startTypingEffect(lang);
    document.querySelectorAll('.title').forEach(el => {
      if (lang === 'mm') el.classList.add('titleGap');
      else el.classList.remove('titleGap');
    });

  } catch (err) {
    console.log("Error loading language:", err);
  }
}

function typeEffect(element, text, speed = 100) {
  let index = 0;
  element.textContent = '';
  function typing() {
    if (index < text.length) {
      element.textContent = text.slice(0, index + 1);
      index++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

async function startTypingEffect(lang = 'en') {
  try {
    const res = await fetch(`${lang}.json`);
    const data = await res.json();
    const element = document.getElementById('typing-text');

    if (element && data.greeting) {
      element.textContent = '';
      await new Promise(r => setTimeout(r, 50));
      typeEffect(element, data.greeting, 80);
    }
  } catch (err) {
    console.log("Typing Effect Error:", err);
  }
}

const starBox = document.getElementById('star-box');
const starCount = document.getElementById('star-count');
const starSvg = starBox.querySelector('svg');

let totalStars = parseInt(localStorage.getItem('totalStars')) || 0;
let hasStarred = localStorage.getItem('hasStarred') === 'true';

starCount.textContent = totalStars;

if (hasStarred) {
  starSvg.classList.add('starred');
  starBox.style.cursor = 'default';
}

starBox.addEventListener('click', () => {
  if (hasStarred) return;

  totalStars++;
  localStorage.setItem('totalStars', totalStars);
  starCount.textContent = totalStars;

  hasStarred = true;
  localStorage.setItem('hasStarred', 'true');

  starSvg.classList.add('starred');
  starBox.style.cursor = 'default';
});
