<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${businessData.banner})` }">
      <div class="flex-column wrap">
        <h2>{{ businessData.title }}</h2>
        <p>{{ businessData.subtitle }}</p>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/business">主营渠道</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <strong>{{ businessData.title }}</strong>
      </div>
    </div>
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/business">主营渠道</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>{{ businessData.title }}</strong>
    </div>

    <div id="fws">
      <div class="wrap">
        <!-- 服务优势 -->
        <div class="tits">
          <h2>服务优势</h2>
        </div>
        <dl class="fwys">
          <dd v-for="(item, index) in businessData.advantages" :key="index">
            <div class="imgs flex-column">
              <span><img :src="item.icon" alt=""></span>
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </dd>
        </dl>

        <!-- 服务内容 -->
        <div class="tits">
          <h2>服务内容</h2>
        </div>
        <dl class="fwnr">
          <dd v-for="(item, index) in businessData.services" :key="index">
            <div class="imgs flex-column">
              <span><img :src="item.icon" alt=""></span>
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </dd>
        </dl>

        <!-- 服务保证 -->
        <div class="tits">
          <h2>服务保证</h2>
        </div>
        <dl class="fwbz">
          <dd v-for="(item, index) in businessData.guarantees" :key="index">
            <div class="imgs flex-column">
              <span><img :src="item.icon" alt=""></span>
            </div>
            <div class="text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </dd>
        </dl>
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
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'

useScrollPosition()

const route = useRoute()

// 导入图片资源 - 所有业务页面使用同一张背景图
import banner from '@/assets/uploadfiles/20230707-131606.jpg'

// 空派专线 - 服务优势图标
import airAdv1 from '@/assets/uploadfiles/20230707-133912.png'
import airAdv2 from '@/assets/uploadfiles/20230707-133947.png'
import airAdv3 from '@/assets/uploadfiles/20230707-133956.png'
import airAdv4 from '@/assets/uploadfiles/20230707-134025.png'
import airAdv5 from '@/assets/uploadfiles/20230707-134039.png'
import airAdv6 from '@/assets/uploadfiles/20230707-134046.png'

// 空派专线 - 服务内容图标
import airSrv1 from '@/assets/uploadfiles/20230707-134248.png'
import airSrv2 from '@/assets/uploadfiles/20230707-134301.png'
import airSrv3 from '@/assets/uploadfiles/20230707-134316.png'
import airSrv4 from '@/assets/uploadfiles/20230812-100508.png'

// 海派专线 - 服务优势图标
import seaAdv1 from '@/assets/uploadfiles/20230803-174106.png'
import seaAdv2 from '@/assets/uploadfiles/20230707-133947.png'
import seaAdv3 from '@/assets/uploadfiles/20230707-133956.png'
import seaAdv4 from '@/assets/uploadfiles/20230707-134025.png'
import seaAdv5 from '@/assets/uploadfiles/20230803-181015.png'
import seaAdv6 from '@/assets/uploadfiles/20230803-181028.png'

// 海派专线 - 服务内容图标
import seaSrv1 from '@/assets/uploadfiles/20230803-181103.png'
import seaSrv2 from '@/assets/uploadfiles/20230803-181051.png'
import seaSrv3 from '@/assets/uploadfiles/20230803-181117.png'
import seaSrv4 from '@/assets/uploadfiles/20230803-181127.png'
import seaSrv5 from '@/assets/uploadfiles/20230812-103047.png'

// 陆运专线 - 服务优势图标
import landAdv1 from '@/assets/uploadfiles/20230803-181501.png'
import landAdv5 from '@/assets/uploadfiles/20230803-181150.png'

// 陆运专线 - 服务内容图标
import landSrv1 from '@/assets/uploadfiles/20230803-181240.png'
import landSrv2 from '@/assets/uploadfiles/20230803-181257.png'
import landSrv3 from '@/assets/uploadfiles/20230803-181435.png'
import landSrv4 from '@/assets/uploadfiles/20230803-181226.png'

// 服务保证图标（所有业务线共用）
import gua1 from '@/assets/uploadfiles/20230707-134519.png'
import gua2 from '@/assets/uploadfiles/20230707-134530.png'
import gua3 from '@/assets/uploadfiles/20230707-134538.png'
import gua4 from '@/assets/uploadfiles/20230707-134548.png'

// 业务渠道数据库
const businessChannels = {
  1: { // 空派专线
    title: '空派专线',
    subtitle: '专注于美国、英国和墨西哥',
    banner: banner,
    advantages: [
      { icon: airAdv1, title: '可靠的合作伙伴', desc: '与KE/OZ/PO等航空公司长期固定合作签约，有固定舱位，有充足舱位，保证时效。' },
      { icon: airAdv2, title: '完整的团队配置', desc: '自有清关团队，正式报关，专业操作，通关率极高。' },
      { icon: airAdv3, title: '配套齐全', desc: '自有美国DG海外仓，具备危险品仓储资质，可提供一件代发服务。' },
      { icon: airAdv4, title: '资源丰富', desc: '拥有多家航空公司代理权、专业的团队运营和全面的航空货运网络服务。充分利用航班资源、车队资源、港口资源、清关资源，形成高效的多式联运网络。' },
      { icon: airAdv5, title: '经验丰富', desc: '有十多年的第9类危险品的处理经验，从香港起飞的国际航空运输。' },
      { icon: airAdv6, title: '流程完善', desc: '专业的服务团队，精细化的运输方案。' }
    ],
    services: [
      { icon: airSrv1, title: '美国专线空运服务', desc: '与各大国际知名航司签约合作，直飞LAX，ORD，搭建空加派专线服务，同时接受大客户定制航线，双清含税到门，为货物保驾护航。' },
      { icon: airSrv2, title: '欧洲、英国专线服务', desc: '欧洲分为双清含税、VAT自税两种交易方式可供客户选择，渠道有空派、海铁联运等运输方式，满足客户各种时效所需。' },
      { icon: airSrv3, title: '韩国、香港包装板代理', desc: '与各大国际知名航司签约合作，荣为香港EK、EY、TK、ET韩国KE、OZ、CI、CX国际空运包板代理。' },
      { icon: airSrv4, title: '越美专线空运服务', desc: '越南出口美国空海线路，DDP服务，涵盖越南头程、尾端清提派服务。' }
    ],
    guarantees: [
      { icon: gua1, title: '专业性强', desc: '合规化操作，货物全程可控。' },
      { icon: gua2, title: '时效快', desc: 'DG舱位充足，高频率出货，时效稳定。' },
      { icon: gua3, title: '安全性高', desc: '联合知名保险公司协助客户购买货物运输保险，增添保障。' },
      { icon: gua4, title: '服务好', desc: '自有车队，市区免费上门提货。' }
    ]
  },
  2: { // 海派专线
    title: '海派专线',
    subtitle: '专注于美国、英国、欧洲和墨西哥',
    banner: banner,
    advantages: [
      { icon: seaAdv1, title: '服务多样性', desc: '美、英、欧、墨DG有FCL和LCL可供选择，有DDP和DDU等多种交货方式。' },
      { icon: seaAdv2, title: '完整的团队配置', desc: '自有清关团队，正式报关，专业操作，通关率极高。' },
      { icon: seaAdv3, title: '配套齐全', desc: '自有美国DG海外仓，具备危险品仓储资质，可提供一件代发服务。' },
      { icon: seaAdv4, title: '拖车资源丰富', desc: '码头DG拖车资源丰富，淡、旺季拖车调度可控。' },
      { icon: seaAdv5, title: '可靠的合作伙伴', desc: '与各大知名船公司签约合作，海运放行快，时效稳定。' },
      { icon: seaAdv6, title: '流程完善', desc: '专业的服务团队，精细化的运输方案。' }
    ],
    services: [
      { icon: seaSrv1, title: '欧洲、英国专线服务', desc: '欧洲分为双清含税、VAT自税两种交易方式可供客户选择，渠道有空派、海铁联运等运输方式，满足客户各种时效所需。' },
      { icon: seaSrv2, title: '盐田/香港港口DG', desc: '第9类危险品正式报关出口，我们拥有自己的DG仓库、多年成熟的操作经验、完善的国内外清关服务，时效稳定，始终处于行业领先地位。' },
      { icon: seaSrv3, title: '欧美英海运服务', desc: '提供集装箱海运出口、散杂货运输、散货拼箱，提供海运、陆运多式联运以及清关服务，全程自主操作。' },
      { icon: seaSrv4, title: '墨西哥海运服务', desc: '提供集装箱海运出口，包含散货拼箱、整柜运输服务，并提供直达墨西哥城的双清含税服务，另提供保险服务。每周固定装箱，时效稳定。' },
      { icon: seaSrv5, title: '越美海运服务', desc: '越南出口美国空海线路，涵盖DDP、头程、尾端清提派服务。' }
    ],
    guarantees: [
      { icon: gua1, title: '专业性强', desc: '合规化操作，货物全程可控。' },
      { icon: gua2, title: '时效快', desc: 'DG舱位充足，高频率出货，时效稳定。' },
      { icon: gua3, title: '安全性高', desc: '联合知名保险公司协助客户购买货物运输保险，增添保障。' },
      { icon: gua4, title: '服务好', desc: '自有车队，市区免费上门提货。' }
    ]
  },
  3: { // 陆运专线
    title: '陆运专线',
    subtitle: '专注于英国、欧洲和越南',
    banner: banner,
    advantages: [
      { icon: landAdv1, title: '灵活性强', desc: '公路、铁路联运。送货上门，双清含税。' },
      { icon: airAdv2, title: '完整的团队配置', desc: '自有清关团队，正式报关，专业操作，通关率极高。' },
      { icon: airAdv3, title: '配套齐全', desc: '自有美国DG海外仓，具备危险品仓储资质，可提供一件代发服务。' },
      { icon: airAdv4, title: '一级代理', desc: '作为中欧铁路货运一级物流公司，公司长期与广铁、中铁保持着良好的战略合作关系。' },
      { icon: landAdv5, title: '极高性价比', desc: '价格优于空运，时效优于海运。' },
      { icon: seaAdv6, title: '流程完善', desc: '专业的服务团队，精细化的运输方案。' }
    ],
    services: [
      { icon: landSrv1, title: '渝新欧班列货运', desc: '作为中国至欧洲铁路货运的一级物流代理，我公司长期与广铁、中铁保持着良好的战略合作伙伴关系。随着越来越多的列车投入运营，凭借我们完善的服务体系，我们能够帮助更多的客户及时将货物运送到欧洲各地，充分展示了物流服务的效率和规模优势。' },
      { icon: landSrv2, title: '湘欧班列货运', desc: '作为中国至欧洲铁路货运的一级物流代理，我公司长期与广铁、中铁保持着良好的战略合作伙伴关系。随着越来越多的列车投入运营，凭借我们完善的服务体系，我们能够帮助更多的客户及时将货物运送到欧洲各地，充分展示了物流服务的效率和规模优势。' },
      { icon: landSrv3, title: '义新欧班列货运', desc: '作为中国至欧洲铁路货运的一级物流代理，我公司长期与广铁、中铁保持着良好的战略合作伙伴关系。随着越来越多的列车投入运营，凭借我们完善的服务体系，我们能够帮助更多的客户及时将货物运送到欧洲各地，充分展示了物流服务的效率和规模优势。' },
      { icon: landSrv4, title: '中越卡航', desc: '涉及南越、北越区域，提供包税特快和双清小货到门服务。' }
    ],
    guarantees: [
      { icon: gua1, title: '专业性强', desc: '合规化操作，货物全程可控。' },
      { icon: gua2, title: '时效快', desc: 'DG舱位充足，高频率出货，时效稳定。' },
      { icon: gua3, title: '安全性高', desc: '联合知名保险公司协助客户购买货物运输保险，增添保障。' },
      { icon: gua4, title: '服务好', desc: '自有车队，市区免费上门提货。' }
    ]
  }
}

// 根据路由获取业务数据
const businessData = computed(() => {
  const type = route.meta.type || 1
  return businessChannels[type] || businessChannels[1]
})
</script>
