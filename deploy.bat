@echo off
chcp 65001 >nul
echo 🚀 IntlCalc 部署脚本启动...

REM 检查是否有未提交的更改
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo 📝 发现未提交的更改，正在提交...
    git add .
    git commit -m "Auto update: %date% %time%"
) else (
    echo ✅ 没有未提交的更改
)

REM 推送到GitHub
echo 📤 推送到GitHub...
git push origin main

REM 检查推送是否成功
if %errorlevel% equ 0 (
    echo ✅ 代码推送成功！
    echo 🌐 Cloudflare Pages 将自动部署...
    echo 📊 部署状态：https://dash.cloudflare.com/pages
    echo 🌍 网站地址：https://intlcalc.com
) else (
    echo ❌ 推送失败，请检查网络连接
    pause
    exit /b 1
)

echo 🎉 部署完成！
pause 