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
      <h2>联系我们</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>联系我们</strong>
    </div>

    <!-- 联系信息 -->
    <div id="contact">
      <div class="wrap">
        <div class="tits">
          <h2>公司联系信息</h2>
        </div>

        <!-- 按分组渲染分支机构 -->
        <template v-if="groupedBranches.length > 0">
          <div class="conts" v-for="group in groupedBranches" :key="group.groupName">
            <div class="tis">{{ group.groupName }}</div>
            <template v-for="(sub, subIdx) in group.subGroups" :key="sub.name || 'default'">
              <div class="rows">
                <div class="text">
                  <h3 class="name" v-if="sub.name">{{ sub.name }}</h3>
                  <div class="editorc">
                    <template v-for="branch in sub.items" :key="branch.id">
                      <p v-if="branch.address">{{ branch.addressLabel || '地址' }}：{{ branch.address }}</p>
                    </template>
                    <p v-if="sub.phone">电话：{{ sub.phone }}</p>
                  </div>
                </div>
                <div v-if="sub.mapLocation" class="map">
                  <iframe
                    :src="`/bdmap.html?point=${sub.mapLocation.lng},${sub.mapLocation.lat}&name=${encodeURIComponent(sub.name || '')}`"
                    width="100%"
                    height="100%"
                    allowtransparency="true"
                    frameborder="0"
                    scrolling="no"
                  ></iframe>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- 兜底：API 未返回数据时显示硬编码 -->
        <template v-else>
          <div class="conts">
            <div class="tis">中国总部</div>
            <div class="rows">
              <div class="text">
                <h3 class="name">深圳会展湾</h3>
                <div class="editorc">
                  <p>总部地址：深圳市宝安区福海街道展城社区展景路83号会展湾中港广场6座B栋1005室</p>
                  <p>福永仓库地址：深圳市宝安区福海街道和秀西路68号宝祥和工业园深腾耀商务大厦一楼103-107</p>
                  <p>电话：400-836-9156</p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 微信公众号 -->
        <div class="conts" v-if="qrcodeUrl">
          <div class="tis">微信公众号</div>
          <div class="qrcode">
            <img :src="qrcodeUrl" alt="微信公众号">
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
import { computed } from 'vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'
import { useSiteStore, useCompanyInfoStore } from '@/stores'
import { BASE_URL } from '@/utils/request'
import defaultBannerBg from '@/assets/uploadfiles/20230706-142647.jpg'

useScrollPosition()

const { bannerBg, mainTitle, subTitle } = useBannerData('contact', {
  bannerBg: defaultBannerBg,
  mainTitle: '联系我们',
  subTitle: '翔宇达，使命必达'
})

const siteStore = useSiteStore()
const companyInfoStore = useCompanyInfoStore()

// 获取完整的图片 URL
const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return `${BASE_URL}/api${imageUrl}`
}

// 微信公众号二维码URL（从站点信息获取）
const qrcodeUrl = computed(() => {
  return getFullImageUrl(siteStore.siteInfo.wechatQrcode)
})

// 将分支机构按 groupName 分组，再按 name 子分组
const groupedBranches = computed(() => {
  const branches = companyInfoStore.branches
  if (!branches || branches.length === 0) return []

  const groups = []
  const groupMap = {}

  for (const branch of branches) {
    if (!branch.isEnabled) continue
    const gn = branch.groupName || '其他'
    if (!groupMap[gn]) {
      groupMap[gn] = { groupName: gn, subGroups: [], subGroupMap: {} }
      groups.push(groupMap[gn])
    }
    const group = groupMap[gn]
    const subKey = branch.name || ''
    if (!group.subGroupMap[subKey]) {
      group.subGroupMap[subKey] = { name: branch.name, items: [], phone: null, mapLocation: null }
      group.subGroups.push(group.subGroupMap[subKey])
    }
    const sub = group.subGroupMap[subKey]
    sub.items.push(branch)
    if (branch.phone && !sub.phone) {
      sub.phone = branch.phone
    }
    // 取第一个有经纬度的地址作为地图位置
    if (!sub.mapLocation && branch.latitude && branch.longitude) {
      sub.mapLocation = { lat: branch.latitude, lng: branch.longitude, address: branch.address }
    }
  }

  return groups
})
</script>
