import { defineStore } from 'pinia'
import { emptyStr } from '@/utils/global'

/**
 * 运单查询状态管理
 * 管理运单查询的输入、加载状态、结果和错误信息
 */
export const useTrackStore = defineStore('track', {
  state: () => ({
    // 运单号输入
    trackNumber: '',
    // 加载状态
    loading: false,
    // 错误信息
    error: '',
    // 查询结果（HTML）
    result: ''
  }),

  getters: {
    // 是否有查询结果
    hasResult: (state) => !!state.result,
    // 是否有错误
    hasError: (state) => !!state.error,
    // 是否正在加载
    isLoading: (state) => state.loading
  },

  actions: {
    // 设置运单号
    setTrackNumber(number) {
      this.trackNumber = number
    },

    // 清空查询结果
    clearResult() {
      this.result = ''
      this.error = ''
    },

    // 执行查询
    async handleQuery() {
      // 验证输入
      if (emptyStr(this.trackNumber)) {
        this.error = '请输入运单号、FBA单号或转运单号查询'
        this.result = ''
        return
      }

      // 重置状态
      this.loading = true
      this.error = ''
      this.result = ''

      // 模拟查询结果（因为没有后端API）
      setTimeout(() => {
        this.loading = false
        this.error = '运单查询功能暂时不可用，请联系客服查询'
      }, 500)
    },

    // 重置所有状态
    reset() {
      this.trackNumber = ''
      this.loading = false
      this.error = ''
      this.result = ''
    }
  }
})
