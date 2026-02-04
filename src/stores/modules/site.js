import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicSiteInfo } from '@/api/siteInfo'

export const useSiteStore = defineStore('site', () => {
  // 站点信息
  const siteInfo = ref({
    siteTitle: '深圳市翔宇达运通国际货运代理有限公司',
    siteSubtitle: '',
    siteDomain: '',
    siteLogo: '/uploads/1/images/logo2.png',
    footerLogo: '/uploads/1/images/footer-logo.png',
    siteIcp: '粤ICP备2021000263号',
    siteTemplate: 'default',
    footerInfo: 'Copyright © 2023 XYD Global Express Service. All rights reserved.'
  })

  // 是否已加载
  const isLoaded = ref(false)

  // 更新页面标题的函数
  const updatePageTitle = () => {
    // 获取当前路由路径
    const currentPath = window.location.pathname

    // 后台管理页面：完全不修改标题
    if (currentPath.startsWith('/admin')) {
      return
    }

    // 前端展示页面：不在这里修改标题
    // 标题由路由守卫统一管理
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
    fetchSiteInfo,
    updatePageTitle
  }
})
