<?php
// ============================================================
// telegram.php - দারুল ইত্তিহাদ ফাউন্ডেশন
// Telegram Bot Notification
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ----- আপনার Telegram Bot তথ্য -----
$botToken = '8806461153:AAFBU6sWeheDDmj1AocdzeA4unyohc8Luvc';  // আপনার Bot Token
$chatId = '6814725651';  // আপনার Chat ID

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';
    $data = json_decode($_POST['data'] ?? '{}', true);
    
    if (empty($type) || empty($data)) {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
        exit;
    }
    
    // ----- মেসেজ তৈরি করুন -----
    $message = buildTelegramMessage($type, $data);
    
    // ----- Telegram এ পাঠান -----
    $result = sendToTelegram($botToken, $chatId, $message);
    
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'message' => 'Telegram নোটিফিকেশন পাঠানো হয়েছে',
            'type' => $type
        ]);
    } else {
        // ব্যাকআপ: ডাটা ফাইলে সেভ করুন
        saveDataToFile($type, $data);
        
        echo json_encode([
            'success' => false,
            'message' => 'Telegram এ পাঠাতে সমস্যা হয়েছে। তবে ডাটা সংরক্ষিত হয়েছে।',
            'error' => $result['error'] ?? ''
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// ============================================================
// Telegram এ মেসেজ পাঠান
// ============================================================

function sendToTelegram($botToken, $chatId, $message) {
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    
    $postData = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return ['success' => true];
    } else {
        return [
            'success' => false,
            'error' => $curlError ?: "HTTP Error: {$httpCode}"
        ];
    }
}

// ============================================================
// Telegram মেসেজ তৈরি করুন
// ============================================================

function buildTelegramMessage($type, $data) {
    $emoji = [
        'contact' => '📧',
        'donation' => '💰',
        'membership' => '👤',
        'newsletter' => '📨'
    ];
    
    $em = $emoji[$type] ?? '📋';
    $typeLabel = ucfirst($type);
    
    $message = "{$em} <b>নতুন ফর্ম সাবমিট!</b>\n";
    $message .= "━━━━━━━━━━━━━━━━\n";
    $message .= "📋 <b>ফর্ম:</b> {$typeLabel}\n";
    $message .= "🕐 <b>সময়:</b> " . date('d M Y, h:i A') . "\n";
    $message .= "━━━━━━━━━━━━━━━━\n\n";
    
    // ফর্ম ডাটা
    foreach ($data as $key => $value) {
        $label = ucfirst(str_replace('_', ' ', $key));
        $displayValue = $value ?: 'প্রদান করা হয়নি';
        $message .= "📌 <b>{$label}:</b> <code>" . htmlspecialchars($displayValue) . "</code>\n";
    }
    
    $message .= "\n━━━━━━━━━━━━━━━━\n";
    $message .= "🏛️ <b>দারুল ইত্তিহাদ ফাউন্ডেশন</b>\n";
    $message .= "📩 <i>স্বয়ংক্রিয় নোটিফিকেশন</i>";
    
    return $message;
}

// ============================================================
// ডাটা ফাইলে সেভ করুন (ব্যাকআপ)
// ============================================================

function saveDataToFile($type, $data) {
    $filename = 'form_data_' . date('Y-m-d') . '.txt';
    $entry = "\n" . str_repeat('=', 50) . "\n";
    $entry .= "ফর্ম: " . $type . "\n";
    $entry .= "সময়: " . date('Y-m-d H:i:s') . "\n";
    $entry .= "আইপি: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
    $entry .= "ডাটা:\n";
    foreach ($data as $key => $value) {
        $entry .= "  " . $key . ": " . $value . "\n";
    }
    $entry .= str_repeat('=', 50) . "\n";
    
    file_put_contents($filename, $entry, FILE_APPEND | LOCK_EX);
}
?>