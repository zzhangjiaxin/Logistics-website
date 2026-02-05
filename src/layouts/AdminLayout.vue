<template>
  <div class="admin-layout">
    <!-- 左侧菜单 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h1>后台管理系统</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        class="admin-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        @select="handleMenuSelect"
      >
        <el-sub-menu index="basic-info">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>基础内容</span>
          </template>
          <el-menu-item index="/admin/site-info" @dblclick="handleMenuDblClick('/admin/site-info')">
            <el-icon><Setting /></el-icon>
            <span>站点管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/navigation" @dblclick="handleMenuDblClick('/admin/navigation')">
            <el-icon><Menu /></el-icon>
            <span>栏目管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/carousel" @dblclick="handleMenuDblClick('/admin/carousel')">
            <el-icon><Picture /></el-icon>
            <span>图片管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="settings">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </template>
          <el-menu-item index="/admin/system-settings" @dblclick="handleMenuDblClick('/admin/system-settings')">
            <el-icon><Tools /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 后续可以添加更多菜单项 -->
      </el-menu>
      <div class="sidebar-footer">
        <el-button type="primary" link @click="goToFrontend">
          <el-icon><Back /></el-icon>
          返回前台
        </el-button>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <div class="admin-main">
      <!-- 顶部栏 -->
      <header class="admin-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-if="route.path !== '/admin'" :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
            <el-breadcrumb-item v-else>后台管理</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.path !== '/admin'">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="admin-user">管理员</span>
        </div>
      </header>

      <!-- 标签页导航 -->
      <div class="tabs-bar">
        <el-tag
          v-for="tab in openedTabs"
          :key="tab.path"
          :type="route.path === tab.path ? 'primary' : 'info'"
          closable
          @click="handleTabClick(tab.path)"
          @close="handleTabClose(tab.path)"
          class="tab-item"
        >
          {{ tab.title }}
        </el-tag>
      </div>

      <!-- 页面内容 -->
      <main class="admin-content">
        <!-- 当没有标签页时显示欢迎页面 -->
        <div v-if="openedTabs.length === 0" class="welcome-page">
          <div class="welcome-content">
            <el-icon :size="80" color="#909399"><Setting /></el-icon>
            <h2>欢迎使用后台管理系统</h2>
            <p>请从左侧菜单选择功能开始使用</p>
          </div>
        </div>
        <!-- 有标签页时显示路由内容 -->
        <router-view v-else :key="routeKey" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Back, Setting, Tools, Picture } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const routeKey = ref(0)

// 打开的标签页列表
const openedTabs = ref([])

// 页面标题映射
const pageTitles = {
  '/admin/site-info': '站点管理',
  '/admin/navigation': '栏目管理',
  '/admin/carousel': '图片管理',
  '/admin/system-settings': '系统设置'
}

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 根据当前路由决定是否展开子菜单
const defaultOpeneds = computed(() => {
  // 如果当前路由在"基础内容"子菜单下，则展开该子菜单
  if (route.path === '/admin/site-info' || route.path === '/admin/navigation' || route.path === '/admin/carousel') {
    return ['basic-info']
  }
  // 如果当前路由在"设置"子菜单下，则展开该子菜单
  if (route.path === '/admin/system-settings') {
    return ['settings']
  }
  return []
})

const currentTitle = computed(() => {
  if (route.path === '/admin') {
    return '后台管理'
  }
  return pageTitles[route.path] || '管理'
})

// 添加标签页
const addTab = (path) => {
  const title = pageTitles[path]
  if (!title) return

  const exists = openedTabs.value.find(tab => tab.path === path)
  if (!exists) {
    openedTabs.value.push({ path, title })
  }
}

// 点击标签页
const handleTabClick = (path) => {
  if (route.path !== path) {
    router.push(path)
  }
}

// 关闭标签页
const handleTabClose = (path) => {
  const index = openedTabs.value.findIndex(tab => tab.path === path)
  if (index === -1) return

  openedTabs.value.splice(index, 1)

  // 如果关闭的是当前页面
  if (route.path === path) {
    // 如果还有其他标签页，跳转到最后一个标签页
    if (openedTabs.value.length > 0) {
      const lastTab = openedTabs.value[openedTabs.value.length - 1]
      router.push(lastTab.path)
    } else {
      // 如果没有标签页了，跳转到后台首页
      router.push('/admin')
    }
  }
}

// 监听路由变化，自动添加标签页
watch(() => route.path, (newPath) => {
  // 如果跳转到后台首页，清空所有标签页
  if (newPath === '/admin') {
    openedTabs.value = []
    return
  }

  // 其他页面，添加标签页
  if (pageTitles[newPath]) {
    addTab(newPath)
  }
}, { immediate: true })

const goToFrontend = () => {
  router.push('/')
}

// 处理菜单单击，只有不在当前页面时才导航
const handleMenuSelect = (index) => {
  if (route.path !== index) {
    router.push(index)
  }
}

// 处理菜单双击，双击当前菜单时刷新页面回到栏目列表
const handleMenuDblClick = (index) => {
  if (route.path === index) {
    routeKey.value++
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

/* 左侧菜单 */
.admin-sidebar {
  width: 220px;
  background-color: #304156;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
}

.sidebar-header h1 {
  color: #fff;
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.admin-menu {
  flex: 1;
  border-right: none;
  user-select: none;
}

.admin-menu:not(.el-menu--collapse) {
  width: 220px;
}

/* 子菜单项样式调整 */
.admin-menu :deep(.el-menu-item) {
  padding-left: 50px !important;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #3d4a5a;
}

.sidebar-footer .el-button {
  color: #bfcbd9;
}

.sidebar-footer .el-button:hover {
  color: #409EFF;
}

/* 右侧内容区 */
.admin-main {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部栏 */
.admin-header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 99;
}

/* 标签页导航 */
.tabs-bar {
  background-color: #fff;
  padding: 8px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
}

.tabs-bar::-webkit-scrollbar {
  height: 4px;
}

.tabs-bar::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 2px;
}

.tab-item {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.tab-item:hover {
  opacity: 0.8;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.admin-user {
  color: #606266;
  font-size: 14px;
}

/* 页面内容 */
.admin-content {
  flex: 1;
  padding: 0;
  overflow: auto;
}

/* 欢迎页面 */
.welcome-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
}

.welcome-content {
  text-align: center;
}

.welcome-content h2 {
  margin: 20px 0 10px;
  color: #303133;
  font-size: 24px;
  font-weight: 500;
}

.welcome-content p {
  color: #909399;
  font-size: 14px;
  margin: 0;
}
</style>
