# 推送代码到GitHub

## 步骤1：创建GitHub仓库
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称：`intlcalc`
4. 描述：`International Calculator Collection - Multi-language calculator website`
5. 选择 Public
6. 不要勾选 "Add a README file"
7. 点击 "Create repository"

## 步骤2：推送代码
创建仓库后，运行以下命令：

```bash
# 替换 YOUR_USERNAME 为您的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/intlcalc.git
git branch -M main
git push -u origin main
```

## 步骤3：验证推送
推送成功后，您应该能在GitHub上看到：
- 186个文件
- 3.31 MB大小
- generated_pages/ 目录
- 所有语言版本的计算器

## 下一步：Cloudflare Pages部署
推送成功后，我们就可以在Cloudflare Pages中部署了。 