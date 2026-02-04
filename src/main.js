import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

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
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
