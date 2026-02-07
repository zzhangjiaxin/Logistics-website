# 前端数据动态化说明文档

> 最后更新：2026-02-07

## 一、概述

本项目前端展示页面的数据分为两类：
- **动态数据**：通过后台管理页面配置，前端从 API 获取并渲染
- **硬编码数据**：直接写在前端代码中，修改需要改代码重新部署

---

## 二、已实现动态化的内容（有后台管理支持）

### 2.1 站点信息

| 字段 | 说明 | 后台管理入口 | API |
|------|------|-------------|-----|
| siteTitle | 站点标题（公司名称） | 站点信息管理 | GET /public/site-info |
| siteSubtitle | 站点副标题 | 站点信息管理 | GET /public/site-info |
| siteLogo | 站点LOGO | 站点信息管理 | GET /public/site-info |
| footerLogo | 页脚LOGO | 站点信息管理 | GET /public/site-info |
| siteIcp | 备案号 | 站点信息管理 | GET /public/site-info |
| footerInfo | 页脚版权信息 | 站点信息管理 | GET /public/site-info |
| siteDomain | 站点域名（只读） | 系统设置 | GET /public/site-info |

**前端使用方式：** 全局 Pinia Store (`useSiteStore`)，App.vue 挂载时加载一次，各组件通过 computed 响应式读取。

**涉及前端文件：**
- `src/stores/modules/site.js` — 全局 store
- `src/components/layout/AppHeader.vue` — logo、标题、副标题
- `src/components/layout/AppFooter.vue` — 页脚logo、版权信息、备案号
- `src/router/index.js` — 页面标题动态拼接公司名称
- `index.html` — 页面刷新时先显示页面名称，Vue 加载后拼接公司名称

---

### 2.2 导航栏

| 内容 | 说明 | 后台管理入口 | API |
|------|------|-------------|-----|
| 导航菜单 | 树形结构，支持父子级 | 导航栏管理 | GET /tenant/navigation/enabled/tree |
| 导航名称 | 每个导航项的显示名称 | 导航栏管理 | 同上 |
| 导航URL | 每个导航项的链接地址 | 导航栏管理 | 同上 |
| 导航启用/禁用 | 控制导航项是否显示 | 导航栏管理 | 同上 |
| 导航排序 | 控制导航项显示顺序 | 导航栏管理 | 同上 |

**涉及前端文件：**
- `src/components/layout/AppHeader.vue` — 顶部导航栏（桌面端）
- `src/components/layout/MobileMenu.vue` — 移动端侧边菜单
- `src/components/layout/AppFooter.vue` — 页脚导航链接（自动筛选有子菜单的导航项）
- `src/views/HomeView.vue` — 首页运单查询类型（通过导航 code 字段匹配）
- `src/router/dynamicRoutes.js` — 动态路由注册

---

### 2.3 轮播图/Banner

| 内容 | 分组名 | 说明 | 后台管理入口 | API |
|------|--------|------|-------------|-----|
| 首页轮播图 | home | 首页顶部大图轮播 | 轮播图管理 | GET /tenant/carousel/group/home/enabled |
| 各页面Banner | news, aboutus, business, contact, help 等 | 各页面顶部背景图、主标题、副标题 | 轮播图管理 | GET /tenant/carousel/group/{groupName}/enabled |

**涉及前端文件：**
- `src/views/HomeView.vue` — 首页轮播图（调用 carousel API）
- `src/composables/useBannerData.js` — 通用 Banner 数据加载 composable
- 以下页面通过 `useBannerData` 加载各自分组的 Banner：
  - `src/views/AboutView.vue` — 分组 aboutus
  - `src/views/BusinessView.vue` — 分组 business
  - `src/views/NewsView.vue` — 分组 news
  - `src/views/NewsCategoryView.vue` — 分组 news
  - `src/views/NewsDetailView.vue` — 分组 news-detail
  - `src/views/NewsSearchView.vue` — 分组 news-search
  - `src/views/ContactView.vue` — 分组 contact
  - `src/views/HelpView.vue` — 分组 help
  - `src/views/HelpArticleView.vue` — 分组 help-article
  - `src/views/HelpSearchView.vue` — 分组 help-search

---

### 2.4 首页 - 关于我们模块

| 内容 | 说明 | 后台管理入口 | API |
|------|------|-------------|-----|
| 描述文字 | 关于我们简介 | 站点信息管理 > 首页-关于我们 | GET /public/home-about |
| 主图 | 关于我们配图 | 站点信息管理 > 首页-关于我们 | 同上 |
| 数字卡片 | 如"15年以上"、"500多家合作伙伴" | 站点信息管理 > 首页-关于我们 | 同上 |
| 底部图片 | 如"企业文化"、"发展历程"、"荣誉资质" | 站点信息管理 > 首页-关于我们 | 同上 |

**涉及前端文件：**
- `src/views/HomeView.vue` — 首页关于我们区域

---

### 2.5 页面标题

| 场景 | 实现方式 |
|------|---------|
| 页面刷新 | index.html 内联脚本立即设置页面名称（如"信息查询"），Vue 加载站点信息后拼接公司名称 |
| 路由切换 | router afterEach 守卫动态设置 `页面名 - 公司名称` |
| 后台管理页面 | 直接使用 meta.title，不拼接公司名称 |
| 站点信息更新后 | siteStore.updatePageTitle() 自动刷新当前页面标题 |

