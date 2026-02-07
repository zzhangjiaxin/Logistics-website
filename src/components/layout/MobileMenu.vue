<template>
  <div id="menu" :class="{ active: menuOpen }">
    <div class="close">
      <div class="lang">
        <a href="javascript:;">简体中文</a>&nbsp;&nbsp;/&nbsp;&nbsp;
        <a href="javascript:;">English</a>&nbsp;&nbsp;/&nbsp;&nbsp;
        <a href="javascript:;">Tiếng Việt</a>
      </div>
      <span @click="closeMenu">
        <i class="layui-icon layui-icon-close"></i>关闭
      </span>
    </div>
    <div class="list" v-for="(nav, index) in navigationList" :key="nav.id">
      <p>
        <router-link :to="nav.url" @click="closeMenu">{{ nav.name }}</router-link>
        <span
          v-if="nav.children && nav.children.length > 0"
          @click="toggleSubmenu(index)"
          :class="{ active: submenus[index] }"
        >
          <i class="layui-icon layui-icon-down"></i>
        </span>
      </p>
      <dl v-if="nav.children && nav.children.length > 0" v-show="submenus[index]">
        <dt v-for="child in nav.children" :key="child.id">
          <router-link :to="child.url" :target="child.target" @click="closeMenu">{{ child.name }}</router-link>
        </dt>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores'
import { getEnabledNavigationTree } from '@/api/navigation'

const menuStore = useMenuStore()

// 使用 Pinia store 中的菜单状态
const menuOpen = computed(() => menuStore.isOpen)

// 导航列表
const navigationList = ref([])

// 子菜单展开状态
const submenus = ref([])

const closeMenu = () => {
  if (menuStore.isOpen) {
    menuStore.closeMenu()
  }
}

const toggleSubmenu = (index) => {
  submenus.value[index] = !submenus.value[index]
}

// 获取启用的导航列表
const fetchNavigationList = async () => {
  try {
    const res = await getEnabledNavigationTree()
    navigationList.value = res.data || []
    // 初始化子菜单展开状态数组
    submenus.value = new Array(navigationList.value.length).fill(false)
  } catch (error) {
    console.error('[移动菜单] 获取导航列表失败:', error)
    navigationList.value = [
      { id: 1, name: '首页', url: '/', isHome: 1, target: '_self' },
      { id: 2, name: '信息查询', url: '/track', target: '_self' },
      { id: 3, name: '关于我们', url: '/aboutus', target: '_self' },
      { id: 4, name: '主营渠道', url: '/business', target: '_self' },
      { id: 5, name: '新闻中心', url: '/news', target: '_self' },
      { id: 6, name: '帮助中心', url: '/help', target: '_self' },
      { id: 7, name: '联系我们', url: '/contact', target: '_self' }
    ]
    submenus.value = new Array(navigationList.value.length).fill(false)
  }
}

onMounted(() => {
  fetchNavigationList()
})
</script>
