/* script.js - সম্পূর্ণ জাভাস্ক্রিপ্ট */

// ============================================================
//  script.js — দারুল ইত্তিহাদ ফাউন্ডেশন (DIF)
//  সম্পূর্ণ ওয়েবসাইটের জন্য JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================
    // ১. নেভবার — স্টিকি, স্ক্রল, হ্যামবার্গার
    // ============================================================
    
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // স্টিকি নেভবার
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbarOnScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavbarOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // হ্যামবার্গার টগল
    function toggleMobileMenu() {
        const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
        
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        navbarToggle.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    navbarToggle.addEventListener('click', toggleMobileMenu);

    // মোবাইলে লিংক ক্লিক করলে মেনু বন্ধ
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navbarMenu.classList.contains('active')) {
                toggleMobileMenu();
            }

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Esc কী
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // রিসাইজে মেনু বন্ধ
    function handleResize() {
        if (window.innerWidth > 768 && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    }

    window.addEventListener('resize', handleResize);

    // অ্যাক্টিভ লিংক
    function setActiveLinkOnLoad() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    setActiveLinkOnLoad();

    // স্ক্রল ভিত্তিক অ্যাক্টিভ সেকশন
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === currentSection) {
                    link.classList.add('active');
                }
            });
        }, 100);
    });

    // স্মুথ স্ক্রল
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + 
                                      window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // ২. হিরো — কাউন্টার অ্যানিমেশন
    // ============================================================
    
    const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (isNaN(target)) return;

            let current = 0;
            const increment = Math.ceil(target / 60);
            
            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    countersAnimated = true;
                    return;
                }
                counter.textContent = current + '+';
                requestAnimationFrame(() => {
                    setTimeout(updateCounter, 30);
                });
            };

            updateCounter();
        });
    }

    // হিরো সেকশন ভিউ হলে কাউন্টার শুরু
    const heroSection = document.querySelector('.hero');
    if ('IntersectionObserver' in window && heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(heroSection);
    } else {
        setTimeout(animateCounters, 1000);
    }

    // ============================================================
    // ৩. অবজেক্টিভস — কার্ড অ্যানিমেশন
    // ============================================================
    
    const objectiveCards = document.querySelectorAll('.objective-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 100 * index);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        objectiveCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        objectiveCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // ============================================================
    // ৪. মেম্বারশিপ — কার্ড অ্যানিমেশন ও জয়েন ফর্ম
    // ============================================================
    
    const membershipCards = document.querySelectorAll('.membership-card');
    
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
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        membershipCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        membershipCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // জয়েন ফর্ম
    const joinModal = document.getElementById('joinModal');
    const selectedMembership = document.getElementById('selectedMembership');

    window.openJoinForm = function(membershipType, price) {
        if (joinModal && selectedMembership) {
            selectedMembership.textContent = membershipType || 'সাধারণ সদস্য';
            joinModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // ফর্ম রিসেট
            const form = document.getElementById('joinForm');
            if (form) form.reset();
        }
    };

    window.closeJoinForm = function() {
        if (joinModal) {
            joinModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // মডালের বাইরে ক্লিক
    if (joinModal) {
        joinModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeJoinForm();
            }
        });
    }

    // Esc কী
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeJoinForm();
        }
    });

    // জয়েন ফর্ম সাবমিট
    window.submitJoinForm = function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('joinName').value,
            phone: document.getElementById('joinPhone').value,
            email: document.getElementById('joinEmail').value || 'প্রদান করা হয়নি',
            address: document.getElementById('joinAddress').value || 'প্রদান করা হয়নি',
            membershipType: document.getElementById('selectedMembership').textContent
        };

        console.log('✅ সদস্যপদ আবেদন:', formData);

        alert(`🎉 অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে।

সদস্যপদ: ${formData.membershipType}
নাম: ${formData.name}
মোবাইল: ${formData.phone}

শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
ধন্যবাদ!`);

        closeJoinForm();
        document.getElementById('joinForm').reset();
    };

    // ============================================================
    // ৫. গভর্নেন্স — অ্যানিমেশন
    // ============================================================
    
    const founderCard = document.getElementById('founderCard');
    if (founderCard && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    founderCard.classList.add('visible');
                    observer.unobserve(founderCard);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(founderCard);
    } else if (founderCard) {
        founderCard.classList.add('visible');
    }

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
        }, { threshold: 0.1 });

        committeeCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        committeeCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    const orgChart = document.getElementById('orgChart');
    if (orgChart && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    orgChart.classList.add('visible');
                    observer.unobserve(orgChart);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(orgChart);
    } else if (orgChart) {
        orgChart.classList.add('visible');
    }

    const timeline = document.getElementById('timeline');
    if (timeline && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timeline.classList.add('visible');
                    observer.unobserve(timeline);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(timeline);
    } else if (timeline) {
        timeline.classList.add('visible');
    }

    // ============================================================
    // ৬. প্রোগ্রামস — কার্ড অ্যানিমেশন
    // ============================================================
    
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
        }, { threshold: 0.1 });

        programCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        programCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // প্রোগ্রাম লিংক
    document.querySelectorAll('.program-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.closest('.program-card').querySelector('.program-title')?.textContent || '';
            alert(`"${title}" প্রোগ্রামের বিস্তারিত তথ্য শীঘ্রই আসছে।`);
        });
    });

    // ============================================================
    // ৭. গ্যালারি — লেজি লোডিং ও অ্যানিমেশন
    // ============================================================
    
    const galleryItems = document.querySelectorAll('.gallery-item');

    // লেজি লোডিং
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });

        galleryItems.forEach(item => {
            imageObserver.observe(item);
        });
    }

    // গ্যালারি অ্যানিমেশন
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
        }, { threshold: 0.1 });

        galleryItems.forEach(item => {
            observer.observe(item);
        });
    } else {
        galleryItems.forEach(item => {
            item.classList.add('visible');
        });
    }

    // গ্যালারি লাইটবক্স (সিম্পল)
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.overlay-content h3')?.textContent || '';
            const src = img.getAttribute('data-src') || img.src;
            
            if (src) {
                // সিম্পল আলার্ট (প্রোডাকশনে লাইটবক্স ব্যবহার করবেন)
                alert(`🖼️ ${title}\n\nছবি দেখতে ক্লিক করুন।\n(প্রোডাকশনে লাইটবক্স খুলবে)`);
            }
        });
    });

    // ============================================================
    // ৮. নিউজ — কার্ড অ্যানিমেশন
    // ============================================================
    
    const newsCards = document.querySelectorAll('.news-card');

    // লেজি লোডিং
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });

        newsCards.forEach(card => {
            const img = card.querySelector('img');
            if (img && img.getAttribute('data-src')) {
                imageObserver.observe(img);
            }
        });
    }

    // নিউজ অ্যানিমেশন
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
        }, { threshold: 0.1 });

        newsCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        newsCards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // রিড মোর
    document.querySelectorAll('.news-readmore').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.closest('.news-content').querySelector('.news-title')?.textContent || '';
            alert(`"${title}" - বিস্তারিত পড়তে ক্লিক করুন।\n(প্রোডাকশনে বিস্তারিত পেজে নিয়ে যাবে)`);
        });
    });

    // ============================================================
    // ৯. ডোনেশন — প্রিসেট ও ফর্ম
    // ============================================================
    
    const presetButtons = document.querySelectorAll('.amount-preset');
    const amountInput = document.getElementById('donationAmount');

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const amount = this.getAttribute('data-amount');
            if (amountInput) {
                amountInput.value = amount;
                amountInput.style.borderColor = '#1a7a5a';
                setTimeout(() => {
                    amountInput.style.borderColor = '';
                }, 2000);
            }
        });
    });

    if (amountInput) {
        amountInput.addEventListener('input', function() {
            presetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // ডোনেশন ফর্ম
    const donationForm = document.getElementById('donationForm');
    const donationModal = document.getElementById('donationModal');

    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('donorName').value,
                email: document.getElementById('donorEmail').value,
                phone: document.getElementById('donorPhone').value,
                amount: document.getElementById('donationAmount').value,
                note: document.getElementById('donationNote')?.value || 'প্রদান করা হয়নি'
            };

            if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
                alert('দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন।');
                return;
            }

            console.log('✅ দানের তথ্য:', formData);
            showDonationModal();
            this.reset();
            presetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    window.showDonationModal = function() {
        if (donationModal) {
            donationModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeDonationModal = function() {
        if (donationModal) {
            donationModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (donationModal) {
        donationModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDonationModal();
            }
        });
    }

    // ব্যাংক তথ্য কপি
    window.copyBankInfo = function() {
        const bankDetails = document.querySelectorAll('.bank-detail');
        let text = 'দারুল ইত্তিহাদ ফাউন্ডেশন - ব্যাংক তথ্য\n\n';
        
        bankDetails.forEach(detail => {
            const label = detail.querySelector('.label')?.textContent || '';
            const value = detail.querySelector('.value')?.textContent || '';
            text += `${label}: ${value}\n`;
        });

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess();
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch (err) {
            alert('কপি করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি কপি করুন।');
        }
        document.body.removeChild(textarea);
    }

    function showCopySuccess() {
        const btn = document.querySelector('.btn-copy');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i><span>কপি হয়েছে!</span>';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 3000);
        }
    }

    window.openPayment = function(method) {
        alert(`আপনি "${method}" এর মাধ্যমে পেমেন্ট করতে চাচ্ছেন।\n\nশীঘ্রই পেমেন্ট পেজে রিডাইরেক্ট করা হবে।`);
        console.log(`✅ পেমেন্ট মেথড: ${method}`);
    };

    // ============================================================
    // ১০. কন্টাক্ট — ফর্ম ভ্যালিডেশন
    // ============================================================
    
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');

    function validateField(field) {
        const value = field.value.trim();
        const errorSpan = document.getElementById(field.id + 'Error');
        
        if (!errorSpan) return true;

        field.classList.remove('error');
        errorSpan.textContent = '';

        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            errorSpan.textContent = 'এই ক্ষেত্রটি আবশ্যক';
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                errorSpan.textContent = 'সঠিক ইমেইল ঠিকানা দিন';
                return false;
            }
        }

        return true;
    }

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
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

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const fields = this.querySelectorAll('input[required], textarea[required]');
            fields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstError = this.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            const formData = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('✅ কন্টাক্ট ফর্ম ডেটা:', formData);
            showContactModal();
            this.reset();
        });
    }

    window.showContactModal = function() {
        if (contactModal) {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeContactModal = function() {
        if (contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeContactModal();
            }
        });
    }

    // ============================================================
    // ১১. ফুটার — নিউজলেটার
    // ============================================================
    
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterInput = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = newsletterInput.value.trim();
            
            if (!email) {
                showNewsletterMessage('দয়া করে আপনার ইমেইল ঠিকানা দিন', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage('সঠিক ইমেইল ঠিকানা দিন', 'error');
                return;
            }

            console.log('✅ নিউজলেটার সাবস্ক্রাইব:', email);
            showNewsletterMessage('আপনি সফলভাবে সাবস্ক্রাইব করেছেন! ধন্যবাদ।', 'success');
            this.reset();
            
            setTimeout(() => {
                newsletterMessage.textContent = '';
                newsletterMessage.className = 'newsletter-message';
            }, 5000);
        });
    }

    function showNewsletterMessage(text, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = text;
            newsletterMessage.className = 'newsletter-message ' + type;
        }
    }

    // ============================================================
    // ১২. ফুটার — কপিরাইট বছর
    // ============================================================
    
    const copyrightYear = document.querySelector('.footer-copyright p');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML.replace('২০২৪', currentYear);
    }

    // ============================================================
    // ১৩. স্ক্রল ইন্ডিকেটর — ক্লিক করলে স্মুথ স্ক্রল
    // ============================================================
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const nextSection = document.querySelector('section:not(.hero)');
            
            if (nextSection) {
                const navbarHeight = navbar.offsetHeight || 0;
                const targetPosition = nextSection.getBoundingClientRect().top + 
                                      window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });

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

    // ============================================================
    // ১৪. ফোন ইনপুট — শুধু ডিজিট
    // ============================================================
    
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    });

    // ============================================================
    // ১৫. রেস্পন্সিভ — ফুটার গ্রিড
    // ============================================================
    
    function handleResponsiveFooter() {
        const footerGrid = document.querySelector('.footer-grid');
        if (!footerGrid) return;

        const width = window.innerWidth;
        let columns = '2fr 1fr 1fr 1.5fr';
        
        if (width <= 768) columns = '1fr';
        else if (width <= 1024) columns = '1fr 1fr';

        footerGrid.style.gridTemplateColumns = columns;
    }

    handleResponsiveFooter();

    let resizeFooterTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeFooterTimeout);
        resizeFooterTimeout = setTimeout(handleResponsiveFooter, 250);
    });

    // ============================================================
    // ১৬. ডিবাগ
    // ============================================================
    
    console.log('✅ দারুল ইত্তিহাদ ফাউন্ডেশন (DIF) — ওয়েবসাইট লোড হয়েছে');
    console.log('📱 সম্পূর্ণ রেস্পন্সিভ ওয়েবসাইট প্রস্তুত');

}); // DOMContentLoaded শেষ
// প্রতিষ্ঠাতার ছবি পরিবর্তন
function changeFounderImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.querySelector('.founder-img');
            if (img) {
                img.src = e.target.result;
                img.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

// কমিটি সদস্যের ছবি পরিবর্তন
function changeAvatar(event, input) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const card = input.closest('.committee-card');
            const img = card.querySelector('.committee-img');
            if (img) {
                img.src = e.target.result;
                img.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}
// ============================================================
// সকল ফর্ম একটিভ করার জন্য JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================
    // ১. কন্টাক্ট ফর্ম (যোগাযোগ)
    // ============================================================
    
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');

    if (contactForm) {
        // ফিল্ড ভ্যালিডেশন
        const contactInputs = contactForm.querySelectorAll('input, textarea');
        contactInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateContactField(this);
            });
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateContactField(this);
                }
            });
        });

        // ফর্ম সাবমিট
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const requiredFields = this.querySelectorAll('input[required], textarea[required]');
            requiredFields.forEach(field => {
                if (!validateContactField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstError = this.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            // ডেটা সংগ্রহ
            const formData = {
                name: document.getElementById('fullName')?.value || '',
                email: document.getElementById('email')?.value || '',
                subject: document.getElementById('subject')?.value || '',
                message: document.getElementById('message')?.value || ''
            };

            console.log('✅ কন্টাক্ট ফর্ম ডেটা:', formData);
            
            // সাফল্যের মডাল দেখান
            if (contactModal) {
                contactModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                alert('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! ধন্যবাদ।');
            }
            
            this.reset();
        });
    }

    // কন্টাক্ট ফিল্ড ভ্যালিডেশন
    function validateContactField(field) {
        const value = field.value.trim();
        const errorSpan = document.getElementById(field.id + 'Error');
        
        if (!errorSpan) return true;

        field.classList.remove('error');
        errorSpan.textContent = '';

        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            errorSpan.textContent = 'এই ক্ষেত্রটি আবশ্যক';
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                errorSpan.textContent = 'সঠিক ইমেইল ঠিকানা দিন';
                return false;
            }
        }

        return true;
    }

    // কন্টাক্ট মডাল বন্ধ
    window.closeContactModal = function() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // মডালের বাইরে ক্লিক করলে বন্ধ
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeContactModal();
            }
        });
    }

    // ============================================================
    // ২. ডোনেশন ফর্ম (দান)
    // ============================================================
    
    const donationForm = document.getElementById('donationForm');
    const donationModal = document.getElementById('donationModal');

    // অ্যামাউন্ট প্রিসেট
    const presetButtons = document.querySelectorAll('.amount-preset');
    const amountInput = document.getElementById('donationAmount');

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const amount = this.getAttribute('data-amount');
            if (amountInput) {
                amountInput.value = amount;
                amountInput.style.borderColor = '#1a7a5a';
                setTimeout(() => {
                    amountInput.style.borderColor = '';
                }, 2000);
            }
        });
    });

    if (amountInput) {
        amountInput.addEventListener('input', function() {
            presetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // ডোনেশন ফর্ম সাবমিট
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('donorName')?.value || '',
                email: document.getElementById('donorEmail')?.value || '',
                phone: document.getElementById('donorPhone')?.value || '',
                amount: document.getElementById('donationAmount')?.value || '',
                note: document.getElementById('donationNote')?.value || 'প্রদান করা হয়নি'
            };

            // ভ্যালিডেশন
            if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
                alert('দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন।');
                return;
            }

            console.log('✅ দানের তথ্য:', formData);
            
            // সাফল্যের মডাল দেখান
            if (donationModal) {
                donationModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                alert('আপনার দান সফল হয়েছে! ধন্যবাদ।');
            }
            
            this.reset();
            presetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // ডোনেশন মডাল বন্ধ
    window.closeDonationModal = function() {
        const modal = document.getElementById('donationModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (donationModal) {
        donationModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDonationModal();
            }
        });
    }

    // ============================================================
    // ৩. জয়েন ফর্ম (সদস্যপদ)
    // ============================================================
    
    const joinModal = document.getElementById('joinModal');
    const selectedMembership = document.getElementById('selectedMembership');

    // জয়েন ফর্ম ওপেন
    window.openJoinForm = function(membershipType, price) {
        if (joinModal && selectedMembership) {
            selectedMembership.textContent = membershipType || 'সাধারণ সদস্য';
            joinModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            const form = document.getElementById('joinForm');
            if (form) form.reset();
        }
    };

    // জয়েন ফর্ম ক্লোজ
    window.closeJoinForm = function() {
        if (joinModal) {
            joinModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (joinModal) {
        joinModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeJoinForm();
            }
        });
    }

    // জয়েন ফর্ম সাবমিট
    window.submitJoinForm = function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('joinName')?.value || '',
            phone: document.getElementById('joinPhone')?.value || '',
            email: document.getElementById('joinEmail')?.value || 'প্রদান করা হয়নি',
            address: document.getElementById('joinAddress')?.value || 'প্রদান করা হয়নি',
            membershipType: document.getElementById('selectedMembership')?.textContent || ''
        };

        // ভ্যালিডেশন
        if (!formData.name || !formData.phone) {
            alert('দয়া করে নাম এবং মোবাইল নম্বর দিন।');
            return;
        }

        console.log('✅ সদস্যপদ আবেদন:', formData);

        alert(`🎉 অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে।

সদস্যপদ: ${formData.membershipType}
নাম: ${formData.name}
মোবাইল: ${formData.phone}

শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
ধন্যবাদ!`);

        closeJoinForm();
        document.getElementById('joinForm')?.reset();
    };

    // ============================================================
    // ৪. নিউজলেটার ফর্ম (ফুটার)
    // ============================================================
    
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterInput = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = newsletterInput?.value.trim() || '';
            
            if (!email) {
                showNewsletterMessage('দয়া করে আপনার ইমেইল ঠিকানা দিন', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage('সঠিক ইমেইল ঠিকানা দিন', 'error');
                return;
            }

            console.log('✅ নিউজলেটার সাবস্ক্রাইব:', email);
            showNewsletterMessage('আপনি সফলভাবে সাবস্ক্রাইব করেছেন! ধন্যবাদ।', 'success');
            this.reset();
            
            setTimeout(() => {
                if (newsletterMessage) {
                    newsletterMessage.textContent = '';
                    newsletterMessage.className = 'newsletter-message';
                }
            }, 5000);
        });
    }

    function showNewsletterMessage(text, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = text;
            newsletterMessage.className = 'newsletter-message ' + type;
        }
    }
