# 私有仓库设置

## GitHub私有仓库设置

### 步骤1：创建私有仓库
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称：`intlcalc`
4. 描述：`International Calculator Collection - Multi-language calculator website`
5. **重要**：选择 "Private"（私有）
6. 不要勾选 "Add a README file"
7. 点击 "Create repository"

### 步骤2：推送代码
创建私有仓库后，运行以下命令：

```bash
# 替换 YOUR_USERNAME 为您的GitHub用户名
git remote set-url origin https://github.com/YOUR_USERNAME/intlcalc.git
git branch -M main
git push -u origin main
```

## 私有仓库的优势
- ✅ 代码完全私有，只有您能看到
- ✅ 免费使用
- ✅ 可以与Cloudflare Pages集成
- ✅ 支持版本控制
- ✅ 可以添加协作者（如果需要）

## Cloudflare Pages部署
私有仓库也可以正常部署到Cloudflare Pages，因为：
- Cloudflare Pages会通过GitHub API访问您的私有仓库
- 部署后的网站是公开的，但源代码保持私有
- 这是标准的部署方式

## 安全说明
- 私有仓库的代码只有您能看到
- 部署后的网站是公开的（这是正常的）
- 用户无法看到您的源代码
- 只有网站功能是公开的 