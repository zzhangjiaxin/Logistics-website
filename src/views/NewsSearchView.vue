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
      <h2>新闻中心</h2>
      <span></span>
    </div>

    <!-- 移动端分类菜单 -->
    <div id="bmenu-m">
      <router-link to="/news-1">
        公司新闻<i class="layui-icon layui-icon-right"></i>
      </router-link>
      <router-link to="/news-2">
        行业动态<i class="layui-icon layui-icon-right"></i>
      </router-link>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/news">新闻中心</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>搜索</strong>
    </div>

    <!-- 面包屑导航 - 桌面端 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/news">新闻中心</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <strong>搜索</strong>
        <div class="search">
          <input
            type="text"
            id="search_key"
            v-model="inputKeyword"
            @keyup.enter="handleSearch"
            maxlength="40"
            placeholder="搜索新闻..."
          >
          <button @click="handleSearch">
            <i class="fyicon icon-search"></i>搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div id="content" class="wrap" style="padding-bottom: 0;">
      <!-- 搜索结果提示 -->
      <div v-if="searchKeyword" style="padding: 20px 0; color: #666;">
        <p>搜索关键词：<strong style="color: #333;">{{ searchKeyword }}</strong></p>
        <p>找到 <strong style="color: #e60012;">{{ filteredNews.length }}</strong> 条相关新闻</p>
      </div>

      <!-- 新闻列表 -->
      <div id="news" v-if="filteredNews.length > 0">
        <router-link
          v-for="news in paginatedNews"
          :key="news.link"
          :to="news.link"
        >
          <div class="imgs">
            <img :src="news.image" :alt="news.title" :title="news.title">
          </div>
          <div class="text">
            <h2 class="gotms" :title="news.title">{{ news.title }}</h2>
            <p class="gotms">{{ news.desc }}</p>
            <span>{{ news.date }}</span>
          </div>
        </router-link>
      </div>

      <!-- 无搜索结果提示 -->
      <div v-else style="padding: 60px 0; text-align: center; color: #999;">
        <i class="layui-icon layui-icon-search" style="font-size: 60px; color: #ddd;"></i>
        <p style="margin-top: 20px; font-size: 16px;">未找到相关新闻</p>
        <p style="margin-top: 10px;">
          <router-link to="/news" style="color: #e60012;">返回新闻中心</router-link>
        </p>
      </div>

      <!-- 桌面端分页器 -->
      <div id="news_page" v-if="totalPages > 1">
        <div class="fypage">
          <a
            @click.prevent="currentPage > 1 && goToPage(currentPage - 1)"
            href="#"
            :class="['fypage_prev', { 'fypage_disabled': currentPage === 1 }]"
          >
            <i class="layui-icon layui-icon-left"></i>
          </a>
          <span
            v-for="page in totalPages"
            :key="page"
            :class="{ 'fypage_current': page === currentPage }"
            @click="page !== currentPage && goToPage(page)"
            style="cursor: pointer;"
          >
            {{ page }}
          </span>
          <a
            @click.prevent="currentPage < totalPages && goToPage(currentPage + 1)"
            href="#"
            :class="['fypage_next', { 'fypage_disabled': currentPage === totalPages }]"
          >
            <i class="layui-icon layui-icon-right"></i>
          </a>
        </div>
      </div>

      <!-- 移动端分页器 -->
      <div id="news_mpage" v-if="totalPages > 1">
        <div class="mfypage">
          <span class="fypage_disabled">{{ currentPage }} / {{ totalPages }}</span>
          <a
            v-if="currentPage < totalPages"
            @click.prevent="goToPage(currentPage + 1)"
            href="#"
            class="fypage_str"
          >
            下一页
          </a>
          <input
            v-model.number="jumpPage"
            type="text"
            id="mfypage_gov"
            maxlength="5"
            @keyup.enter="jumpToPage"
          >
          <span id="mfypage_gobtn" @click="jumpToPage" style="cursor: pointer;">跳转</span>
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
import { useRoute, useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'

const route = useRoute()
const router = useRouter()

// 使用滚动位置管理
useScrollPosition()

// 分页状态
const currentPage = ref(1)
const pageSize = 8 // 每页显示8条新闻
const jumpPage = ref('')

// 搜索关键词（从URL参数获取，用于过滤结果）
const searchKeyword = ref(route.query.search_key || '')
// 输入框的临时值（用户输入时不触发搜索）
const inputKeyword = ref(route.query.search_key || '')

import defaultBannerBg from '@/assets/uploadfiles/20230706-135232.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('news-search', {
  bannerBg: defaultBannerBg,
  mainTitle: '新闻中心',
  subTitle: '消息灵通，保持领先'
})