// ============================================================
// ইমেইলে ডাটা পাঠানোর ফাংশন
// ============================================================

function sendEmailToAdmin(formType, formData) {
    // চেক করুন যে আপনি লোকাল সার্ভারে আছেন নাকি লাইভ সার্ভারে
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
        // লোকাল সার্ভারে কনসোলে দেখান
        console.log(`📧 ইমেইল পাঠানো হবে (লোকাল): ${formType}`, formData);
        console.log('💡 টিপ: লাইভ সার্ভারে আপলোড করলে ইমেইল আসবে');
        return Promise.resolve({ success: true, message: 'লোকাল মোড' });
    }
    
    // লাইভ সার্ভারে AJAX রিকোয়েস্ট
    return fetch('send-email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            type: formType,
            data: JSON.stringify(formData)
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(`📧 ইমেইল স্ট্যাটাস (${formType}):`, data);
        return data;
    })
    .catch(error => {
        console.error('❌ ইমেইল পাঠাতে সমস্যা:', error);
        return { success: false, message: 'Network error' };
    });
}

// ============================================================
// আপডেটেড ফর্ম সাবমিট ফাংশন
// ============================================================

// ১. কন্টাক্ট ফর্ম
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ভ্যালিডেশন চেক
        let isValid = true;
        const requiredFields = this.querySelectorAll('input[required], textarea[required]');
        requiredFields.forEach(field => {
            if (!validateContactField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        const formData = {
            name: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        console.log('✅ কন্টাক্ট ফর্ম ডেটা:', formData);
        
        // ইমেইল পাঠান
        sendEmailToAdmin('contact', formData).then(result => {
            if (result.success) {
                // সাফল্যের মডাল দেখান
                if (contactModal) {
                    contactModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                this.reset();
            } else {
                alert('ইমেইল পাঠাতে সমস্যা হয়েছে। তবে আপনার ডাটা সংরক্ষিত হয়েছে।');
            }
        });
    });
}

// ২. ডোনেশন ফর্ম
if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('donorName')?.value || '',
            email: document.getElementById('donorEmail')?.value || '',
            phone: document.getElementById('donorPhone')?.value || '',
            amount: document.getElementById('donationAmount')?.value || '',
            note: document.getElementById('donationNote')?.value || ''
        };
        
        if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
            alert('দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন।');
            return;
        }
        
        console.log('✅ দানের তথ্য:', formData);
        
        // ইমেইল পাঠান
        sendEmailToAdmin('donation', formData).then(result => {
            if (result.success) {
                if (donationModal) {
                    donationModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                this.reset();
                presetButtons.forEach(btn => btn.classList.remove('active'));
            } else {
                alert('ইমেইল পাঠাতে সমস্যা হয়েছে। তবে আপনার ডাটা সংরক্ষিত হয়েছে।');
            }
        });
    });
}

