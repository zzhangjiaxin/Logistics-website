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
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/news">新闻中心</router-link><template v-if="newsData.category">&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <strong>{{ categoryName }}</strong></template>
      </div>
    </div>
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/news">新闻中心</router-link>
      <template v-if="newsData.category">
      <i class="layui-icon layui-icon-right"></i>
      <strong>{{ categoryName }}</strong>
      </template>
    </div>

    <!-- 新闻内容 -->
    <div id="content" class="wrap">
      <div id="news_info">
        <h1>{{ newsData.title }}</h1>
        <p>
          <span v-if="newsData.category">{{ newsData.category }}</span>
          <span v-if="newsData.author"><i class="layui-icon layui-icon-username"></i>{{ newsData.author }}</span>
          <span><i class="layui-icon layui-icon-time"></i>{{ newsData.date }}</span>
        </p>
      </div>
      <div class="editorc_box">
        <div class="editorc editorc_tbe" v-html="newsData.content"></div>
      </div>

      <!-- 上一篇/下一篇 -->
      <div id="prevnext">
        <p v-if="newsData.prev">
          上一篇：<router-link :to="newsData.prev.link">{{ newsData.prev.title }}</router-link>
        </p>
        <p v-else>上一篇：没有了</p>

        <p class="gots" v-if="newsData.next">
          下一篇：<router-link :to="newsData.next.link">{{ newsData.next.title }}</router-link>
        </p>
        <p v-else class="gots">下一篇：没有了</p>

        <router-link :to="backLink" id="prevnext_back">
          <i class="layui-icon layui-icon-left"></i>返回列表
        </router-link>
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
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { BASE_URL } from '@/utils/request'
import { getPublicArticleById, getPublicArticleList } from '@/api/article'

const route = useRoute()

// 使用滚动位置管理
useScrollPosition()

import defaultBannerBg from '@/assets/uploadfiles/20230706-135232.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('news-detail', {
  bannerBg: defaultBannerBg,
  mainTitle: '新闻详情',
  subTitle: '了解翔宇达最新动态'
})

// 文章数据
const articleData = ref(null)
const prevArticle = ref(null)
const nextArticle = ref(null)
const loading = ref(false)

// 处理HTML内容中的图片路径
function processContentImages(html) {
  if (!html) return ''
  return html.replace(/src="\/uploads\//g, `src="${BASE_URL}/api/uploads/`)
}

// 获取文章详情
async function fetchArticle(id) {
  loading.value = true
  try {
    const res = await getPublicArticleById(id)
    articleData.value = res.data
    // 获取同分类的文章列表，用于计算上一篇/下一篇
    await fetchPrevNext(id)
  } catch (e) {
    console.error('获取新闻详情失败:', e)
    articleData.value = null
  } finally {
    loading.value = false
  }
}

// 获取上一篇/下一篇
async function fetchPrevNext(currentId) {
  try {
    const res = await getPublicArticleList({
      type: 'news',
      page: 1,
      pageSize: 100
    })
    const list = res.data.list || []
    const currentIndex = list.findIndex(item => item.id === Number(currentId))
    if (currentIndex > 0) {
      const prev = list[currentIndex - 1]
      prevArticle.value = { title: prev.title, link: `/news_ds-${prev.id}` }
    } else {
      prevArticle.value = null
    }
    if (currentIndex >= 0 && currentIndex < list.length - 1) {
      const next = list[currentIndex + 1]
      nextArticle.value = { title: next.title, link: `/news_ds-${next.id}` }
    } else {
      nextArticle.value = null
    }
  } catch (e) {
    console.error('获取上下篇失败:', e)
    prevArticle.value = null
    nextArticle.value = null
  }
}

// 使用 computed 构建模板需要的数据格式
const newsData = computed(() => {
  if (!articleData.value) {
    return {
      title: '新闻不存在',
      category: '',
      author: '',
      date: '',
      views: 0,
      content: '<p>抱歉，您访问的新闻不存在。</p>',
      prev: null,
      next: null
    }
  }
  const a = articleData.value
  return {
    title: a.title,
    category: a.navigationName || '',
    author: a.author || '',
    date: a.publishDate,
    views: a.views || 0,
    content: processContentImages(a.content || ''),
    prev: prevArticle.value,
    next: nextArticle.value
  }
})

// 根据后端返回的 navigationUrl 计算返回链接
const backLink = computed(() => {
  if (articleData.value && articleData.value.navigationUrl) {
    return articleData.value.navigationUrl
  }
  return '/news'
})

// 根据新闻分类计算分类名称
const categoryName = computed(() => {
  return newsData.value.category || '新闻中心'
})

// 页面加载时获取数据
onMounted(() => {
  fetchArticle(route.params.id)
})

// 监听路由参数变化（在详情页之间跳转时）
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticle(newId)
  }
})
</script>
