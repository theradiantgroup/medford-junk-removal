/* ============================================
   MEDFORD JUNK PROS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load

    // ---------- Mobile Navigation ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    let overlay = null;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMenu);
    }

    function openMenu() {
        navMenu.classList.add('active');
        if (!overlay) createOverlay();
        setTimeout(() => overlay.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
        navToggle.classList.add('active');
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.classList.remove('active');
    }

    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on nav link click (non-dropdown)
    document.querySelectorAll('.nav-menu > li:not(.nav-dropdown) > .nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                const wasOpen = parent.classList.contains('open');
                document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
                if (!wasOpen) parent.classList.add('open');
            }
        });
    });

    // Close dropdown submenu links on click (mobile)
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- FAQ Accordion ----------
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked one (if it wasn't already open)
            if (!isActive) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---------- Scroll Animations (Fade In) ----------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements we want to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .step-card, .why-list li, .stat-card, .area-card, .faq-item, .contact-item'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        observer.observe(el);
    });

    // Also animate section headers and content blocks
    document.querySelectorAll('.section-header, .why-us-content, .contact-info, .contact-form-wrapper, .eco-content, .eco-image, .why-us-image, .about-text, .detail-content, .detail-sidebar, .sidebar-card, .city-service-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ---------- Active Nav Link on Scroll ----------
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ---------- Phone Number Click Tracking (Basic) ----------
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'Contact',
                    event_label: 'Phone Call',
                    value: 1
                });
            }
            console.log('Phone CTA clicked');
        });
    });

    // ---------- Form Enhancement ----------
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Track form submission
            if (typeof gtag === 'function') {
                gtag('event', 'submit', {
                    event_category: 'Contact',
                    event_label: 'Quote Request Form',
                    value: 1
                });
            }
        });
    }

});
