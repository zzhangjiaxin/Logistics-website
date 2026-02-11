<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>{{ mainTitle }}</h2>
        <p>{{ subTitle }}</p>
      </div>
    </div>

    <!-- 移动端标题 -->
    <div id="bname-m">
      <h2>{{ isFaqPage ? '常见问题' : (isCategoryPage ? categoryTitle : '帮助中心') }}</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m" v-if="!isFaqPage">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link v-if="isCategoryPage" to="/help">帮助中心</router-link>
      <i v-if="isCategoryPage" class="layui-icon layui-icon-right"></i>
      <strong>{{ isCategoryPage ? categoryTitle : '帮助中心' }}</strong>
    </div>

    <!-- 搜索 -->
    <div id="faqss" v-if="!isCategoryPage && !isFaqPage">
      <div>
        <input type="text" v-model="searchKey" maxlength="40" placeholder="输入关键词搜索" @keyup.enter="handleSearch">
        <i class="fyicon icon-search" @click="handleSearch"></i>
      </div>
    </div>

    <!-- 帮助分类 -->
    <div id="help" v-if="!isCategoryPage && !isFaqPage">
      <div class="list wrap">
        <router-link
          v-for="(item, index) in helpCategories"
          :key="index"
          :to="`/arts-${item.id}`"
        >
          <img :src="item.icon" alt="">
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 常见问题 -->
    <div id="faq">
      <div class="wrap">
        <div class="tits" v-if="!isFaqPage">
          <h2>{{ isCategoryPage ? categoryTitle : '常见问题' }}</h2>
        </div>
        <div class="tits" v-else>
          <h2>常见问题</h2>
        </div>

        <!-- FAQ列表 -->
        <ul class="list">
          <li v-for="faq in faqData" :key="faq.id">
            <router-link :to="`/arts_ds/${faq.id}`">{{ faq.title }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- 服务链接 -->
    <div id="fyw" v-if="!isFaqPage">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { getPublicArticleList } from '@/api/article'

useScrollPosition()

const route = useRoute()
const router = useRouter()

import defaultBannerBg from '@/assets/uploadfiles/20230706-142647.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('help', {
  bannerBg: defaultBannerBg,
  mainTitle: '帮助中心',
  subTitle: '始于客户需求，终于客户满意'
})

// 默认分类图标
import help1 from '@/assets/uploadfiles/20230706-143302.png'
import help2 from '@/assets/uploadfiles/20230706-143344.png'
import help3 from '@/assets/uploadfiles/20230706-143353.png'
import help4 from '@/assets/uploadfiles/20230706-143315.png'
import help5 from '@/assets/uploadfiles/20230706-143325.png'
import help6 from '@/assets/uploadfiles/20230706-143336.png'

// 硬编码帮助分类
const helpCategories = [
  { id: 1, icon: help1, title: '安全合规性', desc: '安全合规性', category: 'security' },
  { id: 2, icon: help2, title: '新手指南', desc: '帐户使用情况', category: 'beginner' },
  { id: 3, icon: help3, title: '自助服务', desc: '帐户使用情况', category: 'self-service' },
  { id: 4, icon: help4, title: '账户服务', desc: '帐户使用情况', category: 'account' },
  { id: 5, icon: help5, title: '平台集合', desc: '跨多个平台的统一管理', category: 'platform' },
  { id: 6, icon: help6, title: '增值服务', desc: '多种创新增值功能', category: 'value-added' }
]

const searchKey = ref('')

// FAQ列表
const faqList = ref([])

const handleSearch = () => {
  if (!searchKey.value.trim()) {
    showMessage('请输入搜索关键词')
    return
  }
  router.push({
    path: '/help-search',
    query: { search_key: searchKey.value.trim() }
  })
}

// 判断是否为常见问题页面
const isFaqPage = computed(() => {
  return route.meta.isFaqPage === true || route.path === '/faq'
})

// 判断是否为分类页面
const isCategoryPage = computed(() => {
  return route.params.id !== undefined
})

// 当前分类ID
const currentCategoryId = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null
})

// 当前分类信息
const currentCategory = computed(() => {
  if (!currentCategoryId.value) return null
  return helpCategories.find(cat => cat.id === currentCategoryId.value)
})

// 分类标题
const categoryTitle = computed(() => {
  return currentCategory.value?.title || '常见问题'
})

// 显示的FAQ数据
const faqData = computed(() => {
  if (isCategoryPage.value) {
    // 分类页面：不显示FAQ列表（与原来一致）
    return []
  }
  return faqList.value
})

// 从API获取FAQ列表
async function fetchFaqList() {
  try {
    const res = await getPublicArticleList({
      type: 'faq',
      page: 1,
      pageSize: 100
    })
    faqList.value = res.data.list || []
  } catch (e) {
    console.error('获取FAQ列表失败:', e)
    faqList.value = []
  }
}

// 监听路由变化，重置状态
watch(() => route.path, () => {
  searchKey.value = ''
})

// 页面加载时获取数据
onMounted(() => {
  fetchFaqList()
})
</script>

<style scoped>
#fyw {
  background-image: url(@/assets/images/bg3.jpg);
}

@media only screen and (max-width: 480px) {
  #fyw > div {
    padding-top: 0;
  }
}
</style>
