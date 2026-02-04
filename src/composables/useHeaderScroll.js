import { ref, onMounted, onUnmounted } from 'vue'

export function useHeaderScroll() {
  const isScrolled = ref(false)

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 0
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { isScrolled }
}
