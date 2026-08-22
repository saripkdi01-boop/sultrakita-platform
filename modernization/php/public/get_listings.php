<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function queryString(string $key, int $maxLength = 120): ?string
{
    $value = filter_input(INPUT_GET, $key, FILTER_UNSAFE_RAW);
    if ($value === null || $value === false) {
        return null;
    }
    $value = trim((string) $value);
    return $value === '' ? null : mb_substr($value, 0, $maxLength);
}

$category = queryString('category', 80);
$district = queryString('district', 80);
$minPrice = filter_input(INPUT_GET, 'min_price', FILTER_VALIDATE_FLOAT);
$maxPrice = filter_input(INPUT_GET, 'max_price', FILTER_VALIDATE_FLOAT);
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1, 'max_range' => 100000]]);
$limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 12, 'min_range' => 1, 'max_range' => 50]]);

if ($minPrice !== null && $minPrice !== false && $minPrice < 0) {
    respond(['success' => false, 'error' => 'min_price tidak valid'], 422);
}
if ($maxPrice !== null && $maxPrice !== false && $maxPrice < 0) {
    respond(['success' => false, 'error' => 'max_price tidak valid'], 422);
}
if ($minPrice !== null && $minPrice !== false && $maxPrice !== null && $maxPrice !== false && $minPrice > $maxPrice) {
    respond(['success' => false, 'error' => 'Rentang harga tidak valid'], 422);
}

try {
    // In production, create this PDO in app/bootstrap.php and load credentials from environment variables.
    $dsn = $_ENV['DATABASE_DSN'] ?? getenv('DATABASE_DSN');
    $dbUser = $_ENV['DATABASE_USER'] ?? getenv('DATABASE_USER');
    $dbPassword = $_ENV['DATABASE_PASSWORD'] ?? getenv('DATABASE_PASSWORD');
    if (!$dsn) {
        respond(['success' => false, 'error' => 'Database belum dikonfigurasi'], 503);
    }

    $pdo = new PDO($dsn, $dbUser ?: null, $dbPassword ?: null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $where = ["l.status = 'active'"];
    $params = [];
    if ($category !== null) {
        $where[] = 'c.slug = :category';
        $params[':category'] = $category;
    }
    if ($district !== null) {
        $where[] = 'l.district = :district';
        $params[':district'] = $district;
    }
    if ($minPrice !== null && $minPrice !== false) {
        $where[] = 'l.price >= :min_price';
        $params[':min_price'] = $minPrice;
    }
    if ($maxPrice !== null && $maxPrice !== false) {
        $where[] = 'l.price <= :max_price';
        $params[':max_price'] = $maxPrice;
    }

    $whereSql = implode(' AND ', $where);
    $count = $pdo->prepare("SELECT COUNT(*) FROM listings l JOIN categories c ON c.id = l.category_id WHERE {$whereSql}");
    $count->execute($params);
    $total = (int) $count->fetchColumn();

    $offset = (($page - 1) * $limit);
    $sql = "SELECT l.id, l.title, l.description, l.price, l.condition_label,
                   l.district, l.city, l.province, l.created_at,
                   c.name AS category_name, c.slug AS category_slug,
                   u.id AS seller_id, u.name AS seller_name,
                   (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', v.url, 'thumbnail_url', v.thumbnail_url, 'provider', v.provider))
                    FROM videos v WHERE v.listing_id = l.id) AS videos
            FROM listings l
            JOIN categories c ON c.id = l.category_id
            JOIN users u ON u.id = l.seller_id
            WHERE {$whereSql}
            ORDER BY l.created_at DESC, l.id DESC
            LIMIT :limit OFFSET :offset";
    $statement = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $statement->bindValue($key, $value);
    }
    $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
    $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
    $statement->execute();

    $items = $statement->fetchAll();
    foreach ($items as &$item) {
        $item['id'] = (int) $item['id'];
        $item['seller_id'] = (int) $item['seller_id'];
        $item['price'] = (float) $item['price'];
        $item['videos'] = $item['videos'] ? json_decode($item['videos'], true, 512, JSON_THROW_ON_ERROR) : [];
    }
    unset($item);

    respond([
        'success' => true,
        'data' => $items,
        'meta' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => $total === 0 ? 0 : (int) ceil($total / $limit),
        ],
    ]);
} catch (Throwable $exception) {
    error_log('get_listings failed: ' . $exception->getMessage());
    respond(['success' => false, 'error' => 'Terjadi kesalahan pada server'], 500);
}
