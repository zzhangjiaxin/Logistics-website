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
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;<strong>关于我们</strong>
      </div>
    </div>

    <!-- 移动端导航 -->
    <div id="bname-m" @click="toggleMobileNav">
      <h2>关于我们</h2>
      <span :class="{ active: mobileNavOpen }"></span>
    </div>
    <div id="bmenu-m" v-show="mobileNavOpen">
      <a href="#dw1">公司简介<i class="layui-icon layui-icon-right"></i></a>
      <a href="#dw2">企业理念<i class="layui-icon layui-icon-right"></i></a>
      <a href="#dw3">发展历程<i class="layui-icon layui-icon-right"></i></a>
      <a href="#dw4">荣誉资质<i class="layui-icon layui-icon-right"></i></a>
    </div>
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>关于我们</strong>
    </div>

    <div id="gywm">
      <!-- 公司简介 -->
      <div class="tits" id="dw1">
        <h2>公司简介</h2>
      </div>
      <div class="profile">
        <div class="wrap">
          <div class="imgs">
            <img :src="companyImage" alt="">
          </div>
          <div class="editorc">
            <p style="line-height:3;">
              <span style="font-size:24px;">
                <span style="font-family: 微软雅黑, Verdana, Arial;">
                  {{ companyDescription }}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- 企业理念 -->
      <div class="qyll" id="dw2">
        <div class="tits">
          <h2>企业理念</h2>
        </div>
        <div class="aw-imgs">
          <img src="@/assets/uploadfiles/20230715-145912.png" alt="">
        </div>
      </div>

      <!-- 发展历程 -->
      <div class="history" id="dw3">
        <div class="wrap">
          <div class="tits">
            <h2>发展历程</h2>
          </div>

          <ul class="list">
            <li v-for="item in historyItems" :key="item.year">
              <p class="year">{{ item.year }}</p>
              <p class="desc">{{ item.desc }}</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- 荣誉资质 -->
      <div class="cert" id="dw4">
        <div class="wrap">
          <div class="tits">
            <h2>荣誉资质</h2>
          </div>

          <div class="cont">
            <div class="name">
              <swiper
                ref="nameSwiper"
                :modules="modules"
                direction="vertical"
                :slides-per-view="5"
                :space-between="30"
                :observer="true"
                :observe-parents="true"
                @click="onNameClick"
                class="swiper-container"
              >
                <swiper-slide v-for="(cert, index) in certItems" :key="index" class="gots">
                  {{ cert.name }}
                </swiper-slide>
              </swiper>
              <div class="swiper-button">
                <i class="swiper-prev layui-icon layui-icon-up" @click="prevCert"></i>
                <i class="swiper-next layui-icon layui-icon-down" @click="nextCert"></i>
              </div>
            </div>
            <swiper
              ref="imgSwiper"
              :modules="modules"
              :only-external="true"
              :auto-height="true"
              :observer="true"
              :observe-parents="true"
              class="swiper-container imgs"
            >
              <swiper-slide v-for="(cert, index) in certItems" :key="index">
                <img :src="cert.image" :alt="cert.name">
              </swiper-slide>
            </swiper>
          </div>
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
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { getPublicCompanyProfile } from '@/api/companyProfile'
import { onDataChange } from '@/utils/crossTabSync'
import { BASE_URL } from '@/utils/request'
import defaultBannerBg from '@/assets/uploadfiles/20230706-133407.jpg'

useScrollPosition()

const { bannerBg, mainTitle, subTitle } = useBannerData('aboutus', {
  bannerBg: defaultBannerBg,
  mainTitle: '关于我们',
  subTitle: '不负所托，递遍全球'
})

const modules = [Navigation]
const mobileNavOpen = ref(false)
const nameSwiper = ref(null)
const imgSwiper = ref(null)

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

// 荣誉资质默认图片
import cert1 from '@/assets/thumbs/20230715-154422.jpg'
import cert2 from '@/assets/thumbs/20231013-111945.jpg'
import cert3 from '@/assets/thumbs/20231013-110459.jpg'
import cert4 from '@/assets/thumbs/20230715-162207.jpg'
import cert5 from '@/assets/thumbs/20230715-162314.jpg'
import cert6 from '@/assets/thumbs/20230715-162449.jpg'
import cert7 from '@/assets/thumbs/20230715-162458.jpg'
import cert8 from '@/assets/thumbs/20230715-162511.jpg'
import cert9 from '@/assets/thumbs/20230715-154116.jpg'
import cert10 from '@/assets/thumbs/20230715-153723.jpg'
import defaultCompanyImg from '@/assets/uploadfiles/20230706-133556.jpg'

