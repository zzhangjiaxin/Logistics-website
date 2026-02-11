<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>{{ mainTitle }}</h2>
        <p>{{ subTitle }}</p>
      </div>
    </div>

    <!-- 面包屑导航 - 桌面端 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/help">帮助中心</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <strong>搜索</strong>
      </div>
    </div>

    <!-- 移动端标题 -->
    <div id="bname-m">
      <h2>搜索</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/help">帮助中心</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>搜索</strong>
    </div>

    <!-- 搜索结果 -->
    <div id="faq">
      <div class="wrap">
        <div class="tits">
          <h2>搜索</h2>
        </div>

        <!-- 搜索结果提示 -->
        <div v-if="searchKeyword" style="padding: 20px 0; color: #666;">
          <p>搜索关键词：<strong style="color: #333;">{{ searchKeyword }}</strong></p>
          <p>找到 <strong style="color: #e60012;">{{ total }}</strong> 条相关问题</p>
        </div>

        <!-- FAQ列表 -->
        <ul class="list" v-if="faqList.length > 0">
          <li v-for="faq in faqList" :key="faq.id">
            <router-link :to="`/arts_ds${faq.id}`">{{ faq.title }}</router-link>
          </li>
        </ul>

        <!-- 无搜索结果提示 -->
        <div v-else-if="!loading" style="padding: 60px 0; text-align: center; color: #999;">
          <i class="layui-icon layui-icon-search" style="font-size: 60px; color: #ddd;"></i>
          <p style="margin-top: 20px; font-size: 16px;">未找到相关问题</p>
          <p style="margin-top: 10px;">
            <router-link to="/help" style="color: #e60012;">返回帮助中心</router-link>
          </p>
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
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { getPublicArticleList } from '@/api/article'

useScrollPosition()

const route = useRoute()

import defaultBannerBg from '@/assets/uploadfiles/20230706-142647.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('help-search', {
  bannerBg: defaultBannerBg,
  mainTitle: '帮助中心',
  subTitle: '始于客户需求，终于客户满意'
})

// 搜索关键词（从URL参数获取）
const searchKeyword = ref(route.query.search_key || '')
const faqList = ref([])
const total = ref(0)
const loading = ref(false)

// 从API获取搜索结果
async function fetchSearchResults() {
  loading.value = true
  try {
    const res = await getPublicArticleList({
      type: 'faq',
      keyword: searchKeyword.value.trim(),
      page: 1,
      pageSize: 100
    })
    faqList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (e) {
    console.error('搜索FAQ失败:', e)
    faqList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 监听URL参数变化
watch(() => route.query.search_key, (newKeyword) => {
  searchKeyword.value = newKeyword || ''
  fetchSearchResults()
})

// 页面加载时获取数据
onMounted(() => {
  fetchSearchResults()
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
