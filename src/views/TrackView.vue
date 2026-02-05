<template>
  <div>
    <!-- Banner 区域 - 使用空白区域 -->
    <div id="bmar"></div>

    <!-- 面包屑导航 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;<strong>{{ breadcrumbText }}</strong>
      </div>
    </div>
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>{{ breadcrumbText }}</strong>
    </div>

    <!-- 查询表单 -->
    <div id="track">
      <ul v-if="trackTypeNavs.length > 0">
        <li
          v-for="nav in trackTypeNavs"
          :key="nav.id"
          :class="{ active: (nav.url === '/track' && activeTab === 'waybill') || (nav.url === '/track?type=parcel' && activeTab === 'parcel') }"
          @click="switchTab(nav.url === '/track' ? 'waybill' : 'parcel')"
        >
          {{ nav.name }}
        </li>
      </ul>

      <!-- 运单查询表单 -->
      <template v-if="activeTab === 'waybill' && isTypeEnabled('waybill')">
        <textarea
          id="track_number"
          v-model="trackNumber"
          @keyup.enter="handleQuery"
          placeholder="请输入运单号、FBA单号或转运单号查询"
        ></textarea>
        <button type="button" @click="handleQuery">
          <i class="fyicon icon-search"></i>查询
        </button>
      </template>

      <!-- 包裹查询表单 -->
      <template v-else-if="activeTab === 'parcel' && isTypeEnabled('parcel')">
        <div class="parcel-form">
          <div class="form-row">
            <label>国家：</label>
            <input
              type="text"
              v-model="parcelForm.country"
              :class="{ 'input-error': formErrors.country }"
              @input="formErrors.country = false"
              placeholder=""
            />
          </div>
          <div class="form-row">
            <label>类型：</label>
            <select v-model="parcelForm.type">
              <option value="包裹">包裹</option>
              <option value="文件">文件</option>
            </select>
          </div>
          <div class="form-row">
            <label>重量：</label>
            <input
              type="text"
              v-model="parcelForm.weight"
              :class="{ 'input-error': formErrors.weight }"
              @input="formErrors.weight = false"
              placeholder="必须为数字"
            />
            <span class="unit">KG</span>
          </div>
        </div>
        <button type="button" @click="handleQuery">
          <i class="fyicon icon-search"></i>查询
        </button>
      </template>

      <!-- 如果没有启用的查询类型，显示提示 -->
      <template v-else-if="trackTypeNavs.length === 0">
        <div class="no-track-types">
          <p>查询功能暂时不可用，请联系客服</p>
        </div>
      </template>
    </div>

    <!-- 查询结果 -->
    <div id="track_result" class="wrap">
      <div v-if="loading" id="track_loading">
        <img src="@/assets/images/loading2.gif" alt="">
        <br>正在努力查询中……
      </div>
      <div v-else-if="error" class="errmsg">{{ error }}</div>
      <div v-else-if="result" v-html="result"></div>
    </div>

    <!-- 服务链接 -->
    <div id="fyw">
      <div class="wrap">
        <router-link to="/business-1">
          <h2>空派专线</h2>
          <p>专注于美国、英国和墨西哥</p>
          <img src="@/assets/images/fyw11.png" alt="">
        </router-link>
        <router-link to="/business-2">
          <h2>海派专线</h2>
          <p>专注于美国、英国、欧洲和墨西哥</p>
          <img src="@/assets/images/fyw22.png" alt="">
        </router-link>
        <router-link to="/business-3">
          <h2>陆运专线</h2>
          <p>专注于英国、欧洲和越南</p>
          <img src="@/assets/images/fyw33.png" alt="">
        </router-link>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useTrackStore } from '@/stores'
import { getEnabledNavigationTree } from '@/api/navigation'

useScrollPosition()

const route = useRoute()
const router = useRouter()
const trackStore = useTrackStore()

// 查询类型子导航列表（从"信息查询"的子导航获取）
const trackTypeNavs = ref([])

