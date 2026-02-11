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
              <el-input v-model="formData.siteTitle" placeholder="请输入站点标题" maxlength="100" show-word-limit />
            </el-form-item>

            <!-- 站点副标题 -->
            <el-form-item label="站点副标题" prop="siteSubtitle">
              <el-input v-model="formData.siteSubtitle" placeholder="请输入站点副标题" maxlength="200" show-word-limit />
            </el-form-item>

            <!-- 站点域名（来自租户信息，只读） -->
            <el-form-item label="站点域名">
              <el-input v-model="formData.siteDomain" disabled />
              <div class="form-tip">不可编辑</div>
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

            <!-- 微信公众号二维码 -->
            <el-form-item label="微信二维码" prop="wechatQrcode">
              <div class="image-upload-wrapper">
                <div class="image-input-row">
                  <el-input v-model="formData.wechatQrcode" placeholder="请输入图片路径或上传图片" />
                  <el-upload
                    :show-file-list="false"
                    :http-request="handleWechatQrcodeUpload"
                    accept="image/*"
                  >
                    <el-button type="primary">上传图片</el-button>
                  </el-upload>
                </div>
                <div class="image-preview-container" v-if="formData.wechatQrcode">
                  <div class="image-preview-box">
                    <img :src="wechatQrcodeUrl" alt="微信公众号二维码" @error="handleImageError" />
                    <div class="image-delete-btn" @click="formData.wechatQrcode = ''">
                      <el-icon><Close /></el-icon>
                    </div>
                  </div>
                </div>
                <div class="upload-tip">建议尺寸：200x200px，支持 jpg、png 格式</div>
              </div>
            </el-form-item>

            <!-- 视频号 -->
            <el-form-item label="视频号" prop="videoAccount">
              <el-input v-model="formData.videoAccount" placeholder="请输入视频号名称" maxlength="100" />
            </el-form-item>

            <!-- 抖音号 -->
            <el-form-item label="抖音号" prop="douyinAccount">
              <el-input v-model="formData.douyinAccount" placeholder="请输入抖音号" maxlength="100" />
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

        <!-- 首页 - 关于我们 Tab -->
        <el-tab-pane label="首页 - 关于我们" name="about">
          <el-form
            ref="aboutFormRef"
            :model="aboutFormData"
            label-width="120px"
            v-loading="aboutLoading"
            style="max-width: 900px;"
          >
            <!-- 精简介绍 -->
            <el-divider content-position="left">精简介绍</el-divider>
            <el-form-item label="介绍文字">
              <el-input
                v-model="aboutFormData.description"
                type="textarea"
                :rows="6"
                placeholder="请输入首页关于我们的精简介绍"
                maxlength="500"
                show-word-limit
              />
              <div class="form-tip">显示在首页"关于我们"区块左侧的文字介绍</div>
            </el-form-item>

            <!-- 主图片 -->
            <el-form-item label="主图片">
              <div class="image-upload-wrapper">
                <div class="image-input-row">
                  <el-input v-model="aboutFormData.mainImage" placeholder="请输入图片路径或上传图片" />
                  <el-upload
                    :show-file-list="false"
                    :http-request="handleMainImageUpload"
                    accept="image/*"
                  >
                    <el-button type="primary">上传图片</el-button>
                  </el-upload>
                </div>
                <div class="image-preview-container" v-if="aboutFormData.mainImage">
                  <div class="image-preview-box">
                    <img :src="getImageUrl(aboutFormData.mainImage)" alt="主图片" @error="handleImageError" />
                    <div class="image-delete-btn" @click="aboutFormData.mainImage = ''">
                      <el-icon><Close /></el-icon>
                    </div>
                  </div>
                </div>
                <div class="upload-tip">建议尺寸：800x600px，显示在右侧的主图</div>
              </div>
            </el-form-item>

            <el-collapse v-model="aboutCollapse" class="config-collapse">
              <el-collapse-item title="数字卡片配置" name="cards">
                <el-table :data="aboutFormData.cards" border style="width: 100%">
                  <el-table-column label="序号" width="60" align="center">
                    <template #default="{ $index }">{{ $index + 1 }}</template>
                  </el-table-column>
                  <el-table-column label="数字" min-width="150">
                    <template #default="{ row }">
                      <el-input v-model="row.number" placeholder="如：5、15、30+" maxlength="50" />
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" min-width="200">
                    <template #default="{ row }">
                      <el-input v-model="row.label" placeholder="如：5个分公司" maxlength="100" />
                    </template>
                  </el-table-column>
                  <el-table-column label="启用" width="80" align="center">
                    <template #default="{ row }">
                      <el-switch v-model="row.isEnabled" :active-value="1" :inactive-value="0" />
                    </template>
                  </el-table-column>
                  <el-table-column width="80" align="center">
                    <template #header>
                      <el-button type="primary" size="small" text @click="addCard">
                        <el-icon><Plus /></el-icon>
                      </el-button>
                    </template>
                    <template #default="{ $index }">
                      <el-button
                        type="danger"
                        size="small"
                        text
                        @click="removeCard($index)"
                        v-if="aboutFormData.cards.length > 1"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>

              <el-collapse-item title="底部图片配置" name="images">
                <el-table :data="aboutFormData.bottomImages" border style="width: 100%">
                  <el-table-column label="序号" width="60" align="center">
                    <template #default="{ $index }">{{ $index + 1 }}</template>
                  </el-table-column>
                  <el-table-column label="图片" width="150">
                    <template #default="{ row, $index }">
                      <div class="table-image-cell">
                        <div class="table-image-preview" v-if="row.imageUrl">
                          <img :src="getImageUrl(row.imageUrl)" :alt="`底部图片${$index + 1}`" @error="handleImageError" />
                        </div>
                        <span v-else class="no-image-text">未上传</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="标题" min-width="140">
                    <template #default="{ row }">
                      <el-input v-model="row.title" placeholder="如：企业文化" maxlength="100" />
                    </template>
                  </el-table-column>
                  <el-table-column label="链接" min-width="160">
                    <template #default="{ row }">
                      <el-input v-model="row.linkUrl" placeholder="如：/aboutus#dw2" maxlength="500" />
                    </template>
                  </el-table-column>
                  <el-table-column label="启用" width="80" align="center">
                    <template #default="{ row }">
                      <el-switch v-model="row.isEnabled" :active-value="1" :inactive-value="0" />
                    </template>
                  </el-table-column>
                  <el-table-column width="100" align="center">
                    <template #header>
                      <el-button type="primary" size="small" text @click="addBottomImage">
                        <el-icon><Plus /></el-icon>
                      </el-button>
                    </template>
                    <template #default="{ row, $index }">
                      <div class="table-actions">
                        <el-upload
                          :show-file-list="false"
                          :http-request="(options) => handleBottomImageUpload(options, $index)"
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
                          @click="removeBottomImage($index)"
                          v-if="aboutFormData.bottomImages.length > 1"
                        >
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>

            <!-- 操作按钮 -->
            <el-form-item style="margin-left: -50px;">
              <el-button type="primary" @click="handleAboutSubmit" :loading="aboutSubmitting">
                保存设置
              </el-button>
              <el-button @click="handleAboutReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { Close, Plus, Delete, UploadFilled } from '@element-plus/icons-vue'
