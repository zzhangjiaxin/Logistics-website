<template>
  <div class="log-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="section-title">操作日志</span>
        </div>
      </template>

      <div class="search-bar">
        <el-select v-model="searchForm.operationType" placeholder="操作类型" clearable style="width: 140px">
          <el-option label="登录" value="LOGIN" />
          <el-option label="创建" value="CREATE" />
          <el-option label="更新" value="UPDATE" />
          <el-option label="删除" value="DELETE" />
        </el-select>
        <el-select v-model="searchForm.module" placeholder="操作模块" clearable style="width: 140px">
          <el-option label="登录" value="登录" />
          <el-option label="文章管理" value="文章管理" />
          <el-option label="栏目管理" value="栏目管理" />
          <el-option label="图片管理" value="图片管理" />
          <el-option label="站点管理" value="站点管理" />
          <el-option label="公司信息" value="公司信息" />
        </el-select>
        <el-input v-model="searchForm.keyword" placeholder="搜索描述/操作人" clearable style="width: 200px" @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="logList" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="userName" label="操作人" width="120" />
        <el-table-column prop="operationType" label="操作类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.operationType)" size="small">{{ getTypeLabel(row.operationType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="status" label="结果" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchLogs"
          @current-change="fetchLogs"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTenantLogs } from '@/api/logs'

const loading = ref(false)
const logList = ref([])
const searchForm = ref({ operationType: '', module: '', keyword: '' })
const pagination = ref({ page: 1, size: 10, total: 0 })

const typeMap = { LOGIN: '登录', CREATE: '创建', UPDATE: '更新', DELETE: '删除', TOGGLE: '切换状态' }
const tagMap = { LOGIN: 'warning', CREATE: 'success', UPDATE: 'primary', DELETE: 'danger', TOGGLE: 'info' }

const getTypeLabel = (type) => typeMap[type] || type
const getTypeTag = (type) => tagMap[type] || 'info'

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await getTenantLogs({
      page: pagination.value.page,
      size: pagination.value.size,
      ...searchForm.value
    })
    logList.value = res.data?.records || []
    pagination.value.total = res.data?.total || 0
  } catch (e) {
    console.error('获取日志失败:', e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchLogs()
}

const handleReset = () => {
  searchForm.value = { operationType: '', module: '', keyword: '' }
  pagination.value.page = 1
  fetchLogs()
}

onMounted(() => fetchLogs())
</script>

<style scoped>
.log-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
