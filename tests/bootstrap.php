<?php

// Ensure test database exists before Laravel boots / migrations run
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: 'root';
$db   = getenv('DB_DATABASE') ?: 'fenix_test';
$charset = getenv('DB_CHARSET') ?: 'utf8mb4';
$collation = getenv('DB_COLLATION') ?: 'utf8mb4_unicode_ci';

try {
    $dsn = sprintf('mysql:host=%s;port=%s;charset=%s', $host, $port, $charset);
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db}` CHARACTER SET {$charset} COLLATE {$collation}");
} catch (Throwable $e) {
    // ignore; CI step/service should guarantee DB server availability
}

require __DIR__.'/../vendor/autoload.php';


