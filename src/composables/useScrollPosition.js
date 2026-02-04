import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores'

// 全局标记，用于区分页面刷新和路由导航
let isFirstLoad = true

/**
 * 滚动位置管理
 * 使用 Pinia Store 集中管理滚动位置
 * 支持 keep-alive 组件的滚动位置恢复
 */
export function useScrollPosition() {
  const route = useRoute()
  const router = useRouter()
  const uiStore = useUIStore()
  const scrollY = ref(0)
  let scrollTimer = null
  let isNavigating = false

  // 使用防抖保存滚动位置，减少频繁操作
  const savePosition = () => {
    if (isNavigating) return // 导航期间不保存位置

    const key = route.fullPath
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    scrollTimer = setTimeout(() => {
      uiStore.saveScrollPosition(key, window.scrollY)
    }, 100) // 100ms 防抖
  }

  // 恢复滚动位置
  const restorePosition = () => {
    const key = route.fullPath
    uiStore.restoreScrollPosition(key)
  }

  // 监听滚动事件
  const handleScroll = () => {
    scrollY.value = window.scrollY
    savePosition()
  }

  // 监听路由变化，标记导航状态
  const unwatch = router.beforeEach((to, from) => {
    isNavigating = true
    // 导航前保存当前位置
    if (from.fullPath) {
      const key = from.fullPath
      uiStore.saveScrollPosition(key, window.scrollY)
    }
  })

  router.afterEach(() => {
    // 导航完成后短暂延迟再允许保存位置
    setTimeout(() => {
      isNavigating = false
    }, 300)
    // 标记已经不是首次加载
    isFirstLoad = false
  })

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    // 只在页面刷新时恢复位置，路由跳转由 scrollBehavior 处理
    // 使用 performance.navigation.type 或 isFirstLoad 判断是否是页面刷新
    const isPageRefresh = performance.navigation?.type === 1 ||
                          performance.getEntriesByType('navigation')[0]?.type === 'reload' ||
                          isFirstLoad

    if (isPageRefresh) {
      // 延迟恢复，确保 DOM 已完全渲染
      setTimeout(() => {
        restorePosition()
      }, 50)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    savePosition()
    unwatch() // 清理路由监听
  })

  // 配合 keep-alive 使用
  onActivated(() => {
    const isPageRefresh = performance.navigation?.type === 1 ||
                          performance.getEntriesByType('navigation')[0]?.type === 'reload' ||
                          isFirstLoad

    if (isPageRefresh) {
      setTimeout(() => {
        restorePosition()
      }, 50)
    }
  })

  onDeactivated(() => {
    savePosition()
  })

  return {
    scrollY,
    savePosition,
    restorePosition
  }
}

