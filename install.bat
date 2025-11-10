@echo off
REM AI Travel Planner - Windows 快速安装脚本

echo ======================================
echo AI Travel Planner 快速安装
echo ======================================
echo.

REM 检查 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Docker，请先安装 Docker Desktop
    echo 访问 https://docs.docker.com/desktop/windows/install/ 获取安装指南
    pause
    exit /b 1
)

REM 检查 Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Docker Compose
    pause
    exit /b 1
)

echo ✅ Docker 环境检查通过
echo.

REM 检查 .env 文件
if not exist .env (
    echo 📝 创建环境变量文件...
    copy .env.example .env
    echo ⚠️  请编辑 .env 文件并填入您的 API 密钥
    echo.
    echo 需要配置的密钥：
    echo   - NEXT_PUBLIC_SUPABASE_URL
    echo   - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo   - SUPABASE_SERVICE_ROLE_KEY
    echo   - OPENAI_API_KEY (或 DASHSCOPE_API_KEY)
    echo   - NEXT_PUBLIC_AMAP_KEY
    echo.
    echo 按任意键打开 .env 文件进行编辑...
    pause >nul
    notepad .env
    echo.
    echo 编辑完成后，按任意键继续...
    pause >nul
)

echo 🚀 启动应用...
docker-compose up -d

echo.
echo ======================================
echo ✅ 安装完成！
echo ======================================
echo.
echo 📱 访问应用: http://localhost:3000
echo.
echo 常用命令:
echo   查看日志: docker-compose logs -f
echo   停止应用: docker-compose down
echo   重启应用: docker-compose restart
echo.
echo 📚 更多信息请查看 README.md
echo.
pause
