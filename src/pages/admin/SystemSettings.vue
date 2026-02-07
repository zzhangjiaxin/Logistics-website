<template>
  <div class="system-settings">
    <el-card class="settings-card">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 公司信息 Tab -->
        <el-tab-pane label="公司信息" name="company">
          <div class="tab-content">
            <el-table
              :data="companyList"
              border
              stripe
              v-loading="loading"
              style="width: 100%"
              empty-text="暂无公司数据"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
            >
              <el-table-column prop="id" label="ID" width="80" align="center" />
              <el-table-column prop="name" label="公司名称" min-width="180" />
              <el-table-column prop="id" label="公司ID" width="100" align="center" />
              <el-table-column prop="slug" label="登录域名" min-width="280">
                <template #default="scope">
                  <div class="domain-display">
                    <span class="domain-text">https://</span>
                    <span class="domain-highlight">{{ scope.row.slug }}</span>
                    <span class="domain-text">.intelink.net.cn</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'" size="small">
                    {{ scope.row.status === 'active' ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createdAt" label="创建时间" width="180" align="center" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { getTenantInfo } from '@/api/tenant'

// 当前激活的 Tab
const activeTab = ref('company')

// 加载状态
const loading = ref(false)

// 公司列表数据
const companyList = ref([])

// 页面加载时从后台获取租户信息
onMounted(async () => {
  loading.value = true
  try {
    const res = await getTenantInfo()
    if (res.data) {
      // 将当前租户信息放入列表
      companyList.value = [res.data]
    }
  } catch (error) {
    console.error('获取租户信息失败:', error)
    ElNotification({
      title: '错误',
      message: '获取租户信息失败',
      type: 'error',
      duration: 3000
    })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.system-settings {
  padding: 24px;
  min-height: calc(100vh - 100px);
  background-color: #f5f7fa;
}

.settings-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.settings-tabs {
  padding: 0 20px;
}

.tab-content {
  padding: 24px 20px;
}

.domain-display {
  display: inline-flex;
  align-items: center;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  padding: 4px 8px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.domain-text {
  color: #909399;
  font-size: 13px;
}

.domain-highlight {
  color: #409eff;
  font-weight: 700;
  font-size: 14px;
  padding: 2px 6px;
  background-color: #ecf5ff;
  border-radius: 4px;
  margin: 0 2px;
  border: 1px solid #d9ecff;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-table) {
  font-size: 14px;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 0;
}

:deep(.el-table td.el-table__cell) {
  padding: 16px 0;
}

:deep(.el-table .cell) {
  padding: 0 12px;
  line-height: 1.6;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table__empty-text) {
  color: #909399;
  font-size: 14px;
  padding: 40px 0;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
  border-bottom: 2px solid #e4e7ed;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  padding: 0 24px;
  height: 48px;
  line-height: 48px;
  color: #606266;
  transition: all 0.3s;
}

:deep(.el-tabs__item:hover) {
  color: #409eff;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  background-color: #409eff;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 12px;
  font-weight: 500;
}

:deep(.el-alert) {
  border-radius: 6px;
  padding: 12px 16px;
}

:deep(.el-alert__title) {
  font-size: 13px;
  color: #606266;
}
</style>
