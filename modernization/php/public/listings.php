<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/app/bootstrap.php';

try {
    $method = requestMethod();
    if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        header('Allow: POST, PUT, PATCH, DELETE');
        jsonResponse(['success' => false, 'error' => 'Method tidak diizinkan'], 405);
    }

    $user = authenticatedUser();
    requireCsrf();
    $pdo = database();

    if ($method === 'POST') {
        $body = requestBody();
        $title = trim((string) ($body['title'] ?? ''));
        $description = trim((string) ($body['description'] ?? ''));
        $price = filter_var($body['price'] ?? null, FILTER_VALIDATE_FLOAT);
        $categoryId = filter_var($body['category_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        $district = trim((string) ($body['district'] ?? 'Kendari'));
        $city = trim((string) ($body['city'] ?? 'Kendari'));
        $condition = trim((string) ($body['condition_label'] ?? 'new'));

        if (mb_strlen($title) < 5 || mb_strlen($title) > 180 || mb_strlen($description) < 10 || $price === false || $price < 0 || !$categoryId || mb_strlen($district) > 80 || mb_strlen($city) > 80) {
            jsonResponse(['success' => false, 'error' => 'Data listing belum valid'], 422);
        }
        if (!in_array($user['role'], ['seller', 'mitra_umkm', 'admin'], true)) {
            jsonResponse(['success' => false, 'error' => 'Akun belum memiliki hak seller'], 403);
        }

        $category = $pdo->prepare('SELECT id FROM categories WHERE id = :id LIMIT 1');
        $category->execute([':id' => $categoryId]);
        if (!$category->fetch()) {
            jsonResponse(['success' => false, 'error' => 'Kategori tidak ditemukan'], 422);
        }

        $statement = $pdo->prepare('INSERT INTO listings (seller_id, category_id, title, description, price, condition_label, status, district, city, province) VALUES (:seller_id, :category_id, :title, :description, :price, :condition_label, :status, :district, :city, :province)');
        $statement->execute([
            ':seller_id' => $user['id'],
            ':category_id' => $categoryId,
            ':title' => $title,
            ':description' => $description,
            ':price' => $price,
            ':condition_label' => $condition,
            ':status' => (($body['status'] ?? 'draft') === 'active') ? 'active' : 'draft',
            ':district' => $district,
            ':city' => $city,
            ':province' => 'Sulawesi Tenggara',
        ]);
        jsonResponse(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId(), 'seller_id' => (int) $user['id'], 'status' => (($body['status'] ?? 'draft') === 'active') ? 'active' : 'draft']], 201);
    }

    $body = requestBody();
    $listingId = filter_var($_GET['id'] ?? ($body['id'] ?? null), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if (!$listingId) {
        jsonResponse(['success' => false, 'error' => 'ID listing tidak valid'], 422);
    }
    assertListingOwner((int) $listingId, $user);

    if ($method === 'DELETE') {
        $statement = $pdo->prepare("UPDATE listings SET status = 'archived' WHERE id = :id");
        $statement->execute([':id' => $listingId]);
        if ($statement->rowCount() === 0) {
            jsonResponse(['success' => false, 'error' => 'Listing tidak ditemukan'], 404);
        }
        jsonResponse(['success' => true, 'data' => ['id' => (int) $listingId, 'status' => 'archived']]);
    }

    $title = trim((string) ($body['title'] ?? ''));
    $description = trim((string) ($body['description'] ?? ''));
    $price = filter_var($body['price'] ?? null, FILTER_VALIDATE_FLOAT);
    $categoryId = filter_var($body['category_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    $district = trim((string) ($body['district'] ?? 'Kendari'));
    $city = trim((string) ($body['city'] ?? 'Kendari'));
    $condition = trim((string) ($body['condition_label'] ?? 'new'));
    $status = (($body['status'] ?? 'draft') === 'active') ? 'active' : 'draft';

    if (mb_strlen($title) < 5 || mb_strlen($title) > 180 || mb_strlen($description) < 10 || $price === false || $price < 0 || !$categoryId || mb_strlen($district) > 80 || mb_strlen($city) > 80) {
        jsonResponse(['success' => false, 'error' => 'Data listing belum valid'], 422);
    }
    $statement = $pdo->prepare('UPDATE listings SET category_id = :category_id, title = :title, description = :description, price = :price, condition_label = :condition_label, status = :status, district = :district, city = :city WHERE id = :id');
    $statement->execute([
        ':category_id' => $categoryId,
        ':title' => $title,
        ':description' => $description,
        ':price' => $price,
        ':condition_label' => $condition,
        ':status' => $status,
        ':district' => $district,
        ':city' => $city,
        ':id' => $listingId,
    ]);
    jsonResponse(['success' => true, 'data' => ['id' => (int) $listingId, 'status' => 'updated']]);
} catch (Throwable $exception) {
    error_log('listing mutation failed: ' . $exception->getMessage());
    jsonResponse(['success' => false, 'error' => 'Terjadi kesalahan pada server'], 500);
}