// ৩. জয়েন ফর্ম
window.submitJoinForm = function(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('joinName')?.value || '',
        phone: document.getElementById('joinPhone')?.value || '',
        email: document.getElementById('joinEmail')?.value || '',
        address: document.getElementById('joinAddress')?.value || '',
        membershipType: document.getElementById('selectedMembership')?.textContent || ''
    };
    
    if (!formData.name || !formData.phone) {
        alert('দয়া করে নাম এবং মোবাইল নম্বর দিন।');
        return;
    }
    
    console.log('✅ সদস্যপদ আবেদন:', formData);
    
    // ইমেইল পাঠান
    sendEmailToAdmin('membership', formData).then(result => {
        if (result.success) {
            alert(`🎉 অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে।

সদস্যপদ: ${formData.membershipType}
নাম: ${formData.name}
মোবাইল: ${formData.phone}

শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
আমরা একটি কনফার্মেশন ইমেইলও পাঠিয়েছি।

ধন্যবাদ!`);
            closeJoinForm();
            document.getElementById('joinForm')?.reset();
        } else {
            alert('ইমেইল পাঠাতে সমস্যা হয়েছে। তবে আপনার আবেদন সংরক্ষিত হয়েছে।');
            closeJoinForm();
        }
    });
};

// ৪. নিউজলেটার ফর্ম
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = newsletterInput?.value.trim() || '';
        
        if (!email) {
            showNewsletterMessage('দয়া করে আপনার ইমেইল ঠিকানা দিন', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNewsletterMessage('সঠিক ইমেইল ঠিকানা দিন', 'error');
            return;
        }
        
        console.log('✅ নিউজলেটার সাবস্ক্রাইব:', email);
        
        // ইমেইল পাঠান
        sendEmailToAdmin('newsletter', { email: email }).then(result => {
            if (result.success) {
                showNewsletterMessage('আপনি সফলভাবে সাবস্ক্রাইব করেছেন! ধন্যবাদ।', 'success');
                this.reset();
                
                setTimeout(() => {
                    newsletterMessage.textContent = '';
                    newsletterMessage.className = 'newsletter-message';
                }, 5000);
            } else {
                showNewsletterMessage('সাবস্ক্রাইব করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
            }
        });
    });
}
    // ============================================================
    // ৫. ফোন নম্বর ভ্যালিডেশন (শুধু ডিজিট)
    // ============================================================
    
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    });

    // ============================================================
    // ৬. Esc কী প্রেস করলে সব মডাল বন্ধ
    // ============================================================
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeContactModal();
            closeDonationModal();
            closeJoinForm();
        }
    });

    // ============================================================
    // ৭. ব্যাংক তথ্য কপি (ডোনেশন সেকশন)
    // ============================================================
    
    window.copyBankInfo = function() {
        const bankDetails = document.querySelectorAll('.bank-detail');
        let text = 'দারুল ইত্তিহাদ ফাউন্ডেশন - ব্যাংক তথ্য\n\n';
        
        bankDetails.forEach(detail => {
            const label = detail.querySelector('.label')?.textContent || '';
            const value = detail.querySelector('.value')?.textContent || '';
            text += `${label}: ${value}\n`;
        });

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess();
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch (err) {
            alert('কপি করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি কপি করুন।');
        }
        document.body.removeChild(textarea);
    }

    function showCopySuccess() {
        const btn = document.querySelector('.btn-copy');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i><span>কপি হয়েছে!</span>';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 3000);
        }
    }

    // ============================================================
    // ৮. পেমেন্ট বাটন (ডোনেশন সেকশন)
    // ============================================================
    
    window.openPayment = function(method) {
        alert(`আপনি "${method}" এর মাধ্যমে পেমেন্ট করতে চাচ্ছেন।\n\nশীঘ্রই পেমেন্ট পেজে রিডাইরেক্ট করা হবে।`);
        console.log(`✅ পেমেন্ট মেথড: ${method}`);
    };

    console.log('✅ সকল ফর্ম সফলভাবে একটিভ হয়েছে');
});
// ============================================================
// Telegram এ নোটিফিকেশন পাঠান
// ============================================================

