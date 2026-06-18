<?php
// send-email.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';
    $data = json_decode($_POST['data'] ?? '{}', true);
    
    // আপনার ইমেইল (আপনার দেওয়া ইমেইল)
    $to = "saif387212@gmail.com";
    $subject = "নতুন ফর্ম সাবমিট - দারুল ইত্তিহাদ ফাউন্ডেশন";
    
    // হেডার তৈরি
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: noreply@darulittihad.org\r\n";
    $headers .= "Reply-To: noreply@darulittihad.org\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // HTML ইমেইল বডি তৈরি
    $message = '
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>নতুন ফর্ম সাবমিট</title>
        <style>
            body { font-family: "Hind Siliguri", "Noto Sans Bengali", sans-serif; background: #f0f4f8; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { text-align: center; border-bottom: 3px solid #1a7a5a; padding-bottom: 20px; margin-bottom: 25px; }
            .header h1 { color: #0a1a2b; margin: 0; font-size: 24px; }
            .header .logo { color: #1a7a5a; font-size: 14px; }
            .field { margin-bottom: 15px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #1a7a5a; }
            .field-label { font-weight: 600; color: #0a1a2b; display: block; margin-bottom: 4px; }
            .field-value { color: #2d3e4f; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
            .badge-contact { background: #e3f2fd; color: #1565c0; }
            .badge-donation { background: #e8f5e9; color: #1a7a5a; }
            .badge-membership { background: #fff3e0; color: #e65100; }
            .badge-newsletter { background: #fce4ec; color: #c62828; }
            .footer { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e8f5e9; color: #5a7a8a; font-size: 12px; }
            .time { color: #5a7a8a; font-size: 13px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 নতুন ফর্ম সাবমিট</h1>
                <p class="logo">দারুল ইত্তিহাদ ফাউন্ডেশন (DIF)</p>
            </div>
            
            <p><strong>ফর্মের ধরন:</strong> <span class="badge badge-' . $type . '">' . ucfirst($type) . '</span></p>
            <p class="time">📅 সাবমিটের সময়: ' . date('d M Y, h:i A') . '</p>
            <hr style="border: none; border-top: 1px solid #e8f5e9; margin: 15px 0;">';

    // ফর্ম টাইপ অনুযায়ী ডাটা দেখান
    switch ($type) {
        case 'contact':
            $message .= '
            <h3 style="color: #0a1a2b;">📧 যোগাযোগের তথ্য</h3>
            <div class="field">
                <span class="field-label">👤 নাম</span>
                <span class="field-value">' . htmlspecialchars($data['name'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📧 ইমেইল</span>
                <span class="field-value">' . htmlspecialchars($data['email'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📱 মোবাইল</span>
                <span class="field-value">' . htmlspecialchars($data['phone'] ?? 'প্রদান করা হয়নি') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📌 বিষয়</span>
                <span class="field-value">' . htmlspecialchars($data['subject'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">💬 বার্তা</span>
                <span class="field-value">' . nl2br(htmlspecialchars($data['message'] ?? '')) . '</span>
            </div>';
            break;
            
        case 'donation':
            $message .= '
            <h3 style="color: #0a1a2b;">💰 দানের তথ্য</h3>
            <div class="field">
                <span class="field-label">👤 নাম</span>
                <span class="field-value">' . htmlspecialchars($data['name'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📧 ইমেইল</span>
                <span class="field-value">' . htmlspecialchars($data['email'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📱 মোবাইল</span>
                <span class="field-value">' . htmlspecialchars($data['phone'] ?? '') . '</span>
            </div>
            <div class="field" style="border-left-color: #fbbf24;">
                <span class="field-label">💵 দানের পরিমাণ</span>
                <span class="field-value" style="font-size: 20px; color: #1a7a5a; font-weight: 700;">' . htmlspecialchars($data['amount'] ?? '0') . ' টাকা</span>
            </div>
            <div class="field">
                <span class="field-label">📝 মন্তব্য</span>
                <span class="field-value">' . nl2br(htmlspecialchars($data['note'] ?? 'প্রদান করা হয়নি')) . '</span>
            </div>';
            break;
            
        case 'membership':
            $message .= '
            <h3 style="color: #0a1a2b;">👤 সদস্যপদ আবেদন</h3>
            <div class="field" style="border-left-color: #f59e0b;">
                <span class="field-label">🏷️ সদস্যপদ</span>
                <span class="field-value" style="font-weight: 700; color: #e65100;">' . htmlspecialchars($data['membershipType'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">👤 নাম</span>
                <span class="field-value">' . htmlspecialchars($data['name'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📱 মোবাইল</span>
                <span class="field-value">' . htmlspecialchars($data['phone'] ?? '') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📧 ইমেইল</span>
                <span class="field-value">' . htmlspecialchars($data['email'] ?? 'প্রদান করা হয়নি') . '</span>
            </div>
            <div class="field">
                <span class="field-label">📍 ঠিকানা</span>
                <span class="field-value">' . nl2br(htmlspecialchars($data['address'] ?? 'প্রদান করা হয়নি')) . '</span>
            </div>';
            break;
            
        case 'newsletter':
            $message .= '
            <h3 style="color: #0a1a2b;">📨 নিউজলেটার সাবস্ক্রিপশন</h3>
            <div class="field" style="border-left-color: #ec407a;">
                <span class="field-label">📧 ইমেইল</span>
                <span class="field-value" style="font-size: 18px; font-weight: 600;">' . htmlspecialchars($data['email'] ?? '') . '</span>
            </div>';
            break;
            
        default:
            $message .= '<p style="color: #e74c3c;">অজানা ফর্মের ধরন</p>';
    }

    $message .= '
            <hr style="border: none; border-top: 1px solid #e8f5e9; margin: 20px 0;">
            <div class="footer">
                <p>📩 এই ইমেইলটি দারুল ইত্তিহাদ ফাউন্ডেশনের ওয়েবসাইট থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।</p>
                <p>© ' . date('Y') . ' দারুল ইত্তিহাদ ফাউন্ডেশন (DIF) | সর্বস্বত্ব সংরক্ষিত</p>
            </div>
        </div>
    </body>
    </html>';

    // ইমেইল পাঠান
    $mailSent = mail($to, $subject, $message, $headers);
    
    // রেসপন্স
    if ($mailSent) {
        echo json_encode([
            'success' => true, 
            'message' => 'ইমেইল সফলভাবে পাঠানো হয়েছে',
            'to' => $to
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'ইমেইল পাঠাতে সমস্যা হয়েছে। দয়া করে চেক করুন যে আপনার হোস্টিং মেইল ফাংশন সাপোর্ট করে কিনা।'
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid request method'
    ]);
}
?>