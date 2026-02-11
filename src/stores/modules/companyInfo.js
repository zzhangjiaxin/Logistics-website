import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicCompanyBranches } from '@/api/companyInfo'

export const useCompanyInfoStore = defineStore('companyInfo', () => {
  // 分支机构列表
  const branches = ref([])

  const isLoaded = ref(false)

  const fetchCompanyInfo = async () => {
    try {
      const res = await getPublicCompanyBranches()
      if (res.data) {
        branches.value = res.data
        isLoaded.value = true
      }
    } catch (error) {
      console.error('获取分支机构信息失败:', error)
    }
  }

  return {
    branches,
    isLoaded,
    fetchCompanyInfo
  }
})
