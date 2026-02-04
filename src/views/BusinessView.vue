<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>主营渠道</h2>
        <p>专业物流，全球配送</p>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;<strong>主营渠道</strong>
      </div>
    </div>
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>主营渠道</strong>
    </div>

    <!-- 业务列表 -->
    <div id="iyw" style="background-color: #fff;">
      <div class="wrap">
        <div class="list">
          <router-link to="/business-1">
            <div class="imgs">
              <img src="@/assets/uploadfiles/20230704-154721.jpg" alt="空派专线" title="空派专线">
            </div>
            <div class="text">
              <h2>空派专线</h2>
              <p class="gots">专注于美国、英国和墨西哥</p>
              <div class="days"><span>7</span> 个工作日</div>
            </div>
          </router-link>
          <router-link to="/business-2">
            <div class="imgs">
              <img src="@/assets/uploadfiles/20230704-154834.jpg" alt="海派专线" title="海派专线">
            </div>
            <div class="text">
              <h2>海派专线</h2>
              <p class="gots">专注于美国、英国、欧洲和墨西哥</p>
              <div class="days"><span>35</span> 个工作日</div>
            </div>
          </router-link>
          <router-link to="/business-3">
            <div class="imgs">
              <img src="@/assets/uploadfiles/20230711-095606.jpg" alt="陆运专线" title="陆运专线">
            </div>
            <div class="text">
              <h2>陆运专线</h2>
              <p class="gots">专注于英国、欧洲和越南</p>
              <div class="days"><span>25</span> 个工作日</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'

useScrollPosition()

import bannerBg from '@/assets/uploadfiles/20230707-131606.jpg'
</script>