import { getSiteInfo, saveSiteInfo } from '@/api/siteInfo'
import { getHomeAboutInfo, saveHomeAboutInfo } from '@/api/homeAbout'
import { uploadImage } from '@/api/upload'
import { BASE_URL } from '@/utils/request'
import { useSiteStore } from '@/stores'
import { notifyDataChange } from '@/utils/crossTabSync'

const siteStore = useSiteStore()

const activeTab = ref('list')
const formRef = ref(null)
const aboutFormRef = ref(null)
const loading = ref(false)
const aboutLoading = ref(false)
const submitting = ref(false)
const aboutSubmitting = ref(false)
const aboutCollapse = ref(['cards', 'images'])

// 站点信息表单数据
const formData = reactive({
  siteTitle: '',
  siteSubtitle: '',
  siteDomain: '',
  slug: '',
  siteLogo: '',
  footerLogo: '',
  siteIcp: '',
  siteTemplate: '',
  footerInfo: '',
  wechatQrcode: '',
  videoAccount: '',
  douyinAccount: ''
})

// 关于我们表单数据（灵活配置）
const aboutFormData = reactive({
  description: '',
  mainImage: '',
  cards: [
    { key: Date.now(), number: '', label: '', isEnabled: 1 }
  ],
  bottomImages: [
    { key: Date.now() + 1, imageUrl: '', title: '', linkUrl: '', isEnabled: 1 }
  ]
})

