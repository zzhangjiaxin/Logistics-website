<template>
  <div id="header" :class="{ fd: isScrolled }">
    <div class="wrap">
      <router-link to="/" class="logo">
        <img :src="siteLogoUrl" :alt="siteTitle">
        <img :src="siteLogoUrl" :alt="siteTitle">
        <span v-if="siteSubtitle" class="subtitle">{{ siteSubtitle }}</span>
      </router-link>
      <ul class="nav">
        <li v-for="(nav, index) in navigationList" :key="nav.id">
          <!-- 有子导航的导航项 -->
          <template v-if="nav.children && nav.children.length > 0">
            <router-link
              :to="nav.url"
              :class="isCurrentRoute(nav.url) ? 'nav_over' : 'nav_out'"
            >
              {{ nav.name }}<i class="layui-icon layui-icon-down"></i>
            </router-link>
            <!-- 子导航下拉菜单 -->
            <p>
              <router-link
                v-for="child in nav.children"
                :key="child.id"
                :to="child.url"
                :target="child.target"
              >
                {{ child.name }}
              </router-link>
            </p>
          </template>
          <!-- 普通导航项（无子导航） -->
          <template v-else>
            <router-link
              :to="nav.url"
              :class="isCurrentRoute(nav.url) ? 'nav_over' : 'nav_out'"
              :target="nav.target"
            >
              {{ nav.name }}
            </router-link>
          </template>
        </li>
      </ul>
      <ul class="r">
        <li class="lang">
          <p>简体中文<i class="layui-icon layui-icon-down"></i></p>
          <div>
            <a href="javascript:;">简体中文</a>
            <a href="javascript:;">English</a>
            <a href="javascript:;">Tiếng Việt</a>
          </div>
        </li>
        <li class="login">
          <a href="javascript:;" @click="handleLoginClick">登录</a>
        </li>
        <li class="tel">400-836-9156</li>
      </ul>
      <div id="mheader_menu" @click="toggleMenu">
        <span :class="{ active: menuOpen }"></span>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal ref="loginModalRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore, useUIStore, useSiteStore } from '@/stores'
import LoginModal from '@/components/common/LoginModal.vue'
import { getEnabledNavigationTree } from '@/api/navigation'
import { BASE_URL } from '@/utils/request'

const route = useRoute()
const menuStore = useMenuStore()
const uiStore = useUIStore()
const siteStore = useSiteStore()

// 使用 Pinia store 中的状态
const menuOpen = computed(() => menuStore.isOpen)
const toggleMenu = () => menuStore.toggleMenu()
const isScrolled = computed(() => uiStore.isHeaderScrolled)

// 导航列表
const navigationList = ref([])

// 下拉菜单状态
const activeDropdown = ref(null)

// 登录弹窗引用
const loginModalRef = ref(null)

// 获取完整的图片 URL
const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return `${BASE_URL}/api${imageUrl}`
}

// 计算属性：站点LOGO完整URL
const siteLogoUrl = computed(() => {
  return getFullImageUrl(siteStore.siteInfo.siteLogo)
})

// 计算属性：站点标题
const siteTitle = computed(() => {
  return siteStore.siteInfo.siteTitle || '深圳市翔宇达运通国际货运代理有限公司'
})

// 计算属性：站点副标题
const siteSubtitle = computed(() => {
  return siteStore.siteInfo.siteSubtitle || ''
})

// 获取启用的导航列表（树形结构）
const fetchNavigationList = async () => {
  try {
    const res = await getEnabledNavigationTree()
    navigationList.value = res.data || []
  } catch (error) {
    console.error('获取导航列表失败:', error)
    // 如果获取失败，使用默认导航（与原硬编码导航栏一致）
    navigationList.value = [
      { id: 1, name: '首页', url: '/', isHome: 1, isEnabled: 1, target: '_self', sortOrder: 1 },
      { id: 2, name: '信息查询', url: '/track', isHome: 0, isEnabled: 1, target: '_self', sortOrder: 2 },
      { id: 3, name: '关于我们', url: '/aboutus', isHome: 0, isEnabled: 1, target: '_self', sortOrder: 3 },
      { id: 4, name: '主营渠道', url: '/business', isHome: 0, isEnabled: 1, target: '_self', sortOrder: 4 },
      { id: 5, name: '新闻中心', url: '/news', isHome: 0, isEnabled: 1, target: '_self', sortOrder: 5 },
      { id: 6, name: '帮助中心', url: '/help', isHome: 0, isEnabled: 1, target: '_self', sortOrder: 6 },
      { id: 7, name: '联系我们', url: '/contact', isHome: 0, isEnabled: 1, target: '_self', sortOrder: 7 }
    ]
  }
}

// 页面可见性变化时刷新导航数据
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    fetchNavigationList()
    // 站点信息由全局 store 管理，不需要在这里重新获取
  }
}

const showDropdown = (index) => {
  activeDropdown.value = index
}

const hideDropdown = (index) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null
  }
}

// 判断是否为当前路由
const isCurrentRoute = (url) => {
  return route.path === url
}

const handleLoginClick = () => {
  loginModalRef.value?.show()
}

onMounted(() => {
  fetchNavigationList()
  // 站点信息由 App.vue 中的全局 store 统一加载
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
