import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const isLoginModalVisible = ref(false)

  const showLoginModal = () => {
    isLoginModalVisible.value = true
  }

  const hideLoginModal = () => {
    isLoginModalVisible.value = false
  }

  return {
    isLoginModalVisible,
    showLoginModal,
    hideLoginModal
  }
})
