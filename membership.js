// ============================================================
//  membership.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  সদস্যপদ সেকশনের জন্য সম্পূর্ণ JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. কার্ড অ্যানিমেশন (Intersection Observer) =====
    const cards = document.querySelectorAll('.membership-card');

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

        cards.forEach(card => {
            observer.observe(card);
        });
    } else {
        // ফ্যালব্যাক: সব কার্ড দেখান
        cards.forEach(card => {
            card.classList.add('visible');
        });
    }

    // ===== ২. মডাল ফর্ম =====
    // মডাল HTML তৈরি (ডাইনামিক)
    const modalHTML = `
        <div class="modal-overlay" id="joinModal">
            <div class="modal">
                <button class="modal-close" onclick="closeJoinForm()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-icon">
                    <i class="fas fa-handshake"></i>
                </div>
                <h3>সদস্যপদ আবেদন</h3>
                <p>
                    আপনি <span class="membership-type" id="selectedMembership">সাধারণ সদস্য</span>
                    সদস্যপদে যোগ দিতে চাচ্ছেন। নিচের ফর্মটি পূরণ করুন।
                </p>
                <form id="joinForm" onsubmit="submitJoinForm(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fullName">আপনার নাম *</label>
                            <input type="text" id="fullName" name="fullName" 
                                   placeholder="আপনার পূর্ণ নাম" required />
                        </div>
                        <div class="form-group">
                            <label for="phone">মোবাইল নম্বর *</label>
                            <input type="tel" id="phone" name="phone" 
                                   placeholder="০১XXXXXXXXX" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">ইমেইল ঠিকানা</label>
                        <input type="email" id="email" name="email" 
                               placeholder="আপনার ইমেইল" />
                    </div>
                    <div class="form-group">
                        <label for="address">ঠিকানা</label>
                        <textarea id="address" name="address" 
                                  placeholder="আপনার সম্পূর্ণ ঠিকানা"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="message">অতিরিক্ত তথ্য</label>
                        <textarea id="message" name="message" 
                                  placeholder="যদি কিছু জানাতে চান..."></textarea>
                    </div>
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-paper-plane"></i>
                        <span>আবেদন জমা দিন</span>
                    </button>
                </form>
            </div>
        </div>
    `;

    // মডাল যোগ করুন (যদি না থাকে)
    if (!document.getElementById('joinModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // ===== ৩. গ্লোবাল ফাংশন: মডাল খোলা =====
    window.openJoinForm = function(membershipType, price) {
        const modal = document.getElementById('joinModal');
        const selectedSpan = document.getElementById('selectedMembership');
        
        if (modal && selectedSpan) {
            selectedSpan.textContent = membershipType || 'সাধারণ সদস্য';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // ফর্ম রিসেট
            document.getElementById('joinForm').reset();
        }
    };

    // ===== ৪. গ্লোবাল ফাংশন: মডাল বন্ধ =====
    window.closeJoinForm = function() {
        const modal = document.getElementById('joinModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // ===== ৫. মডালের বাইরে ক্লিক করলে বন্ধ =====
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('joinModal');
        if (modal && modal.classList.contains('active')) {
            if (e.target === modal) {
                closeJoinForm();
            }
        }
    });

    // ===== ৬. Esc কী প্রেস করলে মডাল বন্ধ =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeJoinForm();
        }
    });

    // ===== ৭. ফর্ম সাবমিট =====
    window.submitJoinForm = function(event) {
        event.preventDefault();
        
        // ফর্ম ডেটা সংগ্রহ
        const formData = {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value || 'প্রদান করা হয়নি',
            address: document.getElementById('address').value || 'প্রদান করা হয়নি',
            message: document.getElementById('message').value || 'প্রদান করা হয়নি',
            membershipType: document.getElementById('selectedMembership').textContent
        };

        // কনসোলে লগ (ডেভেলপমেন্ট)
        console.log('✅ সদস্যপদ আবেদন:', formData);

        // সাফল্যের বার্তা
        alert(`
            🎉 অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে।

            সদস্যপদ: ${formData.membershipType}
            নাম: ${formData.name}
            মোবাইল: ${formData.phone}

            শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
            ধন্যবাদ!
        `);

        // মডাল বন্ধ
        closeJoinForm();
        
        // ফর্ম রিসেট
        document.getElementById('joinForm').reset();
    };

    // ===== ৮. বাটনে ক্লিক রিপল ইফেক্ট =====
    const joinButtons = document.querySelectorAll('.btn-join, .btn-cta');
    joinButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // রিপল ইফেক্ট তৈরি
            const ripple = document.createElement('span');
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
            
            const rect = this.getBoundingClientRect();
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

    // ===== ৯. রিপল অ্যানিমেশন স্টাইল যোগ করুন =====
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

    // ===== ১০. কাউন্টার অ্যানিমেশন (ঐচ্ছিক) =====
    // যদি পরিসংখ্যান থাকে তাহলে

    console.log('✅ মেম্বারশিপ সেকশন লোড হয়েছে');
});