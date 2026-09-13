/**
 * ==============================================================================
 * SAAD HASAN QURESHI - DEVOPS & CLOUD PORTFOLIO SCRIPT
 * Features: Dark/Light Theme Switcher, Interactive Terminal CLI Simulator,
 * Interactive CV Modal Viewer & Downloader, Category Filters, Stats Counters,
 * Supabase PostgreSQL Integration & Toast System.
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// SUPABASE CONFIGURATION
// ------------------------------------------------------------------------------
const SUPABASE_CONFIG = {
    url: 'https://vdmrktibinapyjrmiftn.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXJrdGliaW5hcHlqcm1pZnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjEzNTksImV4cCI6MjEwMjk5NzM1OX0.4yA9RvN_xjZMBeDEI8YH_BweflHkvIkNQ6G33El0w1s'
};

// Initialize Supabase Client if CDN is available
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

// ------------------------------------------------------------------------------
// DOM CONTENT LOADED INITIALIZATION
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbarScroll();
    initMobileMenu();
    initStatsCounter();
    initProjectFilters();
    initContactForm();
    initCVModal();
    initInteractiveTerminal();
});

/**
 * 1. Dark / Light Theme Toggle with Persistent Storage
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');

    const getSavedTheme = () => {
        const saved = localStorage.getItem('saad_portfolio_theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('saad_portfolio_theme', theme);

        if (theme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    };

    const currentTheme = getSavedTheme();
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            showToast(`🌓 Switched to ${next.toUpperCase()} mode`);
        });
    }
}

/**
 * 2. Sticky Navbar Shadow & Active Link Scroll Spy
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
            const sectionTop = section.offsetTop - 120;
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
 * 3. Mobile Responsive Hamburger Menu
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

            // Lock body scroll when mobile menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
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
 * 4. Animated Hero Statistics Counter
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
 * 5. Project Category Filter Tabs
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
 * 6. Interactive CV Modal Previewer & Downloader
 */