---

## 三、仍为硬编码的内容（无后台管理）

以下内容目前直接写在前端代码中，后续如需动态化，需要先在后端新建对应的管理接口和数据库表。

### 3.1 联系信息

| 内容 | 当前值 | 出现位置 |
|------|--------|---------|
| 客服电话 | 400-836-9156 | AppHeader.vue, AppFooter.vue, FloatTools.vue |
| 总部地址 | 深圳市宝安区福海街道展景路83号中港广场6栋B座1005 | AppFooter.vue, ContactView.vue |
| 仓库地址 | 深圳市宝安区福海街道和秀西路68号... | ContactView.vue |
| 视频号 | 翔宇达运通国际 | AppFooter.vue |
| 抖音号 | 翔宇达运通国际物流 | AppFooter.vue |
| 微信公众号二维码 | 静态图片 | AppFooter.vue |
| 越南总部信息 | 地址、电话 | ContactView.vue |
| 各分公司信息 | 深圳坂田、义乌、广州的地址和电话 | ContactView.vue |

### 3.2 新闻内容

| 内容 | 数量 | 出现位置 |
|------|------|---------|
| 新闻列表数据 | 16篇 | NewsView.vue, NewsCategoryView.vue, NewsSearchView.vue |
| 新闻详情内容 | 17篇完整HTML | NewsDetailView.vue |
| 首页精选新闻 | 4篇 | HomeView.vue |

### 3.3 业务内容

| 内容 | 出现位置 |
|------|---------|
| 首页主营渠道（空派/海派/陆运简介） | HomeView.vue |
| 业务列表页（3个渠道概述） | BusinessView.vue |
| 业务详情页（优势、服务、保障） | BusinessDetailView.vue |

### 3.4 帮助中心

| 内容 | 数量 | 出现位置 |
|------|------|---------|
| 帮助分类 | 6个 | HelpView.vue |
| FAQ列表 | 8条 | HelpView.vue, HelpSearchView.vue |
| 帮助文章详情 | 8篇完整HTML | HelpArticleView.vue |

### 3.5 关于我们详情

| 内容 | 出现位置 |
|------|---------|
| 公司简介（完整文字） | AboutView.vue |
| 发展历程（7个年份节点） | AboutView.vue |
| 荣誉资质（10项证书） | AboutView.vue |

### 3.6 其他

| 内容 | 出现位置 |
|------|---------|
| 首页服务流程（8个步骤） | HomeView.vue |
| 首页合作伙伴（12个logo） | HomeView.vue |
| meta keywords | index.html |
| meta description | index.html |

---

## 四、数据刷新机制

### 4.1 同标签页刷新（后台 → 展示页）

- **keep-alive 缓存清除**：App.vue 监听路由变化，从 `/admin` 切回展示页时清空 keep-alive 缓存，页面重新挂载并请求最新数据
- **onActivated 钩子**：HomeView、useBannerData 等使用 `onActivated` 在页面重新激活时刷新数据
- **siteStore 刷新**：后台保存站点信息后调用 `siteStore.fetchSiteInfo()` 更新全局缓存

### 4.2 跨标签页刷新（后台标签页保存 → 展示页标签页更新）

通过 `src/utils/crossTabSync.js` 工具实现，基于 `localStorage` + `storage` 事件的跨标签页通信。

**工作流程：**
1. 后台管理页面保存成功后，调用 `notifyDataChange(type)` 写入 localStorage
2. 展示页标签页通过 `storage` 事件自动监听到变化
3. App.vue 中的 `handleCrossTabUpdate` 根据 type 执行对应刷新操作

**支持的更新类型：**

| type | 触发页面 | 刷新动作 |
|------|---------|---------|
| `site-info` | SiteInfoManagement（站点信息保存） | 刷新 siteStore（logo、标题、页脚等） |
| `navigation` | NavigationManagement（导航增删改、状态切换） | 清空 keep-alive 缓存，页面重新挂载 |
| `carousel` | CarouselManagement（轮播图/分组增删改） | 清空 keep-alive 缓存，页面重新挂载 |
| `home-about` | SiteInfoManagement（首页关于我们保存） | 清空 keep-alive 缓存，页面重新挂载 |

**涉及文件：**
- `src/utils/crossTabSync.js` — 工具函数（notifyDataChange / onDataChange）
- `src/App.vue` — 展示页监听端（onDataChange → handleCrossTabUpdate）
- `src/pages/admin/SiteInfoManagement.vue` — 发送端
- `src/pages/admin/NavigationManagement.vue` — 发送端
- `src/pages/admin/CarouselManagement.vue` — 发送端

---

## 五、后续动态化建议

如需将硬编码内容改为动态，建议按以下优先级：

1. **联系信息** — 新建 `contact_info` 表，管理电话、地址、社交媒体
2. **新闻管理** — 新建 `news` 表，实现新闻CRUD和分类管理
3. **业务渠道** — 新建 `business_channel` 表，管理渠道详情
4. **帮助中心** — 新建 `help_category` + `help_article` 表
5. **关于我们详情** — 新建 `about_section` 表，管理公司简介、发展历程、荣誉资质
6. **首页模块** — 新建 `home_module` 表，管理服务流程、合作伙伴等