// 当前激活的Tab
const activeTab = ref('waybill')

// 包裹查询表单数据
const parcelForm = ref({
  country: '',
  type: '包裹',
  weight: ''
})

// 表单错误状态
const formErrors = ref({
  country: false,
  weight: false
})

// 面包屑文本
const breadcrumbText = computed(() => {
  const currentNav = trackTypeNavs.value.find(nav => {
    // 根据URL判断是哪个导航
    if (activeTab.value === 'waybill') {
      return nav.url === '/track'
    } else if (activeTab.value === 'parcel') {
      return nav.url === '/track?type=parcel'
    }
    return false
  })
  return currentNav ? currentNav.name : '信息查询'
})

// 检查某个查询类型是否启用
const isTypeEnabled = (typeKey) => {
  if (typeKey === 'waybill') {
    return trackTypeNavs.value.some(nav => nav.url === '/track')
  } else if (typeKey === 'parcel') {
    return trackTypeNavs.value.some(nav => nav.url === '/track?type=parcel')
  }
  return false
}

// 切换Tab
const switchTab = (tab) => {
  activeTab.value = tab
  // 根据Tab更新URL查询参数
  if (tab === 'waybill') {
    router.push('/track')
  } else {
    router.push('/track?type=parcel')
  }
  // 清空查询结果
  trackStore.setTrackNumber('')
  trackStore.error = ''
  trackStore.result = ''
  // 清空包裹表单
  parcelForm.value = {
    country: '',
    type: '包裹',
    weight: ''
  }
  // 清空错误状态
  formErrors.value = {
    country: false,
    weight: false
  }
}

// 运单查询页面不使用 Banner 图片，使用空白区域

// 使用 Pinia store 中的状态
const trackNumber = computed({
  get: () => trackStore.trackNumber,
  set: (value) => trackStore.setTrackNumber(value)
})
const loading = computed(() => trackStore.loading)
const error = computed(() => trackStore.error)
const result = computed(() => trackStore.result)

const handleQuery = () => {
  if (activeTab.value === 'parcel') {
    // 重置错误状态
    formErrors.value.country = false
    formErrors.value.weight = false

    // 包裹查询逻辑 - 验证表单
    if (!parcelForm.value.country.trim()) {
      showMessage('请输入国家')
      formErrors.value.country = true
      return
    }
    // 验证国家名称只能包含中文、英文字母和空格
    const countryPattern = /^[\u4e00-\u9fa5a-zA-Z\s]+$/
    if (!countryPattern.test(parcelForm.value.country.trim())) {
      showMessage('国家名称只能包含中文或英文字母')
      formErrors.value.country = true
      return
    }
    if (!parcelForm.value.weight.trim()) {
      showMessage('请输入重量')
      formErrors.value.weight = true
      return
    }
    // 验证重量必须为数字
    if (isNaN(parcelForm.value.weight)) {
      showMessage('请确认输入的是数字')
      formErrors.value.weight = true
      return
    }else if(Number(parcelForm.value.weight) <= 0){
      showMessage('重量必须为大于0的数字')
      formErrors.value.weight = true
      return
    }

    trackStore.loading = true
    trackStore.error = ''
    trackStore.result = ''

    setTimeout(() => {
      trackStore.loading = false
      trackStore.error = '没有查询到价格数据'
    }, 500)
  } else {
    // 运单查询逻辑 - 使用弹窗提示
    if (!trackNumber.value.trim()) {
      showMessage('请输入运单号、FBA单号或转运单号查询')
      return
    }

    trackStore.loading = true
    trackStore.error = ''
    trackStore.result = ''

    setTimeout(() => {
      trackStore.loading = false
      trackStore.error = '没有查询到轨迹数据'
    }, 500)
  }
}

