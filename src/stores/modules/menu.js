import { defineStore } from 'pinia'

/**
 * 菜单状态管理
 * 管理移动端菜单的开关状态
 */
export const useMenuStore = defineStore('menu', {
  state: () => ({
    // 移动端菜单是否打开
    isOpen: false
  }),

  getters: {
    // 菜单打开状态
    menuOpen: (state) => state.isOpen
  },

  actions: {
    // 切换菜单状态
    toggleMenu() {
      this.isOpen = !this.isOpen
    },

    // 打开菜单
    openMenu() {
      this.isOpen = true
    },

    // 关闭菜单
    closeMenu() {
      this.isOpen = false
    }
  }
})
