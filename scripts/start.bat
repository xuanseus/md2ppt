@echo off
setlocal
title MD2PPT

:: ── Check if already running ──────────────────────────────────────
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo MD2PPT is already running at http://localhost:5173
    start http://localhost:5173
    exit
)

echo MD2PPT - http://localhost:5173
echo Close this window to stop the server

:: ── Self-extract: pass this file to PowerShell ────────────────────
::     Everything after <#PS#> is pure PowerShell — batch never reaches it.
set "ROOT=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$env:MD2PPT_ROOT='%ROOT:\=\\%'; $c=(Get-Content '%~f0' -Raw); Invoke-Expression ($c -replace '(?s).*?\x3c#PS#\x3e\r?\n', '')"
exit /b
<#PS#>
# ═══════════════════════════════════════════════════════════════════
# MD2PPT Local Server — PowerShell (Windows zero deps, HttpListener)
# ═══════════════════════════════════════════════════════════════════
$port    = 5173
$root    = $env:MD2PPT_ROOT.TrimEnd('\')

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript'
    '.css'  = 'text/css'
    '.md'   = 'text/markdown; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.webp' = 'image/webp'
    '.gif'  = 'image/gif'
    '.mp4'  = 'video/mp4'
    '.webm' = 'video/webm'
    '.ico'  = 'image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Start-Process "http://localhost:$port"
    Write-Host "Listening on $port" -ForegroundColor Green

    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $reqPath = $ctx.Request.Url.LocalPath

        # Route / → /assets/index.html
        if ($reqPath -eq '/' -or $reqPath -eq '/index.html') {
            $reqPath = '/assets/index.html'
        }

        # Remove query string
        $q = $reqPath.IndexOf('?')
        if ($q -ge 0) { $reqPath = $reqPath.Substring(0, $q) }

        # Normalize and serve
        $filePath = $root + ($reqPath.Replace('/', '\'))

        try {
            $full = [IO.Path]::GetFullPath($filePath)
            if ($full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path $full -PathType Leaf)) {
                $ctx.Response.ContentType = $mime[[IO.Path]::GetExtension($full).ToLower()]
                if (-not $ctx.Response.ContentType) { $ctx.Response.ContentType = 'application/octet-stream' }
                $bytes = [IO.File]::ReadAllBytes($full)
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
