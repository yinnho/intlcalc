# 手动DNS记录设置指南

## 当前状态
根据您的Cloudflare DNS控制台截图，目前只有：
- `en` -> `intlcalc-en.pages.dev` (已代理)
- `intlcalc.com` -> `intlcalc.pages.dev` (已代理)

## 需要添加的CNAME记录

请在Cloudflare DNS控制台中添加以下9条CNAME记录：

### 1. 中文 (简体)
- **名称**: `zh`
- **内容**: `intlcalc-zh.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 2. 西班牙语
- **名称**: `es`
- **内容**: `intlcalc-es.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 3. 法语
- **名称**: `fr`
- **内容**: `intlcalc-fr.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 4. 德语
- **名称**: `de`
- **内容**: `intlcalc-de.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 5. 日语
- **名称**: `ja`
- **内容**: `intlcalc-ja.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 6. 韩语
- **名称**: `ko`
- **内容**: `intlcalc-ko.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 7. 葡萄牙语
- **名称**: `pt`
- **内容**: `intlcalc-pt.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 8. 俄语
- **名称**: `ru`
- **内容**: `intlcalc-ru.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

### 9. 阿拉伯语
- **名称**: `ar`
- **内容**: `intlcalc-ar.pages.dev`
- **代理状态**: 已代理 ✅
- **TTL**: 自动

## 操作步骤

1. 登录Cloudflare控制台
2. 选择 `intlcalc.com` 域名
3. 点击左侧菜单的 "DNS" -> "Records"
4. 点击 "Add record" 按钮
5. 选择类型为 "CNAME"
6. 输入名称和内容
7. 确保代理状态为 "已代理" (橙色云朵图标)
8. 点击 "Save" 保存
9. 重复步骤4-8，直到添加完所有9条记录

## 添加完成后的验证

设置完成后，等待5-10分钟DNS传播，然后访问以下URL测试：

- https://intlcalc.com (主站 - 英语)
- https://en.intlcalc.com (英语)
- https://zh.intlcalc.com (中文)
- https://es.intlcalc.com (西班牙语)
- https://fr.intlcalc.com (法语)
- https://de.intlcalc.com (德语)
- https://ja.intlcalc.com (日语)
- https://ko.intlcalc.com (韩语)
- https://pt.intlcalc.com (葡萄牙语)
- https://ru.intlcalc.com (俄语)
- https://ar.intlcalc.com (阿拉伯语)

## 重要提醒

1. **代理状态**: 确保所有记录都启用了Cloudflare代理（橙色云朵图标），这样可以获得CDN加速和安全保护
2. **TTL设置**: 选择"自动"即可，Cloudflare会自动优化
3. **DNS传播**: 新记录需要5-10分钟才能全球生效，请耐心等待

## 完成后的最终状态

添加完成后，您的DNS记录列表应该包含：
- 1条主域名CNAME记录
- 10条子域名CNAME记录
- 1条Google Search Console验证TXT记录
- 总共12条记录 