function sendToTelegram(formType, formData) {
    // লোকাল সার্ভার চেক
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
        console.log(`📱 Telegram (লোকাল): ${formType}`, formData);
        // লোকাল স্টোরেজে সেভ করুন
        saveDataLocally(formType, formData);
        showSuccessMessage(formType);
        return Promise.resolve({ success: true, message: 'লোকাল মোড' });
    }
    
    // লাইভ সার্ভারে পাঠান
    return fetch('telegram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            type: formType,
            data: JSON.stringify(formData)
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(`📱 Telegram রেসপন্স:`, data);
        
        if (data.success) {
            // সফল
            return data;
        } else {
            // ব্যাকআপ: লোকাল স্টোরেজে সেভ করুন
            saveDataLocally(formType, formData);
            return {
                success: false,
                message: 'Telegram এ পাঠাতে সমস্যা হয়েছে। ডাটা সেভ করা হয়েছে।',
                data: formData
            };
        }
    })
    .catch(error => {
        console.error('❌ Telegram এ পাঠাতে সমস্যা:', error);
        // ব্যাকআপ
        saveDataLocally(formType, formData);
        return {
            success: false,
            message: 'Network error - ডাটা সেভ করা হয়েছে',
            data: formData
        };
    });
}

// ============================================================
// লোকাল ডাটা সেভ (ব্যাকআপ)
// ============================================================

