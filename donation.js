/* donation.js */
// ============================================================
//  donation.js — দারুল ইত্তিহাদ ফাউন্ডেশন
//  ডোনেশন সেকশনের জন্য সম্পূর্ণ JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ১. অ্যামাউন্ট প্রিসেট =====
    const presetButtons = document.querySelectorAll('.amount-preset');
    const amountInput = document.getElementById('donationAmount');

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            // অ্যাক্টিভ ক্লাস টগল
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // অ্যামাউন্ট ইনপুটে সেট
            const amount = this.getAttribute('data-amount');
            if (amountInput) {
                amountInput.value = amount;
                // ফোকাস ইফেক্ট
                amountInput.style.borderColor = '#1a7a5a';
                setTimeout(() => {
                    amountInput.style.borderColor = '';
                }, 2000);
            }
        });
    });

    // কাস্টম অ্যামাউন� ইনপুট
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            // প্রিসেট বাটন আনঅ্যাক্টিভ
            presetButtons.forEach(btn => btn.classList.remove('active'));
            if (this.value) {
                this.style.borderColor = '#1a7a5a';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 2000);
            }
        });
    }

    // ===== ২. ফর্ম সাবমিট =====
    const donationForm = document.getElementById('donationForm');

    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // ফর্ম ডেটা সংগ্রহ
            const formData = {
                name: document.getElementById('donorName').value,
                email: document.getElementById('donorEmail').value,
                phone: document.getElementById('donorPhone').value,
                amount: document.getElementById('donationAmount').value,
                note: document.getElementById('donationNote').value || 'প্রদান করা হয়নি'
            };

            // ভ্যালিডেশন
            if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
                alert('দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন।');
                return;
            }

            // কনসোলে লগ
            console.log('✅ দানের তথ্য:', formData);

            // সাফল্যের মডাল দেখান
            showModal();

            // ফর্ম রিসেট
            this.reset();
            presetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // ===== ৩. মডাল =====
    const modal = document.getElementById('successModal');

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

    // ===== ৪. ব্যাংক তথ্য কপি =====
    window.copyBankInfo = function() {
        const bankDetails = document.querySelectorAll('.bank-detail');
        let text = 'দারুল ইত্তিহাদ ফাউন্ডেশন - ব্যাংক তথ্য\n\n';
        
        bankDetails.forEach(detail => {
            const label = detail.querySelector('.label')?.textContent || '';
            const value = detail.querySelector('.value')?.textContent || '';
            text += `${label}: ${value}\n`;
        });

        // কপি
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

    // ===== ৫. পেমেন্ট বাটন =====
    window.openPayment = function(method) {
        alert(`আপনি "${method}" এর মাধ্যমে পেমেন্ট করতে চাচ্ছেন।\n\nশীঘ্রই পেমেন্ট পেজে রিডাইরেক্ট করা হবে।`);
        console.log(`✅ পেমেন্ট মেথড: ${method}`);
    };

    // ===== ৬. আরও লোড (স্মুথ স্ক্রল) =====
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

    // ===== ৭. ভ্যালিডেশন হেল্পার =====
    // ফোন নম্বর ফরম্যাট
    const phoneInput = document.getElementById('donorPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // শুধু ডিজিট অনুমোদন
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    }

    // ===== ৮. অ্যানিমেটেড কাউন্টার =====
    // ডোনেশন সেকশনে কোনো কাউন্টার থাকলে

    // ===== ডিবাগ =====
    console.log('✅ ডোনেশন সেকশন লোড হয়েছে');
});