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
      <h2>新闻中心</h2>
      <span></span>
    </div>

    <!-- 移动端分类菜单 -->
    <div id="bmenu-m">
      <router-link to="/news-1">
        公司新闻<i class="layui-icon layui-icon-right"></i>
      </router-link>
      <router-link to="/news-2">
        行业动态<i class="layui-icon layui-icon-right"></i>
      </router-link>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/news">新闻中心</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>搜索</strong>
    </div>

    <!-- 面包屑导航 - 桌面端 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/news">新闻中心</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <strong>搜索</strong>
        <div class="search">
          <input
            type="text"
            id="search_key"
            v-model="inputKeyword"
            @keyup.enter="handleSearch"
            maxlength="40"
            placeholder="搜索新闻..."
          >
          <button @click="handleSearch">
            <i class="fyicon icon-search"></i>搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div id="content" class="wrap" style="padding-bottom: 0;">
      <!-- 搜索结果提示 -->
      <div v-if="searchKeyword" style="padding: 20px 0; color: #666;">
        <p>搜索关键词：<strong style="color: #333;">{{ searchKeyword }}</strong></p>
        <p>找到 <strong style="color: #e60012;">{{ total }}</strong> 条相关新闻</p>
      </div>

      <!-- 新闻列表 -->
      <div id="news" v-if="newsList.length > 0">
        <router-link
          v-for="news in newsList"
          :key="news.id"
          :to="`/news_ds-${news.id}`"
        >
          <div class="imgs">
            <img :src="getFullImageUrl(news.coverImage)" :alt="news.title" :title="news.title">
          </div>
          <div class="text">
            <h2 class="gotms" :title="news.title">{{ news.title }}</h2>
            <p class="gotms">{{ news.description }}</p>
            <span>{{ news.publishDate }}</span>
          </div>
        </router-link>
      </div>

      <!-- 无搜索结果提示 -->
      <div v-else-if="!loading" style="padding: 60px 0; text-align: center; color: #999;">
        <i class="layui-icon layui-icon-search" style="font-size: 60px; color: #ddd;"></i>
        <p style="margin-top: 20px; font-size: 16px;">未找到相关新闻</p>
        <p style="margin-top: 10px;">
          <router-link to="/news" style="color: #e60012;">返回新闻中心</router-link>
        </p>
      </div>

      <!-- 桌面端分页器 -->
      <div id="news_page" v-if="totalPages > 1">
        <div class="fypage">
          <a
            @click.prevent="currentPage > 1 && goToPage(currentPage - 1)"
            href="#"
            :class="['fypage_prev', { 'fypage_disabled': currentPage === 1 }]"
          >
            <i class="layui-icon layui-icon-left"></i>
          </a>
          <span
            v-for="page in totalPages"
            :key="page"
            :class="{ 'fypage_current': page === currentPage }"
            @click="page !== currentPage && goToPage(page)"
            style="cursor: pointer;"
          >
            {{ page }}
          </span>
          <a
            @click.prevent="currentPage < totalPages && goToPage(currentPage + 1)"
            href="#"
            :class="['fypage_next', { 'fypage_disabled': currentPage === totalPages }]"
          >
            <i class="layui-icon layui-icon-right"></i>
          </a>
        </div>
      </div>

      <!-- 移动端分页器 -->
      <div id="news_mpage" v-if="totalPages > 1">
        <div class="mfypage">
          <span class="fypage_disabled">{{ currentPage }} / {{ totalPages }}</span>
          <a
            v-if="currentPage < totalPages"
            @click.prevent="goToPage(currentPage + 1)"
            href="#"
            class="fypage_str"
          >
            下一页
          </a>
          <input
            v-model.number="jumpPage"
            type="text"
            id="mfypage_gov"
            maxlength="5"
            @keyup.enter="jumpToPage"
          >
          <span id="mfypage_gobtn" @click="jumpToPage" style="cursor: pointer;">跳转</span>
        </div>
      </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { BASE_URL } from '@/utils/request'
import { getPublicArticleList } from '@/api/article'

const route = useRoute()
const router = useRouter()

// 图片URL处理
function getFullImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}/api${url}`
}

// 使用滚动位置管理
useScrollPosition()

// 分页状态
const currentPage = ref(1)
const pageSize = 8
const jumpPage = ref('')
const total = ref(0)
const loading = ref(false)

// 搜索关键词（从URL参数获取）
const searchKeyword = ref(route.query.search_key || '')
// 输入框的临时值
const inputKeyword = ref(route.query.search_key || '')

// 新闻列表数据
const newsList = ref([])

import defaultBannerBg from '@/assets/uploadfiles/20230706-135232.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('news-search', {
  bannerBg: defaultBannerBg,
  mainTitle: '新闻中心',
  subTitle: '消息灵通，保持领先'
})

// 从API获取搜索结果
async function fetchSearchResults() {
  loading.value = true
  try {
    const res = await getPublicArticleList({
      type: 'news',
      keyword: searchKeyword.value.trim(),
      page: currentPage.value,
      pageSize: pageSize
    })
    newsList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (e) {
    console.error('搜索新闻失败:', e)
    newsList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize)
})

// 切换页码
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchSearchResults()
    const newsElement = document.getElementById('news')
    if (newsElement) {
      newsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// 跳转到指定页
const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    goToPage(page)
    jumpPage.value = ''
  } else {
    alert('请输入有效的页码！')
  }
}

// 监听URL参数变化
watch(() => route.query.search_key, (newKeyword) => {
  searchKeyword.value = newKeyword || ''
  inputKeyword.value = newKeyword || ''
  currentPage.value = 1
  fetchSearchResults()
})

// 搜索处理函数
const handleSearch = () => {
  if (inputKeyword.value.trim()) {
    router.push({
      path: '/news-search',
      query: { search_key: inputKeyword.value.trim() }
    })
  } else {
    showMessage('请输入搜索关键词')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchSearchResults()
})
</script>
