<template>
  <div class="company-profile-management">
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <!-- Tab 1: 企业简介 -->
        <el-tab-pane label="企业简介" name="intro">
          <el-form
            ref="introFormRef"
            :model="introFormData"
            label-width="120px"
            v-loading="introLoading"
            style="max-width: 900px;"
          >
            <el-form-item label="公司图片">
              <div class="image-upload-wrapper">
                <div class="image-input-row">
                  <el-input v-model="introFormData.image" placeholder="请输入图片路径或上传图片" />
                  <el-upload
                    :show-file-list="false"
                    :http-request="handleIntroImageUpload"
                    accept="image/*"
                  >
                    <el-button type="primary">上传图片</el-button>
                  </el-upload>
                </div>
                <div class="image-preview-container" v-if="introFormData.image">
                  <div class="image-preview-box">
                    <img :src="getImageUrl(introFormData.image)" alt="公司图片" @error="handleImageError" />
                    <div class="image-delete-btn" @click="introFormData.image = ''">
                      <el-icon><Close /></el-icon>
                    </div>
                  </div>
                </div>
                <div class="upload-tip">建议尺寸：800x600px，支持 jpg、png 格式</div>
              </div>
            </el-form-item>

            <el-form-item label="公司简介">
              <el-input
                v-model="introFormData.description"
                type="textarea"
                :rows="10"
                placeholder="请输入公司简介内容，支持富文本HTML"
                maxlength="2000"
                show-word-limit
              />
              <div class="form-tip">显示在前端"关于我们"页面的公司简介区域</div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleIntroSubmit" :loading="introSubmitting">
                保存设置
              </el-button>
              <el-button @click="handleIntroReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- Tab 2: 发展历程 -->
        <el-tab-pane label="发展历程" name="history">
          <el-form
            ref="historyFormRef"
            :model="historyFormData"
            label-width="120px"
            v-loading="historyLoading"
            style="max-width: 900px;"
          >
            <el-collapse v-model="historyCollapse" class="config-collapse">
              <el-collapse-item title="发展历程配置" name="history">
                <el-table :data="historyFormData.items" border style="width: 100%">
                  <el-table-column label="序号" width="60" align="center">
                    <template #default="{ $index }">{{ $index + 1 }}</template>
                  </el-table-column>
                  <el-table-column label="年份" min-width="120">
                    <template #default="{ row }">
                      <el-input v-model="row.year" placeholder="如：2022" maxlength="20" />
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" min-width="250">
                    <template #default="{ row }">
                      <el-input v-model="row.desc" placeholder="如：2022年，营收超6亿元。" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column label="启用" width="80" align="center">
                    <template #default="{ row }">
                      <el-switch v-model="row.isEnabled" :active-value="1" :inactive-value="0" />
                    </template>
                  </el-table-column>
                  <el-table-column width="80" align="center">
                    <template #header>
                      <el-button type="primary" size="small" text @click="addHistoryItem">
                        <el-icon><Plus /></el-icon>
                      </el-button>
                    </template>
                    <template #default="{ $index }">
                      <el-button
                        type="danger"
                        size="small"
                        text
                        @click="removeHistoryItem($index)"
                        v-if="historyFormData.items.length > 1"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>

            <el-form-item style="margin-left: -50px;">
              <el-button type="primary" @click="handleHistorySubmit" :loading="historySubmitting">
                保存设置
              </el-button>
              <el-button @click="handleHistoryReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- Tab 3: 荣誉资质 -->
        <el-tab-pane label="荣誉资质" name="honor">
          <el-form
            ref="honorFormRef"
            :model="honorFormData"
            label-width="120px"
            v-loading="honorLoading"
            style="max-width: 900px;"
          >
            <el-collapse v-model="honorCollapse" class="config-collapse">
              <el-collapse-item title="荣誉资质配置" name="honor">
                <el-table :data="honorFormData.items" border style="width: 100%">
                  <el-table-column label="序号" width="60" align="center">
                    <template #default="{ $index }">{{ $index + 1 }}</template>
                  </el-table-column>
                  <el-table-column label="标题" min-width="200">
                    <template #default="{ row }">
                      <el-input v-model="row.name" placeholder="如：深圳市电池行业协会理事单位" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column label="图片" width="150">
                    <template #default="{ row, $index }">
                      <div class="table-image-cell">
                        <div class="table-image-preview" v-if="row.imageUrl">
                          <img :src="getImageUrl(row.imageUrl)" :alt="row.name" @error="handleImageError" />
                        </div>
                        <span v-else class="no-image-text">未上传</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="启用" width="80" align="center">
                    <template #default="{ row }">
                      <el-switch v-model="row.isEnabled" :active-value="1" :inactive-value="0" />
                    </template>
                  </el-table-column>
                  <el-table-column width="100" align="center">
                    <template #header>
                      <el-button type="primary" size="small" text @click="addHonorItem">
                        <el-icon><Plus /></el-icon>
                      </el-button>
                    </template>
                    <template #default="{ row, $index }">
                      <div class="table-actions">
                        <el-upload
                          :show-file-list="false"
                          :http-request="(options) => handleHonorImageUpload(options, $index)"
                          accept="image/*"
                          class="inline-upload"
                        >
                          <el-button type="primary" size="small" text>
                            <el-icon><UploadFilled /></el-icon>
                          </el-button>
                        </el-upload>
                        <el-button
                          type="danger"
                          size="small"
                          text
                          @click="removeHonorItem($index)"
                          v-if="honorFormData.items.length > 1"
                        >
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>

            <el-form-item style="margin-left: -50px;">
              <el-button type="primary" @click="handleHonorSubmit" :loading="honorSubmitting">
                保存设置
              </el-button>
              <el-button @click="handleHonorReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { Close, Plus, Delete, UploadFilled } from '@element-plus/icons-vue'
