import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicSiteInfo } from '@/api/siteInfo'

export const useSiteStore = defineStore('site', () => {
  // 站点信息
  const siteInfo = ref({
    siteTitle: '',
    siteSubtitle: '',
    siteDomain: '',
    slug: '',
    siteLogo: '/uploads/1/images/logo2.png',
    footerLogo: '/uploads/1/images/footer-logo.png',
    siteIcp: '粤ICP备2021000263号',
    siteTemplate: 'default',
    footerInfo: 'Copyright © 2023 XYD Global Express Service. All rights reserved.'
  })

  // 是否已加载
  const isLoaded = ref(false)

  // 缓存 router 实例（由 App.vue 初始化时注入，避免循环依赖）
  let _router = null
  const setRouter = (router) => { _router = router }

  // 更新页面标题的函数（站点信息加载完成后调用，用最新的公司名称刷新标题）
  const updatePageTitle = () => {
    if (!_router) return

    const currentRoute = _router.currentRoute.value
    const currentPath = currentRoute.path

    // 后台管理页面：不修改标题
    if (currentPath.startsWith('/admin')) {
      return
    }

    const companyName = siteInfo.value.siteTitle
    if (!companyName) return

    // 首页：只显示公司名称
    if (currentPath === '/') {
      document.title = companyName
    } else if (currentRoute.meta.title) {
      // 有路由 meta.title（来自动态路由注册时的导航名称），直接拼接
      document.title = `${currentRoute.meta.title} - ${companyName}`
    }
  }

  // 加载站点信息
  const fetchSiteInfo = async () => {
    try {
      const res = await getPublicSiteInfo()
      if (res.data) {
        siteInfo.value = res.data
        isLoaded.value = true

        // 更新页面标题（只在非后台管理页面）
        updatePageTitle()
      }
    } catch (error) {
      console.error('获取站点信息失败:', error)
    }
  }

  return {
    siteInfo,
    isLoaded,
    setRouter,
    fetchSiteInfo,
    updatePageTitle
  }
})
