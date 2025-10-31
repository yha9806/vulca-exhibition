// ============================================================================
// VULCA Landing Page - Interactive Features
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll behavior for navigation
    initNavigationScroll();

    // Add animations on scroll
    initScrollAnimations();
});

// ============================================================================
// Smooth Scroll Navigation
// ============================================================================

function initNavigationScroll() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle internal anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for sticky navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================================================
// Scroll Animation - Fade In Elements
// ============================================================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const cards = document.querySelectorAll('.persona-card, .feature, .framework-step, .tech-item');

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ============================================================================
// Counter Animation (for statistics if added later)
// ============================================================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================================================
// Mobile Menu Toggle (if expanded in future)
// ============================================================================

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// ============================================================================
// Form Submission Handler (if contact form added)
// ============================================================================

function handleFormSubmission(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your interest! We will be in touch soon.');
}

console.log('VULCA Landing Page - Ready');
