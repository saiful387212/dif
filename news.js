/* news.js */
// ============================================================
//  news.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  নিউজ সেকশনের জন্য JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== DOM এলিমেন্ট =====
    const newsCards = document.querySelectorAll('.news-card');
    const loadMoreBtn = document.getElementById('loadMoreNews');

    // ===== ১. কার্ড অ্যানিমেশন =====
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

        newsCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        newsCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // ===== ২. লেজি লোডিং =====
    function lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('.news-image img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // ফ্যালব্যাক
            document.querySelectorAll('.news-image img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }

    lazyLoadImages();

    // ===== ৩. লোড মোর =====
    let currentVisible = 6;
    const totalCards = newsCards.length;
    const cardsPerLoad = 3;

    function updateLoadMoreButton() {
        const hiddenCards = document.querySelectorAll('.news-card:not(.visible)');
        if (hiddenCards.length === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
            const remaining = hiddenCards.length;
            loadMoreBtn.querySelector('span').textContent = 
                `আরও সংবাদ (${remaining})`;
        }
    }

    function loadMoreNews() {
        const hiddenCards = document.querySelectorAll('.news-card:not(.visible)');
        const toLoad = Math.min(cardsPerLoad, hiddenCards.length);

        hiddenCards.forEach((card, index) => {
            if (index < toLoad) {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 150 * index);
            }
        });

        setTimeout(updateLoadMoreButton, 200);
    }

    // ইনিশিয়াল আপডেট
    setTimeout(updateLoadMoreButton, 100);

    // লোড মোর ক্লিক
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNews);
    }

    // ===== ৪. রিড মোর লিংক =====
    document.querySelectorAll('.news-readmore').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.closest('.news-content').querySelector('.news-title')?.textContent || '';
            alert(`"${title}" - বিস্তারিত পড়তে ক্লিক করুন।\n(প্রোডাকশনে এটি বিস্তারিত পেজে নিয়ে যাবে)`);
        });
    });

    // ===== ৫. স্মুথ স্ক্রল =====
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

    // ===== ৬. উইন্ডো রিসাইজ =====
    function handleResponsiveGrid() {
        const grid = document.querySelector('.news-grid');
        if (!grid) return;

        const width = window.innerWidth;
        let columns = 3;
        
        if (width <= 576) columns = 1;
        else if (width <= 768) columns = 2;
        else if (width <= 1024) columns = 2;
        else columns = 3;

        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    handleResponsiveGrid();

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResponsiveGrid, 250);
    });

    // ===== ডিবাগ =====
    console.log('✅ নিউজ সেকশন লোড হয়েছে');
    console.log(`📰 মোট ${totalCards} টি সংবাদ পাওয়া গেছে`);
});