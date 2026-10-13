const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

const updateScrollUI = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

    if (scrollProgress) {
        scrollProgress.style.width = `${scrollPercent}%`;
    }

    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
};

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile Navigation Toggle
if (hamburger && navLinks) {
    const setNavigationOpen = (isOpen) => {
        navLinks.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

        const icon = hamburger.querySelector('i');
        icon?.classList.toggle('fa-bars', !isOpen);
        icon?.classList.toggle('fa-times', isOpen);
    };

    hamburger.addEventListener('click', () => {
        setNavigationOpen(hamburger.getAttribute('aria-expanded') !== 'true');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            setNavigationOpen(false);
        });
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
        if (event.matches) setNavigationOpen(false);
    });
}

// Theme Toggle
const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-mode', isLight);

    if (themeIcon) {
        themeIcon.classList.toggle('fa-sun', isLight);
        themeIcon.classList.toggle('fa-moon', !isLight);
    }

    if (themeToggle) {
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }

    localStorage.setItem('theme', theme);
};

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(nextTheme);
    });
}

// Simple Contact Form Interaction
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! This is a demo form, but feel free to email me directly at emmanuelramon100803@gmail.com.');
        contactForm.reset();
    });
}

// Project experience carousel
const projectCards = Array.from(document.querySelectorAll('.project-track .project-card'));
const previousProject = document.querySelector('.carousel-prev');
const nextProject = document.querySelector('.carousel-next');
const carouselStatus = document.querySelector('.carousel-status');
const projectCarousel = document.querySelector('.project-carousel');
const carouselInterval = 3000;
let activeProjectIndex = 0;
let carouselTimer;

const showProject = (index) => {
    activeProjectIndex = (index + projectCards.length) % projectCards.length;

    projectCards.forEach((card, cardIndex) => {
        card.classList.toggle('is-active', cardIndex === activeProjectIndex);
        card.classList.toggle('is-prev', cardIndex === (activeProjectIndex - 1 + projectCards.length) % projectCards.length);
        card.classList.toggle('is-next', cardIndex === (activeProjectIndex + 1) % projectCards.length);
    });

    if (carouselStatus) {
        carouselStatus.textContent = `Project ${activeProjectIndex + 1} of ${projectCards.length}`;
    }
};

if (projectCards.length) {
    showProject(0);

    previousProject?.addEventListener('click', () => showProject(activeProjectIndex - 1));
    nextProject?.addEventListener('click', () => showProject(activeProjectIndex + 1));

    const startCarousel = () => {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(() => showProject(activeProjectIndex + 1), carouselInterval);
    };

    const pauseCarousel = () => clearInterval(carouselTimer);

    projectCarousel?.addEventListener('mouseenter', pauseCarousel);
    projectCarousel?.addEventListener('mouseleave', startCarousel);
    projectCarousel?.addEventListener('focusin', pauseCarousel);
    projectCarousel?.addEventListener('focusout', (event) => {
        if (!projectCarousel.contains(event.relatedTarget)) {
            startCarousel();
        }
    });

    startCarousel();
}

document.querySelectorAll('.cert-image img').forEach((image) => {
    const showPlaceholder = () => {
        const imageFrame = image.closest('.cert-image');
        imageFrame?.classList.add('is-missing');
        imageFrame?.removeAttribute('role');
        imageFrame?.removeAttribute('tabindex');
        imageFrame?.removeAttribute('aria-label');
    };

    image.addEventListener('error', showPlaceholder, { once: true });
    if (image.complete && image.naturalWidth === 0) {
        showPlaceholder();
    }
});

const certLightbox = document.getElementById('certLightbox');
const certLightboxImage = document.getElementById('certLightboxImage');
const certLightboxCaption = document.getElementById('certLightboxCaption');
const certLightboxClose = document.getElementById('certLightboxClose');

document.querySelectorAll('.cert-image').forEach((imageFrame) => {
    const image = imageFrame.querySelector('img');
    if (!image || imageFrame.classList.contains('is-missing')) return;

    imageFrame.setAttribute('role', 'button');
    imageFrame.setAttribute('tabindex', '0');
    imageFrame.setAttribute('aria-label', `View full-screen: ${image.alt}`);

    const openCertificate = () => {
        if (!certLightbox || !certLightboxImage || imageFrame.classList.contains('is-missing')) return;
        certLightboxImage.src = image.currentSrc || image.src;
        certLightboxImage.alt = image.alt;
        if (certLightboxCaption) certLightboxCaption.textContent = image.alt;
        certLightbox.showModal();
    };

    imageFrame.addEventListener('click', openCertificate);
    imageFrame.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openCertificate();
        }
    });
});

certLightboxClose?.addEventListener('click', () => certLightbox?.close());
certLightbox?.addEventListener('click', (event) => {
    if (event.target === certLightbox) certLightbox.close();
});

// Reveal education and certification items as they enter the viewport
const revealItems = document.querySelectorAll('.edu-item, .cert-list li');
if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 4) * 90}ms`;
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Reveal experience bullets word by word, like a lyrics-style reading effect
const lyricLines = document.querySelectorAll('.timeline-content li');
const lyricWordDelay = 140;
lyricLines.forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.innerHTML = words.map((word, index) => `<span class="lyric-word">${word}</span>${index < words.length - 1 ? ' ' : ''}`).join('');
    line.classList.add('lyric-line');
});

const readLyricLine = (line) => {
    line.classList.add('is-reading');
    const words = line.querySelectorAll('.lyric-word');
    words.forEach((word, index) => {
        window.setTimeout(() => {
            word.classList.add('is-visible');
            word.classList.add('is-current');
            if (index > 0) {
                words[index - 1].classList.remove('is-current');
            }
        }, index * lyricWordDelay);
    });
};

if ('IntersectionObserver' in window && lyricLines.length) {
    const lyricObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                readLyricLine(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    lyricLines.forEach((line) => lyricObserver.observe(line));
} else {
    lyricLines.forEach((line) => line.querySelectorAll('.lyric-word').forEach((word) => word.classList.add('is-visible')));
}

const copyEmailButton = document.querySelector('.copy-email');
copyEmailButton?.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.email;
    try {
        await navigator.clipboard.writeText(email);
        copyEmailButton.classList.add('is-copied');
        copyEmailButton.innerHTML = '<i class="fas fa-check"></i>';
        copyEmailButton.setAttribute('aria-label', 'Email copied');
        window.setTimeout(() => {
            copyEmailButton.classList.remove('is-copied');
            copyEmailButton.innerHTML = '<i class="far fa-copy"></i>';
            copyEmailButton.setAttribute('aria-label', 'Copy email address');
        }, 1800);
    } catch {
        window.location.href = `mailto:${email}`;
    }
});