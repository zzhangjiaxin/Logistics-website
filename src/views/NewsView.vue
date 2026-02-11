<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>{{ mainTitle }}</h2>
        <p>{{ subTitle }}</p>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;<strong>新闻中心</strong>
        <div class="search">
          <input
            type="text"
            id="search_key"
            v-model="searchKeyword"
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
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>新闻中心</strong>
    </div>

    <!-- 内容区域 -->
    <div id="content" class="wrap" style="padding-bottom: 0;">
      <!-- 新闻轮播 -->
      <div id="xwtj">
        <div class="swiper-container">
          <swiper
            :modules="modules"
            :loop="true"
            :autoHeight="true"
            :autoplay="{ delay: 6000, disableOnInteraction: false }"
            :pagination="{ clickable: true, el: '#xwtj .swiper-pagination' }"
            :speed="500"
            :spaceBetween="30"
          >
            <swiper-slide v-for="(news, index) in featuredNews" :key="index">
              <router-link :to="news.link" class="imgs" :title="news.title">
                <img :src="news.image" :alt="news.title">
              </router-link>
              <div class="text">
                <h2 class="gotms">
                  <router-link :to="news.link">{{ news.title }}</router-link>
                </h2>
                <p class="desc gotms">{{ news.desc }}</p>
                <span class="date">{{ news.date }}</span>
                <router-link :to="news.link" class="more">查看详情</router-link>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <!-- 新闻列表 -->
      <div id="news">
        <router-link
          v-for="news in paginatedNews"
          :key="news.link"
          :to="news.link"
        >
          <div class="imgs">
            <img :src="news.image" :alt="news.title" :title="news.title">
          </div>
          <div class="text">
            <h2 class="gotms" :title="news.title">{{ news.title }}</h2>
            <p class="gotms">{{ news.desc }}</p>
            <span>{{ news.date }}</span>
          </div>
        </router-link>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { BASE_URL } from '@/utils/request'
import { getPublicArticleList } from '@/api/article'

const router = useRouter()
const route = useRoute()
const modules = [Pagination, Autoplay]

// 使用滚动位置管理
useScrollPosition()

// 分页状态
const currentPage = ref(1)
const pageSize = 8 // 每页显示8条新闻
const totalCount = ref(0)
const jumpPage = ref('')

// 搜索状态
const searchKeyword = ref('')

// 新闻数据
const allNews = ref([])
const loading = ref(false)

import defaultBannerBg from '@/assets/uploadfiles/20230706-135232.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('news', {
  bannerBg: defaultBannerBg,
  mainTitle: '新闻中心',
  subTitle: '消息灵通，保持领先'
})

// 图片URL处理
function getFullImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}/api${url}`
}

// 将API数据转换为页面需要的格式
function mapArticle(item) {
  return {
    id: item.id,
    title: item.title,
    desc: item.description || '',
    date: item.publishDate,
    image: getFullImageUrl(item.coverImage),
    link: `/news_ds-${item.id}`,
    isFeatured: item.isFeatured
  }
}

// 获取新闻列表
async function fetchNewsList() {
  loading.value = true
  try {
    const res = await getPublicArticleList({
      type: 'news',
      page: currentPage.value,
      pageSize: pageSize
    })
    allNews.value = (res.data.list || []).map(mapArticle)
    totalCount.value = res.data.total || 0
  } catch (e) {
    console.error('获取新闻列表失败:', e)
  } finally {
    loading.value = false
  }
}

// 获取推荐新闻（is_featured=1的）
const featuredNewsList = ref([])
async function fetchFeaturedNews() {
  try {
    const res = await getPublicArticleList({
      type: 'news',
      page: 1,
      pageSize: 20
    })
    const list = (res.data.list || []).map(mapArticle)
    featuredNewsList.value = list.filter(n => n.isFeatured === 1).slice(0, 9)
    // 如果推荐新闻不足，用前9条补充
    if (featuredNewsList.value.length < 9) {
      featuredNewsList.value = list.slice(0, 9)
    }
  } catch (e) {
    console.error('获取推荐新闻失败:', e)
  }
}

// 推荐新闻
const featuredNews = computed(() => featuredNewsList.value)

// 总页数
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

// 当前页的新闻列表
const paginatedNews = computed(() => allNews.value)

// 页面加载
onMounted(() => {
  searchKeyword.value = ''
  fetchFeaturedNews()
  fetchNewsList()
})

// 监听路由变化
watch(() => route.path, () => {
  searchKeyword.value = ''
})

// 切换页码
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchNewsList()
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

// 搜索处理函数
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/news-search',
      query: { search_key: searchKeyword.value.trim() }
    })
  } else {
    showMessage('请输入搜索关键词')
  }
}
</script>