function initCVModal() {
    const cvModal = document.getElementById('cv-modal');
    const cvCloseBtn = document.getElementById('cv-modal-close');
    const cvButtons = document.querySelectorAll('.cv-btn');

    const openModal = () => {
        if (cvModal) {
            cvModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (cvModal) {
            cvModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    cvButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (cvCloseBtn) {
        cvCloseBtn.addEventListener('click', closeModal);
    }

    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * 7. Interactive Terminal CLI Simulator
 */
function initInteractiveTerminal() {
    const input = document.getElementById('terminal-cli-input');
    const log = document.getElementById('terminal-log');
    const pills = document.querySelectorAll('.term-pill');
    const hints = document.querySelectorAll('.term-hint');

    if (!input || !log) return;

    const executeCommand = (cmdText) => {
        const raw = cmdText.trim();
        if (!raw) return;

        const cmd = raw.toLowerCase();

        // Print command prompt line
        appendLog(`<div class="code-line"><span class="code-cmd">$</span> ${escapeHtml(raw)}</div>`);

        switch (cmd) {
            case 'help':
                appendLog(`
                    <div class="code-output text-cyan">Available Commands:</div>
                    <div class="code-output font-mono">
                      &bull; <strong>summary</strong> / <strong>about</strong>: Overview &amp; background<br/>
                      &bull; <strong>skills</strong>: Cloud, DevOps, Containers &amp; DB skills<br/>
                      &bull; <strong>projects</strong>: 7 production architectures<br/>
                      &bull; <strong>experience</strong>: Professional experience &amp; internships<br/>
                      &bull; <strong>education</strong>: Emerson University &amp; MPS<br/>
                      &bull; <strong>certs</strong>: Honhaar Jawan, Udemy, Deloitte, DataCamp<br/>
                      &bull; <strong>get cv</strong> / <strong>cv</strong>: View &amp; download PDF CV<br/>
                      &bull; <strong>kubectl get pods</strong>: Inspect simulated cluster state<br/>
                      &bull; <strong>terraform plan</strong>: Run declarative IaC plan<br/>
                      &bull; <strong>contact</strong>: Direct phone, email, LinkedIn, website<br/>
                      &bull; <strong>clear</strong>: Clean terminal console
                    </div>
                `);
                break;

            case 'cat summary.txt':
            case 'cat summary':
            case 'summary':
            case 'about':
                appendLog(`
                    <div class="code-output text-success">&#x2714; Saad Hasan Qureshi — DevOps &amp; Cloud Engineer</div>
                    <div class="code-output">Computer Science undergraduate (Emerson University Multan) specializing in AWS, Linux, Docker, Kubernetes, Terraform, GitOps, CI/CD automation, and Python. Former Junior DevOps Specialist Intern at Burjsoft.</div>
                `);
                break;

            case 'skills':
                appendLog(`
                    <div class="code-output text-accent"><strong>[Cloud Infrastructure]</strong> AWS (EC2, S3, IAM, VPC, RDS, Route53)</div>
                    <div class="code-output text-cyan"><strong>[DevOps &amp; CI/CD]</strong> GitHub Actions, ArgoCD, GitOps, IaC, Basic Jenkins</div>
                    <div class="code-output text-success"><strong>[Containers &amp; IaC]</strong> Docker, Kubernetes (EKS), Terraform, Helm, Trivy</div>
                    <div class="code-output"><strong>[Programming &amp; DB]</strong> Python, Bash Scripting, SQL, PostgreSQL, MySQL</div>
                    <div class="code-output text-dim"><strong>[Productivity]</strong> Problem Solving, Teamwork, Communication, MS Excel</div>
                `);
                break;

            case 'projects':
                appendLog(`
                    <div class="code-output text-success"><strong>1. Multi-Tier AWS Infrastructure:</strong> Terraform + EKS + VPC (+30% scalability)</div>
                    <div class="code-output text-success"><strong>2. GitOps CI/CD Pipeline:</strong> Actions + Docker + Trivy + ArgoCD (-60% deploy time)</div>
                    <div class="code-output text-success"><strong>3. Production Kubernetes:</strong> Helm + Ingress + HPA + Cert-Manager (+40% app scale)</div>
                    <div class="code-output text-success"><strong>4. DevSecOps Security:</strong> Linux hardening + automated audits (-50% sec effort)</div>
                    <div class="code-output text-success"><strong>5. Observability Stack:</strong> Prometheus + Grafana + Loki + Alertmanager (-45% incident time)</div>
                    <div class="code-output text-dim">Type <code class="term-hint" data-cmd="clear">clear</code> to reset terminal.</div>
                `);
                break;

            case 'experience':
            case 'work':
                appendLog(`
                    <div class="code-output text-cyan"><strong>[Burjsoft]</strong> Junior DevOps Specialist (Internship: May 2026 – Aug 2026)</div>
                    <div class="code-output">&bull; AWS infrastructure, Linux administration, Docker, CI/CD automation (~25% workflow gain)</div>
                    <div class="code-output text-accent"><strong>[Worldwide Freelance]</strong> DevOps &amp; Cloud Consultant (Global Clients)</div>
                    <div class="code-output">&bull; Scalable cloud architectures, containerization, GitOps pipelines (~40% efficiency boost)</div>
                `);
                break;

            case 'education':
            case 'edu':
                appendLog(`
                    <div class="code-output text-cyan"><strong>1. Emerson University Multan:</strong> Bachelor in Computer Science (2024 – 2028)</div>
                    <div class="code-output text-cyan"><strong>2. Multan Public School &amp; College:</strong> Intermediate (2021 – 2023)</div>
                `);
                break;

            case 'certs':
            case 'certifications':
                appendLog(`
                    <div class="code-output text-success">&bull; <strong>Honhaar Jawan Program (Govt of Pakistan):</strong> AWS DevOps Track, Python, Cybersecurity</div>
                    <div class="code-output text-success">&bull; <strong>Udemy:</strong> Linux Administration Bootcamp</div>
                    <div class="code-output text-success">&bull; <strong>Deloitte:</strong> Data Analytics Job Simulation</div>
                    <div class="code-output text-success">&bull; <strong>DataCamp:</strong> Understanding Cloud Computing</div>
                `);
                break;

            case 'get cv':
            case 'cv':
            case 'download cv':
            case 'view cv':
                appendLog(`
                    <div class="code-output text-success">&#x2714; Opening CV Preview Modal...</div>
                    <div class="code-output">Direct download link: <a href="Saad_Hasan_Qureshi_Resume.pdf" download="Saad_Hasan_Qureshi_Resume.pdf" class="text-highlight">Saad_Hasan_Qureshi_Resume.pdf</a></div>
                `);
                const cvModal = document.getElementById('cv-modal');
                if (cvModal) {
                    cvModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                break;

            case 'kubectl get pods':
            case 'kubectl':
            case 'pods':
                appendLog(`
                    <div class="code-output font-mono text-cyan">NAME                                READY   STATUS    RESTARTS   AGE</div>
                    <div class="code-output font-mono text-success">api-gateway-7f89d-9kl2              1/1     Running   0          42d</div>
                    <div class="code-output font-mono text-success">auth-service-6b45a-x841             1/1     Running   0          42d</div>
                    <div class="code-output font-mono text-success">worker-daemon-5c91z-m2              1/1     Running   0          19d</div>
                    <div class="code-output font-mono text-success">prometheus-server-84f9a-1q          1/1     Running   0          84d</div>
                `);
                break;

            case 'terraform plan':
            case 'terraform':
                appendLog(`
                    <div class="code-output font-mono text-dim">Refreshing Terraform state in memory prior to plan...</div>
                    <div class="code-output font-mono text-success">&#x2714; aws_vpc.main_vpc: Refreshing state... [id=vpc-09a8bc43]</div>
                    <div class="code-output font-mono text-success">&#x2714; aws_eks_cluster.prod: Refreshing state... [id=eks-prod-cluster]</div>
                    <div class="code-output font-mono text-cyan">Plan: 4 to add, 0 to change, 0 to destroy.</div>
                `);
                break;

            case 'whoami':
                appendLog(`<div class="code-output text-success">saad@control-node (Saad Hasan Qureshi — DevOps &amp; Cloud Engineer)</div>`);
                break;

            case 'contact':
            case 'email':
            case 'phone':
                appendLog(`
                    <div class="code-output font-mono">
                      &bull; <strong>Phone / WhatsApp:</strong> +92 324 8148344<br/>
                      &bull; <strong>Email:</strong> qurehisaad1860@gmail.com<br/>
                      &bull; <strong>LinkedIn:</strong> linkedin.com/in/saad-hassan-qureshi-1460153b9<br/>
                      &bull; <strong>Website:</strong> www.saadsystems.me<br/>
                      &bull; <strong>Location:</strong> Multan, Pakistan
                    </div>
                `);
                break;

            case 'clear':
            case 'cls':
                log.innerHTML = '';
                break;

            default:
                appendLog(`
                    <div class="code-output text-danger">zsh: command not found: ${escapeHtml(raw)}</div>
                    <div class="code-output text-dim">Type <code class="term-hint" data-cmd="help">help</code> for list of commands.</div>
                `);
                break;
        }

        // Auto-scroll terminal to latest output
        log.scrollTop = log.scrollHeight;
    };

    const appendLog = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value;
            input.value = '';
            executeCommand(val);
        }
    });

    pills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('term-hint')) {
            const cmd = e.target.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        }
    });
}

/**
 * 8. Contact Form Submission (Supabase PostgreSQL Integration)
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
                if (supabaseClient) {
                    const { data, error } = await supabaseClient
                        .from('contact_submissions')
                        .insert([
                            {
                                name: name,
                                email: email,
                                subject: subject || 'General DevOps Inquiry',
                                message: message
                            }
                        ]);

                    if (error) throw error;

                    showToast(`🚀 Transmission received! Thank you, ${name}. Your message has been saved in the database.`);
                    form.reset();
                } else {
                    // Fallback mode
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    showToast(`✅ Thank you, ${name}! Transmission completed.`);
                    form.reset();
                }
            } catch (err) {
                console.error('Supabase submission error:', err);
                showToast('❌ Transmission failed. Please reach out directly via Phone (+92 324 8148344) or Email!');
            } finally {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            }
        });
    }
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
    }, 4500);
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