#!/bin/bash

# IntlCalc 一键部署脚本
echo "🚀 IntlCalc 部署脚本启动..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现未提交的更改，正在提交..."
    git add .
    git commit -m "Auto update: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "✅ 没有未提交的更改"
fi

# 推送到GitHub
echo "📤 推送到GitHub..."
git push origin main

# 检查推送是否成功
if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
    echo "🌐 Cloudflare Pages 将自动部署..."
    echo "📊 部署状态：https://dash.cloudflare.com/pages"
    echo "🌍 网站地址：https://intlcalc.com"
else
    echo "❌ 推送失败，请检查网络连接"
    exit 1
fi

echo "🎉 部署完成！" 