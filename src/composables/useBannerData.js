import { ref, onMounted, onActivated } from 'vue'
import { getEnabledCarouselByGroup } from '@/api/carousel'
import { BASE_URL } from '@/utils/request'

/**
 * 获取页面顶部背景图数据（背景图、主标题、副标题）
 * @param {string} groupName - 分组名称（如 'news', 'aboutus', 'business' 等）
 * @param {object} defaults - 默认值 { bannerBg, mainTitle, subTitle }
 */
export function useBannerData(groupName, defaults = {}) {
  const bannerBg = ref(defaults.bannerBg || '')
  const mainTitle = ref(defaults.mainTitle || '')
  const subTitle = ref(defaults.subTitle || '')

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    if (imageUrl.startsWith('/api')) {
      imageUrl = imageUrl.substring(4)
    }
    if (!imageUrl.startsWith('/')) {
      imageUrl = '/' + imageUrl
    }
    return `${BASE_URL}/api${imageUrl}`
  }

  const loadBannerData = async () => {
    try {
      const res = await getEnabledCarouselByGroup(groupName)
      if (res.data && res.data.length > 0) {
        const carousel = res.data[0]
        if (carousel.imageUrl) {
          bannerBg.value = getFullImageUrl(carousel.imageUrl)
        }
        if (carousel.mainTitle) {
          mainTitle.value = carousel.mainTitle
        }
        if (carousel.subTitle) {
          subTitle.value = carousel.subTitle
        }
      }
    } catch (error) {
      console.error(`[${groupName}] 获取背景图数据失败:`, error)
    }
  }

  onMounted(() => {
    loadBannerData()
  })

  // keep-alive 缓存的页面重新激活时刷新数据（从后台管理切回前端时）
  onActivated(() => {
    loadBannerData()
  })

  return {
    bannerBg,
    mainTitle,
    subTitle
  }
}
