document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    await loadProfile();
    await loadExperience();
    await loadEducation();
    await loadCertifications();
    await loadProjects();
    await loadLibrary();
    await loadArticles();
    await loadLinks();
    
    // Initialize UI interactions after content is loaded
    initMobileMenu();
    initSmoothScroll();
    initScrollObserver();
    initScrollObserver();
    logVisit();
}

// --- Data Fetching Helper ---
async function fetchData(fileName) {
    try {
        const response = await fetch(`assets/data/${fileName}`);
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// --- Section Renderers ---

async function loadProfile() {
    const data = await fetchData('profile.json');
    if (!data) return;

    // Navbar Logo
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        navLogo.textContent = data.name;
    }

    // Hero Section
    const heroContainer = document.querySelector('.hero-content');
    if (heroContainer) {
        heroContainer.innerHTML = `
            <h1>${data.name}</h1>
            <p class="tagline">${data.tagline}</p>
            ${data.location ? `<p class="location" style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">📍 ${data.location}</p>` : ''}
            <p class="bio">${data.about.summary}</p>
            <div class="social-links">
                ${data.social.github ? `<a href="${data.social.github}" target="_blank" class="social-link">GitHub</a>` : ''}
                ${data.social.linkedin ? `<a href="${data.social.linkedin}" target="_blank" class="social-link">LinkedIn</a>` : ''}
                ${data.social.twitter ? `<a href="${data.social.twitter}" target="_blank" class="social-link">Twitter</a>` : ''}
                ${data.social.portfolio ? `<a href="${data.social.portfolio}" target="_blank" class="social-link">Portfolio</a>` : ''}
                ${data.social["IIT M"] ? `<a href="${data.social["IIT M"]}" target="_blank" class="social-link">IIT Madras</a>` : ''}
                ${data.social.microsoft_learn ? `<a href="${data.social.microsoft_learn}" target="_blank" class="social-link">Microsoft Learn</a>` : ''}
                ${data.social.email ? `<a href="${data.social.email}" class="social-link">Email</a>` : ''}
            </div>
        `;
    }

    // About Section
    const aboutContent = document.getElementById('about-content');
    if (aboutContent) {
        aboutContent.innerHTML = `
            <div class="card">
                <h3>Professional Summary</h3>
                <p>${data.about.extended_summary || data.about.summary}</p>
            </div>
            <div class="card">
                <h3>Personal Life</h3>
                <p>${data.about.personal}</p>
            </div>
        `;
    }

    // Footer
    const footerInfo = document.getElementById('footer-info');
    if (footerInfo) {
        footerInfo.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.tagline}</p>
            <div class="social-links" style="justify-content: center; margin-top: 1rem;">
                 ${data.social.email ? `<a href="${data.social.email}" class="social-link">Get in Touch</a>` : ''}
            </div>
        `;
    }
    
    document.getElementById('year').textContent = new Date().getFullYear();
}

async function loadExperience() {
    const data = await fetchData('experience.json');
    const container = document.getElementById('experience-list');
    const section = document.getElementById('experience');

    if (!data || data.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="timeline-item">
            <h3>${item.role}</h3>
            <span class="meta">
                ${item.url ? `<a href="${item.url}" target="_blank" style="color: inherit; text-decoration: underline; text-decoration-color: var(--accent-primary);">${item.company}</a>` : item.company} 
                | ${item.period}
            </span>
            <p>${item.description}</p>
        </div>
    `).join('');
}

async function loadEducation() {
    const data = await fetchData('education.json');
    const container = document.getElementById('education-list');
    const section = document.getElementById('education');

    if (!data || data.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="card">
            <h3>${item.degree}</h3>
            <span class="meta">${item.institution} | ${item.period}</span>
            <p>${item.description}</p>
        </div>
    `).join('');
}

async function loadCertifications() {
    const data = await fetchData('certifications.json');
    const container = document.getElementById('certifications-list');
    const section = document.getElementById('certifications');

    if (!data || data.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="card">
            <h3>${item.name}</h3>
            <span class="meta">${item.issuer} | ${item.date}</span>
            ${item.url ? `<a href="${item.url}" target="_blank" class="btn-link">Verify Credential &rarr;</a>` : ''}
        </div>
    `).join('');
}

async function loadProjects() {
    const data = await fetchData('projects.json');
    
    // Split into Projects and Exploration
    const projects = data ? data.filter(item => item.type === 'project') : [];
    const exploration = data ? data.filter(item => item.type === 'exploration') : [];

    // Render Projects
    const projectsContainer = document.getElementById('projects-list');
    const projectsSection = document.getElementById('projects');
    
    if (projects.length === 0) {
        if (projectsSection) projectsSection.style.display = 'none';
    } else {
        projectsContainer.innerHTML = projects.map(item => renderProjectCard(item)).join('');
    }

    // Render Exploration
    const explorationContainer = document.getElementById('exploration-list');
    const explorationSection = document.getElementById('exploration');

    if (exploration.length === 0) {
        if (explorationSection) explorationSection.style.display = 'none';
    } else {
        explorationContainer.innerHTML = exploration.map(item => renderProjectCard(item)).join('');
    }
}

function renderProjectCard(item) {
    return `
        <div class="card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${item.tech.map(t => `<span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">${t}</span>`).join('')}
            </div>
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                ${item.repoUrl ? `<a href="${item.repoUrl}" target="_blank" class="btn-link">GitHub</a>` : ''}
                ${item.demoUrl ? `<a href="${item.demoUrl}" target="_blank" class="btn-link">Live Demo</a>` : ''}
            </div>
        </div>
    `;
}

async function loadLibrary() {
    const data = await fetchData('library.json');
    const section = document.getElementById('library');
    
    if (!data || data.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    // Filter for public books only
    const publicBooks = data.filter(book => book.visibility === 'public');

    if (publicBooks.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    // Render Public Books
    const digitalContainer = document.getElementById('digital-books-list');
    // We reuse the 'digital-books-list' container for the main list for now, 
    // or we could rename it in HTML. Let's just use it to avoid HTML changes if possible,
    // but the HTML has two subsections. Let's hide the second one and use the first one for "Featured Library".
    
    // Hide the hardcopy subsection container if it exists (it was commented out in HTML but let's be safe)
    const hardCopySubsection = document.querySelector('#library .library-subsection:last-child');
    if (hardCopySubsection) hardCopySubsection.style.display = 'none';

    // Rename the first subsection title
    const firstSubsectionTitle = document.querySelector('#library .library-subsection:first-child h3');
    if (firstSubsectionTitle) firstSubsectionTitle.textContent = "Featured Books";

    digitalContainer.innerHTML = publicBooks.map(book => `
        <div class="card">
            <h3>${book.title}</h3>
            <span class="meta">by ${book.author}</span>
            <div style="margin-top: 0.5rem;">
                <span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${book.status || 'Owned'}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.5rem;">${book.format}</span>
            </div>
            ${book.link ? `<a href="${book.link}" target="_blank" class="btn-link" style="font-size: 0.9rem; margin-top: 0.5rem;">View Book</a>` : ''}
        </div>
    `).join('');
}

async function loadArticles() {
    const data = await fetchData('articles.json');
    const container = document.getElementById('articles-list');
    const section = document.getElementById('knowledge-base');

    if (!data || data.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="card">
            <h3><a href="${item.url}" target="_blank">${item.title} &nearr;</a></h3>
            <p>${item.notes}</p>
            <div style="margin-top: 1rem;">
                ${item.tags.map(tag => `<span style="font-size: 0.8rem; color: var(--text-secondary);">#${tag} </span>`).join('')}
            </div>
        </div>
    `).join('');
}

async function loadLinks() {
    const data = await fetchData('links.json');
    const container = document.getElementById('links-list');
    const section = document.getElementById('vault');

    if (!data || data.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="card" style="padding: 1.5rem;">
            <span class="meta" style="margin-bottom: 0.5rem;">${item.category}</span>
            <h3><a href="${item.url}" target="_blank">${item.title} &nearr;</a></h3>
        </div>
    `).join('');
}

// --- UI Interactions ---

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    
    if (btn && nav) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                btn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                const nav = document.querySelector('.nav-links');
                if (window.innerWidth <= 768 && nav) {
                    nav.style.display = 'none';
                }
            }
        });
    });
}

function initScrollObserver() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}



async function logVisit() {
    // Placeholder URL - User needs to update this after setting up the Google Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-VFeMPYFR8BP0mrKJSnmYt38iW2NPaPhZoL269w59hNUQJaiHrjzZCzABphDmtIN4fQ/exec'; 
    
    const counterElement = document.getElementById('visit-count');

    try {
        // 1. Get IP Address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // 2. Send to Google Sheet and Get Count
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Changed to 'cors' to read the response
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // 'text/plain' avoids preflight OPTIONS request which Google Scripts don't handle well
            },
            body: JSON.stringify({
                ip: ipData.ip,
                userAgent: navigator.userAgent
            })
        });

        const data = await response.json();
        
        if (data.count && counterElement) {
            counterElement.textContent = data.count;
        }
        
        console.log('Visit logged successfully');
    } catch (error) {
        console.error('Failed to log visit:', error);
        if (counterElement) counterElement.textContent = '(Offline)';
    }
}
