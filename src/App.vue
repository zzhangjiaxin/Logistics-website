<template>
  <div id="main">
    <!-- 后台管理使用独立布局 -->
    <template v-if="isAdminRoute">
      <router-view />
    </template>

    <!-- 前端展示使用默认布局 -->
    <template v-else>
      <AppHeader />
      <MobileMenu />
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
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import MobileMenu from './components/layout/MobileMenu.vue'
import FloatTools from './components/layout/FloatTools.vue'
import { useUIStore, useSiteStore } from '@/stores'

const route = useRoute()
const uiStore = useUIStore()
const siteStore = useSiteStore()

// 判断是否是后台管理路由
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// 监听滚动事件更新 UI Store
const handleScroll = () => {
  uiStore.updateScrollY(window.scrollY)
}

onMounted(() => {
  // 初始化加载站点信息
  siteStore.fetchSiteInfo()

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const cachedViews = computed(() => [
  'HomeView',
  'NewsView',
  'NewsCategoryView',
  'AboutView',
  'BusinessView'
])
</script>

<style>
/* 全局样式已在main.js中引入 */
</style>
