/**
 * ==============================================================================
 * SAAD HASAN QURESHI — DEVOPS & CLOUD PORTFOLIO ENGINE
 * Features: Sticky Navbar Scrollspy, Mobile Navigation, Interactive Engineering
 * Snapshot, Project Filter Tabs, Rich Project Details Modal, CV Modal Viewer,
 * Supabase Database Integration, Toast System.
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. SUPABASE DATABASE CONFIGURATION
// ------------------------------------------------------------------------------
const SUPABASE_CONFIG = {
  url: 'https://vdmrktibinapyjrmiftn.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXJrdGliaW5hcHlqcm1pZnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjEzNTksImV4cCI6MjEwMjk5NzM1OX0.4yA9RvN_xjZMBeDEI8YH_BweflHkvIkNQ6G33El0w1s'
};

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url) {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
} catch (err) {
  console.warn('Supabase client notice:', err);
}

// ------------------------------------------------------------------------------
// 2. PROJECT SPECIFICATIONS DATA (FOR MODALS)
// ------------------------------------------------------------------------------
const PROJECTS_DATABASE = {
  'aws-infra': {
    category: 'Cloud Infrastructure & IaC',
    title: 'Multi-Tier AWS Infrastructure with Terraform & EKS',
    overview: 'Engineered a highly available, multi-AZ cloud architecture on Amazon Web Services using Terraform modules to provision declarative networking, compute, and relational storage.',
    architecture: 'Traffic enters via an AWS Application Load Balancer into public subnets, routing to Kubernetes EKS worker nodes residing within isolated private subnets. Relational persistence is hosted across dedicated database subnets using Amazon RDS PostgreSQL with automated multi-AZ replication.',
    technologies: ['AWS EKS', 'Terraform', 'VPC', 'RDS PostgreSQL', 'IAM Roles', 'NAT Gateways', 'CloudWatch'],
    challenges: 'Ensuring zero public exposure of container workloads and relational databases while providing secure, low-latency egress for package updates and telemetry ingestion.',
    solution: 'Designed public, private, and database subnet tiers paired with managed NAT Gateways, least-privilege IAM instance profiles, and strictly constrained Security Group boundaries.',
    result: 'Achieved complete environment reproducibility with +30% scalability, eliminating manual cloud provisioning bottlenecks.',
    github: 'https://github.com/saadqureshiiiii'
  },
  'gitops-cicd': {
    category: 'CI/CD & GitOps Automation',
    title: 'GitOps CI/CD Pipeline (Actions + Docker + Trivy + Argo CD)',
    overview: 'Built an end-to-end continuous delivery pipeline enabling zero-downtime, declarative application deployments triggered automatically by Git pull requests and commits.',
    architecture: 'Developers push code to GitHub; GitHub Actions triggers automated linting, unit testing, Docker multi-stage build, and Trivy CVE vulnerability scans. Upon passing, container images are published to AWS ECR, and Kubernetes manifests in the config repository are updated, prompting ArgoCD to sync state.',
    technologies: ['GitHub Actions', 'Docker', 'Trivy', 'Argo CD', 'AWS ECR', 'Kubernetes'],
    challenges: 'Preventing vulnerable container images from reaching production and eliminating manual `kubectl apply` commands that cause configuration drift.',
    solution: 'Integrated Trivy scanning directly into the CI pipeline fail-fast gate, and instituted ArgoCD in pull-based GitOps reconciliation mode to maintain cluster state parity with Git.',
    result: 'Reduced release deployment time by ~60% with zero configuration drift and continuous vulnerability prevention.',
    github: 'https://github.com/saadqureshiiiii'
  },
  'k8s-platform': {
    category: 'Kubernetes & Container Orchestration',
    title: 'Production Kubernetes Platform with Ingress & HPA',
    overview: 'Deployed a production-grade Kubernetes cluster configured for automated traffic routing, horizontal elasticity, and self-renewing SSL/TLS certificates.',
    architecture: 'An NGINX Ingress Controller manages inbound HTTPS traffic, delegating to internal ClusterIP services. The Horizontal Pod Autoscaler (HPA) monitors real-time CPU and memory metrics via Metrics Server to scale replica counts dynamically.',
    technologies: ['Kubernetes (EKS)', 'Helm 3', 'NGINX Ingress', 'HPA', 'Cert-Manager', 'Let\'s Encrypt'],
    challenges: 'Handling sudden spikes in traffic without manual pod scaling, while managing SSL certificates securely without administrative renewal overhead.',
    solution: 'Packaged deployment manifests into reusable Helm charts, implemented custom HPA scaling thresholds, and deployed Cert-Manager with automated ACME Let\'s Encrypt challenge solving.',
    result: 'Increased application scalability by ~40% during peak traffic loads with 100% automated certificate lifecycle management.',
    github: 'https://github.com/saadqureshiiiii'
  },
  'devsecops': {
    category: 'DevSecOps & System Hardening',
    title: 'DevSecOps Security Automation & Linux Hardening',
    overview: 'Developed automated security baseline scripts to harden Linux servers, restrict network attack surfaces, and validate continuous compliance against CIS benchmarks.',
    architecture: 'A suite of modular Bash scripts configures kernel parameters, disables unused filesystems, configures IPTables/UFW firewalls, enforces SSH key-only ed25519 authentication, and provisions Fail2ban to mitigate brute-force attempts.',
    technologies: ['Linux (Ubuntu/RHEL)', 'Bash Scripting', 'IPTables', 'Fail2ban', 'SSH Hardening', 'Auditd'],
    challenges: 'Applying rigorous enterprise security controls without disrupting live background services or administrative access.',
    solution: 'Created automated pre-flight validation routines, structured rollback checkpoints, and non-intrusive rate limiting rules for remote management.',
    result: 'Cut security auditing and host maintenance effort by ~50% while achieving alignment with Center for Internet Security (CIS) standards.',
    github: 'https://github.com/saadqureshiiiii'
  },
  'observability': {
    category: 'Cloud Monitoring & Observability',
    title: 'Cloud Monitoring & Observability Stack',
    overview: 'Architected a centralized telemetry and observability stack collecting system metrics, container health, and application logs into actionable visual dashboards.',
    architecture: 'Prometheus scrapes metrics from Kubernetes Node Exporters and application endpoints; Promtail ships distributed logs to Loki; Grafana aggregates both telemetry streams into unified dashboards with automated Alertmanager routing.',
    technologies: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'Node Exporter', 'Slack Webhooks'],
    challenges: 'Preventing alert fatigue while ensuring critical system degradation (memory pressure, pod restart loops, 5xx errors) is flagged immediately.',
    solution: 'Crafted structured PromQL alerting expressions with rate-based thresholds and deduplicated alerts across Slack and email notification channels.',
    result: 'Reduced incident detection and mean time to resolution (MTTR) by ~45%, providing total operational transparency.',
    github: 'https://github.com/saadqureshiiiii'
  },
  'vpc-peering': {
    category: 'Cloud Networking & Connectivity',
    title: 'High-Availability Hybrid Cloud VPC Peering & Gateway',
    overview: 'Engineered an encrypted, high-throughput network mesh interconnecting distributed cloud VPCs and on-premise environments with granular routing policies.',
    architecture: 'AWS VPC Peering establishes direct private IP connectivity between isolated VPCs; a WireGuard VPN gateway facilitates encrypted point-to-site connectivity for remote engineering teams without exposing services to the public internet.',
    technologies: ['AWS VPC Peering', 'WireGuard VPN', 'Route Tables', 'DNS Resolvers', 'Security Groups'],
    challenges: 'Avoiding overlapping CIDR ranges across multiple environments and maintaining low-latency encrypted inter-service communication.',
    solution: 'Designed an organized non-overlapping subnet IP schema (RFC 1918) and configured targeted VPC route table entries with least-privilege security groups.',
    result: 'Delivered secure, encrypted inter-network throughput with zero internet transit exposure.',
    github: 'https://github.com/saadqureshiiiii'
  },
  'blue-green': {
    category: 'Zero-Downtime Deployment Automation',
    title: 'Zero-Downtime Blue/Green Deployment Engine',
    overview: 'Constructed an automated Blue/Green release orchestration mechanism utilizing Docker, bash automated health checks, and dynamic NGINX upstream switching.',
    architecture: 'Two identical containerized application environments (Blue & Green) operate side by side. When a new release is staged, traffic remains on the active environment while the candidate environment undergoes automated health probes before traffic is instantaneously cut over.',
    technologies: ['Docker Compose', 'NGINX Upstream', 'Bash Automation', 'Health Checks', 'cURL Validation'],
    challenges: 'Eliminating user-visible dropped connections or session loss during version upgrades, with instant rollback if an unexpected defect emerges.',
    solution: 'Scripted automated smoke test validation against the inactive environment prior to reloading NGINX configurations via graceful SIGHUP reload.',
    result: 'Guaranteed 100% zero-dropout application rollouts with sub-second automated rollback capabilities.',
    github: 'https://github.com/saadqureshiiiii'
  }
};

// ------------------------------------------------------------------------------
// 3. ENGINEERING SNAPSHOT DATA
// ------------------------------------------------------------------------------
const SNAPSHOT_DATA = {
  cloud: {
    category: 'Cloud Architecture',
    title: 'Resilient AWS Multi-Tier Infrastructure',
    text: 'Deploying production-grade, highly available cloud systems using Amazon Web Services. Incorporates private subnets for sensitive databases, public subnets for load balancers, automated NAT gateways, and granular least-privilege IAM roles.',
    metrics: [
      { title: 'Primary Services', val: 'EKS, VPC, RDS, S3, IAM' },
      { title: 'Availability', val: 'Multi-AZ Redundancy' },
      { title: 'Security Model', val: 'Zero-Trust Network ACLs' }
    ]
  },
  cicd: {
    category: 'Continuous Delivery',
    title: 'Automated GitOps Delivery Pipelines',
    text: 'Eliminating manual deployment friction through declarative GitHub Actions workflows and ArgoCD GitOps reconciliation. Every commit triggers automated unit testing, container compilation, Trivy vulnerability audits, and synchronized Kubernetes rollouts.',
    metrics: [
      { title: 'Toolchain', val: 'GitHub Actions, ArgoCD, Docker' },
      { title: 'Deployment Model', val: 'Declarative GitOps Sync' },
      { title: 'Security Gates', val: 'Trivy Automated Scans' }
    ]
  },
  containers: {
    category: 'Container Orchestration',
    title: 'Production Kubernetes Cluster Management',
    text: 'Operating resilient microservice workloads across Amazon EKS. Implements Helm charting for configuration management, NGINX Ingress Controller for routing, Horizontal Pod Autoscaling (HPA) for load elasticity, and Cert-Manager for TLS certificate lifecycle.',
    metrics: [
      { title: 'Engine', val: 'Kubernetes (EKS) + Docker' },
      { title: 'Ingress & TLS', val: 'NGINX + Cert-Manager' },
      { title: 'Autoscaling', val: 'HPA CPU/Memory Triggers' }
    ]
  },
  iac: {
    category: 'Infrastructure as Code',
    title: 'Declarative Cloud Management with Terraform',
    text: 'Codifying all cloud networking, security groups, and compute resources with clean, modular Terraform configurations. Enforces automated plan validations, remote state management with state locking, and versioned peer reviews.',
    metrics: [
      { title: 'IaC Language', val: 'HashiCorp HCL (Terraform)' },
      { title: 'State Strategy', val: 'Remote S3 + DynamoDB Lock' },
      { title: 'Parity', val: 'Zero Drift Environments' }
    ]
  },
  systems: {
    category: 'Linux & Systems Engineering',
    title: 'Hardened Linux System Administration',
    text: 'Deep operating systems proficiency across Ubuntu and RHEL distributions. Managing automated system administration tasks via Bash scripts, kernel parameter tuning, IPTables/UFW network filtering, and systemd service orchestration.',
    metrics: [
      { title: 'Distributions', val: 'Ubuntu Server, RHEL' },
      { title: 'Automation', val: 'Bash & Shell Scripting' },
      { title: 'Hardening', val: 'CIS Benchmarks + Fail2ban' }
    ]
  }
};

// ------------------------------------------------------------------------------
// 4. DOM INITIALIZATION
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initEngineeringSnapshot();
  initSliderTouchControls();
  initProjectFilters();
  initProjectModal();
  initCVModal();
  initContactForm();
});

// ------------------------------------------------------------------------------
// 5. NAVBAR SCROLL & ACTIVE SCROLLSPY
// ------------------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ------------------------------------------------------------------------------
// 6. MOBILE RESPONSIVE HAMBURGER MENU
// ------------------------------------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .hire-btn');

  if (!toggleBtn || !navMenu) return;

  const toggle = () => {
    const isOpen = navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    navMenu.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', toggle);

  navLinks.forEach((link) => {
    link.addEventListener('click', close);
  });
}

// ------------------------------------------------------------------------------
// 7. ENGINEERING SNAPSHOT CONTROLLER
// ------------------------------------------------------------------------------
function initEngineeringSnapshot() {
  const tabs = document.querySelectorAll('.snapshot-tab');
  const display = document.getElementById('snapshot-display');

  if (!tabs.length || !display) return;

  const renderContent = (tabKey) => {
    const data = SNAPSHOT_DATA[tabKey];
    if (!data) return;

    display.innerHTML = `
      <div class="snapshot-content-inner">
        <div class="snapshot-meta">
          <span class="snapshot-category">${escapeHtml(data.category)}</span>
          <h3 class="snapshot-title">${escapeHtml(data.title)}</h3>
        </div>
        <p class="snapshot-text">${escapeHtml(data.text)}</p>
        <div class="snapshot-metrics-grid">
          ${data.metrics
            .map(
              (m) => `
            <div class="snapshot-metric-card">
              <span class="metric-title">${escapeHtml(m.title)}</span>
              <span class="metric-val">${escapeHtml(m.val)}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  };

  // Render initial active tab on page load
  renderContent('cloud');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const tabKey = tab.getAttribute('data-tab');
      renderContent(tabKey);
    });
  });
}

// ------------------------------------------------------------------------------
// Touch Pause Handling for Auto Sliders
// ------------------------------------------------------------------------------
function initSliderTouchControls() {
  const tracks = document.querySelectorAll('.slider-track');
  tracks.forEach((track) => {
    track.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    track.addEventListener('touchend', () => {
      setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 800);
    }, { passive: true });
  });
}

// ------------------------------------------------------------------------------
// 8. PROJECT CATEGORY FILTER TABS
// ------------------------------------------------------------------------------
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');

        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ------------------------------------------------------------------------------
// 9. PROJECT DETAILS MODAL
// ------------------------------------------------------------------------------
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');
  const categoryEl = document.getElementById('modal-project-category');
  const titleEl = document.getElementById('modal-project-title');
  const bodyEl = document.getElementById('project-modal-body');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!modal || !bodyEl) return;

  const openModal = (projectId) => {
    const p = PROJECTS_DATABASE[projectId];
    if (!p) return;

    if (categoryEl) categoryEl.innerText = p.category;
    if (titleEl) titleEl.innerText = p.title;

    bodyEl.innerHTML = `
      <div>
        <h4 class="modal-section-title">Project Overview</h4>
        <p class="modal-section-p">${escapeHtml(p.overview)}</p>
      </div>

      <div>
        <h4 class="modal-section-title">Architecture &amp; Flow</h4>
        <p class="modal-section-p">${escapeHtml(p.architecture)}</p>
      </div>

      <div>
        <h4 class="modal-section-title">Technologies &amp; Infrastructure Tools</h4>
        <div class="modal-tech-stack-row">
          ${p.technologies.map((tech) => `<span class="modal-tech-chip">${escapeHtml(tech)}</span>`).join('')}
        </div>
      </div>

      <div class="modal-two-col">
        <div class="modal-callout">
          <h4>Engineering Challenges</h4>
          <p>${escapeHtml(p.challenges)}</p>
        </div>
        <div class="modal-callout">
          <h4>Implemented Solution</h4>
          <p>${escapeHtml(p.solution)}</p>
        </div>
      </div>

      <div class="modal-callout">
        <h4>Measurable Result &amp; Impact</h4>
        <p>${escapeHtml(p.result)}</p>
      </div>

      <div class="modal-footer-cta">
        <a href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          View GitHub Repository
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project');
      openModal(pid);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ------------------------------------------------------------------------------
// 10. CURRICULUM VITAE (CV) MODAL
// ------------------------------------------------------------------------------
function initCVModal() {
  const cvModal = document.getElementById('cv-modal');
  const cvCloseBtn = document.getElementById('cv-modal-close');
  const cvTriggers = document.querySelectorAll('.cv-btn');

  if (!cvModal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    cvModal.classList.add('active');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    cvModal.classList.remove('active');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  cvTriggers.forEach((btn) => btn.addEventListener('click', openModal));
  if (cvCloseBtn) cvCloseBtn.addEventListener('click', closeModal);

  cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ------------------------------------------------------------------------------
// 11. FUNCTIONAL CONTACT FORM (SUPABASE INTEGRATION)
// ------------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const subject = (document.getElementById('subject')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    // Validation
    if (!name || !email || !message) {
      showToast('⚠️ Please provide your name, email, and message.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('⚠️ Please provide a valid email address.');
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
      <span>Transmitting Message...</span>
    `;
    submitBtn.disabled = true;

    try {
      if (supabaseClient) {
        const { error } = await supabaseClient.from('contact_submissions').insert([
          {
            name: name,
            email: email,
            subject: subject || 'DevOps Portfolio Inquiry',
            message: message
          }
        ]);

        if (error) throw error;

        showToast(`🚀 Thank you, ${name}! Your message was successfully received.`);
        form.reset();
      } else {
        // Fallback simulation
        await new Promise((resolve) => setTimeout(resolve, 800));
        showToast(`✅ Thank you, ${name}! Message transmission completed.`);
        form.reset();
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      showToast('❌ Transmission notice. Please connect directly via Phone (+92 324 8148344) or Email!');
    } finally {
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;
    }
  });
}

// ------------------------------------------------------------------------------
// 12. HELPER UTILITIES
// ------------------------------------------------------------------------------
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 320);
  }, 4500);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}