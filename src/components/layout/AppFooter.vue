<template>
  <div id="finfo">
    <div class="wrap">
      <div class="logo">
        <router-link to="/">
          <img :src="footerLogoUrl" alt="翔宇达">
        </router-link>
      </div>
      <ul class="fnav">
        <li>
          <h3>主营渠道</h3>
          <p><router-link to="/business-1">空派专线</router-link></p>
          <p><router-link to="/business-2">海派专线</router-link></p>
          <p><router-link to="/business-3">陆运专线</router-link></p>
        </li>
        <li>
          <h3>新闻中心</h3>
          <p><router-link to="/news-1">公司新闻</router-link></p>
          <p><router-link to="/news-2">行业动态</router-link></p>
        </li>
        <li>
          <h3>关于我们</h3>
          <p><router-link to="/aboutus#dw1">公司简介</router-link></p>
          <p><router-link to="/aboutus#dw2">企业理念</router-link></p>
          <p><router-link to="/aboutus#dw3">发展历程</router-link></p>
          <p><router-link to="/aboutus#dw4">荣誉资质</router-link></p>
        </li>
        <li>
          <h3>联系我们</h3>
          <div class="lxfs">
            <p class="tel">电话：400-836-9156</p>
            <p class="address">
              <span>地址：</span>
              <span>深圳市宝安区福海街道展景路83号中港广场6栋B座1005</span>
            </p>
            <p class="shipinhao"><i class="fyicon icon-weixin"></i>视频号：翔宇达运通国际</p>
            <p class="douyin">抖音：翔宇达运通国际物流</p>
          </div>
        </li>
      </ul>
      <div class="qrcode">
        <img src="@/assets/uploadfiles/20230704-152915.jpg" alt="微信公众号">
        <p>扫码关注微信公众号</p>
      </div>
    </div>
  </div>
  <div id="footer">
    <div class="wrap">
      <p style="text-align: center;" v-html="footerInfoHtml"></p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSiteStore } from '@/stores'
import { BASE_URL } from '@/utils/request'

const siteStore = useSiteStore()

// 获取完整的图片 URL
const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return `${BASE_URL}/api${imageUrl}`
}

// 计算属性：尾部LOGO完整URL
const footerLogoUrl = computed(() => {
  return getFullImageUrl(siteStore.siteInfo.footerLogo)
})

// 计算属性：尾部信息HTML（自动拼接备案号）
const footerInfoHtml = computed(() => {
  let html = siteStore.siteInfo.footerInfo || 'Copyright &copy; 2023 XYD Global Express Service.&nbsp;All rights reserved.'

  // 如果有备案号，自动添加备案链接
  if (siteStore.siteInfo.siteIcp) {
    html += `&nbsp;<a href="https://beian.miit.gov.cn/" target="_blank">${siteStore.siteInfo.siteIcp}</a>`
  }

  return html
})
</script>