import newsImg1 from '@/assets/uploadfiles/20230926-144059.jpg'
import newsImg2 from '@/assets/uploadfiles/20230719-182116.jpg'
import newsImg3 from '@/assets/uploadfiles/20230712-103016.jpg'
import newsImg4 from '@/assets/uploadfiles/20230719-161352.jpg'
import newsImg5 from '@/assets/uploadfiles/20230719-154603.jpg'
import newsImg6 from '@/assets/uploadfiles/20230719-154747.jpg'
import newsImg7 from '@/assets/uploadfiles/20230719-154957.jpg'
import newsImg8 from '@/assets/uploadfiles/20230719-155143.jpg'
import newsImg9 from '@/assets/uploadfiles/20230719-155320.jpg'
import newsImg10 from '@/assets/uploadfiles/20230719-160325.jpg'
import newsImg11 from '@/assets/uploadfiles/20230719-160814.jpg'
import newsImg12 from '@/assets/uploadfiles/20230719-161629.jpg'
import newsImg13 from '@/assets/uploadfiles/20230719-160209.jpg'
import newsImg14 from '@/assets/uploadfiles/20230719-160524.jpg'

// 所有新闻数据
const allNewsData = [
  {
    title: '深圳市翔宇达运通国际货运代理有限公司当选福海快递物流协会常务副会长单位！',
    desc: '2023年9月22日，福海快递物流协会举办了第一届一次会员大会暨启动仪式，地点深圳国际会展中心希尔顿酒店。来自行业内的会员单位汇聚一堂，共同探讨了可持...',
    date: '2023-09-26',
    image: newsImg1,
    link: '/news_ds-17',
    category: 1
  },
  {
    title: '燃情驱动，凝聚力UP！翔宇达国际物流业务部团建',
    desc: '燃情驱动，凝聚力UP！—翔宇达国际物流业务部团建—惠州南昆山亲爱的小伙伴们，周末到啦！翔宇达国际物流业务部为了增进团队的凝聚力、激发大家...',
    date: '2023-07-09',
    image: newsImg2,
    link: '/news_ds-15',
    category: 1
  },
  {
    title: '我国外贸数据逐月向好，背后因素是什么？',
    desc: '4月13日，海关总署公布今年一季度外贸数据。一季度我国货物贸易进出口同比增4.8%。1月，我国进出口下降7%，2月"由负转正"，当月增长8%，3月...',
    date: '2023-04-25',
    image: newsImg3,
    link: '/news_ds-10',
    category: 2
  },
  {
    title: '2023年五一劳动节放假通知',
    desc: '',
    date: '2023-04-24',
    image: newsImg4,
    link: '/news_ds-16',
    category: 1
  },
  {
    title: '涨价！集装箱一舱难求！出口企业发货难…',
    desc: '根据上海航运交易所公布的最新数据，截至7月2日，中国出口集装箱运价指数报2653.32，较6月25日的2591.41，上升了2.4%，同时，各大集装箱海运公司也公布了...',
    date: '2023-07-01',
    image: newsImg5,
    link: '/news_ds-14',
    category: 2
  },
  {
    title: '欧盟增值税新规则，2021年7月1日起生效',
    desc: '针对欧盟27国的《增值税指令》将于2021年7月1日起正式生效1、废除远程销售起征额（适用于全欧范围年销售额超过阈值1万欧元），取消22欧元的增值税免征额自...',
    date: '2021-06-19',
    image: newsImg6,
    link: '/news_ds-13',
    category: 2
  },
  {
    title: '跨境电商大卖环球易购被申请破产',
    desc: '在《全国企业破产重整案件信息网》上，我们看到了破产案件号。深圳市环球易购电子商务有限公司在6月4日被中国工商银行股份有限公司深圳南山支行申请破产。...',
    date: '2021-06-10',
    image: newsImg7,
    link: '/news_ds-12',
    category: 2
  },
  {
    title: '盐田港将延迟14天，加价$3000也可能抢不到集装箱',
    desc: '随着深圳和广州新冠确诊病例的出现，这场广东地区的局部疫情已经严重影响到华南地区的外贸出货情况。由于现有深圳确诊个案均在盐田港国际货轮作业传播链上...',
    date: '2021-06-08',
    image: newsImg8,
    link: '/news_ds-1',
    category: 2
  },
  {
    title: '关于海运延迟开船通知',
    desc: '深圳市翔宇达运通国际货运代理有限公司关于海运延迟开船通知尊敬的客户：受疫情影响，盐田码头已经接近崩溃，5月28日00:00开始将暂停接收出口重柜，直到5...',
    date: '2021-05-28',
    image: newsImg9,
    link: '/news_ds-2',
    category: 1
  },
  {
    title: '出口集装箱依旧短缺，或将持续到2022年！',
    desc: '受疫情影响，国外集装箱货物进口空前繁荣，造成港口持续拥堵。据了解，中国发往美国海上集装箱大增46.5％，增至98万7834个，海洋货运的需求在不断增加，造...',
    date: '2021-05-27',
    image: newsImg12,
    link: '/news_ds-3',
    category: 2
  },
  {
    title: '5月25日22:00起闸口有限作业',
    desc: '各位客户：由于船期延误日趋严重，导致盐田港区堆场堆存密度极高，严重影响码头操作效率，也导致港区周边交通拥堵。为改善上述问题，盐田国际决定：1、5月...',
    date: '2021-05-26',
    image: newsImg12,
    link: '/news_ds-11',
    category: 2
  },
  {
    title: '疯涨十倍！运价一周飙升1500美金，再创历史新高',
    desc: '简介：为何我眼里常含泪水，因为运费涨价涨到心寒！涨！涨！涨！可以说是运价在今年最真实的写照。当很多人都以为运价已经在一定程度上涨到顶了的时候，运...',
    date: '2021-05-20',
    image: newsImg13,
    link: '/news_ds-9',
    category: 2
  },
  {
    title: '关于义乌分公司搬迁通告',
    desc: '关于义乌分公司搬迁通告',
    date: '2021-05-17',
    image: newsImg10,
    link: '/news_ds-8',
    category: 1
  },
  {
    title: '缺箱缺舱加剧！美线海运半月涨价25%',
    desc: '有卖家感慨：半月海运涨价25%，利润又受到了打击。近日，空派价格回落，50甚至4X的报价陆续出现，让只能少量补货的卖家松了一口气。但卖家倚仗的海运这个...',
    date: '2021-05-17',
    image: newsImg14,
    link: '/news_ds-7',
    category: 2
  },
  {
    title: '母恩比海深',
    desc: '把心里的爱，全部打包给你。',
    date: '2021-05-08',
    image: newsImg11,
    link: '/news_ds-6',
    category: 1
  },
  {
    title: '提醒：4月24日起，盐田港暂停接收到港船期5天后的出口重箱',
    desc: '盐田港五一假期操作安排"五一"黄金周迎来出货高峰，码头操作渐趋繁忙。盐田国际已全力以赴处理高峰作业需求。为确保港外交通顺畅，避免出现交通...',
    date: '2021-04-24',
    image: newsImg12,
    link: '/news_ds-5',
    category: 2
  }
]

// 根据搜索关键词过滤新闻（只搜索标题，搜索所有新闻，不分类）
const filteredNews = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allNewsData
  }
  const keyword = searchKeyword.value.toLowerCase().trim()
  return allNewsData.filter(news =>
    news.title.toLowerCase().includes(keyword)
  )
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / pageSize)
})

// 当前页的新闻列表
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredNews.value.slice(start, end)
})

// 切换页码
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到新闻列表顶部
    const newsElement = document.getElementById('news')
    if (newsElement) {
      newsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// 跳转到指定页
const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    goToPage(page)
    jumpPage.value = ''
  } else {
    alert('请输入有效的页码！')
  }
}

// 监听URL参数变化
watch(() => route.query.search_key, (newKeyword) => {
  searchKeyword.value = newKeyword || ''
  inputKeyword.value = newKeyword || ''
  currentPage.value = 1
})

// 搜索处理函数
const handleSearch = () => {
  if (inputKeyword.value.trim()) {
    // 更新URL参数
    router.push({
      path: '/news-search',
      query: { search_key: inputKeyword.value.trim() }
    })
  } else {
    showMessage('请输入搜索关键词')
  }
}
</script>
