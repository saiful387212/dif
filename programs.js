/* programs.js */
// ============================================================
//  programs.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  প্রোগ্রামস সেকশনের জন্য সম্পূর্ণ JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. প্রোগ্রাম কার্ড অ্যানিমেশন =====
    const programCards = document.querySelectorAll('.program-card');
    
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

        programCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        programCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // ===== ২. ফিল্টার সিস্টেম =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allCards = document.querySelectorAll('.program-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // অ্যাক্টিভ ক্লাস পরিবর্তন
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            allCards.forEach((card, index) => {
                // অ্যানিমেশন রিসেট
                card.classList.remove('visible');
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';

                // ফিল্টার চেক
                const cardCategory = card.querySelector('.program-link')?.getAttribute('data-category') || 'all';
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    setTimeout(() => {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.classList.add('visible');
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, 200 * (index % 3));
                } else {
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== ৩. কার্ডে হোভার অডিও ইফেক্ট (ঐচ্ছিক) =====
    // এখানে আপনি হোভার সাউন্ড বা হ্যাপটিক ফিডব্যাক যোগ করতে পারেন

    // ===== ৪. প্রোগ্রাম লিংক ট্র্যাকিং =====
    const programLinks = document.querySelectorAll('.program-link');
    programLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const programTitle = this.closest('.program-card').querySelector('.program-title')?.textContent || 'Unknown';
            console.log(`✅ প্রোগ্রাম ভিজিট: ${programTitle}`);
            
            // এখানে আপনি মডাল খুলতে পারেন বা বিস্তারিত পেজে যেতে পারেন
            alert(`"${programTitle}" প্রোগ্রামের বিস্তারিত তথ্য শীঘ্রই আসছে।`);
        });
    });

    // ===== ৫. ফিল্টার বাটনে ক্লিক রিপল =====
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ===== ৬. স্মুথ স্ক্রল (অ্যাঙ্কর লিংক) =====
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

    // ===== ৭. রিপল অ্যানিমেশন স্টাইল =====
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes rippleEffect {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ===== ৮. উইন্ডো রিসাইজ - কার্ড ভিউ =====
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // কার্ড পুনরায় সাজানোর প্রয়োজন হলে
            console.log('🔄 উইন্ডো রিসাইজ ডিটেক্টেড');
        }, 250);
    });

    // ===== ডিবাগ =====
    console.log('✅ প্রোগ্রামস সেকশন লোড হয়েছে');
});