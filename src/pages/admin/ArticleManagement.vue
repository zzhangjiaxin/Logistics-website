<template>
  <div class="article-management">
    <el-card class="main-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 文章列表 -->
        <el-tab-pane :label="listTabLabel" name="list" v-if="!showEditTab">
          <!-- 筛选栏 -->
          <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <el-select
              v-if="isNews"
              v-model="filterNavigationId"
              placeholder="全部分类"
              clearable
              @change="handleFilterChange"
              style="width: 200px"
            >
              <el-option label="全部分类" value="" />
              <el-option
                v-for="nav in newsNavigations"
                :key="nav.id"
                :value="nav.id"
                :label="nav.name"
              />
            </el-select>
            <el-select
              v-model="filterStatus"
              placeholder="全部状态"
              clearable
              @change="handleFilterChange"
              style="width: 150px"
            >
              <el-option label="全部状态" value="" />
              <el-option label="已发布" :value="1" />
              <el-option label="草稿" :value="0" />
            </el-select>
            <el-input
              v-model="filterKeyword"
              placeholder="搜索标题..."
              clearable
              @keyup.enter="handleFilterChange"
              @clear="handleFilterChange"
              style="width: 220px"
            />
            <el-button type="primary" :icon="Search" @click="handleFilterChange" style="margin-left: -8px;">搜索</el-button>
          </div>

          <el-table
            :data="articleList"
            style="width: 100%"
            v-loading="loading"
            row-key="id"
          >
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">
                {{ (currentPage - 1) * pageSize + $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column v-if="isNews" label="封面图" width="120">
              <template #default="{ row }">
                <el-image
                  v-if="row.coverImage"
                  :src="getFullImageUrl(row.coverImage)"
                  :preview-src-list="[getFullImageUrl(row.coverImage)]"
                  :preview-teleported="true"
                  fit="cover"
                  style="width: 80px; height: 50px; border-radius: 4px; cursor: pointer;"
                />
                <span v-else style="color: #c0c4cc; font-size: 12px;">无封面</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
            <el-table-column v-if="isNews" prop="navigationName" label="分类" width="120">
              <template #default="{ row }">
                <el-tag size="small">{{ row.navigationName || '未分类' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="isNews" prop="author" label="作者" width="100" />
            <el-table-column prop="publishDate" label="发布日期" width="120" />
            <el-table-column v-if="isNews" label="推荐" width="80">
              <template #default="{ row }">
                <el-tag v-if="row.isFeatured === 1" type="warning" size="small">推荐</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 1 ? '已发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEdit(row)">修改</el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchArticleList"
            @current-change="fetchArticleList"
            style="margin-top: 20px; justify-content: flex-end;"
          />
        </el-tab-pane>

        <!-- 文章新增 -->
        <el-tab-pane :label="addTabLabel" name="add" v-if="!showEditTab" lazy>
          <div class="form-container">
            <el-form
              ref="addFormRef"
              :model="addFormData"
              :rules="formRules"
              label-width="100px"
            >
              <el-form-item v-if="isNews" label="分类" prop="navigationId">
                <el-select v-model="addFormData.navigationId" placeholder="请选择分类" style="width: 300px" @change="fetchNextSortOrder($event)">
                  <el-option
                    v-for="nav in newsNavigations"
                    :key="nav.id"
                    :value="nav.id"
                    :label="nav.name"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="标题" prop="title">
                <el-input v-model="addFormData.title" placeholder="请输入标题" style="width: 500px" />
              </el-form-item>

              <el-form-item v-if="isNews" label="摘要" prop="description">
                <el-input
                  v-model="addFormData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入摘要，用于列表页展示"
                  style="width: 500px"
                />
              </el-form-item>

              <el-form-item v-if="isNews" label="封面图" prop="coverImage">
                <div>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <el-input v-model="addFormData.coverImage" placeholder="请输入封面图URL或上传" style="width: 260px" />
                    <el-upload
                      :show-file-list="false"
                      :http-request="(opts) => handleUploadCover(opts, 'add')"
                      accept="image/*"
                    >
                      <el-button type="primary">上传封面</el-button>
                    </el-upload>
                  </div>
                  <div v-if="addFormData.coverImage" style="position: relative; display: inline-block; margin-top: 10px;">
                    <el-image
                      :src="getFullImageUrl(addFormData.coverImage)"
                      :preview-src-list="[getFullImageUrl(addFormData.coverImage)]"
                      :preview-teleported="true"
                      fit="cover"
                      style="width: 200px; height: 120px; border-radius: 4px; border: 1px solid #dcdfe6;"
                    />
                    <el-button
                      type="danger"
                      :icon="Close"
                      circle
                      size="small"
                      @click="addFormData.coverImage = ''"
                      style="position: absolute; top: -8px; right: -8px; z-index: 10;"
                    />
                  </div>
                </div>
              </el-form-item>

              <el-form-item v-if="isNews" label="作者" prop="author">
                <el-input v-model="addFormData.author" placeholder="请输入作者" style="width: 200px" />
              </el-form-item>

              <el-form-item label="发布日期" prop="publishDate">
                <el-date-picker
                  v-model="addFormData.publishDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>

              <el-form-item label="内容" prop="content">
                <TinymceEditor
                  v-model="addFormData.content"
                  :init="tinymceInit"
                />
              </el-form-item>

              <el-form-item v-if="isNews" label="推荐" prop="isFeatured">
                <el-switch
                  v-model="addFormData.isFeatured"
                  :active-value="1"
                  :inactive-value="0"
                />
                <span class="form-tip">开启后将在新闻轮播推荐位展示</span>
              </el-form-item>

              <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="addFormData.sortOrder" :min="1" :max="999" />
                <span class="form-tip">数字越小越靠前，选择分类后自动计算</span>
              </el-form-item>

              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="addFormData.status">
                  <el-radio :value="1">发布</el-radio>
                  <el-radio :value="0">草稿</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleAddSubmit" :loading="submitting">立即创建</el-button>
                <el-button @click="handleAddReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 文章修改 -->
        <el-tab-pane :label="editTabLabel" name="edit" v-if="showEditTab" lazy>
          <div class="form-container">
            <el-form
              ref="editFormRef"
              :model="editFormData"
              :rules="formRules"
              label-width="100px"
            >
              <el-form-item v-if="isNews" label="分类" prop="navigationId">
                <el-select v-model="editFormData.navigationId" placeholder="请选择分类" style="width: 300px">
                  <el-option
                    v-for="nav in newsNavigations"
                    :key="nav.id"
                    :value="nav.id"
                    :label="nav.name"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="标题" prop="title">
                <el-input v-model="editFormData.title" placeholder="请输入标题" style="width: 500px" />
              </el-form-item>

              <el-form-item v-if="isNews" label="摘要" prop="description">
                <el-input
                  v-model="editFormData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入摘要"
                  style="width: 500px"
                />
              </el-form-item>

              <el-form-item v-if="isNews" label="封面图" prop="coverImage">
                <div>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <el-input v-model="editFormData.coverImage" placeholder="请输入封面图URL或上传" style="width: 260px" />
                    <el-upload
                      :show-file-list="false"
                      :http-request="(opts) => handleUploadCover(opts, 'edit')"
                      accept="image/*"
                    >
                      <el-button type="primary">上传封面</el-button>
                    </el-upload>
                  </div>
                  <div v-if="editFormData.coverImage" style="position: relative; display: inline-block; margin-top: 10px;">
                    <el-image
                      :src="getFullImageUrl(editFormData.coverImage)"
                      :preview-src-list="[getFullImageUrl(editFormData.coverImage)]"
                      :preview-teleported="true"
                      fit="cover"
                      style="width: 200px; height: 120px; border-radius: 4px; border: 1px solid #dcdfe6;"
                    />
                    <el-button
                      type="danger"
                      :icon="Close"
                      circle
                      size="small"
                      @click="editFormData.coverImage = ''"
                      style="position: absolute; top: -8px; right: -8px; z-index: 10;"
                    />
                  </div>
                </div>
              </el-form-item>

              <el-form-item v-if="isNews" label="作者" prop="author">
                <el-input v-model="editFormData.author" placeholder="请输入作者" style="width: 200px" />
              </el-form-item>

              <el-form-item label="发布日期" prop="publishDate">
                <el-date-picker
                  v-model="editFormData.publishDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>

              <el-form-item label="内容" prop="content">
                <TinymceEditor
                  v-model="editFormData.content"
                  :init="tinymceInit"
                />
              </el-form-item>

              <el-form-item v-if="isNews" label="推荐" prop="isFeatured">
                <el-switch
                  v-model="editFormData.isFeatured"
                  :active-value="1"
                  :inactive-value="0"
                />
                <span class="form-tip">开启后将在新闻轮播推荐位展示</span>
              </el-form-item>

              <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="editFormData.sortOrder" :min="1" :max="999" />
              </el-form-item>

              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="editFormData.status">
                  <el-radio :value="1">发布</el-radio>
                  <el-radio :value="0">草稿</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleEditSubmit" :loading="submitting">保存修改</el-button>
                <el-button @click="handleEditCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Close } from '@element-plus/icons-vue'
import TinymceEditor from '@tinymce/tinymce-vue'
import { BASE_URL } from '@/utils/request'
import { uploadImage } from '@/api/upload'
import { getArticleList, createArticle, updateArticle, deleteArticle } from '@/api/article'
import { getNavigationTree } from '@/api/navigation'

const route = useRoute()

// ==================== 类型判断 ====================
const articleType = computed(() => route.meta.articleType || 'news')
const isNews = computed(() => articleType.value === 'news')

// 帮助中心固定的 navigation_id
const HELP_NAVIGATION_ID = 6

// ==================== 标签页标题 ====================
const listTabLabel = computed(() => isNews.value ? '新闻列表' : '问题列表')
const addTabLabel = computed(() => isNews.value ? '新闻新增' : '问题新增')
const editTabLabel = computed(() => isNews.value ? '新闻修改' : '问题修改')

// ==================== 状态 ====================
const activeTab = ref('list')
const showEditTab = ref(false)
const loading = ref(false)
const submitting = ref(false)

// 列表数据
const articleList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 筛选
const filterNavigationId = ref('')
const filterStatus = ref('')
const filterKeyword = ref('')

// 新闻中心子导航列表（用于分类选择）
const newsNavigations = ref([])

// 富文本编辑器 TinyMCE 配置
const tinymceInit = {
  license_key: 'gpl',
  base_url: '/tinymce',
  suffix: '.min',
  language: 'zh_CN',
  language_url: '/tinymce/langs/zh_CN.js',
  height: 450,
  menubar: 'file edit view insert format tools table',
  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
  toolbar: 'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media insertwxcard | removeformat code fullscreen',
  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; } img { max-width: 100%; height: auto; } .wx-card {display:flex;align-items:center;max-width:580px;margin:20px 0;overflow:hidden;border-radius:4px;} .wx-card-qrcode {flex:0 0 190px;width:190px;background-color:#fff;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;} .wx-card-qrcode img {width:100%;height:auto;margin:0;padding:0;display:block;} .wx-card-info {flex:1 1 auto;background-color:rgb(95,156,239);padding:0 20px;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;} .wx-card-info p {margin:0;padding:0;color:#fff;font-size:15px;line-height:1.6;} .wx-card-info .wx-card-title {font-weight:bold;margin-bottom:12px;} .wx-card-info .wx-card-item {margin-bottom:4px;} .wx-card-info .wx-card-item:last-child {margin-bottom:0;}',
  images_upload_handler: async (blobInfo) => {
    const file = blobInfo.blob()
    const res = await uploadImage(file, 'tenant-image')
    if (res.data && res.data.url) {
      return getFullImageUrl(res.data.url)
    }
    throw new Error('Upload failed')
  },
  convert_urls: false,
  relative_urls: false,
  valid_elements: '*[*]',
  valid_children: '+body[style|section],+section[section|div|p|img|span|a|strong|em|br|h1|h2|h3|h4|h5|h6|ul|ol|li|table|tr|td|th|thead|tbody],+div[section|div|p|img|span]',
  extended_valid_elements: 'section[*],div[*],span[*],p[*],img[*],a[*],strong[*],em[*],br',
  schema: 'html5',
  verify_html: false,
  paste_as_text: false,
  paste_auto_cleanup_on_paste: false,
  paste_remove_styles: false,
  paste_remove_styles_if_webkit: false,
  paste_strip_class_attributes: 'none',
  paste_retain_style_properties: 'all',
  paste_word_valid_elements: '*[*]',
  paste_webkit_styles: 'all',
  promotion: false,
  branding: false,
  setup: (editor) => {
    editor.ui.registry.addButton('insertwxcard', {
      text: '微信卡片',
      tooltip: '插入微信公众号卡片',
      onAction: () => {
        const html = '<div class="wx-card"><div class="wx-card-qrcode"><img src="/uploads/1/uploadfiles_xyd/images/20230926_144402.jpg" alt="微信公众号二维码" /></div><div class="wx-card-info"><p class="wx-card-title"><strong>扫描二维码，关注我们的公众号</strong></p><p class="wx-card-item"><strong>视频号：</strong>翔宇达运通国际</p><p class="wx-card-item"><strong>抖音：</strong>翔宇达运通国际物流</p></div></div><p>&nbsp;</p>'
        editor.insertContent(html)
      }
    })
  }
}

// 新增表单
const addFormRef = ref(null)
const addFormData = ref(getDefaultFormData())

// 编辑表单
const editFormRef = ref(null)
const editFormData = ref(getDefaultFormData())
const editingId = ref(null)

function getDefaultFormData() {
  return {
    navigationId: '',
    title: '',
    description: '',
    content: '',
    coverImage: '',
    author: '',
    publishDate: new Date().toISOString().slice(0, 10),
    isFeatured: 0,
    sortOrder: null,
    status: 1
  }
}

// 表单校验
const formRules = computed(() => {
  const rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }]
  }
  if (isNews.value) {
    rules.navigationId = [{ required: true, message: '请选择分类', trigger: 'change' }]
  }
  return rules
})

// ==================== 图片URL处理 ====================
function getFullImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BASE_URL}/api${url}`
}

// 将内容中的相对路径图片转为完整URL（用于编辑器显示）
function contentToEditor(html) {
  if (!html) return ''
  return html.replace(/src="\/uploads\//g, `src="${BASE_URL}/api/uploads/`)
}