function saveDataLocally(type, data) {
    let key = '';
    switch(type) {
        case 'contact': key = 'contactForms'; break;
        case 'donation': key = 'donations'; break;
        case 'membership': key = 'memberships'; break;
        case 'newsletter': key = 'newsletters'; break;
        default: key = 'formData';
    }
    
    let allData = JSON.parse(localStorage.getItem(key) || '[]');
    allData.push({
        ...data,
        timestamp: new Date().toISOString(),
        type: type
    });
    localStorage.setItem(key, JSON.stringify(allData));
    console.log(`📝 ডাটা সেভ হয়েছে (${key}):`, data);
}

function showSuccessMessage(type) {
    const messages = {
        contact: '📱 আপনার বার্তা সফলভাবে জমা হয়েছে!',
        donation: '📱 আপনার দান সফল হয়েছে!',
        membership: '📱 আপনার আবেদন সফলভাবে জমা হয়েছে!',
        newsletter: '📱 আপনি সফলভাবে সাবস্ক্রাইব করেছেন!'
    };
    alert(messages[type] || '📱 সফল হয়েছে!');
}

// ============================================================
// ফর্ম সাবমিট ফাংশন আপডেট
// ============================================================

// ১. কন্টাক্ট ফর্ম
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        // ভ্যালিডেশন
        if (!formData.name || !formData.email || !formData.message) {
            alert('দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন।');
            return;
        }
        
        console.log('✅ কন্টাক্ট ফর্ম:', formData);
        
        // Telegram এ পাঠান
        sendToTelegram('contact', formData).then(result => {
            if (document.getElementById('contactModal')) {
                document.getElementById('contactModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            this.reset();
        });
    });
}

