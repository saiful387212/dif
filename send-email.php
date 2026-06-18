<?php
// ============================================================
// send-email.php - দারুল ইত্তিহাদ ফাউন্ডেশন
// সম্পূর্ণ কাজ করা ভার্সন (PHPMailer + Gmail SMTP)
// ============================================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// PHPMailer লোড করুন
require_once 'PHPMailer/PHPMailer.php';
require_once 'PHPMailer/SMTP.php';
require_once 'PHPMailer/Exception.php';

// CORS হেডার
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Error Reporting (ডিবাগের জন্য)
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';
    $data = json_decode($_POST['data'] ?? '{}', true);
    
    // ডাটা সেভ করুন (লোকাল স্টোরেজের জন্য)
    saveDataToFile($type, $data);
    
    if (empty($type) || empty($data)) {
        echo json_encode([
            'success' => false, 
            'message' => 'Invalid data',
            'type' => $type
        ]);
        exit;
    }
    
    $mail = new PHPMailer(true);
    
    try {
        // ----- Gmail SMTP সেটিংস -----
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'saif387212@gmail.com';     // আপনার Gmail
        $mail->Password   = 'xxxx xxxx xxxx xxxx';      // 🔑 App Password (16 ডিজিট)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        $mail->Encoding   = 'base64';
        
        // টাইমআউট বাড়ান
        $mail->Timeout = 30;
        
        // ----- প্রেরক ও প্রাপক -----
        $mail->setFrom('saif387212@gmail.com', 'দারুল ইত্তিহাদ ফাউন্ডেশন');
        $mail->addAddress('saif387212@gmail.com');  // আপনার ইমেইল
        $mail->addReplyTo(
            $data['email'] ?? 'saif387212@gmail.com', 
            $data['name'] ?? 'Visitor'
        );
        
        // ----- ইমেইল কন্টেন্ট -----
        $mail->isHTML(true);
        $mail->Subject = 'নতুন ফর্ম সাবমিট - ' . ucfirst($type) . ' - ' . date('d M Y');
        $mail->Body = buildEmailHTML($type, $data);
        $mail->AltBody = strip_tags($mail->Body);
        
        // ----- ইমেইল পাঠান -----
        $mail->send();
        
        echo json_encode([
            'success' => true,
            'message' => 'ইমেইল সফলভাবে পাঠানো হয়েছে',
            'to' => 'saif387212@gmail.com',
            'type' => $type,
            'data' => $data
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => "ইমেইল পাঠাতে সমস্যা: " . $mail->ErrorInfo,
            'error' => $e->getMessage(),
            'type' => $type,
            'data' => $data
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid request method'
    ]);
}

// ============================================================
// ডাটা ফাইলে সেভ করুন (ব্যাকআপ)
// ============================================================

function saveDataToFile($type, $data) {
    $filename = 'form_data_' . date('Y-m-d') . '.txt';
    $entry = "\n" . str_repeat('=', 50) . "\n";
    $entry .= "ফর্ম: " . $type . "\n";
    $entry .= "সময়: " . date('Y-m-d H:i:s') . "\n";
    $entry .= "ডাটা:\n";
    foreach ($data as $key => $value) {
        $entry .= "  " . $key . ": " . $value . "\n";
    }
    $entry .= str_repeat('=', 50) . "\n";
    
    file_put_contents($filename, $entry, FILE_APPEND | LOCK_EX);
}

// ============================================================
// HTML ইমেইল বডি
// ============================================================

function buildEmailHTML($type, $data) {
    $badgeColors = [
        'contact' => ['bg' => '#e3f2fd', 'color' => '#1565c0'],
        'donation' => ['bg' => '#e8f5e9', 'color' => '#1a7a5a'],
        'membership' => ['bg' => '#fff3e0', 'color' => '#e65100'],
        'newsletter' => ['bg' => '#fce4ec', 'color' => '#c62828']
    ];
    
    $style = $badgeColors[$type] ?? ['bg' => '#f0f4f8', 'color' => '#0a1a2b'];
    
    $html = '
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>নতুন ফর্ম সাবমিট</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f0f4f8; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 3px solid #1a7a5a; padding-bottom: 20px; margin-bottom: 25px; }
            .header h1 { color: #0a1a2b; margin: 0; font-size: 24px; }
            .header p { color: #1a7a5a; font-weight: 600; }
            .badge { display: inline-block; padding: 4px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; background: ' . $style['bg'] . '; color: ' . $style['color'] . '; }
            .field { margin-bottom: 12px; padding: 12px 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #1a7a5a; }
            .field-label { font-weight: 600; color: #0a1a2b; display: block; margin-bottom: 4px; font-size: 13px; }
            .field-value { color: #2d3e4f; font-size: 15px; }
            .footer { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e8f5e9; color: #5a7a8a; font-size: 12px; }
            .time { color: #5a7a8a; font-size: 13px; }
            .highlight { background: #fff3cd; padding: 10px; border-radius: 8px; border-left: 4px solid #ffc107; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 নতুন ফর্ম সাবমিট</h1>
                <p>🏛️ দারুল ইত্তিহাদ ফাউন্ডেশন</p>
            </div>
            
            <p><strong>ফর্ম:</strong> <span class="badge">' . ucfirst($type) . '</span></p>
            <p class="time">📅 সময়: ' . date('d M Y, h:i A') . '</p>
            <hr style="border: none; border-top: 1px solid #e8f5e9; margin: 15px 0;">
            
            <h3 style="color: #0a1a2b;">📝 ফর্মের তথ্য</h3>';
    
    foreach ($data as $key => $value) {
        $label = ucfirst(str_replace('_', ' ', $key));
        $displayValue = $value ?: 'প্রদান করা হয়নি';
        $html .= '
            <div class="field">
                <span class="field-label">' . $label . '</span>
                <span class="field-value">' . htmlspecialchars($displayValue) . '</span>
            </div>';
    }
    
    $html .= '
            <hr style="border: none; border-top: 1px solid #e8f5e9; margin: 20px 0;">
            <div class="highlight">
                <p style="margin: 0; color: #856404;">📌 এই ইমেইলটি স্বয়ংক্রিয়ভাবে দারুল ইত্তিহাদ ফাউন্ডেশনের ওয়েবসাইট থেকে পাঠানো হয়েছে।</p>
            </div>
            <div class="footer">
                <p>© ' . date('Y') . ' দারুল ইত্তিহাদ ফাউন্ডেশন (DIF) | সর্বস্বত্ব সংরক্ষিত</p>
                <p style="font-size: 11px;">📧 saif387212@gmail.com | 🌐 darulittihad.org</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}
?>