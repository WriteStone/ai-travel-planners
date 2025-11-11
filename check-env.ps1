# 验证环境变量配置脚本
Write-Host "=== 环境变量验证脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 .env.local 文件
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local 文件存在" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    # 检查 Supabase URL
    if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)') {
        $url = $matches[1].Trim()
        if ($url -like "*sgfwhfjcuonargkhdybt.supabase.co*") {
            Write-Host "✓ SUPABASE_URL 配置正确: $url" -ForegroundColor Green
        } elseif ($url -like "*placeholder*") {
            Write-Host "✗ SUPABASE_URL 包含 placeholder，请修改！" -ForegroundColor Red
        } else {
            Write-Host "⚠ SUPABASE_URL: $url" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ 未找到 NEXT_PUBLIC_SUPABASE_URL 配置" -ForegroundColor Red
    }
    
    # 检查 Supabase Anon Key
    if ($envContent -match 'NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\r\n]+)') {
        $key = $matches[1].Trim()
        if ($key -like "eyJ*") {
            Write-Host "✓ SUPABASE_ANON_KEY 配置正确 (长度: $($key.Length))" -ForegroundColor Green
        } else {
            Write-Host "✗ SUPABASE_ANON_KEY 格式不正确" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ 未找到 NEXT_PUBLIC_SUPABASE_ANON_KEY 配置" -ForegroundColor Red
    }
    
    # 检查 DashScope API Key
    if ($envContent -match 'DASHSCOPE_API_KEY=([^\r\n]+)') {
        $apiKey = $matches[1].Trim()
        if ($apiKey -like "sk-*" -and $apiKey.Length -gt 30) {
            Write-Host "✓ DASHSCOPE_API_KEY 配置正确 (长度: $($apiKey.Length))" -ForegroundColor Green
        } else {
            Write-Host "⚠ DASHSCOPE_API_KEY 可能不正确: $($apiKey.Substring(0, [Math]::Min(15, $apiKey.Length)))..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠ 未找到 DASHSCOPE_API_KEY 配置" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "✗ .env.local 文件不存在！" -ForegroundColor Red
    Write-Host "请从 .env.example 创建 .env.local 文件" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 建议操作 ===" -ForegroundColor Cyan
Write-Host "1. 停止开发服务器"
Write-Host "2. 删除 .next 目录: Remove-Item -Recurse -Force .next"
Write-Host "3. 重启服务器: npm run dev"
Write-Host "4. 在浏览器中硬刷新: Ctrl + Shift + R"
Write-Host ""