// 将内容中的完整URL图片转回相对路径（用于保存到数据库）
function contentToStorage(html) {
  if (!html) return ''
  return html.replace(new RegExp(`src="${BASE_URL}/api/uploads/`, 'g'), 'src="/uploads/')
}

// ==================== 封面图上传 ====================
async function handleUploadCover(opts, formType) {
  try {
    const res = await uploadImage(opts.file, 'uploadfile')
    if (res.data && res.data.url) {
      if (formType === 'add') {
        addFormData.value.coverImage = res.data.url
      } else {
        editFormData.value.coverImage = res.data.url
      }
      ElMessage.success('封面上传成功')
    }
  } catch (e) {
    ElMessage.error('封面上传失败')
  }
}

// ==================== 获取新闻中心子导航 ====================
async function fetchNewsNavigations() {
  try {
    const res = await getNavigationTree()
    const tree = res.data || []
    // 找到 code='news' 的导航，取其 children
    const newsNav = tree.find(nav => nav.code === 'news')
    if (newsNav && newsNav.children) {
      newsNavigations.value = newsNav.children
    } else {
      newsNavigations.value = []
    }
  } catch (e) {
    console.error('获取新闻导航失败:', e)
    newsNavigations.value = []
  }
}

// ==================== 文章列表 ====================
async function fetchArticleList() {
  loading.value = true
  try {
    const params = {
      type: articleType.value,
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (filterNavigationId.value) params.navigationId = filterNavigationId.value
    if (filterStatus.value !== '') params.status = filterStatus.value
    if (filterKeyword.value) params.keyword = filterKeyword.value

    const res = await getArticleList(params)
    articleList.value = res.data.list || []
    totalCount.value = res.data.total || 0
  } catch (e) {
    console.error('获取文章列表失败:', e)
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  currentPage.value = 1
  fetchArticleList()
}

// 查询分类下最大的 sortOrder，计算下一个排序号
async function fetchNextSortOrder(navigationId) {
  try {
    const params = {
      type: articleType.value,
      page: 1,
      pageSize: 999
    }
    if (navigationId) params.navigationId = navigationId
    const res = await getArticleList(params)
    const list = res.data.list || []
    if (list.length > 0) {
      const maxSort = Math.max(...list.map(item => item.sortOrder || 0))
      addFormData.value.sortOrder = maxSort + 1
    } else {
      addFormData.value.sortOrder = 1
    }
  } catch (e) {
    // 查询失败不影响使用，保持当前值
  }
}

// 切换 tab 时，新增 tab 自动计算排序号
function handleTabChange(tab) {
  if (tab === 'add') {
    if (!isNews.value) {
      // FAQ 模式，直接按 type 查总数
      fetchNextSortOrder(null)
    } else if (addFormData.value.navigationId) {
      // 新闻模式且已选分类
      fetchNextSortOrder(addFormData.value.navigationId)
    }
  }
}

// ==================== 文章新增 ====================
async function handleAddSubmit() {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const submitData = {
      ...addFormData.value,
      content: contentToStorage(addFormData.value.content),
      type: articleType.value
    }
    // FAQ 固定 navigationId 为帮助中心
    if (!isNews.value) {
      submitData.navigationId = HELP_NAVIGATION_ID
    }
    await createArticle(submitData)
    ElMessage.success('创建成功')
    handleAddReset()
    activeTab.value = 'list'
    fetchArticleList()
  } catch (e) {
    console.error('创建失败:', e)
  } finally {
    submitting.value = false
  }
}

function handleAddReset() {
  addFormData.value = getDefaultFormData()
  addFormRef.value?.resetFields()
}

// ==================== 文章编辑 ====================
function handleEdit(row) {
  editingId.value = row.id
  editFormData.value = {
    navigationId: row.navigationId || '',
    title: row.title,
    description: row.description || '',
    content: contentToEditor(row.content || ''),
    coverImage: row.coverImage || '',
    author: row.author || '',
    publishDate: row.publishDate,
    isFeatured: row.isFeatured || 0,
    sortOrder: row.sortOrder || 1,
    status: row.status
  }
  showEditTab.value = true
  activeTab.value = 'edit'
}

async function handleEditSubmit() {
  const valid = await editFormRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const submitData = {
      ...editFormData.value,
      content: contentToStorage(editFormData.value.content),
      type: articleType.value
    }
    // FAQ 固定 navigationId 为帮助中心
    if (!isNews.value) {
      submitData.navigationId = HELP_NAVIGATION_ID
    }
    await updateArticle(editingId.value, submitData)
    ElMessage.success('修改成功')
    handleEditCancel()
    fetchArticleList()
  } catch (e) {
    console.error('修改失败:', e)
  } finally {
    submitting.value = false
  }
}

function handleEditCancel() {
  showEditTab.value = false
  activeTab.value = 'list'
  editingId.value = null
  editFormData.value = getDefaultFormData()
}

// ==================== 文章删除 ====================
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定要删除「${row.title}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteArticle(row.id)
    ElMessage.success('删除成功')
    fetchArticleList()
  } catch (e) {
    if (e !== 'cancel') console.error('删除失败:', e)
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  if (isNews.value) {
    fetchNewsNavigations()
  }
  fetchArticleList()
})
</script>

<style scoped>
.article-management {
  padding: 20px;
}

.main-card {
  min-height: calc(100vh - 180px);
}

.form-container {
  max-width: 100%;
  margin-top: 20px;
}

.form-tip {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}
</style>
