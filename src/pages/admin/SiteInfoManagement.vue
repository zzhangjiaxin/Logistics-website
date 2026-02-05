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

            <!-- 数字卡片配置 -->
            <el-divider content-position="left">数字卡片配置</el-divider>

            <div class="cards-grid">
              <el-card
                v-for="(card, index) in aboutFormData.cards"
                :key="card.key"
                class="card-item"
                :class="{ 'is-collapsed': collapsedCards[index] }"
                shadow="hover"
              >
                <template #header>
                  <div class="card-header">
                    <div class="card-header-left" @click="toggleCardCollapse(index)">
                      <el-icon class="collapse-icon" :class="{ 'is-collapsed': collapsedCards[index] }">
                        <ArrowRight />
                      </el-icon>
                      <span class="card-title">卡片 {{ index + 1 }}</span>
                      <span class="card-preview" v-if="collapsedCards[index] && (card.number || card.label)">
                        - {{ card.number }} {{ card.label }}
                      </span>
                    </div>
                    <div class="card-actions" @click.stop>
                      <el-tag
                        :type="card.isEnabled === 1 ? 'success' : 'info'"
                        size="small"
                      >
                        {{ card.isEnabled === 1 ? '已启用' : '已禁用' }}
                      </el-tag>
                      <el-button
                        type="danger"
                        size="small"
                        text
                        @click="removeCard(index)"
                        v-if="aboutFormData.cards.length > 1"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </template>

                <div class="card-content" v-show="!collapsedCards[index]">
                  <el-form label-width="70px">
                    <el-form-item label="数字">
                      <el-input v-model="card.number" placeholder="如：5、15、30+、500+" maxlength="50" />
                    </el-form-item>

                    <el-form-item label="描述">
                      <el-input v-model="card.label" placeholder="如：5个分公司、15年以上" maxlength="100" />
                    </el-form-item>

                    <el-form-item label="是否启用">
                      <el-switch v-model="card.isEnabled" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </div>

            <el-form-item style="margin-top: 20px; margin-left: -50px;">
              <el-button type="primary" plain @click="addCard">
                <el-icon><Plus /></el-icon>
                添加数字卡片
              </el-button>
              <span class="form-tip" style="margin-left: 10px;">可以添加任意数量的数字卡片</span>
            </el-form-item>

            <!-- 底部图片配置 -->
            <el-divider content-position="left">底部图片配置</el-divider>

            <div class="images-grid">
              <el-card
                v-for="(image, index) in aboutFormData.bottomImages"
                :key="image.key"
                class="image-item"
                :class="{ 'is-collapsed': collapsedImages[index] }"
                shadow="hover"
              >
                <template #header>
                  <div class="card-header">
                    <div class="card-header-left" @click="toggleImageCollapse(index)">
                      <el-icon class="collapse-icon" :class="{ 'is-collapsed': collapsedImages[index] }">
                        <ArrowRight />
                      </el-icon>
                      <span class="card-title">底部图片 {{ index + 1 }}</span>
                      <span class="card-preview" v-if="collapsedImages[index] && image.title">
                        - {{ image.title }}
                      </span>
                    </div>
                    <div class="card-actions" @click.stop>
                      <el-tag
                        :type="image.isEnabled === 1 ? 'success' : 'info'"
                        size="small"
                      >
                        {{ image.isEnabled === 1 ? '已启用' : '已禁用' }}
                      </el-tag>
                      <el-button
                        type="danger"
                        size="small"
                        text
                        @click="removeBottomImage(index)"
                        v-if="aboutFormData.bottomImages.length > 1"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </template>

                <div class="card-content" v-show="!collapsedImages[index]">
                  <el-form label-width="70px">
                    <el-form-item label="图片">
                      <div class="image-upload-wrapper">
                        <div class="image-input-row">
                          <el-input v-model="image.imageUrl" placeholder="请输入图片路径或上传图片" />
                          <el-upload
                            :show-file-list="false"
                            :http-request="(options) => handleBottomImageUpload(options, index)"
                            accept="image/*"
                          >
                            <el-button type="primary" size="small">上传</el-button>
                          </el-upload>
                        </div>
                        <div class="image-preview-container" v-if="image.imageUrl">
                          <div class="image-preview-box small">
                            <img :src="getImageUrl(image.imageUrl)" :alt="`底部图片${index + 1}`" @error="handleImageError" />
                            <div class="image-delete-btn" @click="image.imageUrl = ''">
                              <el-icon><Close /></el-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-form-item>

                    <el-form-item label="标题">
                      <el-input v-model="image.title" placeholder="如：企业文化、发展历程" maxlength="100" />
                    </el-form-item>

                    <el-form-item label="链接">
                      <el-input v-model="image.linkUrl" placeholder="如：/aboutus#dw2" maxlength="500" />
                    </el-form-item>

                    <el-form-item label="是否启用">
                      <el-switch v-model="image.isEnabled" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </div>

            <el-form-item style="margin-top: 20px; margin-left: -50px;">
              <el-button type="primary" plain @click="addBottomImage">
                <el-icon><Plus /></el-icon>
                添加底部图片
              </el-button>
              <span class="form-tip" style="margin-left: 10px;">可以添加任意数量的底部图片</span>
            </el-form-item>

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
import { Close, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
import { getSiteInfo, saveSiteInfo } from '@/api/siteInfo'
import { getHomeAboutInfo, saveHomeAboutInfo } from '@/api/homeAbout'
import { uploadImage } from '@/api/upload'
import { BASE_URL } from '@/utils/request'

const activeTab = ref('list')
const formRef = ref(null)
const aboutFormRef = ref(null)
const loading = ref(false)
const aboutLoading = ref(false)
const submitting = ref(false)
const aboutSubmitting = ref(false)

// 卡片折叠状态
const collapsedCards = ref({}) // 记录每个卡片的折叠状态
const collapsedImages = ref({}) // 记录每个图片的折叠状态

// 站点信息表单数据
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
        // 初始化所有卡片为折叠状态
        aboutFormData.cards.forEach((_, index) => {
          collapsedCards.value[index] = true
        })
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
        // 初始化所有图片为折叠状态
        aboutFormData.bottomImages.forEach((_, index) => {
          collapsedImages.value[index] = true
        })
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
  const newIndex = aboutFormData.cards.length
  aboutFormData.cards.push({
    key: Date.now() + Math.random(),
    number: '',
    label: '',
    isEnabled: 1
  })
  // 新添加的卡片默认折叠
  collapsedCards.value[newIndex] = true
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
  const newIndex = aboutFormData.bottomImages.length
  aboutFormData.bottomImages.push({
    key: Date.now() + Math.random(),
    imageUrl: '',
    title: '',
    linkUrl: '',
    isEnabled: 1
  })
  // 新添加的图片默认折叠
  collapsedImages.value[newIndex] = true
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

// 切换卡片折叠状态
const toggleCardCollapse = (index) => {
  // 使用 Vue 的响应式 API 确保更新被追踪
  if (collapsedCards.value[index]) {
    delete collapsedCards.value[index]
  } else {
    collapsedCards.value[index] = true
  }
  // 强制触发响应式更新
  collapsedCards.value = { ...collapsedCards.value }
}

// 切换图片折叠状态
const toggleImageCollapse = (index) => {
  // 使用 Vue 的响应式 API 确保更新被追踪
  if (collapsedImages.value[index]) {
    delete collapsedImages.value[index]
  } else {
    collapsedImages.value[index] = true
  }
  // 强制触发响应式更新
  collapsedImages.value = { ...collapsedImages.value }
}

// 提交站点信息表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await saveSiteInfo(formData)
      ElNotification({
        title: '成功',
        message: '保存成功',
        type: 'success',
        duration: 3000
      })
      // 更新原始数据
      originalData.value = { ...formData }
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

/* 卡片网格布局 - 恢复原来的单列布局 */
.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  max-width: 670px;
  margin-left: 70px;
}

