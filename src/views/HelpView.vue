<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>帮助中心</h2>
        <p>始于客户需求，终于客户满意</p>
      </div>
    </div>

    <!-- 移动端标题 -->
    <div id="bname-m">
      <h2>{{ isFaqPage ? '常见问题' : (isCategoryPage ? categoryTitle : '帮助中心') }}</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m" v-if="!isFaqPage">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link v-if="isCategoryPage" to="/help">帮助中心</router-link>
      <i v-if="isCategoryPage" class="layui-icon layui-icon-right"></i>
      <strong>{{ isCategoryPage ? categoryTitle : '帮助中心' }}</strong>
    </div>

    <!-- 搜索 -->
    <div id="faqss" v-if="!isCategoryPage && !isFaqPage">
      <div>
        <input type="text" v-model="searchKey" maxlength="40" placeholder="输入关键词搜索" @keyup.enter="handleSearch">
        <i class="fyicon icon-search" @click="handleSearch"></i>
      </div>
    </div>

    <!-- 帮助分类 -->
    <div id="help" v-if="!isCategoryPage && !isFaqPage">
      <div class="list wrap">
        <router-link
          v-for="(item, index) in helpCategories"
          :key="index"
          :to="`/arts-${item.id}`"
        >
          <img :src="item.icon" alt="">
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 常见问题 -->
    <div id="faq">
      <div class="wrap">
        <div class="tits" v-if="!isFaqPage">
          <h2>{{ isCategoryPage ? categoryTitle : '常见问题' }}</h2>
        </div>
        <div class="tits" v-else>
          <h2>常见问题</h2>
        </div>

        <!-- FAQ列表 -->
        <ul class="list">
          <li v-for="faq in faqData" :key="faq.id">
            <router-link :to="`/arts_ds${faq.id}`">{{ faq.question }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- 服务链接 -->
    <div id="fyw" v-if="!isFaqPage">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'

useScrollPosition()

const route = useRoute()
const router = useRouter()

import bannerBg from '@/assets/uploadfiles/20230706-142647.jpg'
import help1 from '@/assets/uploadfiles/20230706-143302.png'
import help2 from '@/assets/uploadfiles/20230706-143344.png'
import help3 from '@/assets/uploadfiles/20230706-143353.png'
import help4 from '@/assets/uploadfiles/20230706-143315.png'
import help5 from '@/assets/uploadfiles/20230706-143325.png'
import help6 from '@/assets/uploadfiles/20230706-143336.png'

const searchKey = ref('')
const selectedCategory = ref(null)

const handleSearch = () => {
  // 检查是否输入了搜索关键词
  if (!searchKey.value.trim()) {
    // 显示提示信息（与源网页一致）
    showMessage('请输入搜索关键词')
    return
  }

  // 跳转到搜索页面（与源网页一致：search.html?search_key=关键词）
  router.push({
    path: '/help-search',
    query: { search_key: searchKey.value.trim() }
  })
}

const helpCategories = [
  { id: 1, icon: help1, title: '安全合规性', desc: '安全合规性', category: 'security' },
  { id: 2, icon: help2, title: '新手指南', desc: '帐户使用情况', category: 'beginner' },
  { id: 3, icon: help3, title: '自助服务', desc: '帐户使用情况', category: 'self-service' },
  { id: 4, icon: help4, title: '账户服务', desc: '帐户使用情况', category: 'account' },
  { id: 5, icon: help5, title: '平台集合', desc: '跨多个平台的统一管理', category: 'platform' },
  { id: 6, icon: help6, title: '增值服务', desc: '多种创新增值功能', category: 'value-added' }
]

// 硬编码的FAQ数据
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

const filteredFaqData = ref([...allFaqData])

// 判断是否为常见问题页面
const isFaqPage = computed(() => {
  return route.meta.isFaqPage === true || route.path === '/faq'
})

// 判断是否为分类页面
const isCategoryPage = computed(() => {
  return route.params.id !== undefined
})

// 当前分类ID
const currentCategoryId = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null
})

// 当前分类信息
const currentCategory = computed(() => {
  if (!currentCategoryId.value) return null
  return helpCategories.find(cat => cat.id === currentCategoryId.value)
})

// 分类标题
const categoryTitle = computed(() => {
  return currentCategory.value?.title || '常见问题'
})

// 显示的FAQ数据
const faqData = computed(() => {
  if (isFaqPage.value) {
    // 常见问题页面：显示所有问题
    return filteredFaqData.value
  } else if (isCategoryPage.value) {
    // 分类页面：不显示任何问题（与源网页一致）
    return []
  } else if (selectedCategory.value) {
    // 主页筛选：显示筛选后的问题
    return filteredFaqData.value.filter(item => item.category === selectedCategory.value)
  }
  // 主页默认：显示所有问题
  return filteredFaqData.value
})

// 按分类筛选FAQ（仅在主页使用）
const filterByCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? null : category
}

// 监听路由变化，重置状态
watch(() => route.path, () => {
  selectedCategory.value = null
  searchKey.value = ''
  filteredFaqData.value = [...allFaqData]
})

// 组件挂载时不需要获取数据，直接使用硬编码数据
onMounted(() => {
  // 数据已经在初始化时设置好了
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