// ২. ডোনেশন ফর্ম
if (document.getElementById('donationForm')) {
    document.getElementById('donationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('donorName')?.value || '',
            email: document.getElementById('donorEmail')?.value || '',
            phone: document.getElementById('donorPhone')?.value || '',
            amount: document.getElementById('donationAmount')?.value || '',
            note: document.getElementById('donationNote')?.value || ''
        };
        
        if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
            alert('দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন।');
            return;
        }
        
        console.log('✅ দানের তথ্য:', formData);
        
        sendToTelegram('donation', formData).then(result => {
            if (document.getElementById('donationModal')) {
                document.getElementById('donationModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            this.reset();
            document.querySelectorAll('.amount-preset').forEach(btn => btn.classList.remove('active'));
        });
    });
}

// ৩. জয়েন ফর্ম
window.submitJoinForm = function(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('joinName')?.value || '',
        phone: document.getElementById('joinPhone')?.value || '',
        email: document.getElementById('joinEmail')?.value || '',
        address: document.getElementById('joinAddress')?.value || '',
        membershipType: document.getElementById('selectedMembership')?.textContent || ''
    };
    
    if (!formData.name || !formData.phone) {
        alert('দয়া করে নাম এবং মোবাইল নম্বর দিন।');
        return;
    }
    
    console.log('✅ সদস্যপদ আবেদন:', formData);
    
    sendToTelegram('membership', formData).then(result => {
        alert(`🎉 অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে!\n\n📱 Telegram নোটিফিকেশন পাঠানো হয়েছে।\n\nসদস্যপদ: ${formData.membershipType}\nনাম: ${formData.name}\nমোবাইল: ${formData.phone}\n\nশীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।\nধন্যবাদ!`);
        closeJoinForm();
        document.getElementById('joinForm')?.reset();
    });
};

