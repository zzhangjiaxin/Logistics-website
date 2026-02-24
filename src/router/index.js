import { createRouter, createWebHistory } from 'vue-router'
import { useSiteStore } from '@/stores'
import { generateRoutes } from './dynamicRoutes'

// 静态路由（不会被管理员修改的路由）
const staticRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { navIndex: 0 }
  },
  // 注意：主要页面路由（/track, /aboutus, /business 等）将由动态路由注册
  // 这里只保留详情页和特殊页面的路由
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
    path: '/arts_ds/:id',
    name: 'HelpArticle',
    component: () => import('../views/HelpArticleView.vue'),
    meta: { title: '帮助详情', navIndex: 5 },
    props: true
  },
  // /login 重定向到 /admin/login
  {
    path: '/login',
    redirect: '/admin/login'
  },
  // 后台管理登录页（不需要认证）
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../pages/admin/AdminLogin.vue'),
    meta: { title: '管理员登录', isLoginPage: true }
  },
  // 后台管理路由（使用独立布局）
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('../pages/admin/AdminDashboard.vue'),
        meta: { title: '仪表盘', requiresAuth: true }
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
      },
      {
        path: 'company-info',
        name: 'CompanyInfoManagement',
        component: () => import('../pages/admin/CompanyInfoManagement.vue'),
        meta: { title: '公司信息 - 后台管理', requiresAuth: true }
      },
      {
        path: 'company-profile',
        name: 'CompanyProfileManagement',
        component: () => import('../pages/admin/CompanyProfileManagement.vue'),
        meta: { title: '企业简介 - 后台管理', requiresAuth: true }
      },
      {
        path: 'system-settings',
        name: 'SystemSettings',
        component: () => import('../pages/admin/SystemSettings.vue'),
        meta: { title: '系统设置 - 后台管理', requiresAuth: true }
      },
      {
        path: 'logs',
        name: 'LogManagement',
        component: () => import('../pages/admin/LogManagement.vue'),
        meta: { title: '日志信息 - 后台管理', requiresAuth: true }
      },
      {
        path: 'news',
        name: 'NewsManagement',
        component: () => import('../pages/admin/ArticleManagement.vue'),
        meta: { title: '新闻管理 - 后台管理', requiresAuth: true, articleType: 'news' }
      },
      {
        path: 'faq',
        name: 'FaqManagement',
        component: () => import('../pages/admin/ArticleManagement.vue'),
        meta: { title: '常见问题 - 后台管理', requiresAuth: true, articleType: 'faq' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../pages/admin/AdminProfile.vue'),
        meta: { title: '个人信息 - 后台管理', requiresAuth: true }
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
  routes: staticRoutes,
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

/**
 * 注册动态路由
 * @param {Array} navigations - 后端返回的导航列表
 */
export function registerDynamicRoutes(navigations) {
  console.log('[路由] 开始注册动态路由...')

  // 生成动态路由配置
  const dynamicRoutes = generateRoutes(navigations)

  // 注册动态路由
  dynamicRoutes.forEach(route => {
    // 检查路由是否已存在
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
      console.log(`[路由] 已注册: ${route.path} -> ${route.name}`)
    } else {
      console.log(`[路由] 跳过已存在的路由: ${route.name}`)
    }
  })

  console.log(`[路由] 动态路由注册完成，共注册 ${dynamicRoutes.length} 个路由`)

  return dynamicRoutes
}

export default router

// 路由前置守卫：后台管理页面需要登录
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 已登录时访问登录页，直接跳到后台
  if (to.meta.isLoginPage && token) {
    next({ path: '/admin' })
    return
  }

  // 需要认证的页面，没 token 跳登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ path: '/admin/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 路由后置守卫：动态设置页面标题
router.afterEach((to) => {
  const siteStore = useSiteStore()
  const companyName = siteStore.siteInfo.siteTitle

  if (to.path.startsWith('/admin')) {
    document.title = to.meta.title || '后台管理'
  } else if (to.meta.title) {
    // 如果站点信息已加载，拼接公司名称；否则先只显示页面名称，等 fetchSiteInfo 完成后 updatePageTitle 会补上
    document.title = companyName ? `${to.meta.title} - ${companyName}` : to.meta.title
  } else if (to.path === '/') {
    document.title = companyName || 'Loading...'
  }
})
