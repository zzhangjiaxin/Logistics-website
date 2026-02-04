import { createRouter, createWebHistory } from 'vue-router'
import { useSiteStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { navIndex: 0 }
  },
  {
    path: '/track',
    name: 'Track',
    component: () => import('../views/TrackView.vue'),
    meta: { title: '信息查询', navIndex: 1 }
  },
  {
    path: '/aboutus',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于我们', navIndex: 2 }
  },
  {
    path: '/business',
    name: 'Business',
    component: () => import('../views/BusinessView.vue'),
    meta: { title: '主营渠道', navIndex: 3 }
  },
  {
    path: '/business-1',
    name: 'BusinessAir',
    component: () => import('../views/BusinessDetailView.vue'),
    meta: { title: '空派专线', navIndex: 3, type: 1 }
  },
  {
    path: '/business-2',
    name: 'BusinessSea',
    component: () => import('../views/BusinessDetailView.vue'),
    meta: { title: '海派专线', navIndex: 3, type: 2 }
  },
  {
    path: '/business-3',
    name: 'BusinessLand',
    component: () => import('../views/BusinessDetailView.vue'),
    meta: { title: '陆运专线', navIndex: 3, type: 3 }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/NewsView.vue'),
    meta: { title: '新闻中心', navIndex: 4 }
  },
  {
    path: '/news-1',
    name: 'NewsCompany',
    component: () => import('../views/NewsCategoryView.vue'),
    meta: { title: '公司新闻', navIndex: 4, category: 1 }
  },
  {
    path: '/news-2',
    name: 'NewsIndustry',
    component: () => import('../views/NewsCategoryView.vue'),
    meta: { title: '行业动态', navIndex: 4, category: 2 }
  },
  {
    path: '/news-search',
    name: 'NewsSearch',
    component: () => import('../views/NewsSearchView.vue'),
    meta: { title: '搜索结果 - 新闻中心', navIndex: 4 }
  },
  {
    path: '/news_ds-:id',
    name: 'NewsDetail',
    component: () => import('../views/NewsDetailView.vue'),
    meta: { title: '新闻详情', navIndex: 4 },
    props: true
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/HelpView.vue'),
    meta: { title: '帮助中心', navIndex: 5 }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/HelpView.vue'),
    meta: { title: '常见问题', navIndex: 5, isFaqPage: true }
  },
  {
    path: '/help-search',
    name: 'HelpSearch',
    component: () => import('../views/HelpSearchView.vue'),
    meta: { title: '搜索结果 - 帮助中心', navIndex: 5 }
  },
  {
    path: '/arts-:id',
    name: 'HelpCategory',
    component: () => import('../views/HelpView.vue'),
    meta: { title: '帮助中心', navIndex: 5 }
  },
  {
    path: '/arts_ds:id',
    name: 'HelpArticle',
    component: () => import('../views/HelpArticleView.vue'),
    meta: { title: '帮助详情', navIndex: 5 },
    props: true
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue'),
    meta: { title: '联系我们', navIndex: 6 }
  },
  // 后台管理路由（使用独立布局）
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('../pages/admin/AdminHome.vue'),
        meta: { title: '后台管理', requiresAuth: true }
      },
      {
        path: 'site-info',
        name: 'SiteInfoManagement',
        component: () => import('../pages/admin/SiteInfoManagement.vue'),
        meta: { title: '站点信息 - 后台管理', requiresAuth: true }
      },
      {
        path: 'navigation',
        name: 'NavigationManagement',
        component: () => import('../pages/admin/NavigationManagement.vue'),
        meta: { title: '导航栏管理 - 后台管理', requiresAuth: true }
      },
      {
        path: 'carousel',
        name: 'CarouselManagement',
        component: () => import('../pages/admin/CarouselManagement.vue'),
        meta: { title: '轮播图管理 - 后台管理', requiresAuth: true }
      }
    ]
  },
  // 测试页面
  {
    path: '/test-site-info',
    name: 'TestSiteInfo',
    component: () => import('../pages/TestSiteInfo.vue'),
    meta: { title: '站点信息API测试' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      // 如果有锚点，滚动到锚点位置
      if (to.hash) {
        // 使用 setTimeout 确保 DOM 已渲染
        setTimeout(() => {
          const element = document.querySelector(to.hash)
          if (element) {
            const top = element.offsetTop - 80 // 偏移量，避免被固定头部遮挡
            resolve({
              top,
              behavior: 'smooth'
            })
          } else {
            resolve({ top: 0, behavior: 'instant' })
          }
        }, 100)
        return
      }

      // 浏览器前进/后退时，保留位置
      if (savedPosition) {
        // 使用 requestAnimationFrame 确保在下一帧渲染
        requestAnimationFrame(() => {
          resolve(savedPosition)
        })
        return
      }

      // 点击导航栏跳转时，滚动到顶部
      // 页面刷新时的滚动位置由 useScrollPosition composable 管理
      requestAnimationFrame(() => {
        resolve({ top: 0, behavior: 'instant' })
      })
    })
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  next()
})

// 路由守卫 - 设置页面标题
router.afterEach((to) => {
  const siteStore = useSiteStore()
  const siteTitle = siteStore.siteInfo.siteTitle || '深圳市翔宇达运通国际货运代理有限公司'

  // 后台管理路由：使用固定标题
  if (to.path.startsWith('/admin')) {
    document.title = to.meta.title || '后台管理'
  }
  // 前端展示路由：拼接页面名称和站点名称
  else if (to.meta.title) {
    document.title = `${to.meta.title} - ${siteTitle}`
  }
  // 首页：只显示站点名称
  else {
    document.title = siteTitle
  }
})

export default router
