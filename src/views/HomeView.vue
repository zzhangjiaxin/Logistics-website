<template>
  <div>
    <!-- Banner轮播 -->
    <div id="banner">
      <swiper
        :modules="modules"
        :loop="true"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 6000, disableOnInteraction: false }"
        class="swiper-container"
      >
        <swiper-slide v-for="(img, index) in bannerImages" :key="index">
          <img :src="img" alt="">
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
    </div>

    <!-- 运单查询 -->
    <div id="itrack">
      <span>运单查询</span>
      <input
        type="text"
        id="track_number"
        v-model="trackNumber"
        @keyup.enter="handleTrack"
        placeholder="请输入运单号、FBA单号或转运单号查询"
      >
      <button type="button" @click="handleTrack">
        <i class="fyicon icon-search"></i>查询
      </button>
    </div>

    <!-- 主营渠道 -->
    <div id="iyw">
      <div class="wrap">
        <div class="itis">
          <h2>主营渠道</h2>
          <div class="fls">
            <router-link to="/business">了解更多</router-link>
          </div>
        </div>
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

    <!-- 服务流程 -->
    <div id="iprocess">
      <div class="wrap">
        <div class="itis">
          <h2>服务流程</h2>
        </div>
        <dl class="list">
          <dd v-for="(item, index) in processItems" :key="index">
            <div class="imgs flex-column">
              <span><img :src="item.icon" alt=""></span>
            </div>
            <h4>{{ item.title }}</h4>
            <p></p>
            <span class="number">{{ String(index + 1).padStart(2, '0') }}</span>
          </dd>
        </dl>
      </div>
    </div>

    <!-- 关于我们 -->
    <div id="iabout">
      <div class="wrap">
        <div class="itis">
          <h2>关于我们</h2>
          <div class="fls">
            <router-link to="/aboutus">了解更多</router-link>
          </div>
        </div>
        <div class="cont">
          <div class="text">
            <div class="editorc">
              <p>{{ statistics.years }}年以上<br>
              专注跨境货运<br>
              高效集成专家<br>
              在中国、越南的跨境物流</p>
            </div>
            <ul class="szys">
              <li>
                <div class="tis"><span class="counter">{{ statistics.branches }}</span><span class="wz"></span></div>
                <p class="desc">{{ statistics.branches }}个分公司</p>
              </li>
              <li>
                <div class="tis"><span class="counter">{{ statistics.years }}</span><span class="wz"></span></div>
                <p class="desc">{{ statistics.years }}年以上</p>
              </li>
              <li>
                <div class="tis"><span class="counter">{{ statistics.countries }}</span><span class="wz"></span></div>
                <p class="desc">{{ statistics.countries }}多个国家</p>
              </li>
              <li>
                <div class="tis"><span class="counter">{{ statistics.partners }}</span><span class="wz"></span></div>
                <p class="desc">{{ statistics.partners }}多家合作伙伴</p>
              </li>
              <li>
                <div class="tis"><span class="counter">{{ statistics.revenue }}</span><span class="wz">亿</span></div>
                <p class="desc">年收入{{ statistics.revenue }}亿元</p>
              </li>
            </ul>
          </div>
          <div class="imgs">
            <img src="@/assets/uploadfiles/20230801-171809.png" alt="">
          </div>
        </div>
        <div class="pics">
          <router-link to="/aboutus#dw2">
            <div><img src="@/assets/uploadfiles/20230803-191508.png" alt=""></div>
            <p>企业文化</p>
          </router-link>
          <router-link to="/aboutus#dw2">
            <div><img src="@/assets/uploadfiles/20230803-191518.png" alt=""></div>
            <p>发展历程</p>
          </router-link>
          <router-link to="/aboutus#dw2">
            <div><img src="@/assets/uploadfiles/20230803-191541.png" alt=""></div>
            <p>荣誉资质</p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 新闻中心 -->
    <div id="inews">
      <div class="wrap">
        <div class="itis">
          <h2>新闻中心</h2>
          <div class="fls">
            <router-link to="/news-1">公司新闻</router-link>
            <router-link to="/news-2">行业动态</router-link>
          </div>
        </div>

        <div class="cont">
          <router-link :to="featuredNews[0].link" class="tws1" :title="featuredNews[0].title">
            <div class="imgs">
              <span :style="{ backgroundImage: `url(${featuredNews[0].image})` }"></span>
            </div>
            <div class="text">
              <span>{{ featuredNews[0].category }}</span>
              <h2 class="gotms">{{ featuredNews[0].title }}</h2>
            </div>
          </router-link>
          <div class="r">
            <router-link :to="featuredNews[1].link" class="tws2" :title="featuredNews[1].title">
              <div class="imgs">
                <span :style="{ backgroundImage: `url(${featuredNews[1].image})` }"></span>
              </div>
              <div class="text">
                <span>{{ featuredNews[1].category }}</span>
                <h2 class="gotms">{{ featuredNews[1].title }}</h2>
              </div>
            </router-link>
            <router-link :to="featuredNews[2].link" class="tws3" :title="featuredNews[2].title">
              <div class="imgs">
                <span :style="{ backgroundImage: `url(${featuredNews[2].image})` }"></span>
              </div>
              <div class="text">
                <span>{{ featuredNews[2].category }}</span>
                <h2 class="gotms">{{ featuredNews[2].title }}</h2>
              </div>
            </router-link>
            <router-link :to="featuredNews[3].link" class="tws3" :title="featuredNews[3].title">
              <div class="imgs">
                <span :style="{ backgroundImage: `url(${featuredNews[3].image})` }"></span>
              </div>
              <div class="text">
                <span>{{ featuredNews[3].category }}</span>
                <h2 class="gotms">{{ featuredNews[3].title }}</h2>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 合作伙伴 -->
    <div class="itis">
      <h2>合作伙伴</h2>
    </div>

    <ul id="iparter" class="wrap">
      <li v-for="(partner, index) in partners" :key="index" class="flex-column">
        <p><img :src="partner" title="" alt=""></p>
      </li>
    </ul>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { getEnabledNavigationTree } from '@/api/navigation'