// 默认数据
const defaultDescription = '深圳市翔宇达运通国际货运代理有限公司成立于 2009 年 6 月，位于深圳市宝安区会展湾，是一家国际货运一级代理公司，国内服务网点涵盖深圳会展湾、深圳坂田、广州、义乌。公司主营美国、英国、墨西哥、欧洲的空运和海运专线。在美西、美中共设立3个海外仓，并配备专业清关团队，保证高效通关和配送，另外在越南设立分公司，建立了庞大、稳定的客户群体。截至 2022 年底，公司已经拥有 200多名专业人员，致力于发展出口国外的纯电池、电子烟和FBA客户群体，在行业中享有较高的声誉和影响力。公司提供咨询报价、客户开户、报关清关、货物操作、全程追踪、专车配送的门到门双清含税一条龙服务，秉承"不负所托，递遍全球"的使命,为客户提供优质的物流服务。'

const defaultHistoryItems = [
  { year: '2022', desc: '2022年，营收超6亿元。' },
  { year: '2021', desc: '2021年，营收超3亿元。' },
  { year: '2019', desc: '2019年，营收突破1亿元。' },
  { year: '2018', desc: '2018年，营收超6000万元。' },
  { year: '2015', desc: '2015年，营收达到3000万元。' },
  { year: '2012', desc: '2012年，营收突破1000万元。' },
  { year: '2009', desc: '2009年，公司成立与深圳宝安。' }
]

const defaultCertItems = [
  { name: '深圳市电池行业协会理事单位', image: cert1 },
  { name: '宝安区福海街道快递物流协会常务副会长单位', image: cert2 },
  { name: '坂田跨境电商物流协会副会长单位', image: cert3 },
  { name: '深圳市玩具行业协会理事单位', image: cert4 },
  { name: '深圳市航空业协会优秀贡献单位', image: cert5 },
  { name: '第三届深航协国际物流商会年度峰会优秀展商', image: cert6 },
  { name: '成都市跨境电子商务协会理事单位', image: cert7 },
  { name: '中国深圳物博会优秀物流与供应链服务商', image: cert8 },
  { name: '中国深圳物博会FBA服务商TOP20', image: cert9 },
  { name: '广东省水路运输业务备案证明', image: cert10 }
]

// 响应式数据
const companyImage = ref(defaultCompanyImg)
const companyDescription = ref(defaultDescription)
const historyItems = ref(defaultHistoryItems)
const certItems = ref(defaultCertItems)

// 获取完整图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return BASE_URL + '/api' + path
}

// 从API加载数据
const fetchCompanyProfile = async () => {
  try {
    const res = await getPublicCompanyProfile()
    if (res.data) {
      // 公司简介
      if (res.data.companyIntro) {
        if (res.data.companyIntro.image) {
          companyImage.value = getImageUrl(res.data.companyIntro.image)
        }
        if (res.data.companyIntro.description) {
          companyDescription.value = res.data.companyIntro.description
        }
      }

      // 发展历程
      if (res.data.historyItems && res.data.historyItems.length > 0) {
        historyItems.value = res.data.historyItems
          .filter(item => item.isEnabled === 1)
          .map(item => ({
            year: item.year,
            desc: item.description
          }))
      }

      // 荣誉资质
      if (res.data.honorItems && res.data.honorItems.length > 0) {
        certItems.value = res.data.honorItems
          .filter(item => item.isEnabled === 1)
          .map(item => ({
            name: item.name,
            image: getImageUrl(item.imageUrl)
          }))
      }
    }
  } catch (error) {
    console.error('获取企业简介失败，使用默认数据:', error)
  }
}

onMounted(() => {
  fetchCompanyProfile()

  // 监听后台数据变更，自动刷新
  onDataChange((payload) => {
    if (payload.type === 'company-profile') {
      fetchCompanyProfile()
    }
  })
})

const onNameClick = (swiper) => {
  if (imgSwiper.value && swiper.clickedIndex !== undefined) {
    imgSwiper.value.$el.swiper.slideTo(swiper.clickedIndex)
  }
}

const prevCert = () => {
  if (nameSwiper.value) {
    nameSwiper.value.$el.swiper.slidePrev()
  }
}

const nextCert = () => {
  if (nameSwiper.value) {
    nameSwiper.value.$el.swiper.slideNext()
  }
}
</script>

<style scoped>
@media only screen and (max-width: 480px) {
  #fyw > div {
    padding-top: 0;
  }
}
</style>