import { getCompanyProfile, saveCompanyProfile } from '@/api/companyProfile'
import { uploadImage } from '@/api/upload'
import { BASE_URL } from '@/utils/request'
import { notifyDataChange } from '@/utils/crossTabSync'

const activeTab = ref('intro')
const introFormRef = ref(null)
const historyFormRef = ref(null)
const honorFormRef = ref(null)

const introLoading = ref(false)
const historyLoading = ref(false)
const honorLoading = ref(false)
const introSubmitting = ref(false)
const historySubmitting = ref(false)
const honorSubmitting = ref(false)

const historyCollapse = ref(['history'])
const honorCollapse = ref(['honor'])

const introFormData = reactive({
  image: '',
  description: ''
})

const historyFormData = reactive({
  items: [
    { key: Date.now(), year: '', desc: '', isEnabled: 1 }
  ]
})

const honorFormData = reactive({
  items: [
    { key: Date.now() + 1, name: '', imageUrl: '', isEnabled: 1 }
  ]
})

const originalIntroData = ref({})
const originalHistoryData = ref({})
const originalHonorData = ref({})

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return BASE_URL + '/api' + path
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

const fetchData = async () => {
  introLoading.value = true
  historyLoading.value = true
  honorLoading.value = true
  try {
    const res = await getCompanyProfile()
    if (res.data) {
      if (res.data.companyIntro) {
        introFormData.image = res.data.companyIntro.image || ''
        introFormData.description = res.data.companyIntro.description || ''
      }
      originalIntroData.value = JSON.parse(JSON.stringify(introFormData))

      if (res.data.historyItems && res.data.historyItems.length > 0) {
        historyFormData.items = res.data.historyItems.map((item) => ({
          key: Date.now() + Math.random(),
          id: item.id,
          year: item.year || '',
          desc: item.description || '',
          isEnabled: item.isEnabled,
          sortOrder: item.sortOrder
        }))
      }
      originalHistoryData.value = JSON.parse(JSON.stringify(historyFormData))

      if (res.data.honorItems && res.data.honorItems.length > 0) {
        honorFormData.items = res.data.honorItems.map((item) => ({
          key: Date.now() + Math.random(),
          id: item.id,
          name: item.name || '',
          imageUrl: item.imageUrl || '',
          isEnabled: item.isEnabled,
          sortOrder: item.sortOrder
        }))
      }
      originalHonorData.value = JSON.parse(JSON.stringify(honorFormData))
    }
  } catch (error) {
    console.error('获取企业简介信息失败:', error)
    originalIntroData.value = JSON.parse(JSON.stringify(introFormData))
    originalHistoryData.value = JSON.parse(JSON.stringify(historyFormData))
    originalHonorData.value = JSON.parse(JSON.stringify(honorFormData))
  } finally {
    introLoading.value = false
    historyLoading.value = false
    honorLoading.value = false
  }
}

const handleIntroImageUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'uploadfile')
    if (res.code === 200) {
      introFormData.image = res.data.url
      ElNotification({ title: '成功', message: '上传成功', type: 'success', duration: 3000 })
    } else {
      ElNotification({ title: '错误', message: res.message || '上传失败', type: 'error', duration: 3000 })
    }
  } catch (error) {
    ElNotification({ title: '错误', message: '上传失败', type: 'error', duration: 3000 })
  }
}

const handleHonorImageUpload = async (options, index) => {
  try {
    const res = await uploadImage(options.file, 'uploadfile')
    if (res.code === 200) {
      honorFormData.items[index].imageUrl = res.data.url
      ElNotification({ title: '成功', message: '上传成功', type: 'success', duration: 3000 })
    } else {
      ElNotification({ title: '错误', message: res.message || '上传失败', type: 'error', duration: 3000 })
    }
  } catch (error) {
    ElNotification({ title: '错误', message: '上传失败', type: 'error', duration: 3000 })
  }
}

const addHistoryItem = () => {
  historyFormData.items.push({
    key: Date.now() + Math.random(),
    year: '',
    desc: '',
    isEnabled: 1
  })
}

