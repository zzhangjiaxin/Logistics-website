<template>
  <div class="dashboard" v-loading="loading">
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card" style="--accent: #409EFF">
        <div class="stat-icon">
          <el-icon :size="28"><DocumentCopy /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.newsTotal || 0 }}</div>
          <div class="stat-label">新闻文章</div>
        </div>
        <div class="stat-detail">已发布 {{ stats.newsPublished || 0 }} / 草稿 {{ stats.newsDraft || 0 }}</div>
      </div>
      <div class="stat-card" style="--accent: #67C23A">
        <div class="stat-icon">
          <el-icon :size="28"><QuestionFilled /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.faqTotal || 0 }}</div>
          <div class="stat-label">常见问题</div>
        </div>
        <div class="stat-detail">已发布 {{ stats.faqPublished || 0 }} / 草稿 {{ stats.faqDraft || 0 }}</div>
      </div>
      <div class="stat-card" style="--accent: #E6A23C">
        <div class="stat-icon">
          <el-icon :size="28"><Picture /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.carouselTotal || 0 }}</div>
          <div class="stat-label">轮播图片</div>
        </div>
        <div class="stat-detail">已启用 {{ stats.carouselEnabled || 0 }}</div>
      </div>
      <div class="stat-card" style="--accent: #F56C6C">
        <div class="stat-icon">
          <el-icon :size="28"><Menu /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.navTotal || 0 }}</div>
          <div class="stat-label">导航栏目</div>
        </div>
        <div class="stat-detail">已启用 {{ stats.navEnabled || 0 }}</div>
      </div>
    </div>

    <!-- 内容概览 + 快捷操作 -->
    <div class="dashboard-row">
      <!-- 内容概览 -->
      <el-card class="overview-card">
        <template #header>
          <span class="section-title">内容概览</span>
        </template>
        <el-table :data="overviewData" stripe style="width: 100%">
          <el-table-column prop="name" label="内容类型" min-width="140" />
          <el-table-column prop="total" label="总数" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.total > 0 ? 'primary' : 'info'" size="small">{{ row.total }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="detail" label="详情" min-width="160" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button type="primary" text size="small" @click="goTo(row.path)">管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 快捷操作 -->
      <el-card class="shortcut-card">
        <template #header>
          <span class="section-title">快捷操作</span>
        </template>
        <div class="shortcut-grid">
          <div class="shortcut-item" @click="goTo('/admin/site-info')">
            <el-icon :size="24" color="#409EFF"><Setting /></el-icon>
            <span>站点管理</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/news')">
            <el-icon :size="24" color="#67C23A"><DocumentCopy /></el-icon>
            <span>新闻管理</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/faq')">
            <el-icon :size="24" color="#E6A23C"><QuestionFilled /></el-icon>
            <span>常见问题</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/carousel')">
            <el-icon :size="24" color="#F56C6C"><Picture /></el-icon>
            <span>图片管理</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/company-info')">
            <el-icon :size="24" color="#909399"><Phone /></el-icon>
            <span>公司信息</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/company-profile')">
            <el-icon :size="24" color="#304156"><OfficeBuilding /></el-icon>
            <span>企业简介</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/navigation')">
            <el-icon :size="24" color="#b37feb"><Menu /></el-icon>
            <span>栏目管理</span>
          </div>
          <div class="shortcut-item" @click="goTo('/admin/system-settings')">
            <el-icon :size="24" color="#606266"><Tools /></el-icon>
            <span>系统设置</span>
          </div>
          <div class="shortcut-item" @click="goToFrontend">
            <el-icon :size="24" color="#13C2C2"><Monitor /></el-icon>
            <span>站点前台</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DocumentCopy, QuestionFilled, Picture, Menu, Setting, Phone, OfficeBuilding, Tools, Monitor } from '@element-plus/icons-vue'
import { getDashboardStats } from '@/api/dashboard'

const router = useRouter()
const loading = ref(false)
const stats = ref({})

const overviewData = computed(() => [
  {
    name: '新闻文章',
    total: stats.value.newsTotal || 0,
    detail: `已发布 ${stats.value.newsPublished || 0}，草稿 ${stats.value.newsDraft || 0}`,
    path: '/admin/news'
  },
  {
    name: '常见问题',
    total: stats.value.faqTotal || 0,
    detail: `已发布 ${stats.value.faqPublished || 0}，草稿 ${stats.value.faqDraft || 0}`,
    path: '/admin/faq'
  },
  {
    name: '轮播图片',
    total: stats.value.carouselTotal || 0,
    detail: `已启用 ${stats.value.carouselEnabled || 0}`,
    path: '/admin/carousel'
  },
  {
    name: '导航栏目',
    total: stats.value.navTotal || 0,
    detail: `已启用 ${stats.value.navEnabled || 0}`,
    path: '/admin/navigation'
  },
  {
    name: '分支机构',
    total: stats.value.branchTotal || 0,
    detail: `已启用 ${stats.value.branchEnabled || 0}`,
    path: '/admin/company-info'
  },
  {
    name: '企业荣誉',
    total: stats.value.honorTotal || 0,
    detail: '',
    path: '/admin/company-profile'
  },
  {
    name: '发展历程',
    total: stats.value.historyTotal || 0,
    detail: '',
    path: '/admin/company-profile'
  }
])

const goTo = (path) => {
  router.push(path)
}

const goToFrontend = () => {
  window.open('/', '_blank')
}

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await getDashboardStats()
    if (res.data) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

/* 统计卡片 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  border-top: 3px solid var(--accent);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.stat-detail {
  width: 100%;
  font-size: 12px;
  color: #a8abb2;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

/* 内容区域 */
.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 快捷操作 */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #606266;
}

.shortcut-item:hover {
  background: #ecf5ff;
  color: #409EFF;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
}
</style>
