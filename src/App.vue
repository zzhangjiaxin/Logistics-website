<template>
  <div id="main">
    <!-- 路由未就绪时不渲染任何布局，避免闪烁 -->
    <template v-if="!routerReady" />

    <!-- 后台管理使用独立布局 -->
    <template v-else-if="isAdminRoute">
      <router-view />
    </template>

    <!-- 前端展示使用默认布局 -->
    <template v-else>
      <AppHeader ref="appHeaderRef" />
      <MobileMenu ref="mobileMenuRef" />
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
      <FloatTools />
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import MobileMenu from './components/layout/MobileMenu.vue'
import FloatTools from './components/layout/FloatTools.vue'
import { useUIStore, useSiteStore, useCompanyInfoStore } from '@/stores'
import { onDataChange } from '@/utils/crossTabSync'

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const siteStore = useSiteStore()
const companyInfoStore = useCompanyInfoStore()

// 等路由解析完成后再渲染布局，避免闪烁前端壳子
const routerReady = ref(false)
router.isReady().then(() => {
  routerReady.value = true
})

// 注入 router 实例到 siteStore，供 updatePageTitle 使用（避免循环依赖）
siteStore.setRouter(router)

// 组件引用
const appHeaderRef = ref(null)
const mobileMenuRef = ref(null)

// 判断是否是后台管理路由
const isAdminRoute = computed(() => route.path.startsWith('/admin') || route.path === '/login')

// keep-alive 缓存列表
const cachedViews = ref(['HomeView', 'NewsView', 'NewsCategoryView', 'AboutView', 'BusinessView'])

// 清空 keep-alive 缓存并恢复（让页面重新挂载请求最新数据）
const invalidateCache = () => {
  cachedViews.value = []
  setTimeout(() => {
    cachedViews.value = ['HomeView', 'NewsView', 'NewsCategoryView', 'AboutView', 'BusinessView']
  }, 100)
}

// 同标签页：从后台切回前端展示页时刷新
watch(isAdminRoute, (isAdmin, wasAdmin) => {
  if (wasAdmin && !isAdmin) {
    invalidateCache()
    siteStore.fetchSiteInfo()
    companyInfoStore.fetchCompanyInfo()
  }
})

// 跨标签页：后台在另一个标签页保存数据后，展示页自动刷新
let removeDataChangeListener = null

const handleCrossTabUpdate = (payload) => {
  // 只在展示页（非后台管理页面）才响应
  if (isAdminRoute.value) return

  console.log('[跨标签页同步] 收到数据更新通知:', payload.type)

  switch (payload.type) {
    case 'site-info':
      // 站点信息更新：刷新全局 store（logo、标题、页脚等）
      siteStore.fetchSiteInfo()
      break
    case 'navigation':
      // 导航更新：清空缓存让页面重新挂载
      invalidateCache()
      break
    case 'carousel':
      // 轮播图更新：清空缓存让页面重新挂载
      invalidateCache()
      break
    case 'home-about':
      // 首页关于我们更新：清空缓存让页面重新挂载
      invalidateCache()
      break
    case 'company-info':
      // 公司联系信息更新：刷新全局 store
      companyInfoStore.fetchCompanyInfo()
      break
  }
}

// 监听滚动事件更新 UI Store
const handleScroll = () => {
  uiStore.updateScrollY(window.scrollY)
}

onMounted(() => {
  // 初始化加载站点信息
  siteStore.fetchSiteInfo()
  // 初始化加载公司联系信息
  companyInfoStore.fetchCompanyInfo()

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  // 监听跨标签页数据变更
  removeDataChangeListener = onDataChange(handleCrossTabUpdate)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (removeDataChangeListener) {
    removeDataChangeListener()
  }
})
</script>

<style>
/* 全局样式已在main.js中引入 */
</style>
