<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed.'
    ]);
    exit;
}

$type = isset($_POST['type']) ? trim($_POST['type']) : '';
$data = isset($_POST['data']) ? $_POST['data'] : '';

$payload = [];
if (!empty($data)) {
    $decoded = json_decode($data, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $payload = $decoded;
    }
}

$adminEmail = 'saif387212@gmail.com';

function formatText($value) {
    return isset($value) ? trim((string)$value) : '';
}

function buildSubject($type) {
    $map = [
        'contact' => 'যোগাযোগ ফর্ম',
        'donation' => 'দান ফর্ম',
        'membership' => 'সদস্যপদ আবেদন',
        'newsletter' => 'নিউজলেটার সাবস্ক্রিপশন'
    ];
    return isset($map[$type]) ? $map[$type] : 'ফর্ম সাবমিশন';
}

function buildMessage($type, $payload) {
    if ($type === 'membership') {
        return sprintf(
            "সদস্যপদ আবেদন\n\n" .
            "সদস্যপদ: %s\n" .
            "নাম: %s\n" .
            "মোবাইল: %s\n" .
            "ইমেইল: %s\n" .
            "ঠিকানা: %s\n\n" .
            "সাবমিটের সময়: %s",
            formatText($payload['membershipType'] ?? ''),
            formatText($payload['name'] ?? ''),
            formatText($payload['phone'] ?? ''),
            formatText($payload['email'] ?? ''),
            formatText($payload['address'] ?? ''),
            date('Y-m-d H:i:s')
        );
    }

    if ($type === 'contact') {
        return sprintf(
            "যোগাযোগ ফর্ম\n\n" .
            "নাম: %s\n" .
            "ইমেইল: %s\n" .
            "মোবাইল: %s\n" .
            "বিষয়: %s\n" .
            "মেসেজ: %s\n\n" .
            "সাবমিটের সময়: %s",
            formatText($payload['name'] ?? ''),
            formatText($payload['email'] ?? ''),
            formatText($payload['phone'] ?? ''),
            formatText($payload['subject'] ?? ''),
            formatText($payload['message'] ?? ''),
            date('Y-m-d H:i:s')
        );
    }

    if ($type === 'donation') {
        return sprintf(
            "দান ফর্ম\n\n" .
            "নাম: %s\n" .
            "ইমেইল: %s\n" .
            "মোবাইল: %s\n" .
            "পরিমাণ: %s\n" .
            "সাবমিটের সময়: %s",
            formatText($payload['name'] ?? ''),
            formatText($payload['email'] ?? ''),
            formatText($payload['phone'] ?? ''),
            formatText($payload['amount'] ?? ''),
            date('Y-m-d H:i:s')
        );
    }

    if ($type === 'newsletter') {
        return sprintf(
            "নিউজলেটার সাবস্ক্রিপশন\n\n" .
            "ইমেইল: %s\n" .
            "সাবমিটের সময়: %s",
            formatText($payload['email'] ?? ''),
            date('Y-m-d H:i:s')
        );
    }

    $message = "ফর্ম ডেটা:\n\n";
    foreach ($payload as $key => $value) {
        $message .= "$key: $value\n";
    }
    $message .= "\nসাবমিটের সময়: " . date('Y-m-d H:i:s');
    return $message;
}

$subject = buildSubject($type);
$message = buildMessage($type, $payload);
$headers = [
    'From: no-reply@dif.org',
    'Reply-To: ' . (formatText($payload['email'] ?? '') !== '' ? $payload['email'] : $adminEmail),
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = mail($adminEmail, $subject, $message, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Email could not be sent. Please check server mail settings.'
    ]);
}
