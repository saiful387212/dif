/* footer.js */
// ============================================================
//  footer.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  ফুটারের জন্য সম্পূর্ণ JavaScript
//  নিউজলেটার সাবস্ক্রিপশন, সোশ্যাল মিডিয়া ট্র্যাকিং সহ
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. নিউজলেটার ফর্ম =====
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterInput = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = newsletterInput.value.trim();
            
            // ভ্যালিডেশন
            if (!email) {
                showNewsletterMessage('দয়া করে আপনার ইমেইল ঠিকানা দিন', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage('সঠিক ইমেইল ঠিকানা দিন', 'error');
                return;
            }

            // সাবস্ক্রিপশন সফল
            console.log('✅ নিউজলেটার সাবস্ক্রাইব:', email);
            showNewsletterMessage('আপনি সফলভাবে সাবস্ক্রাইব করেছেন! ধন্যবাদ।', 'success');
            
            // ফর্ম রিসেট
            newsletterForm.reset();
            
            // ৩ সেকেন্ড পর মেসেজ সরান
            setTimeout(() => {
                newsletterMessage.textContent = '';
                newsletterMessage.className = 'newsletter-message';
            }, 5000);
        });
    }

    // নিউজলেটার মেসেজ শো
    function showNewsletterMessage(text, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = text;
            newsletterMessage.className = 'newsletter-message ' + type;
        }
    }

    // ===== ২. সোশ্যাল মিডিয়া ক্লিক ট্র্যাকিং =====
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('aria-label') || 'সোশ্যাল মিডিয়া';
            console.log(`✅ সোশ্যাল মিডিয়া ক্লিক (ফুটার): ${platform}`);
            
            // এখানে আপনি সোশ্যাল মিডিয়া লিংক ওপেন করতে পারেন
            // window.open(this.href, '_blank');
            
            // ডেমো অ্যাকশন
            alert(`${platform} পেজে যেতে ক্লিক করুন।\n(প্রোডাকশনে এটি লিংক ওপেন করবে)`);
        });
    });

    // ===== ৩. ফুটার লিংক ক্লিক ট্র্যাকিং =====
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-bottom-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // অভ্যন্তরীণ লিংকের জন্য
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + 
                                          window.pageYOffset - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            
            // লিংক ট্র্যাকিং
            const linkText = this.textContent.trim();
            console.log(`✅ ফুটার লিংক ক্লিক: ${linkText}`);
        });
    });

    // ===== ৪. কপিরাইট বছর আপডেট =====
    const copyrightYear = document.querySelector('.footer-copyright p');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML
            .replace('২০২৪', currentYear);
    }

    // ===== ৫. স্ক্রল টু টপ বাটন (ঐচ্ছিক) =====
    // ফুটারে ক্লিক করে টপে যাওয়ার সুবিধা

    // ===== ৬. ইন্টারসেকশন অবজার্ভার (অ্যানিমেশন) =====
    if ('IntersectionObserver' in window) {
        const footer = document.querySelector('.footer');
        if (footer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.style.opacity = '1';
                        footer.style.transform = 'translateY(0)';
                        observer.unobserve(footer);
                    }
                });
            }, {
                threshold: 0.1
            });

            footer.style.opacity = '0';
            footer.style.transform = 'translateY(20px)';
            footer.style.transition = 'all 0.8s ease';
            observer.observe(footer);
        }
    }

    // ===== ৭. ফোন নম্বর ফরম্যাট (ঐচ্ছিক) =====
    // ফোন নম্বরগুলো ক্লিক করলে কল করার সুবিধা

    // ===== ৮. ডিবাগ =====
    console.log('✅ ফুটার লোড হয়েছে');
});