const removeHistoryItem = async (index) => {
  if (historyFormData.items.length <= 1) {
    ElNotification({ title: '提示', message: '至少需要保留一条发展历程', type: 'warning', duration: 3000 })
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除这条发展历程吗？', '删除确认', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
    historyFormData.items.splice(index, 1)
    ElNotification({ title: '成功', message: '删除成功', type: 'success', duration: 3000 })
  } catch (error) {}
}

const addHonorItem = () => {
  honorFormData.items.push({
    key: Date.now() + Math.random(),
    name: '',
    imageUrl: '',
    isEnabled: 1
  })
}

const removeHonorItem = async (index) => {
  if (honorFormData.items.length <= 1) {
    ElNotification({ title: '提示', message: '至少需要保留一条荣誉资质', type: 'warning', duration: 3000 })
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除这条荣誉资质吗？', '删除确认', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
    honorFormData.items.splice(index, 1)
    ElNotification({ title: '成功', message: '删除成功', type: 'success', duration: 3000 })
  } catch (error) {}
}

const handleIntroSubmit = async () => {
  introSubmitting.value = true
  try {
    await saveCompanyProfile({
      companyIntro: {
        image: introFormData.image,
        description: introFormData.description
      }
    })
    ElNotification({ title: '成功', message: '保存成功', type: 'success', duration: 3000 })
    originalIntroData.value = JSON.parse(JSON.stringify(introFormData))
    notifyDataChange('company-profile')
  } catch (error) {
    ElNotification({ title: '错误', message: error.message || '保存失败', type: 'error', duration: 3000 })
  } finally {
    introSubmitting.value = false
  }
}

const handleHistorySubmit = async () => {
  historySubmitting.value = true
  try {
    await saveCompanyProfile({
      historyItems: historyFormData.items.map((item, index) => ({
        id: item.id,
        year: item.year,
        description: item.desc,
        isEnabled: item.isEnabled,
        sortOrder: index + 1
      }))
    })
    ElNotification({ title: '成功', message: '保存成功', type: 'success', duration: 3000 })
    originalHistoryData.value = JSON.parse(JSON.stringify(historyFormData))
    notifyDataChange('company-profile')
  } catch (error) {
    ElNotification({ title: '错误', message: error.message || '保存失败', type: 'error', duration: 3000 })
  } finally {
    historySubmitting.value = false
  }
}

const handleHonorSubmit = async () => {
  honorSubmitting.value = true
  try {
    await saveCompanyProfile({
      honorItems: honorFormData.items.map((item, index) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        isEnabled: item.isEnabled,
        sortOrder: index + 1
      }))
    })
    ElNotification({ title: '成功', message: '保存成功', type: 'success', duration: 3000 })
    originalHonorData.value = JSON.parse(JSON.stringify(honorFormData))
    notifyDataChange('company-profile')
  } catch (error) {
    ElNotification({ title: '错误', message: error.message || '保存失败', type: 'error', duration: 3000 })
  } finally {
    honorSubmitting.value = false
  }
}

const handleIntroReset = () => {
  Object.assign(introFormData, JSON.parse(JSON.stringify(originalIntroData.value)))
}

const handleHistoryReset = () => {
  Object.assign(historyFormData, JSON.parse(JSON.stringify(originalHistoryData.value)))
}

const handleHonorReset = () => {
  Object.assign(honorFormData, JSON.parse(JSON.stringify(originalHonorData.value)))
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.company-profile-management {
  padding: 24px;
  min-height: calc(100vh - 100px);
  background-color: #f5f7fa;
}

.main-card {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-upload-wrapper {
  width: 100%;
}

.image-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 350px;
}

.image-input-row .el-input {
  flex: 1;
  min-width: 200px;
}

.image-preview-container {
  margin-top: 10px;
  display: inline-block;
}

.image-preview-box {
  position: relative;
  display: inline-block;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fafafa;
}

.image-preview-box img {
  max-width: 300px;
  max-height: 120px;
  display: block;
}

.image-delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background-color: #f56c6c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.image-delete-btn:hover {
  background-color: #e64242;
}

.image-delete-btn .el-icon {
  color: #fff;
  font-size: 12px;
}

.upload-tip {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 8px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 折叠面板样式 */
.config-collapse {
  margin-left: 70px;
  max-width: 800px;
  margin-bottom: 20px;
}

.config-collapse :deep(.el-collapse-item__header) {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}

.config-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 16px;
}

.table-image-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.table-image-preview img {
  max-width: 120px;
  max-height: 60px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.no-image-text {
  color: #909399;
  font-size: 12px;
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.inline-upload {
  display: inline-flex;
}

:deep(.el-card__body) {
  padding: 20px;
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

:deep(.el-tabs__content) {
  padding: 24px 20px;
}

:deep(.el-form) {
  padding-top: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-button) {
  border-radius: 4px;
  font-weight: 500;
}

:deep(.el-divider) {
  margin: 24px 0;
}

:deep(.el-divider__text) {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}
</style>