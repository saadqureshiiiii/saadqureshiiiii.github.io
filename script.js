/**
 * ==============================================================================
 * SAAD HASSAN QURESHI - DEVOPS PORTFOLIO SCRIPT
 * Vanilla JavaScript: Mobile Drawer, Terminal CLI, Filters, Counters & Toasts
 * Database: Supabase (PostgreSQL) Live Integration
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// SUPABASE CONFIGURATION
// Paste your Project URL and Anon Public Key from your Supabase Dashboard below:
// (Settings -> API -> Project URL & Project API Keys / anon public)
// ------------------------------------------------------------------------------
const SUPABASE_CONFIG = {
    url: 'https://vdmrktibinapyjrmiftn.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXJrdGliaW5hcHlqcm1pZnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjEzNTksImV4cCI6MjEwMjk5NzM1OX0.4yA9RvN_xjZMBeDEI8YH_BweflHkvIkNQ6G33El0w1s'
};

// Initialize Supabase Client if CDN is loaded and keys are provided
let supabaseClient = null;
try {
    if (
        typeof supabase !== 'undefined' &&
        SUPABASE_CONFIG.url &&
        !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE_PROJECT_ID')
    ) {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
} catch (e) {
    console.warn('Supabase initialization notice:', e);
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initStatsCounter();
    initProjectFilters();
    initContactForm();
    initCVButtons();
});

/**
 * 1. Navbar Sticky Shadow & Active Link Scroll Spy
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 25) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Spy
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 110;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 2. Mobile Responsive Hamburger Menu
 */
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            toggleBtn.classList.toggle('active');
            toggleBtn.setAttribute('aria-expanded', isOpen);

            // Lock background scrolling when mobile menu is open
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking any nav link
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * 3. Animated Hero Statistics Counter
 */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const runCounter = () => {
        counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1200; // ms
            const stepTime = 20;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.ceil(current);
                }
            }, stepTime);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    runCounter();
                }
            });
        },
        { threshold: 0.25 }
    );

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

/**
 * 4. Project Category Filter Tabs
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const categories = card.getAttribute('data-category').split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.35s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}



/**
 * 6. Contact Form Submission Handling (Supabase PostgreSQL Integration)
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showToast('⚠️ Please fill out all required fields.');
                return;
            }

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Transmitting to Database...
            `;
            submitBtn.disabled = true;

            try {
                // If Supabase credentials are configured, execute real database insert
                if (supabaseClient) {
                    const { data, error } = await supabaseClient
                        .from('contact_submissions')
                        .insert([
                            {
                                name: name,
                                email: email,
                                subject: subject || 'General Inquiry',
                                message: message
                            }
                        ]);

                    if (error) {
                        throw error;
                    }

                    showToast(`🚀 Transmission received! Thank you, ${name}. Your message has been stored in the database.`);
                    form.reset();
                } else {
                    // Fallback demo mode before Supabase credentials are input
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    showToast(`✅ Thank you, ${name}! Transmission completed (Simulated mode - connect Supabase in script.js to write live).`);
                    form.reset();
                }
            } catch (err) {
                console.error('Supabase submission error:', err);
                showToast('❌ Transmission failed. Please reach out directly via Email or LinkedIn.');
            } finally {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            }
        });
    }
}

/**
 * 7. CV Placeholder Handler
 */
function initCVButtons() {
    const cvButtons = document.querySelectorAll('.cv-btn');
    cvButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            showToast('📄 Saad\'s updated CV is currently being finalized. In the meantime, please connect via LinkedIn or Email!');
        });
    });
}

/**
 * Helper: Toast Notification
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 350);
    }, 4200);
}

/**
 * Helper: Escape HTML string
 */
function escapeHtml(string) {
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}