// 使用滚动位置保持
useScrollPosition()

const router = useRouter()
const modules = [Pagination, Autoplay]

// 运单查询
const trackNumber = ref('')

// 查询类型子导航列表（从"信息查询"的子导航获取）
const trackTypeNavs = ref([])

// 加载启用的查询类型导航
const loadTrackTypeNavs = async () => {
  try {
    const res = await getEnabledNavigationTree()
    if (res.data && res.data.length > 0) {
      // 找到"信息查询"的子导航
      const infoQueryNav = res.data.find(nav => nav.name === '信息查询')
      if (infoQueryNav && infoQueryNav.children && infoQueryNav.children.length > 0) {
        trackTypeNavs.value = infoQueryNav.children
      }
    }
  } catch (error) {
    console.error('获取导航配置失败', error)
    // 使用默认配置
    trackTypeNavs.value = [
      { name: '运单查询', url: '/track', sortOrder: 1 }
    ]
  }
}

const handleTrack = () => {
  const trimmedValue = trackNumber.value.trim()

  if (!trimmedValue) {
    // 使用自定义消息提示（匹配源网页样式）
    showMessage('请输入运单号、FBA单号或转运单号')
    return
  }

  // 检查是否有启用的查询类型
  if (trackTypeNavs.value.length === 0) {
    showMessage('查询功能暂时不可用，请联系客服')
    return
  }

  // 获取第一个启用的查询类型
  const firstNav = trackTypeNavs.value[0]

  // 如果第一个启用的类型是运单查询，直接跳转
  if (firstNav.url === '/track') {
    router.push({ path: '/track', query: { number: trimmedValue } })
  } else {
    // 如果第一个启用的类型不是运单查询（比如只启用了包裹查询），提示输入无效
    showMessage('输入无效，请前往查询页面使用正确的查询方式')
  }
}

