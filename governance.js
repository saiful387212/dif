/* governance.js */
// ============================================================
//  governance.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  গভর্নেন্স সেকশনের জন্য সম্পূর্ণ JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. ফাউন্ডার কার্ড অ্যানিমেশন =====
    const founderCard = document.getElementById('founderCard');
    if (founderCard) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    founderCard.classList.add('visible');
                    observer.unobserve(founderCard);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        observer.observe(founderCard);
    }

    // ===== ২. কমিটি কার্ড অ্যানিমেশন =====
    const committeeCards = document.querySelectorAll('.committee-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        committeeCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        committeeCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // ===== ৩. অর্গানাইজেশন চার্ট অ্যানিমেশন =====
    const orgChart = document.getElementById('orgChart');
    if (orgChart) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    orgChart.classList.add('visible');
                    observer.unobserve(orgChart);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        observer.observe(orgChart);
    }

    // ===== ৪. টাইমলাইন অ্যানিমেশন =====
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timeline.classList.add('visible');
                    observer.unobserve(timeline);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        observer.observe(timeline);
    }

    // ===== ৫. টাইমলাইন আইটেম স্টagger =====
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, 200 * index);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }

    // ===== ৬. স্মুথ স্ক্রল (অভ্যন্তরীণ লিংক) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + 
                                      window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ৭. সোশ্যাল মিডিয়া লিংক (ট্র্যাকিং) =====
    const socialLinks = document.querySelectorAll('.founder-social a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label') || 'unknown';
            console.log(`✅ সোশ্যাল মিডিয়া ক্লিক: ${platform}`);
            // আপনি এখানে Google Analytics বা অন্য ট্র্যাকিং যোগ করতে পারেন
        });
    });

    // ===== ৮. পারফরম্যান্স: লেজি লোড ইমেজ =====
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }

    // ===== ডিবাগ =====
    console.log('✅ গভর্নেন্স সেকশন লোড হয়েছে');
});