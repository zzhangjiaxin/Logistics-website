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
              style="width: 100%"
              empty-text="暂无公司数据"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
            >
              <el-table-column prop="id" label="ID" width="80" align="center" />
              <el-table-column prop="companyName" label="公司名称" min-width="180" />
              <el-table-column prop="companyId" label="公司ID" width="150" align="center" />
              <el-table-column prop="subdomain" label="登录域名" min-width="280">
                <template #default="scope">
                  <div class="domain-display">
                    <span class="domain-text">https://</span>
                    <span class="domain-highlight">{{ scope.row.subdomain }}</span>
                    <span class="domain-text">.intelink.net.cn</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'" size="small">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
            </el-table>

            <div class="table-footer">
              <el-alert
                title="公司信息管理功能正在开发中，暂不可用"
                type="info"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'

// 当前激活的 Tab
const activeTab = ref('company')

// 公司列表数据（示例数据）
const companyList = ref([
  {
    id: 1,
    companyId: 'COMP001',
    companyName: '示例公司A',
    subdomain: 'kld',
    status: '启用',
    createTime: '2024-01-01 10:00:00'
  },
  // {
  //   id: 2,
  //   companyId: 'COMP002',
  //   companyName: '示例公司B',
  //   subdomain: 'company-b',
  //   status: '禁用',
  //   createTime: '2024-01-02 11:00:00'
  // }
])

// 页面加载时从后台获取公司列表
onMounted(() => {
  // TODO: 调用后台 API 获取公司列表
  // const data = await api.getCompanyList()
  // companyList.value = data

  console.log('公司列表加载完成')
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

.table-footer {
  margin-top: 20px;
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
