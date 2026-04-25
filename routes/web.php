<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/documentation', function () {
    $html = <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Thrift Store API</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: '/api/documentation/openapi.json',
            dom_id: '#swagger-ui',
        });
    </script>
</body>
</html>
HTML;
    return response($html)->header('Content-Type', 'text/html');
});

Route::get('/api/documentation/openapi.json', function () {
    $path = resource_path('swagger/openapi.json');
    return response()->file($path, ['Content-Type' => 'application/json']);
});