// 加载启用的查询类型导航
const loadTrackTypeNavs = async () => {
  try {
    console.log('[查询页面] 开始加载查询类型导航...')
    const res = await getEnabledNavigationTree()
    console.log('[查询页面] 导航 API 响应:', res)

    if (res.data && res.data.length > 0) {
      // 通过 code 字段查找导航（最稳定，不受管理员修改名称和URL影响）
      const infoQueryNav = res.data.find(nav => nav.code === 'track_query')

      console.log('[查询页面] 找到的查询导航:', infoQueryNav)

      if (infoQueryNav && infoQueryNav.children && infoQueryNav.children.length > 0) {
        trackTypeNavs.value = infoQueryNav.children
        console.log('[查询页面] 查询类型子菜单:', trackTypeNavs.value)

        // 如果当前激活的Tab被禁用了，切换到第一个启用的类型
        if (!isTypeEnabled(activeTab.value)) {
          const firstNav = trackTypeNavs.value[0]
          // 根据URL判断类型
          if (firstNav.url === '/track') {
            activeTab.value = 'waybill'
            router.replace('/track')
          } else if (firstNav.url === '/track?type=parcel') {
            activeTab.value = 'parcel'
            router.replace('/track?type=parcel')
          }
        }
      } else {
        console.warn('[查询页面] 没有找到查询类型子菜单')
        showMessage('查询功能暂时不可用')
      }
    }
  } catch (error) {
    console.error('[查询页面] 获取导航配置失败', error)
    // 使用默认配置
    trackTypeNavs.value = [
      { name: '运单查询', url: '/track', sortOrder: 1 },
      { name: '包裹查询', url: '/track?type=parcel', sortOrder: 2 }
    ]
    console.log('[查询页面] 使用默认配置')
  }
}

// 检查并跳转到正确的查询类型页面
const checkAndRedirect = () => {
  // 如果当前激活的Tab被禁用了，切换到第一个启用的类型
  if (trackTypeNavs.value.length > 0 && !isTypeEnabled(activeTab.value)) {
    const firstNav = trackTypeNavs.value[0]
    // 根据URL判断类型
    if (firstNav.url === '/track') {
      activeTab.value = 'waybill'
      router.replace('/track')
    } else if (firstNav.url === '/track?type=parcel') {
      activeTab.value = 'parcel'
      router.replace('/track?type=parcel')
    }
  }
}

// 监听路由变化，更新activeTab
watch(() => route.query.type, (newType) => {
  if (newType === 'parcel') {
    activeTab.value = 'parcel'
  } else {
    activeTab.value = 'waybill'
  }
}, { immediate: true })

onMounted(async () => {
  // 加载启用的查询类型导航
  await loadTrackTypeNavs()

  // 从URL参数获取运单号/包裹号
  if (route.query.number) {
    trackStore.setTrackNumber(route.query.number)
    handleQuery()
  }
})

// 每次页面激活时重新加载导航配置（解决从后台切换回来时数据不更新的问题）
onActivated(async () => {
  await loadTrackTypeNavs()
  // 加载完成后检查是否需要跳转
  checkAndRedirect()
})
</script>

<style scoped>
/* 错误信息样式 - 覆盖全局样式，使用更大的字体 */
#track_result :deep(.errmsg) {
  padding: 30px 0px;
  text-align: center;
  color: #ff0000;
  font-size: 22px;
}

#track ul {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  justify-content: flex-start;
}

#track ul li {
  cursor: pointer;
}

#track ul li a {
  text-decoration: none;
  color: inherit;
}

/* 包裹查询表单样式 */
.parcel-form {
  background-color: #fff;
  padding: 0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-row label {
  min-width: 60px;
  font-size: 14px;
  color: #333;
  text-align: right;
  margin-right: 10px;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  background-color: #fff;
}

.form-row input:focus,
.form-row select:focus {
  outline: none;
  border-color: #6a3906;
}

.form-row .unit {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
}

.form-row input::placeholder {
  color: #999;
}

/* 输入框错误状态样式 */
.input-error {
  border-color: #ff0000 !important;
  background-color: #fff5f5;
}

.input-error:focus {
  border-color: #ff0000 !important;
}

/* 无查询类型提示样式 */
.no-track-types {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
