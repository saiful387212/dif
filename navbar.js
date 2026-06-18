/* navbar.js */
// ============================================================
//  navbar.js — দারুল ইত্তিহাদ ফাউন্ডেশন (DIF)
//  স্টিকি নেভবার, হ্যামবার্গার টগল, অ্যাক্টিভ সেকশন হাইলাইট
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== DOM এলিমেন্ট নির্বাচন =====
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // ===== ১. স্টিকি নেভবার — স্ক্রল ইফেক্ট =====
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbarOnScroll() {
        const currentScrollY = window.scrollY;
        
        // স্ক্রল ডিরেকশন চেক (ডাউন/আপ)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // ডাউনস্ক্রল — নেভবার ছোট হবে
            navbar.classList.add('scrolled');
        } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
            // আপস্ক্রল বা টপে — নেভবার স্বাভাবিক
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    // স্ক্রল ইভেন্ট (থ্রোটল সহ)
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavbarOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ===== ২. মোবাইল হ্যামবার্গার টগল =====
    function toggleMobileMenu() {
        const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
        
        // টগল স্টেট পরিবর্তন
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        navbarToggle.setAttribute('aria-expanded', !isExpanded);
        
        // বডি স্ক্রল লক (ঐচ্ছিক)
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    navbarToggle.addEventListener('click', toggleMobileMenu);

    // ===== ৩. মোবাইলে লিংক ক্লিক করলে মেনু বন্ধ করা =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // মোবাইলে মেনু খোলা থাকলে বন্ধ করি
            if (navbarMenu.classList.contains('active')) {
                toggleMobileMenu();
            }

            // অ্যাক্টিভ ক্লাস ম্যানেজ (সব লিংক থেকে রিমুভ)
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===== ৪. অ্যাক্টিভ সেকশন হাইলাইট (স্ক্রল-ভিত্তিক) =====
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id], div[id]');
        let currentActive = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            
            // সেকশন ভিউপোর্টে এলে
            if (rect.top <= 150 && rect.bottom >= 150) {
                if (distance < minDistance) {
                    minDistance = distance;
                    currentActive = section;
                }
            }
        });

        if (currentActive) {
            const sectionId = currentActive.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    }

    // ডিবাউন্স সহ স্ক্রল ইভেন্ট
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(highlightActiveSection, 100);
    });

    // ===== ৫. কিবোর্ড অ্যাক্সেসিবিলিটি =====
    // Esc কী প্রেস করলে মোবাইল মেনু বন্ধ
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // ===== ৬. উইন্ডো রিসাইজ — মোবাইল ভিউ চেক =====
    function handleResize() {
        // ডেস্কটপ ভিউতে মেনু খোলা থাকলে বন্ধ করি
        if (window.innerWidth > 768 && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    }

    window.addEventListener('resize', handleResize);

    // ===== ৭. পেজ লোডে অ্যাক্টিভ লিংক চেক =====
    function setActiveLinkOnLoad() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentPage = currentPath.replace('.html', '');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.replace('.html', '');
                if (linkPage === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    setActiveLinkOnLoad();

    // ===== ৮. স্মুথ স্ক্রলিং (অ্যাঙ্কর লিংকের জন্য) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // URL আপডেট (ঐচ্ছিক)
                history.pushState(null, null, targetId);
            }
        });
    });

    // ===== ডিবাগ (শুধু ডেভেলপমেন্ট) =====
    console.log('✅ নেভবার সক্রিয় হয়েছে (দারুল ইত্তিহাদ ফাউন্ডেশন)');
});