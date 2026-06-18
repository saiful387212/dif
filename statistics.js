/* statistics.js */
// ============================================================
//  statistics.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  স্ট্যাটিস্টিক্স সেকশনের জন্য সম্পূর্ণ JavaScript
//  কাউন্টার অ্যানিমেশন সহ
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. স্ট্যাট আইটেম অ্যানিমেশন =====
    const statItems = document.querySelectorAll('.stat-item');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        // ভিজিবল হওয়ার পর কাউন্টার শুরু
                        startCounter(entry.target);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        statItems.forEach(item => {
            observer.observe(item);
        });
    } else {
        // ফ্যালব্যাক: সব আইটেম দেখান এবং কাউন্টার শুরু
        statItems.forEach(item => {
            item.classList.add('visible');
            startCounter(item);
        });
    }

    // ===== ২. কাউন্টার ফাংশন =====
    function startCounter(item) {
        const numberElement = item.querySelector('.stat-number');
        if (!numberElement) return;

        const target = parseInt(item.getAttribute('data-count'));
        if (isNaN(target) || target <= 0) return;

        // চেক করুন ইতিমধ্যে কাউন্টার চালু হয়েছে কিনা
        if (numberElement.dataset.animated === 'true') return;
        numberElement.dataset.animated = 'true';

        let current = 0;
        const duration = 2000; // 2 সেকেন্ড
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;

        function updateCounter() {
            current += increment;
            if (current >= target) {
                numberElement.textContent = target.toLocaleString('bn-BD') + '+';
                return;
            }
            numberElement.textContent = Math.floor(current).toLocaleString('bn-BD') + '+';
            requestAnimationFrame(() => {
                setTimeout(updateCounter, stepTime);
            });
        }

        // ডিভাইস পারফরম্যান্স অনুযায়ী কাউন্টার শুরু
        if ('requestAnimationFrame' in window) {
            updateCounter();
        } else {
            // ফ্যালব্যাক: সরাসরি দেখান
            numberElement.textContent = target.toLocaleString('bn-BD') + '+';
        }
    }

    // ===== ৩. কাউন্টার রিসেট (ঐচ্ছিক) =====
    // উইন্ডো রিসাইজ বা রিফ্রেশে কাউন্টার রিসেট করা যায়

    // ===== ৪. ইন্টারসেকশন অবজার্ভার (পুনরায় চেক) =====
    // যদি কোনো কারণে অবজার্ভার কাজ না করে

    // ===== ৫. স্মুথ স্ক্রল (অ্যাঙ্কর লিংক) =====
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

    // ===== ৬. পারফরম্যান্স অপটিমাইজেশন =====
    // ডিভাইসের পারফরম্যান্স অনুযায়ী কাউন্টারের স্টেপ সংখ্যা পরিবর্তন
    function isLowPerformanceDevice() {
        // মোবাইল ডিভাইস বা কম মেমরির ডিভাইস চেক
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        return isMobile || isLowMemory;
    }

    if (isLowPerformanceDevice()) {
        // কম পারফরম্যান্স ডিভাইসের জন্য সরলীকৃত অ্যানিমেশন
        document.querySelectorAll('.stat-item').forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            if (numberElement) {
                const target = parseInt(item.getAttribute('data-count'));
                if (!isNaN(target)) {
                    numberElement.textContent = target.toLocaleString('bn-BD') + '+';
                }
            }
        });
    }

    // ===== ৭. কাস্টম ইভেন্ট: ট্যাব ভিজিবিলিটি =====
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // ট্যাব আবার অ্যাকটিভ হলে কাউন্টার চেক
            document.querySelectorAll('.stat-item.visible').forEach(item => {
                const numberElement = item.querySelector('.stat-number');
                if (numberElement && numberElement.dataset.animated !== 'true') {
                    startCounter(item);
                }
            });
        }
    });

    // ===== ৮. ডিবাগ =====
    console.log('✅ স্ট্যাটিস্টিক্স সেকশন লোড হয়েছে');
    console.log(`📊 মোট ${statItems.length} টি স্ট্যাট আইটেম পাওয়া গেছে`);
});

// ===== ৯. উইন্ডো লোড হলে কাউন্টার চেক =====
window.addEventListener('load', function() {
    // ইতিমধ্যে ভিউপোর্টে থাকা আইটেমগুলোর জন্য
    document.querySelectorAll('.stat-item.visible').forEach(item => {
        const numberElement = item.querySelector('.stat-number');
        if (numberElement && numberElement.dataset.animated !== 'true') {
            startCounter(item);
        }
    });
});

// ===== ১০. রেসপনসিভ ব্রেকপয়েন্ট হ্যান্ডলার =====
function handleResponsiveStats() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    const width = window.innerWidth;
    let columns = 5;
    
    if (width <= 480) columns = 2;
    else if (width <= 768) columns = 2;
    else if (width <= 1024) columns = 3;
    else columns = 5;

    statsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// প্রাথমিক সেটআপ
handleResponsiveStats();

// রিসাইজ ইভেন্ট (ডিবাউন্স সহ)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveStats, 250);
});

// ===== ১১. নম্বর ফরম্যাটিং হেল্পার =====
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'ক';
    }
    return num.toString();
}

// যদি আপনি 'ক' (হাজার) ব্যবহার করতে চান
// .stat-number এ ব্যবহার করুন: textContent = formatNumber(target) + '+';