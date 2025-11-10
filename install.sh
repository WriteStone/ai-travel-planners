#!/bin/bash

# AI Travel Planner - 快速安装脚本

set -e

echo "======================================"
echo "AI Travel Planner 快速安装"
echo "======================================"
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未检测到 Docker，请先安装 Docker"
    echo "访问 https://docs.docker.com/get-docker/ 获取安装指南"
    exit 1
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: 未检测到 Docker Compose，请先安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件并填入您的 API 密钥"
    echo ""
    echo "需要配置的密钥："
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - OPENAI_API_KEY (或 DASHSCOPE_API_KEY)"
    echo "  - NEXT_PUBLIC_AMAP_KEY"
    echo ""
    read -p "是否现在编辑 .env 文件? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    else
        echo "⚠️  请手动编辑 .env 文件后重新运行此脚本"
        exit 1
    fi
fi

echo "🚀 启动应用..."
docker-compose up -d

echo ""
echo "======================================"
echo "✅ 安装完成！"
echo "======================================"
echo ""
echo "📱 访问应用: http://localhost:3000"
echo ""
echo "常用命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止应用: docker-compose down"
echo "  重启应用: docker-compose restart"
echo ""
echo "📚 更多信息请查看 README.md"
echo ""
