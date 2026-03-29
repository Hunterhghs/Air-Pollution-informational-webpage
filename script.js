/* ======================================
   AIR POLLUTION — Interactive Scripts
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation scroll effect ---
    const nav = document.getElementById('nav');
    const handleScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile menu ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Hero stat counter animation ---
    const animateCounters = () => {
        document.querySelectorAll('.hero-stat-number').forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
        });
    };

    // --- Hero particles ---
    const createParticles = () => {
        const container = document.getElementById('particles');
        if (!container) return;

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 8 + 6;
            const opacity = Math.random() * 0.3 + 0.05;

            Object.assign(particle.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: size > 3 ? 'rgba(255, 77, 77, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                left: `${x}%`,
                top: `${y}%`,
                opacity: opacity,
                animation: `particleFloat ${duration}s ease-in-out ${delay}s infinite alternate`,
                pointerEvents: 'none',
            });

            container.appendChild(particle);
        }

        // Add keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translate(0, 0) scale(1); opacity: 0.05; }
                50% { opacity: 0.3; }
                100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 60 + 20}px, -${Math.random() * 80 + 30}px) scale(${Math.random() * 0.5 + 0.8}); opacity: 0.05; }
            }
        `;
        document.head.appendChild(style);
    };

    // --- Donut chart ---
    const drawDonutChart = () => {
        const svg = document.querySelector('#donutChart svg');
        const legend = document.getElementById('donutLegend');
        if (!svg || !legend) return;

        const data = [
            { label: 'Residential', value: 25, color: '#ff6b6b' },
            { label: 'Industry', value: 22, color: '#4da6ff' },
            { label: 'Transport', value: 19, color: '#ffa726' },
            { label: 'Energy', value: 15, color: '#ab47bc' },
            { label: 'Agriculture', value: 12, color: '#66bb6a' },
            { label: 'Waste/Other', value: 7, color: '#78909c' },
        ];

        const cx = 100, cy = 100, r = 80;
        const circumference = 2 * Math.PI * r;
        let offset = 0;

        // Remove existing segments (keep the ring)
        svg.querySelectorAll('.donut-segment').forEach(el => el.remove());

        data.forEach((item, i) => {
            const segmentLength = (item.value / 100) * circumference;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'donut-segment');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', r);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', item.color);
            circle.setAttribute('stroke-width', '32');
            circle.setAttribute('stroke-dasharray', `${segmentLength} ${circumference - segmentLength}`);
            circle.setAttribute('stroke-dashoffset', `${-offset}`);
            circle.style.transform = 'rotate(-90deg)';
            circle.style.transformOrigin = '50% 50%';
            circle.style.transition = 'stroke-dasharray 1s ease';
            svg.appendChild(circle);

            offset += segmentLength;

            // Legend
            const legendItem = document.createElement('div');
            legendItem.className = 'donut-legend-item';
            legendItem.innerHTML = `<span class="donut-legend-dot" style="background:${item.color}"></span>${item.label} (${item.value}%)`;
            legend.appendChild(legendItem);
        });
    };

    // --- Scroll-triggered fade-in ---
    const observeFadeIn = () => {
        const targets = document.querySelectorAll(
            '.overview-card, .pollutant-card, .health-organ, .health-stat-card, ' +
            '.source-detail-card, .region-card, .econ-card, .action-column, ' +
            '.story-card, .vulnerable-card, .aqi-scale, .most-polluted, ' +
            '.health-vulnerable, .success-stories'
        );

        targets.forEach(el => el.classList.add('fade-in'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => observer.observe(el));
    };

    // --- Hero counter trigger on load ---
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);

    // --- City bar animation ---
    const animateCityBars = () => {
        const bars = document.querySelectorAll('.city-bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.getPropertyValue('--width');
                    bar.style.width = '0%';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            bar.style.width = width;
                        });
                    });
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });

        bars.forEach(bar => observer.observe(bar));
    };

    // --- Region bar animation ---
    const animateRegionBars = () => {
        const bars = document.querySelectorAll('.region-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.getPropertyValue('--width');
                    bar.style.width = '0%';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            bar.style.width = width;
                        });
                    });
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });

        bars.forEach(bar => observer.observe(bar));
    };

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Init ---
    createParticles();
    drawDonutChart();
    observeFadeIn();
    animateCityBars();
    animateRegionBars();
});
