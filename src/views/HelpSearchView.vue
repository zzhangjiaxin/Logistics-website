<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>帮助中心</h2>
        <p>始于客户需求，终于客户满意</p>
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
          <p>找到 <strong style="color: #e60012;">{{ filteredFaqData.length }}</strong> 条相关问题</p>
        </div>

        <!-- FAQ列表 -->
        <ul class="list" v-if="filteredFaqData.length > 0">
          <li v-for="faq in filteredFaqData" :key="faq.id">
            <router-link :to="`/arts_ds${faq.id}`">{{ faq.question }}</router-link>
          </li>
        </ul>

        <!-- 无搜索结果提示 -->
        <div v-else style="padding: 60px 0; text-align: center; color: #999;">
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'

useScrollPosition()

const route = useRoute()

import bannerBg from '@/assets/uploadfiles/20230706-142647.jpg'

// 搜索关键词（从URL参数获取）
const searchKeyword = ref(route.query.search_key || '')

// 硬编码的FAQ数据（与HelpView.vue保持一致）
const allFaqData = [
  {
    id: 10,
    question: '"CE"证明是什么？',
    category: 'security'
  },
  {
    id: 9,
    question: 'FOB、CNF、CIF指的是什么？',
    category: 'self-service'
  },
  {
    id: 8,
    question: 'UPS国际快递为什么分蓝单和红单',
    category: 'self-service'
  },
  {
    id: 7,
    question: '香港DHL和大陆DHL的区别 ?',
    category: 'self-service'
  },
  {
    id: 6,
    question: '国际快递公司是怎样测量货物尺寸的?',
    category: 'self-service'
  },
  {
    id: 5,
    question: '物流的定义',
    category: 'beginner'
  },
  {
    id: 4,
    question: '国际物流中的角色',
    category: 'beginner'
  },
  {
    id: 3,
    question: '一般贸易进出口流程图',
    category: 'beginner'
  }
]

// 根据搜索关键词过滤FAQ（只搜索标题）
const filteredFaqData = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allFaqData
  }
  const keyword = searchKeyword.value.toLowerCase().trim()
  return allFaqData.filter(faq =>
    faq.question.toLowerCase().includes(keyword)
  )
})

// 监听URL参数变化
watch(() => route.query.search_key, (newKeyword) => {
  searchKeyword.value = newKeyword || ''
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
