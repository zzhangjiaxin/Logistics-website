import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores'

/**
 * 监听页面滚动并更新 UI Store
 * 用于头部样式变化等全局 UI 效果
 */
export function useHeaderScroll() {
  const uiStore = useUIStore()

  const handleScroll = () => {
    uiStore.updateScrollY(window.scrollY)
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isScrolled: () => uiStore.isHeaderScrolled
  }
}