// 原始数据（用于重置）
const originalData = ref({})
const originalAboutData = ref({})

// 表单验证规则
const formRules = {}

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

// 计算属性：微信二维码完整URL
const wechatQrcodeUrl = computed(() => getImageUrl(formData.wechatQrcode))

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
  // 不隐藏元素，避免后续 src 更新后仍不可见
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
    ElNotification({
      title: '错误',
      message: '获取站点信息失败',
      type: 'error',
      duration: 3000
    })
  } finally {
    loading.value = false
  }
}

// 获取关于我们信息
const fetchAboutInfo = async () => {
  aboutLoading.value = true
  try {
    const res = await getHomeAboutInfo()
    if (res.data) {
      aboutFormData.description = res.data.description || ''
      aboutFormData.mainImage = res.data.mainImage || ''

      // 数字卡片
      if (res.data.cards && res.data.cards.length > 0) {
        aboutFormData.cards = res.data.cards.map((card, index) => ({
          key: Date.now() + Math.random(),
          id: card.id,
          number: card.cardNumber,
          label: card.cardLabel,
          isEnabled: card.isEnabled,
          sortOrder: card.sortOrder
        }))
      }

      // 底部图片
      if (res.data.bottomImages && res.data.bottomImages.length > 0) {
        aboutFormData.bottomImages = res.data.bottomImages.map((img, index) => ({
          key: Date.now() + Math.random(),
          id: img.id,
          imageUrl: img.imageUrl,
          title: img.imageTitle,
          linkUrl: img.linkUrl,
          isEnabled: img.isEnabled,
          sortOrder: img.sortOrder
        }))
      }

      originalAboutData.value = JSON.parse(JSON.stringify(aboutFormData))
    }
  } catch (error) {
    console.error('获取关于我们信息失败:', error)
    ElNotification({
      title: '错误',
      message: '获取关于我们信息失败',
      type: 'error',
      duration: 3000
    })
    originalAboutData.value = JSON.parse(JSON.stringify(aboutFormData))
  } finally {
    aboutLoading.value = false
  }
}

