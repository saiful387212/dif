/* gallery.js */
// ============================================================
//  gallery.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  গ্যালারি সেকশনের জন্য সম্পূর্ণ JavaScript
//  ফিল্টার, লাইটবক্স, লেজি লোডিং সহ
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== DOM এলিমেন্ট =====
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;
    let visibleItems = 8;
    const itemsPerLoad = 4;
    let allItems = [];

    // ===== ১. আইটেম ডেটা তৈরি =====
    function getGalleryItems() {
        const items = [];
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            const img = item.querySelector('img');
            const title = item.querySelector('.overlay-content h3')?.textContent || 'গ্যালারি';
            const desc = item.querySelector('.overlay-content p')?.textContent || '';
            const category = item.querySelector('.gallery-category')?.textContent || '';
            const src = img.getAttribute('data-src') || img.src;
            
            items.push({
                element: item,
                img: img,
                src: src,
                title: title,
                desc: desc,
                category: category,
                index: index
            });
        });
        return items;
    }

    allItems = getGalleryItems();

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

            document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // ফ্যালব্যাক: সব ছবি লোড
            document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }

    // ===== ৩. কার্ড অ্যানিমেশন =====
    function animateGalleryItems(items) {
        items.forEach((item, index) => {
            const delay = parseInt(item.element.getAttribute('data-delay')) || 0;
            setTimeout(() => {
                item.element.classList.add('visible');
            }, delay);
        });
    }

    // ===== ৪. ফিল্টার সিস্টেম =====
    function filterGallery(category) {
        let visibleCount = 0;
        
        allItems.forEach((item, index) => {
            const itemCategory = item.element.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.element.classList.remove('hidden');
                visibleCount++;
                // অ্যানিমেশন রিসেট
                setTimeout(() => {
                    item.element.classList.add('visible');
                }, 100 * (index % 3));
            } else {
                item.element.classList.add('hidden');
                item.element.classList.remove('visible');
            }
        });

        // লোড মোর বাটন আপডেট
        if (visibleCount <= 8) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }

        // ভিজিবল আইটেম সংখ্যা ট্র্যাক
        visibleItems = Math.min(8, visibleCount);
        updateLoadMoreButton();
    }

    // ===== ৫. লোড মোর ফাংশন =====
    function loadMoreItems() {
        const hiddenItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        const currentVisible = document.querySelectorAll('.gallery-item:not(.hidden).visible');
        const totalVisible = hiddenItems.length;
        
        if (currentVisible.length < totalVisible) {
            const remaining = totalVisible - currentVisible.length;
            const toLoad = Math.min(itemsPerLoad, remaining);
            
            let loaded = 0;
            hiddenItems.forEach(item => {
                if (!item.classList.contains('visible') && loaded < toLoad) {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 150 * loaded);
                    loaded++;
                }
            });

            visibleItems += toLoad;
            updateLoadMoreButton();
        }
    }

    function updateLoadMoreButton() {
        const totalVisible = document.querySelectorAll('.gallery-item:not(.hidden)').length;
        const currentVisible = document.querySelectorAll('.gallery-item:not(.hidden).visible').length;
        
        if (currentVisible >= totalVisible) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
            loadMoreBtn.querySelector('span').textContent = 
                `আরও দেখুন (${currentVisible}/${totalVisible})`;
        }
    }

    // ===== ৬. লাইটবক্স =====
    function openLightbox(index) {
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        const item = visibleItems[index];
        if (!item) return;

        const img = item.querySelector('img');
        const title = item.querySelector('.overlay-content h3')?.textContent || 'গ্যালারি';
        const desc = item.querySelector('.overlay-content p')?.textContent || '';
        const category = item.querySelector('.gallery-category')?.textContent || '';

        const src = img.getAttribute('data-src') || img.src;
        
        lightboxImage.src = src;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        lightboxCategory.textContent = category;

        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        const total = visibleItems.length;
        
        currentIndex = (currentIndex + direction + total) % total;
        openLightbox(currentIndex);
    }

    // ===== ৭. ইভেন্ট লিসেনার =====

    // ফিল্টার বাটন
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-filter');
            filterGallery(category);
        });
    });

    // লোড মোর
    loadMoreBtn.addEventListener('click', loadMoreItems);

    // গ্যালারি আইটেম ক্লিক
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
            const itemIndex = Array.from(visibleItems).indexOf(this);
            if (itemIndex !== -1) {
                openLightbox(itemIndex);
            }
        });

        // কিবোর্ড অ্যাক্সেস
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // লাইটবক্স কন্ট্রোল
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // লাইটবক্সের বাইরে ক্লিক
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // কিবোর্ড কন্ট্রোল
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // ===== ৮. রেস্পন্সিভ ব্রেকপয়েন্ট =====
    function handleResponsiveGrid() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;

        const width = window.innerWidth;
        let columns = 4;
        
        if (width <= 480) columns = 2;
        else if (width <= 768) columns = 2;
        else if (width <= 1024) columns = 3;
        else columns = 4;

        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    handleResponsiveGrid();

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResponsiveGrid, 250);
    });

    // ===== ৯. ইনিশিয়ালাইজেশন =====
    function init() {
        // লেজি লোডিং শুরু
        lazyLoadImages();
        
        // প্রথম ৮টি আইটেম দেখান
        let count = 0;
        allItems.forEach((item, index) => {
            if (count < 8) {
                setTimeout(() => {
                    item.element.classList.add('visible');
                }, parseInt(item.element.getAttribute('data-delay')) || 100);
                count++;
            }
        });

        // লোড মোর বাটন আপডেট
        visibleItems = 8;
        updateLoadMoreButton();

        console.log('✅ গ্যালারি সেকশন লোড হয়েছে');
        console.log(`📸 মোট ${allItems.length} টি ছবি পাওয়া গেছে`);
    }

    init();

    // ===== ১০. স্ক্রল টু টপ (অ্যাঙ্কর লিংক) =====
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
});