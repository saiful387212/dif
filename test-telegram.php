<?php
// test-telegram.php - টেস্ট ফাইল

$botToken = '8806461153:AAFBU6sWeheDDmj1AocdzeA4unyohc8Luvc';
$chatId = '6814725651';

$message = "✅ টেস্ট মেসেজ!\n\nআপনার Telegram Bot সঠিকভাবে কাজ করছে।\n🕐 " . date('Y-m-d H:i:s');

$url = "https://api.telegram.org/bot{$botToken}/sendMessage";

$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ টেস্ট মেসেজ সফল! আপনার Telegram চেক করুন।";
} else {
    echo "❌ সমস্যা হয়েছে: " . $response;
}
?>