// 站点LOGO上传
const handleSiteLogoUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'logo')
    if (res.code === 200) {
      formData.siteLogo = res.data.url
      ElNotification({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 3000
      })
    } else {
      ElNotification({
        title: '错误',
        message: res.message || '上传失败',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '上传失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 尾部LOGO上传
const handleFooterLogoUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'footer-logo')
    if (res.code === 200) {
      formData.footerLogo = res.data.url
      ElNotification({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 3000
      })
    } else {
      ElNotification({
        title: '错误',
        message: res.message || '上传失败',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '上传失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 微信公众号二维码上传
const handleWechatQrcodeUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'wechat-qrcode')
    if (res.code === 200) {
      formData.wechatQrcode = res.data.url
      ElNotification({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 3000
      })
    } else {
      ElNotification({
        title: '错误',
        message: res.message || '上传失败',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '上传失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 主图片上传
const handleMainImageUpload = async (options) => {
  try {
    const res = await uploadImage(options.file, 'about-main')
    if (res.code === 200) {
      aboutFormData.mainImage = res.data.url
      ElNotification({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 3000
      })
    } else {
      ElNotification({
        title: '错误',
        message: res.message || '上传失败',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '上传失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 底部图片上传
const handleBottomImageUpload = async (options, index) => {
  try {
    const res = await uploadImage(options.file, `about-bottom-${index}`)
    if (res.code === 200) {
      aboutFormData.bottomImages[index].imageUrl = res.data.url
      ElNotification({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 3000
      })
    } else {
      ElNotification({
        title: '错误',
        message: res.message || '上传失败',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '上传失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 添加数字卡片
const addCard = () => {
  aboutFormData.cards.push({
    key: Date.now() + Math.random(),
    number: '',
    label: '',
    isEnabled: 1
  })
}

// 删除数字卡片
const removeCard = async (index) => {
  if (aboutFormData.cards.length <= 1) {
    ElNotification({
      title: '提示',
      message: '至少需要保留一个数字卡片',
      type: 'warning',
      duration: 3000
    })
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要删除这个数字卡片吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    aboutFormData.cards.splice(index, 1)

    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    // 用户取消删除
  }
}

// 添加底部图片
const addBottomImage = () => {
  aboutFormData.bottomImages.push({
    key: Date.now() + Math.random(),
    imageUrl: '',
    title: '',
    linkUrl: '',
    isEnabled: 1
  })
}

// 删除底部图片
const removeBottomImage = async (index) => {
  if (aboutFormData.bottomImages.length <= 1) {
    ElNotification({
      title: '提示',
      message: '至少需要保留一个底部图片',
      type: 'warning',
      duration: 3000
    })
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要删除这个底部图片吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    aboutFormData.bottomImages.splice(index, 1)

    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    // 用户取消删除
  }
}

// 提交站点信息表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      // 排除只读字段，其余全部提交（siteTitle 由后端写入 tenant.name）
      const { siteDomain, slug, ...submitData } = formData
      await saveSiteInfo(submitData)
      ElNotification({
        title: '成功',
        message: '保存成功',
        type: 'success',
        duration: 3000
      })
      // 更新原始数据
      originalData.value = { ...formData }
      // 同步刷新前端展示页的站点信息缓存
      siteStore.fetchSiteInfo()
      // 通知其他标签页数据已更新
      notifyDataChange('site-info')
    } catch (error) {
      ElNotification({
        title: '错误',
        message: '保存失败',
        type: 'error',
        duration: 3000
      })
    } finally {
      submitting.value = false
    }
  })
}

// 提交关于我们表单
const handleAboutSubmit = async () => {
  aboutSubmitting.value = true
  try {
    // 构建提交数据
    const submitData = {
      description: aboutFormData.description,
      mainImage: aboutFormData.mainImage,
      cards: aboutFormData.cards.map((card, index) => ({
        id: card.id,
        cardNumber: card.number,
        cardLabel: card.label,
        isEnabled: card.isEnabled,
        sortOrder: index + 1
      })),
      bottomImages: aboutFormData.bottomImages.map((img, index) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        imageTitle: img.title,
        linkUrl: img.linkUrl,
        isEnabled: img.isEnabled,
        sortOrder: index + 1
      }))
    }

    await saveHomeAboutInfo(submitData)

    ElNotification({
      title: '成功',
      message: '保存成功',
      type: 'success',
      duration: 3000
    })
    // 更新原始数据
    originalAboutData.value = JSON.parse(JSON.stringify(aboutFormData))
    // 同步刷新前端展示页的站点信息缓存
    siteStore.fetchSiteInfo()
    // 通知其他标签页数据已更新
    notifyDataChange('home-about')
  } catch (error) {
    ElNotification({
      title: '错误',
      message: error.message || '保存失败',
      type: 'error',
      duration: 3000
    })
  } finally {
    aboutSubmitting.value = false
  }
}

// 重置站点信息表单
const handleReset = () => {
  Object.assign(formData, originalData.value)
  formRef.value?.clearValidate()
}

// 重置关于我们表单
const handleAboutReset = () => {
  Object.assign(aboutFormData, JSON.parse(JSON.stringify(originalAboutData.value)))
  aboutFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchSiteInfo()
  fetchAboutInfo()
})
</script>

<style scoped>
.site-info-management {
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

/* Tab 优化样式 */
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
