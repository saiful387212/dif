/* hero-section.js */
// ============================================================
//  hero-section.js — দারুল ইত্তিহাদ ফাউন্ডেশন (DIF)
//  হিরো সেকশনের অ্যানিমেশন, স্ক্রল ইন্ডিকেটর, কাউন্টার
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. পরিসংখ্যান কাউন্টার অ্যানিমেশন =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (isNaN(target)) return;

            let current = 0;
            const increment = Math.ceil(target / 60);
            const duration = 2000; // 2 সেকেন্ড
            const stepTime = Math.floor(duration / 60);

            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    countersAnimated = true;
                    return;
                }
                counter.textContent = current + '+';
                setTimeout(updateCounter, stepTime);
            };

            updateCounter();
        });
    }

    // ===== ২. ইন্টারসেকশন অবজার্ভার (স্ক্রল ভিউ) =====
    const heroSection = document.querySelector('.hero');
    const statsSection = document.querySelector('.hero-stats');

    if ('IntersectionObserver' in window && statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(statsSection);
    } else {
        // ফ্যালব্যাক: পেজ লোডে কাউন্টার শুরু
        setTimeout(animateCounters, 1000);
    }

    // ===== ৩. স্ক্রল ইন্ডিকেটর (ক্লিক করলে স্মুথ স্ক্রল) =====
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const nextSection = document.querySelector('section:not(.hero)') || 
                               document.querySelector('div:not(.hero)');
            
            if (nextSection) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = nextSection.getBoundingClientRect().top + 
                                      window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });

        // কিবোর্ড অ্যাক্সেসিবিলিটি
        scrollIndicator.setAttribute('role', 'button');
        scrollIndicator.setAttribute('tabindex', '0');
        scrollIndicator.setAttribute('aria-label', 'পরবর্তী সেকশনে স্ক্রল করুন');

        scrollIndicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // ===== ৪. প্যারালাক্স ইফেক্ট (ঐচ্ছিক) =====
    const heroBg = document.querySelector('.hero-background');
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!heroBg) return;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const heroHeight = heroSection?.offsetHeight || window.innerHeight;
                const parallaxSpeed = 0.4;
                
                if (scrolled < heroHeight) {
                    const translateY = scrolled * parallaxSpeed;
                    heroBg.style.transform = `scale(1.05) translateY(${translateY}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // ===== ৫. রেস্পন্সিভ ভিউপোর্ট চেক =====
    function handleResize() {
        // মোবাইলে স্ক্রল ইন্ডিকেটর লুকানো ইতিমধ্যে CSS-তে আছে
        // কিন্তু প্রয়োজনে আরও কাস্টমাইজেশন
        const isMobile = window.innerWidth <= 768;
        if (scrollIndicator) {
            scrollIndicator.style.display = isMobile ? 'none' : 'flex';
        }
    }

    // প্রাথমিক চেক
    handleResize();

    // রিসাইজ ইভেন্ট (ডিবাউন্স সহ)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // ===== ৬. পারফরম্যান্স: অ্যানিমেশন পজ (ট্যাব অ্যাক্টিভ না থাকলে) =====
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // ট্যাব ইনঅ্যাকটিভ — অ্যানিমেশন পজ (যদি প্রয়োজন)
            document.querySelectorAll('.animated').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            document.querySelectorAll('.animated').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });

    // ===== ডিবাগ =====
    console.log('✅ হিরো সেকশন সক্রিয় হয়েছে');
});