/* contact.js */
// ============================================================
//  contact.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  কন্টাক্ট সেকশনের জন্য সম্পূর্ণ JavaScript
//  ফর্ম ভ্যালিডেশন, মডাল কন্ট্রোল, সোশ্যাল মিডিয়া সহ
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== DOM এলিমেন্ট =====
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');

    // ===== ১. ফর্ম ভ্যালিডেশন =====
    function validateField(field) {
        const value = field.value.trim();
        const errorSpan = document.getElementById(field.id + 'Error');
        
        if (!errorSpan) return true;

        // রিসেট
        field.classList.remove('error');
        errorSpan.textContent = '';

        // ভ্যালিডেশন
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            errorSpan.textContent = 'এই ক্ষেত্রটি আবশ্যক';
            return false;
        }

        // ইমেইল ভ্যালিডেশন
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                errorSpan.textContent = 'সঠিক ইমেইল ঠিকানা দিন';
                return false;
            }
        }

        // ফোন ভ্যালিডেশন
        if (field.id === 'phone' && value) {
            const phoneRegex = /^01[3-9]\d{8}$/;
            if (!phoneRegex.test(value)) {
                field.classList.add('error');
                errorSpan.textContent = 'সঠিক মোবাইল নম্বর দিন (০১XXXXXXXXX)';
                return false;
            }
        }

        return true;
    }

    // ইনপুট ইভেন্ট
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // ===== ২. ফর্ম সাবমিট =====
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // সব ফিল্ড ভ্যালিডেট
            let isValid = true;
            const fields = this.querySelectorAll('input[required], textarea[required]');
            fields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                // প্রথম এরর ফিল্ডে ফোকাস
                const firstError = this.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
                return;
            }

            // ফর্ম ডেটা সংগ্রহ
            const formData = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || 'প্রদান করা হয়নি',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // কনসোলে লগ
            console.log('✅ কন্টাক্ট ফর্ম ডেটা:', formData);

            // সাফল্যের মডাল দেখান
            showModal();

            // ফর্ম রিসেট
            this.reset();
        });
    }

    // ===== ৩. মডাল কন্ট্রোল =====
    window.showModal = function() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // মডালের বাইরে ক্লিক
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Esc কী
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ===== ৪. সোশ্যাল মিডিয়া =====
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('aria-label') || 'সোশ্যাল মিডিয়া';
            console.log(`✅ সোশ্যাল মিডিয়া ক্লিক: ${platform}`);
            
            // এখানে আপনি সোশ্যাল মিডিয়া লিংক ওপেন করতে পারেন
            // window.open(this.href, '_blank');
            alert(`${platform} পেজে যেতে ক্লিক করুন।\n(প্রোডাকশনে এটি লিংক ওপেন করবে)`);
        });
    });

    // ===== ৫. ফোন নম্বর ফরম্যাট =====
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // শুধু ডিজিট অনুমোদন
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    }

    // ===== ৬. স্মুথ স্ক্রল =====
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

    // ===== ৭. লোডিং স্পিনার (ঐচ্ছিক) =====
    // ফর্ম সাবমিটে লোডিং ইফেক্ট

    // ===== ৮. গুগল ম্যাপ লোড চেক =====
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe) {
        mapIframe.addEventListener('load', function() {
            console.log('✅ গুগল ম্যাপ লোড হয়েছে');
        });
    }

    // ===== ৯. রেস্পন্সিভ হ্যান্ডলার =====
    function handleResponsiveLayout() {
        const contactGrid = document.querySelector('.contact-grid');
        if (!contactGrid) return;

        const width = window.innerWidth;
        if (width <= 1024) {
            contactGrid.style.gridTemplateColumns = '1fr';
        } else {
            contactGrid.style.gridTemplateColumns = '1fr 1.5fr';
        }
    }

    handleResponsiveLayout();

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResponsiveLayout, 250);
    });

    // ===== ডিবাগ =====
    console.log('✅ কন্টাক্ট সেকশন লোড হয়েছে');
}); 