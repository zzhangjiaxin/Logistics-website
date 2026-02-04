import { defineStore } from 'pinia'

/**
 * UI 状态管理
 * 管理全局 UI 状态，包括滚动位置和头部状态
 */
export const useUIStore = defineStore('ui', {
  state: () => ({
    // 当前滚动位置
    scrollY: 0,
    // 头部是否处于滚动状态（用于样式变化）
    isHeaderScrolled: false,
    // 滚动位置存储（用于页面切换时恢复位置）
    scrollPositions: {}
  }),

  getters: {
    // 获取当前页面的滚动位置
    getCurrentScrollPosition: (state) => (routePath) => {
      return state.scrollPositions[routePath] || 0
    }
  },

  actions: {
    // 更新当前滚动位置
    updateScrollY(value) {
      this.scrollY = value
      this.isHeaderScrolled = value > 0
    },

    // 保存指定路由的滚动位置
    saveScrollPosition(routePath, position) {
      this.scrollPositions[routePath] = position
      // 使用 requestIdleCallback 或 setTimeout 延迟保存到 sessionStorage
      // 避免频繁写入影响性能
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          sessionStorage.setItem(`scroll_${routePath}`, JSON.stringify(position))
        })
      } else {
        setTimeout(() => {
          sessionStorage.setItem(`scroll_${routePath}`, JSON.stringify(position))
        }, 0)
      }
    },

    // 恢复指定路由的滚动位置
    restoreScrollPosition(routePath) {
      let savedPosition = this.scrollPositions[routePath]

      // 如果内存中没有，尝试从 sessionStorage 读取
      if (savedPosition === undefined) {
        const stored = sessionStorage.getItem(`scroll_${routePath}`)
        if (stored) {
          savedPosition = JSON.parse(stored)
          this.scrollPositions[routePath] = savedPosition
        }
      }

      if (savedPosition !== undefined) {
        // 使用 requestAnimationFrame 确保在下一帧渲染前滚动
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition)
        })
      }
    },

    // 清除所有滚动位置记录
    clearScrollPositions() {
      this.scrollPositions = {}
    }
  }
})
