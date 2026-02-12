import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router, { registerDynamicRoutes } from './router'
import { getEnabledNavigationTree } from '@/api/navigation'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// Element Plus 自定义样式
import './assets/css/element-custom.css'

// Swiper CSS
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Global CSS
import './assets/css/base.css'
import './assets/css/style_cn.css'
import './assets/css/media_cn.css'
import './assets/fonts/layicon/layicon.css'
import './assets/fonts/iconfont/iconfont.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 初始化应用：加载导航配置并注册动态路由
async function initApp() {
  // 后台管理和登录页不需要等导航数据
  const isAdminPath = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login'

  if (!isAdminPath) {
    try {
      console.log('[应用初始化] 开始加载导航配置...')

      // 从后端获取导航配置
      const res = await getEnabledNavigationTree()

      if (res.data && res.data.length > 0) {
        console.log('[应用初始化] 导航配置加载成功')

        // 注册动态路由
        registerDynamicRoutes(res.data)

        console.log('[应用初始化] 动态路由注册完成')
      } else {
        console.warn('[应用初始化] 未获取到导航配置，使用默认路由')
      }
    } catch (error) {
      console.error('[应用初始化] 加载导航配置失败，使用默认路由', error)
    }
  }

  // 注册路由和挂载应用
  app.use(router)
  app.use(ElementPlus, {
    locale: zhCn,
  })
  app.mount('#app')

  console.log('[应用初始化] 应用启动完成')
}

// 启动应用
initApp()
