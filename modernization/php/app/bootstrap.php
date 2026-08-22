<?php
declare(strict_types=1);

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function database(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = $_ENV['DATABASE_DSN'] ?? getenv('DATABASE_DSN');
    $user = $_ENV['DATABASE_USER'] ?? getenv('DATABASE_USER');
    $password = $_ENV['DATABASE_PASSWORD'] ?? getenv('DATABASE_PASSWORD');
    if (!$dsn) {
        jsonResponse(['success' => false, 'error' => 'Database belum dikonfigurasi'], 503);
    }

    $pdo = new PDO($dsn, $user ?: null, $password ?: null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function startSecureSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax',
        'path' => '/',
    ]);
    session_start();
}

function requestMethod(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function requestBody(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        jsonResponse(['success' => false, 'error' => 'Payload JSON tidak valid'], 400);
    }
    return $body;
}

function authenticatedUser(): array
{
    startSecureSession();
    $userId = filter_var($_SESSION['user_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if (!$userId) {
        jsonResponse(['success' => false, 'error' => 'Autentikasi diperlukan'], 401);
    }

    $statement = database()->prepare('SELECT id, name, role, phone_verified FROM users WHERE id = :id LIMIT 1');
    $statement->execute([':id' => $userId]);
    $user = $statement->fetch();
    if (!$user) {
        $_SESSION = [];
        session_destroy();
        jsonResponse(['success' => false, 'error' => 'Sesi tidak valid'], 401);
    }
    return $user;
}

function requireCsrf(): void
{
    startSecureSession();
    $expected = $_SESSION['csrf_token'] ?? '';
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($expected) || $expected === '' || !is_string($provided) || !hash_equals($expected, $provided)) {
        jsonResponse(['success' => false, 'error' => 'CSRF token tidak valid'], 419);
    }
}

function csrfToken(): string
{
    startSecureSession();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function listingIdFromRequest(): int
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if (!$id) {
        $body = requestBody();
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    }
    if (!$id) {
        jsonResponse(['success' => false, 'error' => 'ID listing tidak valid'], 422);
    }
    return (int) $id;
}

function assertListingOwner(int $listingId, array $user): void
{
    if (($user['role'] ?? '') === 'admin') {
        return;
    }
    $statement = database()->prepare('SELECT id FROM listings WHERE id = :id AND seller_id = :seller_id LIMIT 1');
    $statement->execute([':id' => $listingId, ':seller_id' => $user['id']]);
    if (!$statement->fetch()) {
        jsonResponse(['success' => false, 'error' => 'Akses tidak diizinkan'], 403);
    }
}