onMounted(() => {
  // 加载启用的查询类型导航
  loadTrackTypeNavs()
})

// 每次页面激活时重新加载导航配置（解决从后台切换回来时数据不更新的问题）
onActivated(() => {
  loadTrackTypeNavs()
})

// Banner图片
import banner1 from '@/assets/uploadfiles/20230817-094143.jpg'
import banner2 from '@/assets/uploadfiles/20230817-094153.jpg'
import banner3 from '@/assets/uploadfiles/20230817-094205.jpg'
import banner4 from '@/assets/uploadfiles/20230817-094216.jpg'

// 服务流程图标
import process1 from '@/assets/uploadfiles/20230704-160655.png'
import process2 from '@/assets/uploadfiles/20230704-160712.png'
import process3 from '@/assets/uploadfiles/20230704-160726.png'
import process4 from '@/assets/uploadfiles/20230704-160734.png'
import process5 from '@/assets/uploadfiles/20230704-160805.png'
import process6 from '@/assets/uploadfiles/20230704-160758.png'
import process7 from '@/assets/uploadfiles/20230704-160751.png'
import process8 from '@/assets/uploadfiles/20230704-160742.png'

// 新闻背景图
import news1Bg from '@/assets/uploadfiles/20230926-144254.jpg'
import news2Bg from '@/assets/uploadfiles/20230719-182121.jpg'
import news3Bg from '@/assets/uploadfiles/20230712-103011.jpg'
import news4Bg from '@/assets/uploadfiles/20230719-161414.jpg'

// 合作伙伴
import partner1 from '@/assets/uploadfiles/20230712-134359.png'
import partner2 from '@/assets/uploadfiles/20230704-161606.jpg'
import partner3 from '@/assets/uploadfiles/20230712-092954.png'
import partner4 from '@/assets/uploadfiles/20230711-101027.jpg'
import partner5 from '@/assets/uploadfiles/20230712-093018.png'
import partner6 from '@/assets/uploadfiles/20230712-093258.png'
import partner7 from '@/assets/uploadfiles/20230712-093557.png'
import partner8 from '@/assets/uploadfiles/20230712-093702.png'
import partner9 from '@/assets/uploadfiles/20230712-093858.png'
import partner10 from '@/assets/uploadfiles/20230712-093938.png'
import partner11 from '@/assets/uploadfiles/20230712-134601.png'
import partner12 from '@/assets/uploadfiles/20230712-095118.png'

// 硬编码数据
const bannerImages = [banner1, banner2, banner3, banner4]
const processItems = [
  { icon: process1, title: '咨询报价' },
  { icon: process2, title: '开户预报' },
  { icon: process3, title: '货物入库' },
  { icon: process4, title: '货物操作' },
  { icon: process5, title: '出库发货' },
  { icon: process6, title: '货物提取' },
  { icon: process7, title: '高效配送' },
  { icon: process8, title: '客户签收' }
]
const partners = [
  partner1, partner2, partner3, partner4, partner5, partner6,
  partner7, partner8, partner9, partner10, partner11, partner12
]
const featuredNews = [
  {
    title: '深圳市翔宇达运通国际货运代理有限公司当选福海快递物流协会常务副会长单位！',
    category: '公司新闻',
    link: '/news_ds-17',
    image: news1Bg
  },
  {
    title: '燃情驱动，凝聚力UP！翔宇达国际物流业务部团建',
    category: '公司新闻',
    link: '/news_ds-15',
    image: news2Bg
  },
  {
    title: '我国外贸数据逐月向好，背后因素是什么？',
    category: '行业动态',
    link: '/news_ds-10',
    image: news3Bg
  },
  {
    title: '2023年五一劳动节放假通知',
    category: '公司新闻',
    link: '/news_ds-16',
    image: news4Bg
  }
]
const statistics = {
  branches: 4,
  years: 14,
  countries: 20,
  partners: 50,
  revenue: 6
}
</script>

<style scoped>
#banner .swiper-container {
  width: 100%;
}
</style>