.cards-grid .card-item {
  width: 100% !important;
  max-width: 100%;
  margin-bottom: 0;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* 图片网格布局 - 恢复原来的单列布局 */
.images-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  max-width: 670px;
  margin-left: 70px;
}

.images-grid .image-item {
  width: 100% !important;
  max-width: 100%;
  margin-bottom: 0;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* 确保 el-card 组件宽度一致 */
.cards-grid .card-item :deep(.el-card),
.images-grid .image-item :deep(.el-card) {
  width: 100% !important;
  box-sizing: border-box;
}

.cards-grid .card-item :deep(.el-card__header),
.images-grid .image-item :deep(.el-card__header) {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
}

.cards-grid .card-item :deep(.el-card__body),
.images-grid .image-item :deep(.el-card__body) {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-left {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
  user-select: none;
}

.card-header-left:hover .card-title {
  color: #409eff;
}

.collapse-icon {
  margin-right: 8px;
  transition: transform 0.3s;
  color: #909399;
}

.collapse-icon.is-collapsed {
  transform: rotate(0deg);
}

.collapse-icon:not(.is-collapsed) {
  transform: rotate(90deg);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  transition: color 0.3s;
}

.card-preview {
  margin-left: 8px;
  color: #909399;
  font-weight: normal;
  font-size: 13px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 卡片内容区域 */
.card-content {
  transition: all 0.3s;
}

/* 折叠状态的卡片 - 简化版本 */
.card-item.is-collapsed,
.image-item.is-collapsed {
  cursor: pointer;
}

/* 折叠时隐藏卡片主体 */
.card-item.is-collapsed :deep(.el-card__body),
.image-item.is-collapsed :deep(.el-card__body) {
  display: none;
}

/* 折叠时的卡片头部样式 */
.card-item.is-collapsed :deep(.el-card__header),
.image-item.is-collapsed :deep(.el-card__header) {
  margin-bottom: 0;
  padding: 16px;
}

/* 展开状态的卡片主体 */
.card-item:not(.is-collapsed) :deep(.el-card__body),
.image-item:not(.is-collapsed) :deep(.el-card__body) {
  display: block;
  padding: 16px;
}

/* 展开状态的卡片 */
.card-item:not(.is-collapsed) .el-card__body,
.image-item:not(.is-collapsed) .el-card__body {
  padding: 16px;
}

/* 卡片内表单样式 */
.card-item .el-form-item,
.image-item .el-form-item {
  margin-bottom: 16px;
}

.card-item .el-form-item:last-child,
.image-item .el-form-item:last-child {
  margin-bottom: 0;
}

/* 统一标签宽度，确保对齐 */
.card-item :deep(.el-form-item__label),
.image-item :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  text-align: right;
  padding-right: 12px;
}

/* 小尺寸图片预览 */
.image-preview-box.small img {
  max-width: 200px;
  max-height: 100px;
}

/* 折叠面板样式（已移除，保留注释供参考） */
/* 现在使用卡片网格布局代替折叠面板 */

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
