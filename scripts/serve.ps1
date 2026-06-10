# MD2PPT Local Server (PowerShell, zero deps)
param($Port = 5173)

# Script is in dist/assets/, serve from dist/ (parent dir)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    Start-Process "http://localhost:$Port"
    Write-Host "Server running at http://localhost:$Port" -ForegroundColor Green
    Write-Host ""

    $mime = @{
        ".html" = "text/html; charset=utf-8"
        ".js"   = "application/javascript"
        ".css"  = "text/css"
        ".md"   = "text/markdown; charset=utf-8"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".svg"  = "image/svg+xml"
        ".mp4"  = "video/mp4"
        ".webm" = "video/webm"
        ".ico"  = "image/x-icon"
    }

    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $reqPath = $ctx.Request.Url.LocalPath
        if ($reqPath -eq "/" -or $reqPath -eq "/index.html") { $reqPath = "/assets/index.html" }
        $filePath = Join-Path $root ($reqPath.TrimStart("/") -replace "/", "\\")

        try {
            if (Test-Path $filePath -PathType Leaf) {
                $ext = [IO.Path]::GetExtension($filePath).ToLower()
                $contentType = $mime[$ext]
                if (-not $contentType) { $contentType = "application/octet-stream" }
                $ctx.Response.ContentType = $contentType
                $bytes = [IO.File]::ReadAllBytes($filePath)
                $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $ctx.Response.StatusCode = 404
            }
        } catch {
            $ctx.Response.StatusCode = 500
        }
        $ctx.Response.Close()
    }
} finally {
    try { $listener.Stop() } catch {}
    try { $listener.Close() } catch {}
}
