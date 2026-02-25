// NAF Vale do Sousa - Interactive Functionality

document.addEventListener('DOMContentLoaded', function () {

    // ================================
    // Mobile Navigation Toggle
    // ================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Update ARIA state
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);

            // Animate toggle button
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
    });

    // ================================
    // Smooth Scroll Navigation
    // ================================
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only apply smooth scroll to internal anchor links (starting with #)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 60;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For external links (like eventos.html), let the browser handle normally
        });
    });

    // ================================
    // Active Navigation State
    // ================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // ================================
    // Navbar Background on Scroll
    // ================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.6)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ================================
    // Contact Form Handling
    // ================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('formName').value.trim(),
                email: document.getElementById('formEmail').value.trim(),
                mobile: document.getElementById('formMobile') ? document.getElementById('formMobile').value.trim() : '',
                address: document.getElementById('formAddress') ? document.getElementById('formAddress').value.trim() : '',
                dob: document.getElementById('formDob') ? document.getElementById('formDob').value.trim() : '',
                afp: document.getElementById('formAFP') ? document.getElementById('formAFP').value.trim() : '',
                profession: document.getElementById('formProfession') ? document.getElementById('formProfession').value.trim() : '',
                // Keep these for backward compatibility if other forms use them or remove if strict
                phone: document.getElementById('formPhone') ? document.getElementById('formPhone').value.trim() : '',
                message: document.getElementById('formMessage')?.value?.trim() ?? ''
            };

            // Basic validation
            let isValid = true;
            let errorMessage = 'Por favor, preencha todos os campos obrigatórios.';

            // Check if it's the socio form (has mobile field)
            if (document.getElementById('formMobile')) {
                // Only name, email and mobile are required
                if (!formData.name || !formData.email || !formData.mobile || !formData.dob) {
                    isValid = false;
                }
            } else {
                // Standard contact form validation
                if (!formData.name || !formData.email || !formData.message) {
                    isValid = false;
                }
            }

            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Por favor, insira um email válido.', 'error');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'A enviar...';

            if (document.getElementById('formMobile')) {
                // Formulário de sócio — enviar via EmailJS
                emailjs.send('service_js_naf', 'template_inscricao_socio', {
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    address: formData.address || '—',
                    dob: formData.dob,
                    afp: formData.afp || '—',
                    profession: formData.profession || '—'
                }).then(function () {
                    showFormMessage('Inscrição enviada com sucesso! Entraremos em contacto em breve.', 'success');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    setTimeout(() => {
                        const msg = document.getElementById('formMessage');
                        if (msg) msg.style.display = 'none';
                    }, 5000);
                }, function (error) {
                    showFormMessage('Erro ao enviar a inscrição. Por favor tente novamente.', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    console.error('EmailJS error:', error);
                    setTimeout(() => {
                        const msg = document.getElementById('formMessage');
                        if (msg) msg.style.display = 'none';
                    }, 5000);
                });
            } else {
                // Formulário de contacto (index.html) — enviar via EmailJS
                emailjs.send('service_js_naf', 'template_contacto', {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || '—',
                    message: formData.message
                }).then(function () {
                    showFormMessage('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    setTimeout(() => {
                        const msg = document.getElementById('formFeedback');
                        if (msg) msg.style.display = 'none';
                    }, 5000);
                }, function (error) {
                    showFormMessage('Erro ao enviar a mensagem. Por favor tente novamente.', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    console.error('EmailJS error:', error);
                    setTimeout(() => {
                        const msg = document.getElementById('formFeedback');
                        if (msg) msg.style.display = 'none';
                    }, 5000);
                });
            }
        });
    }

    function showFormMessage(message, type) {
        // index.html usa id="formFeedback"; socio.html usa id="formMessage"
        const messageElement = document.getElementById('formFeedback') || document.getElementById('formMessage');
        if (!messageElement) return;
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';

        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    // ================================
    // Scroll Animations
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .value-card, .highlight-card, .stats-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ================================
    // CTA Button Tracking
    // ================================
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            const buttonId = this.getAttribute('id');
            console.log('CTA clicked:', buttonId);
            // In production, you could track this with analytics
        });
    });

    // ================================
    // Footer Links Smooth Scroll
    // ================================
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 60;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ================================
    // Google Maps - Now using iframe embed
    // ================================
    // Map is now embedded via iframe in HTML, no JavaScript initialization needed

    // ================================
    // Keyboard Accessibility Improvements
    // ================================

    // Scroll indicator keyboard support
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const nextSection = document.querySelector('#main-content');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }


});
