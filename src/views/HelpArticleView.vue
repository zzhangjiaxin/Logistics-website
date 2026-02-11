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
      <h2>常见问题</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/help">帮助中心</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/faq">常见问题</router-link>
    </div>

    <!-- 面包屑导航 - PC端 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/help">帮助中心</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/faq">常见问题</router-link>
      </div>
    </div>

    <!-- 文章内容 -->
    <div id="content" class="wrap">
      <div id="news_info">
        <h1>{{ articleData.title }}</h1>
        <p>
          <span><i class="layui-icon layui-icon-time"></i>{{ articleData.date }}</span>
        </p>
      </div>
      <div class="editorc_box">
        <div class="editorc editorc_tbe" v-html="articleData.content"></div>
      </div>

      <!-- 上一篇/下一篇 -->
      <div id="prevnext">
        <p v-if="articleData.prev" class="gots">
          上一篇：<router-link :to="articleData.prev.link">{{ articleData.prev.title }}</router-link>
        </p>
        <p v-else class="gots">上一篇：没有了</p>

        <p v-if="articleData.next" class="gots">
          下一篇：<router-link :to="articleData.next.link">{{ articleData.next.title }}</router-link>
        </p>
        <p v-else class="gots">下一篇：没有了</p>

        <router-link to="/help" id="prevnext_back">
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

import defaultBannerBg from '@/assets/uploadfiles/20230706-142647.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('help-article', {
  bannerBg: defaultBannerBg,
  mainTitle: '帮助中心',
  subTitle: '始于客户需求，终于客户满意'
})

// 文章数据
const article = ref(null)
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
    article.value = res.data
    await fetchPrevNext(id)
  } catch (e) {
    console.error('获取FAQ详情失败:', e)
    article.value = null
  } finally {
    loading.value = false
  }
}

// 获取上一篇/下一篇
async function fetchPrevNext(currentId) {
  try {
    const res = await getPublicArticleList({
      type: 'faq',
      page: 1,
      pageSize: 100
    })
    const list = res.data.list || []
    const currentIndex = list.findIndex(item => item.id === Number(currentId))
    if (currentIndex > 0) {
      const prev = list[currentIndex - 1]
      prevArticle.value = { title: prev.title, link: `/arts_ds/${prev.id}` }
    } else {
      prevArticle.value = null
    }
    if (currentIndex >= 0 && currentIndex < list.length - 1) {
      const next = list[currentIndex + 1]
      nextArticle.value = { title: next.title, link: `/arts_ds/${next.id}` }
    } else {
      nextArticle.value = null
    }
  } catch (e) {
    console.error('获取上下篇失败:', e)
    prevArticle.value = null
    nextArticle.value = null
  }
}

// 构建模板需要的数据格式
const articleData = computed(() => {
  if (!article.value) {
    return {
      title: '文章不存在',
      date: '',
      content: '<p>抱歉，您访问的文章不存在。</p>',
      prev: null,
      next: null
    }
  }
  const a = article.value
  return {
    title: a.title,
    date: a.publishDate,
    content: processContentImages(a.content || ''),
    prev: prevArticle.value,
    next: nextArticle.value
  }
})

// 页面加载时获取数据
onMounted(() => {
  fetchArticle(route.params.id)
})

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticle(newId)
  }
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
