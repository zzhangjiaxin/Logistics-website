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
        <el-menu-item index="/admin" @dblclick="handleMenuDblClick('/admin')">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="basic-info">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>基础内容</span>
          </template>
          <el-menu-item index="/admin/site-info" @dblclick="handleMenuDblClick('/admin/site-info')">
            <el-icon><Setting /></el-icon>
            <span>站点管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/company-info" @dblclick="handleMenuDblClick('/admin/company-info')">
            <el-icon><Phone /></el-icon>
            <span>公司信息</span>
          </el-menu-item>
          <el-menu-item index="/admin/navigation" @dblclick="handleMenuDblClick('/admin/navigation')">
            <el-icon><Menu /></el-icon>
            <span>栏目管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="article-content">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>文章内容</span>
          </template>
          <el-menu-item index="/admin/news" @dblclick="handleMenuDblClick('/admin/news')">
            <el-icon><DocumentCopy /></el-icon>
            <span>新闻管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/faq" @dblclick="handleMenuDblClick('/admin/faq')">
            <el-icon><DocumentCopy /></el-icon>
            <span>常见问题</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="extend-content">
          <template #title>
            <el-icon><Expand /></el-icon>
            <span>扩展内容</span>
          </template>
          <el-menu-item index="/admin/carousel" @dblclick="handleMenuDblClick('/admin/carousel')">
            <el-icon><Picture /></el-icon>
            <span>图片管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/company-profile" @dblclick="handleMenuDblClick('/admin/company-profile')">
            <el-icon><OfficeBuilding /></el-icon>
            <span>企业简介</span>
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
          <el-menu-item index="/admin/logs" @dblclick="handleMenuDblClick('/admin/logs')">
            <el-icon><Document /></el-icon>
            <span>日志信息</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 后续可以添加更多菜单项 -->
      </el-menu>
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
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <div class="user-avatar">{{ adminName.charAt(0) }}</div>
              <span class="user-name">{{ adminName }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon>我的信息
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 标签页导航 -->
      <div class="tabs-bar">
        <el-tag
          v-for="tab in openedTabs"
          :key="tab.path"
          :type="route.path === tab.path ? 'primary' : 'info'"
          :closable="tab.path !== '/admin'"
          @click="handleTabClick(tab.path)"
          @close="handleTabClose(tab.path)"
          class="tab-item"
        >
          {{ tab.title }}
        </el-tag>
      </div>

      <!-- 页面内容 -->
      <main class="admin-content">
        <router-view :key="route.path + '-' + routeKey" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Setting, Tools, Picture, OfficeBuilding, Document, DocumentCopy, Expand, Phone, DataAnalysis, ArrowDown, UserFilled, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const routeKey = ref(0)

const adminName = computed(() => localStorage.getItem('adminName') || '管理员')

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/admin/profile')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('adminName')
      router.push('/admin/login')
    }).catch(() => {})
  }
}

// 打开的标签页列表（仪表盘固定第一个）
const openedTabs = ref([{ path: '/admin', title: '仪表盘' }])

// 页面标题映射
const pageTitles = {
  '/admin': '仪表盘',
  '/admin/site-info': '站点管理',
  '/admin/company-info': '公司信息',
  '/admin/navigation': '栏目管理',
  '/admin/carousel': '图片管理',
  '/admin/company-profile': '企业简介',
  '/admin/news': '新闻管理',
  '/admin/faq': '常见问题',
  '/admin/system-settings': '系统设置',
  '/admin/logs': '日志信息',
  '/admin/profile': '个人信息'
}

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 根据当前路由决定是否展开子菜单
const defaultOpeneds = computed(() => {
  // 如果当前路由在"基础内容"子菜单下，则展开该子菜单
  if (route.path === '/admin/site-info' || route.path === '/admin/company-info' || route.path === '/admin/navigation') {
    return ['basic-info']
  }
  // 如果当前路由在"扩展内容"子菜单下，则展开该子菜单
  if (route.path === '/admin/carousel' || route.path === '/admin/company-profile') {
    return ['extend-content']
  }
  // 如果当前路由在"文章内容"子菜单下，则展开该子菜单
  if (route.path === '/admin/news' || route.path === '/admin/faq') {
    return ['article-content']
  }
  // 如果当前路由在"设置"子菜单下，则展开该子菜单
  if (route.path === '/admin/system-settings' || route.path === '/admin/logs') {
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
  if (path === '/admin') return // 仪表盘不可关闭
  const index = openedTabs.value.findIndex(tab => tab.path === path)
  if (index === -1) return

  openedTabs.value.splice(index, 1)

  // 如果关闭的是当前页面
  if (route.path === path) {
    if (openedTabs.value.length > 0) {
      const lastTab = openedTabs.value[openedTabs.value.length - 1]
      router.push(lastTab.path)
    } else {
      router.push('/admin')
    }
  }
}

// 监听路由变化，自动添加标签页
watch(() => route.path, (newPath) => {
  if (pageTitles[newPath]) {
    addTab(newPath)
  }
}, { immediate: true })

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
.admin-menu :deep(.el-sub-menu .el-menu-item) {
  padding-left: 50px !important;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #304156);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.arrow-icon {
  font-size: 12px;
  color: #909399;
}

/* 页面内容 */
.admin-content {
  flex: 1;
  padding: 0;
  overflow: auto;
}
</style>
