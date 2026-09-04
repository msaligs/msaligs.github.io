/**
 * Mohd Shahid - Portfolio Interactive Core JS
 * Handles neural network canvas, dynamic spotlight hovers, interactive widgets, waveforms and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // The role-focused portfolio is deliberately static and privacy-conscious.
    // Public work links to actual projects; there are no simulated classifiers or visitor tracking calls.
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
        siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
            siteNav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }));
    }
    return;
    
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ----------------------------------------------------
    // 1. Mobile Menu Navigation Toggle
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when navigation links are clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Shrink header on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // 2. Interactive Bento Card Spotlight Hover Effect
    // ----------------------------------------------------
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ----------------------------------------------------
    // 3. Interactive Neural Network Node Background (Canvas)
    // ----------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const maxParticles = Math.min(75, Math.floor((width * height) / 18000)); // Dynamic density
        const connectionDistance = 120;
        let mouse = { x: null, y: null, radius: 180 };

        // Handle window resizing
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        // Trace mouse coordinate positions
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off canvas edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Simple pull towards cursor simulation
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= dx * force * 0.02;
                        this.y -= dy * force * 0.02;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#64ffda';
                ctx.shadowColor = '#64ffda';
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow for lines
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // Draw links first
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const alpha = (1 - (distance / connectionDistance)) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }

                // Connect nodes to mouse coordinates if near
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const alpha = (1 - (distance / mouse.radius)) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // ----------------------------------------------------
    // 4. ML Playground Tab Navigation
    // ----------------------------------------------------
    window.switchPlaygroundTab = function(tabName) {
        const tabYolo = document.getElementById('widget-yolo');
        const tabNlp = document.getElementById('widget-nlp');
        const tabHf = document.getElementById('widget-hf');
        const buttons = document.querySelectorAll('.playground-tabs .tab-btn');

        buttons.forEach(btn => btn.classList.remove('active'));

        if (tabName === 'yolo') {
            if (tabYolo) tabYolo.style.display = 'grid';
            if (tabNlp) tabNlp.style.display = 'none';
            if (tabHf) tabHf.style.display = 'none';
            buttons[1].classList.add('active'); // Index 1 is the Bounding Box Tracker
        } else if (tabName === 'hf') {
            if (tabYolo) tabYolo.style.display = 'none';
            if (tabNlp) tabNlp.style.display = 'none';
            if (tabHf) tabHf.style.display = 'grid'; // Grid layout matches others
            buttons[2].classList.add('active'); // Index 2 is the HF Space tab
        } else {
            if (tabYolo) tabYolo.style.display = 'none';
            if (tabNlp) tabNlp.style.display = 'grid';
            if (tabHf) tabHf.style.display = 'none';
            buttons[0].classList.add('active'); // Index 0 is the Paradox NLP Classifier
            
            // Trigger automatic initial evaluation if empty
            const nlpInput = document.getElementById('nlp-input');
            if (nlpInput && !nlpInput.value) {
                selectNlpSample('human');
            }
        }
    };

    // ----------------------------------------------------
    // 5. Paradox NLP AI vs Human Text Classifier Widget
    // ----------------------------------------------------
    const nlpPresets = {
        human: "I am driven by curiosity more than convention. I don't just study machines; I study systems — technical and human alike. My work revolves around AI systems, computer vision, and infrastructure layers. Most of what I know was shaped by experimentation and an obsession with understanding how things actually work beneath the surface.",
        ai: "Furthermore, it is highly critical to leverage advanced machine learning models and paradigms to synergize data-driven strategies, thereby maximizing customer retention and platform optimization. We comprehensively delve into the multifaceted parameters to catalyze systemic enhancement across paradigms."
    };

    let nlpTimer = null;
    let currentNlpTimeoutIds = [];

    // Select preset samples
    window.selectNlpSample = function(type) {
        const btnHuman = document.getElementById('nlp-sample-human');
        const btnAi = document.getElementById('nlp-sample-ai');
        const nlpInput = document.getElementById('nlp-input');

        if (!btnHuman || !btnAi || !nlpInput) return;

        btnHuman.classList.remove('active');
        btnAi.classList.remove('active');

        if (type === 'human') {
            btnHuman.classList.add('active');
            nlpInput.value = nlpPresets.human;
        } else {
            btnAi.classList.add('active');
            nlpInput.value = nlpPresets.ai;
        }

        runNlpClassification(nlpInput.value);
    };

    // Evaluate input text and render terminal diagnostic animations
    function runNlpClassification(text) {
        const termOutput = document.getElementById('terminal-nlp-output');
        const statusLabel = document.getElementById('nlp-status-label');
        const barHuman = document.getElementById('bar-human');
        const barAi = document.getElementById('bar-ai');
        const pctHuman = document.getElementById('pct-human');
        const pctAi = document.getElementById('pct-ai');

        if (!termOutput || !statusLabel) return;

        // Clear any ongoing timeout queues to prevent logs overlapping
        currentNlpTimeoutIds.forEach(id => clearTimeout(id));
        currentNlpTimeoutIds = [];

        // Check for sufficient input length
        const cleanedText = text.trim();
        const wordList = cleanedText ? cleanedText.split(/\s+/) : [];
        const wordCount = wordList.length;

        if (wordCount < 4) {
            termOutput.innerHTML = `
                <div class="term-line text-indigo">
                    <i data-lucide="terminal" class="term-icon"></i>
                    <span>Awaiting sufficient text inputs (min 4 words)...</span>
                </div>
            `;
            statusLabel.textContent = "Awaiting input text stream...";
            
            // Set stats neutral
            if (barHuman && barAi && pctHuman && pctAi) {
                barHuman.style.width = '50%';
                barAi.style.width = '50%';
                pctHuman.textContent = '50%';
                pctAi.textContent = '50%';
            }
            
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        statusLabel.textContent = "Analyzing input text stream...";

        // Intelligent heuristic classifier mimicking ComplementNB log probabilities
        const aiBuzzwords = [
            "furthermore", "leverage", "moreover", "delve", "tapestry", "demystify", 
            "synergize", "cross-functional", "maximize", "paradigm", "testament", 
            "crucial", "essential", "in summary", "it is important to note", 
            "underscores", "revolutionize", "multifaceted", "pivotal", "beacon", 
            "catalyst", "transformative", "comprehensively", "optimize", "optimization"
        ];
        
        const humanWords = [
            "i ", "me ", "my", "our", "we ", "curiosity", "obsession", "experimentation", 
            "break", "build", "dissect", "rebuild", "beneath", "scale", "pressure", "failure"
        ];

        let aiCount = 0;
        let humanCount = 0;
        const lowercaseText = cleanedText.toLowerCase();

        aiBuzzwords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = lowercaseText.match(regex);
            if (matches) aiCount += matches.length;
        });

        humanWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = lowercaseText.match(regex);
            if (matches) humanCount += matches.length;
        });

        // Compute simulated probabilities
        // Baseline AI probability
        let aiProb = 12; 
        
        // Boost/penalize probabilities based on signals
        aiProb += aiCount * 22;
        aiProb -= humanCount * 14;

        // Factor in typical paragraph features
        // Very long sentences are common in standard AI text
        const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
        if (avgSentenceLength > 18) {
            aiProb += 10;
        }

        // Clamp probabilities [2% to 98%]
        aiProb = Math.max(2, Math.min(98, aiProb));
        const humanProb = 100 - aiProb;

        // Perform sequential compilation animation logs
        termOutput.innerHTML = ''; // Clear terminal

        const logs = [
            { text: `Tokenizing input text stream (${wordCount} words)...`, cls: 'text-teal', icon: 'chevron-right' },
            { text: `Extracting sparse TF-IDF text features...`, cls: 'text-indigo', icon: 'chevron-right' },
            { text: `Executing Paradox ComplementNB model probabilities...`, cls: 'text-pink', icon: 'chevron-right' }
        ];

        // Print initial loading sequences
        logs.forEach((log, idx) => {
            const timeoutId = setTimeout(() => {
                const line = document.createElement('div');
                line.className = `term-line ${log.cls}`;
                line.innerHTML = `
                    <i data-lucide="${log.icon}" class="term-icon"></i>
                    <span>${log.text}</span>
                `;
                termOutput.appendChild(line);
                termOutput.scrollTop = termOutput.scrollHeight;
                if (window.lucide) window.lucide.createIcons();
            }, idx * 140);
            currentNlpTimeoutIds.push(timeoutId);
        });

        // Final output classification log line and bars completion
        const finalTimeoutId = setTimeout(() => {
            // Update dual progress bars
            if (barHuman && barAi && pctHuman && pctAi) {
                barHuman.style.width = `${humanProb}%`;
                barAi.style.width = `${aiProb}%`;
                pctHuman.textContent = `${humanProb}%`;
                pctAi.textContent = `${aiProb}%`;
            }

            const verdictLine = document.createElement('div');
            if (humanProb >= 50) {
                verdictLine.className = 'term-line text-primary';
                verdictLine.innerHTML = `
                    <i data-lucide="check-circle" class="term-icon"></i>
                    <span><strong>Output: Human Written</strong> (${humanProb}% Confidence)</span>
                `;
                statusLabel.textContent = `Inference completed: Human Written model match.`;
            } else {
                verdictLine.className = 'term-line text-pink';
                verdictLine.innerHTML = `
                    <i data-lucide="alert-triangle" class="term-icon"></i>
                    <span><strong>Output: AI Generated</strong> (${aiProb}% Confidence)</span>
                `;
                statusLabel.textContent = `Inference completed: High probability AI footprint.`;
            }
            termOutput.appendChild(verdictLine);
            termOutput.scrollTop = termOutput.scrollHeight;
            if (window.lucide) window.lucide.createIcons();
        }, 460);
        currentNlpTimeoutIds.push(finalTimeoutId);
    }

    // Monitor custom input area
    const nlpInput = document.getElementById('nlp-input');
    if (nlpInput) {
        nlpInput.addEventListener('input', () => {
            // Deactivate preset indicators
            const btnHuman = document.getElementById('nlp-sample-human');
            const btnAi = document.getElementById('nlp-sample-ai');
            if (btnHuman) btnHuman.classList.remove('active');
            if (btnAi) btnAi.classList.remove('active');

            // Debounce real-time analysis to prevent flickering
            clearTimeout(nlpTimer);
            nlpTimer = setTimeout(() => {
                runNlpClassification(nlpInput.value);
            }, 300);
        });
    }

    // ----------------------------------------------------
    // 6. YOLOv8 Simulator Controls
    // ----------------------------------------------------
    const rangeInput = document.getElementById('conf-range');
    const confVal = document.getElementById('conf-val');

    function updateYoloBboxSimulation() {
        if (!rangeInput || !confVal) return;
        
        const val = parseFloat(rangeInput.value);
        confVal.textContent = val.toFixed(2);
        
        const activeSample = document.getElementById('btn-traffic').classList.contains('active') ? 'traffic' : 'office';
        
        if (activeSample === 'traffic') {
            const box1 = document.querySelector('.bbox-1');
            const box2 = document.querySelector('.bbox-2');
            
            if (box1 && box2) {
                box1.style.display = 'block';
                box2.style.display = 'block';
                
                // Toggle opacity according to simulated confidence score
                box1.style.opacity = (val > 0.94) ? '0' : '1';
                box2.style.opacity = (val > 0.88) ? '0' : '1';
            }
        } else {
            const box3 = document.querySelector('.bbox-3');
            const box4 = document.querySelector('.bbox-4');
            
            if (box3 && box4) {
                box3.style.display = 'block';
                box4.style.display = 'block';
                
                box3.style.opacity = (val > 0.97) ? '0' : '1';
                box4.style.opacity = (val > 0.82) ? '0' : '1';
            }
        }
    }

    if (rangeInput) {
        rangeInput.addEventListener('input', updateYoloBboxSimulation);
    }

    window.selectSample = function(type) {
        const btnTraffic = document.getElementById('btn-traffic');
        const btnOffice = document.getElementById('btn-office');
        const sampleImg = document.getElementById('sample-img');
        
        if (!btnTraffic || !btnOffice || !sampleImg) return;

        // Hide all boxes before swapping backgrounds
        document.querySelectorAll('.bbox').forEach(box => {
            box.style.display = 'none';
            box.style.opacity = '1';
        });
        
        if (type === 'traffic') {
            btnTraffic.classList.add('active');
            btnOffice.classList.remove('active');
            sampleImg.src = 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=600&auto=format&fit=crop';
        } else {
            btnTraffic.classList.remove('active');
            btnOffice.classList.add('active');
            sampleImg.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop';
        }
        
        // Brief timeout to let source load
        setTimeout(updateYoloBboxSimulation, 50);
    };

    // Run initially
    updateYoloBboxSimulation();

    // ----------------------------------------------------
    // 7. Interactive Magnetic Hover Buttons
    // ----------------------------------------------------
    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull the button coordinate slightly towards cursor
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Automatically trigger active tab evaluation on load
    if (document.getElementById('widget-nlp') && document.getElementById('widget-nlp').style.display !== 'none') {
        selectNlpSample('human');
    }

    // ----------------------------------------------------
    // 8. Excel Apps Script Visitor Counter Logger
    // ----------------------------------------------------
    async function logVisit() {
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-VFeMPYFR8BP0mrKJSnmYt38iW2NPaPhZoL269w59hNUQJaiHrjzZCzABphDmtIN4fQ/exec';
        const counterElement = document.getElementById('visit-count');
        if (!counterElement) return;

        try {
            // 1. Fetch visitor IP address
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();

            // 2. Transmit logging request to Google Sheets Macro Web App
            const params = new URLSearchParams({
                ip: ipData.ip,
                userAgent: navigator.userAgent
            });

            const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const data = await response.json();

            // Update badge value dynamically
            if (data.count) {
                counterElement.textContent = data.count;
            }
            console.log('Visit successfully cataloged via Excel Macro API:', data);
        } catch (error) {
            console.error('Failed to log visitation index:', error);
            counterElement.textContent = '(Offline)';
        }
    }

    // Call visitor logger
    logVisit();

});