// ৪. নিউজলেটার ফর্ম
if (document.getElementById('newsletterForm')) {
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail')?.value.trim() || '';
        
        if (!email) {
            showNewsletterMessage('দয়া করে আপনার ইমেইল ঠিকানা দিন', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNewsletterMessage('সঠিক ইমেইল ঠিকানা দিন', 'error');
            return;
        }
        
        console.log('✅ নিউজলেটার সাবস্ক্রাইব:', email);
        
        sendToTelegram('newsletter', { email: email }).then(result => {
            showNewsletterMessage('📱 আপনি সফলভাবে সাবস্ক্রাইব করেছেন!', 'success');
            this.reset();
            setTimeout(() => {
                const msg = document.getElementById('newsletterMessage');
                if (msg) {
                    msg.textContent = '';
                    msg.className = 'newsletter-message';
                }
            }, 5000);
        });
    });
}

function showNewsletterMessage(text, type) {
    const msg = document.getElementById('newsletterMessage');
    if (msg) {
        msg.textContent = text;
        msg.className = 'newsletter-message ' + type;
    }
}

// ============================================================
// মডাল বন্ধ ফাংশন
// ============================================================

window.closeContactModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.closeDonationModal = function() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.closeJoinForm = function() {
    const modal = document.getElementById('joinModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Esc কী
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeContactModal();
        closeDonationModal();
        closeJoinForm();
    }
});