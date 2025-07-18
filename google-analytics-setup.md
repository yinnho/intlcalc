# Google Analytics 多语言网站配置

## 🌍 IntlCalc.com 多语言追踪设置

### 方案1：单个 GA4 媒体资源 + 多数据流（推荐）

在同一个 GA4 媒体资源下创建多个数据流：

#### 主数据流配置
1. **主网站**: `https://intlcalc.com` → 测量ID: `G-XXXXXXXXXX`

#### 子域名数据流配置
为每个语言版本创建独立数据流：

| 语言 | 域名 | 数据流名称 | 用途 |
|------|------|------------|------|
| 英文 | en.intlcalc.com | IntlCalc English | 英文版网站 |
| 中文 | zh.intlcalc.com | IntlCalc Chinese | 中文版网站 |
| 西班牙语 | es.intlcalc.com | IntlCalc Spanish | 西班牙语版 |
| 法语 | fr.intlcalc.com | IntlCalc French | 法语版 |
| 德语 | de.intlcalc.com | IntlCalc German | 德语版 |
| 日语 | ja.intlcalc.com | IntlCalc Japanese | 日语版 |
| 韩语 | ko.intlcalc.com | IntlCalc Korean | 韩语版 |
| 葡萄牙语 | pt.intlcalc.com | IntlCalc Portuguese | 葡萄牙语版 |
| 俄语 | ru.intlcalc.com | IntlCalc Russian | 俄语版 |
| 阿拉伯语 | ar.intlcalc.com | IntlCalc Arabic | 阿拉伯语版 |

### 设置步骤

#### 1. 创建主数据流
1. GA4 → 管理 → 数据流 → 添加数据流
2. 选择"网站"
3. 网站网址: `https://intlcalc.com`
4. 数据流名称: `IntlCalc Main`

#### 2. 创建语言子域名数据流
重复以下步骤为每个语言创建数据流：
1. 添加数据流 → 网站
2. 网站网址: `https://en.intlcalc.com`
3. 数据流名称: `IntlCalc English`
4. 保存并获取测量ID

### 跨域名追踪配置

#### Enhanced Measurement 设置
为每个数据流启用：
- ✅ 网页浏览
- ✅ 滚动 (90%)
- ✅ 出站点击
- ✅ 网站内搜索
- ✅ 视频互动
- ✅ 文件下载

#### 自定义维度设置
创建以下自定义维度：
1. **语言版本**: 范围=事件, 参数名=language
2. **计算器类型**: 范围=事件, 参数名=calculator_type
3. **计算器分类**: 范围=事件, 参数名=calculator_category

### 代码实现

每个网站页面需要包含对应的 GA4 代码：

```html
<!-- 主网站 (intlcalc.com) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-主网站ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-主网站ID', {
    custom_map: {
      'custom_parameter_1': 'language'
    }
  });
  
  // 设置语言维度
  gtag('event', 'page_view', {
    language: 'language_selection',
    page_type: 'homepage'
  });
</script>

<!-- 英文网站 (en.intlcalc.com) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-英文版ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-英文版ID');
  
  // 设置语言和页面信息
  gtag('event', 'page_view', {
    language: 'en',
    page_type: 'calculator_list'
  });
</script>
```

### 事件追踪设置

#### 标准事件
- `calculator_use`: 用户使用计算器
- `language_switch`: 用户切换语言
- `calculation_complete`: 完成计算

#### 自定义事件示例
```javascript
// 计算器使用事件
gtag('event', 'calculator_use', {
  calculator_type: 'percentage',
  calculator_category: 'math',
  language: 'en'
});

// 语言切换事件
gtag('event', 'language_switch', {
  from_language: 'en',
  to_language: 'zh',
  switch_method: 'header_link'
});

// 计算完成事件
gtag('event', 'calculation_complete', {
  calculator_type: 'interest',
  result_value: '1500',
  input_method: 'manual'
});
```

### 报告和分析

#### 推荐报告
1. **受众报告**: 按语言和地理位置分析用户
2. **行为报告**: 最受欢迎的计算器类型
3. **转化报告**: 用户从访问到使用计算器的路径
4. **实时报告**: 监控各语言版本的实时使用情况

#### 自定义仪表板
创建包含以下指标的仪表板：
- 各语言版本的用户数
- 最受欢迎的计算器
- 用户互动深度
- 语言切换行为
- 移动端 vs 桌面端使用

### 目标和转化设置

#### 转化事件设置
1. `calculator_use` → 主要转化
2. `calculation_complete` → 次要转化
3. `language_switch` → 用户参与度指标

### SEO 和 Search Console 整合

#### Search Console 设置
为每个语言版本的域名单独验证：
1. `intlcalc.com`
2. `en.intlcalc.com`
3. `zh.intlcalc.com`
4. 等等...

#### GA4 和 Search Console 关联
在 GA4 中关联所有 Search Console 媒体资源，以获得完整的搜索性能数据。 