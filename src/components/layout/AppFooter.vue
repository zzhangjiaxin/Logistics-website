<template>
  <div id="finfo">
    <div class="wrap">
      <div class="logo">
        <router-link to="/">
          <img :src="footerLogoUrl" alt="">
        </router-link>
      </div>
      <ul class="fnav">
        <li v-for="nav in footerNavs" :key="nav.id">
          <h3>{{ nav.name }}</h3>
          <template v-if="nav.children && nav.children.length > 0">
            <p v-for="child in nav.children" :key="child.id">
              <router-link :to="child.url" :target="child.target">{{ child.name }}</router-link>
            </p>
          </template>
        </li>
        <li>
          <h3>联系我们</h3>
          <div class="lxfs">
            <p class="tel">电话：{{ mainPhone }}</p>
            <p class="address">
              <span>地址：</span>
              <span>{{ mainAddress }}</span>
            </p>
            <p class="shipinhao" v-if="siteStore.siteInfo.videoAccount"><i class="fyicon icon-weixin"></i>视频号：{{ siteStore.siteInfo.videoAccount }}</p>
            <p class="douyin" v-if="siteStore.siteInfo.douyinAccount">抖音：{{ siteStore.siteInfo.douyinAccount }}</p>
          </div>
        </li>
      </ul>
      <div class="qrcode" v-if="qrcodeUrl">
        <img :src="qrcodeUrl" alt="微信公众号">
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
import { ref, computed, onMounted } from 'vue'
import { useSiteStore, useCompanyInfoStore } from '@/stores'
import { BASE_URL } from '@/utils/request'
import { getEnabledNavigationTree } from '@/api/navigation'

const siteStore = useSiteStore()
const companyInfoStore = useCompanyInfoStore()

// 导航列表（只取有子菜单的导航项用于页脚展示，排除首页、帮助中心、联系我们等无子菜单项）
const footerNavs = ref([])

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

// 计算属性：微信公众号二维码URL（从站点信息获取）
const qrcodeUrl = computed(() => {
  return getFullImageUrl(siteStore.siteInfo.wechatQrcode)
})

// 计算属性：主电话（取分支机构第一条）
const mainPhone = computed(() => {
  const branches = companyInfoStore.branches
  if (branches && branches.length > 0) {
    return branches[0].phone || '400-836-9156'
  }
  return '400-836-9156'
})

// 计算属性：主地址（取分支机构第一条）
const mainAddress = computed(() => {
  const branches = companyInfoStore.branches
  if (branches && branches.length > 0) {
    return branches[0].address || '深圳市宝安区福海街道展景路83号中港广场6栋B座1005'
  }
  return '深圳市宝安区福海街道展景路83号中港广场6栋B座1005'
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

// 获取启用的导航列表，筛选有子菜单的项用于页脚
const fetchFooterNavs = async () => {
  try {
    const res = await getEnabledNavigationTree()
    if (res.data) {
      // 只取有子菜单的导航项展示在页脚（如主营渠道、新闻中心、关于我们）
      footerNavs.value = res.data.filter(nav => nav.children && nav.children.length > 0)
    }
  } catch (error) {
    console.error('[页脚] 获取导航列表失败:', error)
    // 使用默认导航
    footerNavs.value = [
      {
        id: 4, name: '主营渠道', children: [
          { id: 41, name: '空派专线', url: '/business-1', target: '_self' },
          { id: 42, name: '海派专线', url: '/business-2', target: '_self' },
          { id: 43, name: '陆运专线', url: '/business-3', target: '_self' }
        ]
      },
      {
        id: 5, name: '新闻中心', children: [
          { id: 51, name: '公司新闻', url: '/news-1', target: '_self' },
          { id: 52, name: '行业动态', url: '/news-2', target: '_self' }
        ]
      },
      {
        id: 3, name: '关于我们', children: [
          { id: 31, name: '公司简介', url: '/aboutus#dw1', target: '_self' },
          { id: 32, name: '企业理念', url: '/aboutus#dw2', target: '_self' },
          { id: 33, name: '发展历程', url: '/aboutus#dw3', target: '_self' },
          { id: 34, name: '荣誉资质', url: '/aboutus#dw4', target: '_self' }
        ]
      }
    ]
  }
}

onMounted(() => {
  fetchFooterNavs()
})
</script>
