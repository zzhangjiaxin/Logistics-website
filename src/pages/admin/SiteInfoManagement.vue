<template>
  <div class="site-info-management">
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="站点信息" name="list">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            v-loading="loading"
            style="max-width: 900px;"
          >
            <!-- 站点标题 -->
            <el-form-item label="站点标题" prop="siteTitle">
              <el-input v-model="formData.siteTitle" placeholder="请输入站点标题" maxlength="200" show-word-limit />
            </el-form-item>

            <!-- 站点副标题 -->
            <el-form-item label="站点副标题" prop="siteSubtitle">
              <el-input v-model="formData.siteSubtitle" placeholder="请输入站点副标题" maxlength="200" show-word-limit />
            </el-form-item>

            <!-- 站点域名 -->
            <el-form-item label="站点域名" prop="siteDomain">
              <el-input v-model="formData.siteDomain" placeholder="请输入站点域名" maxlength="255" />
            </el-form-item>

            <!-- 站点LOGO -->
            <el-form-item label="站点LOGO" prop="siteLogo">
              <div class="image-upload-wrapper">
                <div class="image-input-row">
                  <el-input v-model="formData.siteLogo" placeholder="请输入图片路径或上传图片" />
                  <el-upload
                    :show-file-list="false"
                    :http-request="handleSiteLogoUpload"
                    accept="image/*"
                  >
                    <el-button type="primary">上传图片</el-button>
                  </el-upload>
                </div>
                <div class="image-preview-container" v-if="formData.siteLogo">
                  <div class="image-preview-box">
                    <img :src="siteLogoUrl" alt="站点LOGO" @error="handleImageError" />
                    <div class="image-delete-btn" @click="formData.siteLogo = ''">
                      <el-icon><Close /></el-icon>
                    </div>
                  </div>
                </div>
                <div class="upload-tip">建议尺寸：200x60px，支持 jpg、png 格式</div>
              </div>
            </el-form-item>

            <!-- 尾部LOGO -->
            <el-form-item label="尾部LOGO" prop="footerLogo">
              <div class="image-upload-wrapper">
                <div class="image-input-row">
                  <el-input v-model="formData.footerLogo" placeholder="请输入图片路径或上传图片" />
                  <el-upload
                    :show-file-list="false"
                    :http-request="handleFooterLogoUpload"
                    accept="image/*"
                  >
                    <el-button type="primary">上传图片</el-button>
                  </el-upload>
                </div>
                <div class="image-preview-container" v-if="formData.footerLogo">
                  <div class="image-preview-box">
                    <img :src="footerLogoUrl" alt="尾部LOGO" @error="handleImageError" />
                    <div class="image-delete-btn" @click="formData.footerLogo = ''">
                      <el-icon><Close /></el-icon>
                    </div>
                  </div>
                </div>
                <div class="upload-tip">建议尺寸：200x60px，支持 jpg、png 格式</div>
              </div>
            </el-form-item>

            <!-- 站点备案 -->
            <el-form-item label="站点备案" prop="siteIcp">
              <el-input v-model="formData.siteIcp" placeholder="请输入站点备案号，如：粤ICP备2021000263号" maxlength="100" />
            </el-form-item>

            <!-- 站点模板 -->
            <el-form-item label="站点模板" prop="siteTemplate">
              <el-input v-model="siteTemplateDisplay" placeholder="待开发" disabled />
              <div class="form-tip">此功能待开发</div>
            </el-form-item>

            <!-- 尾部信息 -->
            <el-form-item label="尾部信息" prop="footerInfo">
              <el-input
                v-model="formData.footerInfo"
                type="textarea"
                :rows="4"
                placeholder="请输入尾部版权信息"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>

            <!-- 操作按钮 -->
            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting">
                保存设置
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { getSiteInfo, saveSiteInfo } from '@/api/siteInfo'
import { uploadImage } from '@/api/upload'
import { BASE_URL } from '@/utils/request'

const activeTab = ref('list')
const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  siteTitle: '',
  siteSubtitle: '',
  siteDomain: '',
  siteLogo: '',
  footerLogo: '',
  siteIcp: '',
  siteTemplate: '',
  footerInfo: ''
})

// 原始数据（用于重置）
const originalData = ref({})

// 表单验证规则
const formRules = {
  siteTitle: [{ required: true, message: '请输入站点标题', trigger: 'blur' }]
}

// 获取完整图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // 后端有 context-path: /api，静态资源也需要加上 /api 前缀
  return BASE_URL + '/api' + path
}

// 计算属性：站点LOGO完整URL
const siteLogoUrl = computed(() => getImageUrl(formData.siteLogo))

// 计算属性：尾部LOGO完整URL
const footerLogoUrl = computed(() => getImageUrl(formData.footerLogo))

// 计算属性：站点模板显示名称
const siteTemplateDisplay = computed(() => {
  const templateMap = {
    'default': '待开发',
    'classic': '经典模板',
    'modern': '现代模板'
  }
  return templateMap[formData.siteTemplate] || formData.siteTemplate
})

// 图片加载错误处理
const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// 获取站点信息
const fetchSiteInfo = async () => {
  loading.value = true
  try {
    const res = await getSiteInfo()
    if (res.data) {
      Object.assign(formData, res.data)
      originalData.value = { ...res.data }
    }
  } catch (error) {
    ElMessage.error('获取站点信息失败')
  } finally {
    loading.value = false
  }
}

// 站点LOGO上传
const handleSiteLogoUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'logo')
    if (res.code === 200) {
      formData.siteLogo = res.data.url
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 尾部LOGO上传
const handleFooterLogoUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'footer-logo')
    if (res.code === 200) {
      formData.footerLogo = res.data.url
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await saveSiteInfo(formData)
      ElMessage.success('保存成功')
      // 更新原始数据
      originalData.value = { ...formData }
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
const handleReset = () => {
  Object.assign(formData, originalData.value)
  formRef.value?.clearValidate()
}

onMounted(() => {
  fetchSiteInfo()
})
</script>

<style scoped>
.site-info-management {
  padding: 20px;
}

.main-card {
  min-height: 500px;
}

/* 图片上传组件样式 */
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
</style>
