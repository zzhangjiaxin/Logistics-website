<template>
  <div class="carousel-management">
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <!-- 图片列表 -->
        <el-tab-pane label="图片列表" name="list" v-if="!showEditTab">
          <!-- 分组筛选和管理 -->
          <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
            <el-select
              v-model="selectedGroup"
              placeholder="选择分组筛选"
              clearable
              @change="handleGroupFilter"
              style="width: 250px"
            >
              <el-option label="全部分组" value="" />
              <el-option
                v-for="nav in parentNavigationList"
                :key="nav.id"
                :value="nav.url === '/' ? 'home' : (nav.url.startsWith('/') ? nav.url.substring(1) : nav.url)"
                :label="nav.name"
              >
                <span>{{ nav.name }}</span>
              </el-option>
            </el-select>
            <el-button type="primary" @click="showGroupDialog = true">
              <el-icon><FolderAdd /></el-icon>
              管理分组
            </el-button>
          </div>

          <el-table
            ref="tableRef"
            :data="filteredCarouselList"
            style="width: 100%"
            v-loading="loading"
            row-key="id"
            :default-sort="{ prop: 'groupName', order: 'ascending' }"
          >
            <el-table-column label="序号" width="80">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="groupName" label="分组" width="150" sortable :sort-method="sortByGroup" :sort-orders="['ascending', 'descending']">
              <template #default="{ row }">
                <el-tag :style="getGroupTagStyle(row.groupName)" size="small">
                  {{ getGroupLabel(row.groupName) }}
                  <span v-if="isGroupDisabled(row.groupName)" style="margin-left: 4px; color: #F56C6C;">禁</span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="图片预览" width="150">
              <template #default="{ row }">
                <el-image
                  v-if="row.imageUrl"
                  :src="getFullImageUrl(row.imageUrl)"
                  :preview-src-list="[]"
                  :preview-teleported="true"
                  fit="cover"
                  style="width: 100px; height: 50px; border-radius: 4px; cursor: pointer;"
                  @click="handleImagePreview(row.imageUrl)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="linkUrl" label="链接地址" min-width="200">
              <template #default="{ row }">
                {{ row.linkUrl || '无' }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-switch
                  v-model="row.isEnabled"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="打开方式" width="120">
              <template #default="{ row }">
                {{ row.target === '_blank' ? '新窗口' : '当前窗口' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEdit(row)">
                  修改
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 图片新增 -->
        <el-tab-pane label="图片新增" name="add" v-if="!showEditTab">
          <el-form
            ref="addFormRef"
            :model="addFormData"
            :rules="formRules"
            label-width="100px"
            style="max-width: 600px; margin-top: 20px;"
          >
            <el-form-item label="分组" prop="groupName">
              <el-select v-model="addFormData.groupName" placeholder="请选择分组" style="width: 100%">
                <el-option
                  v-for="group in groupList"
                  :key="group.groupKey"
                  :label="group.isEnabled === 0 ? `${group.groupName} (已禁用)` : group.groupName"
                  :value="group.groupKey"
                  :disabled="group.isEnabled === 0"
                />
              </el-select>
              <div class="form-tip">选择轮播图显示的位置</div>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input v-model="addFormData.title" placeholder="请输入轮播图标题" />
            </el-form-item>

            <el-form-item label="图片URL" prop="imageUrl">
              <el-input v-model="addFormData.imageUrl" placeholder="请输入图片URL地址" />
              <div class="form-tip">示例：/uploads/1/uploadfiles/banner1.jpg</div>
            </el-form-item>

            <el-form-item label="链接地址" prop="linkUrl">
              <el-input v-model="addFormData.linkUrl" placeholder="请输入点击跳转的链接地址（可选）" />
              <div class="form-tip">留空则不跳转，示例：/business 或 https://example.com</div>
            </el-form-item>

            <el-form-item label="排序顺序" prop="sortOrder" v-if="addFormData.title && addFormData.title.startsWith('轮播图')">
              <el-input-number
                v-model="addFormData.sortOrder"
                :min="1"
                :max="999"
                disabled
              />
              <span class="form-tip">新增时自动排在最后</span>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch
                v-model="addFormData.isEnabled"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>

            <el-form-item label="打开方式" prop="target">
              <el-radio-group v-model="addFormData.target">
                <el-radio label="_self">当前窗口</el-radio>
                <el-radio label="_blank">新窗口</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="描述" prop="description">
              <el-input
                v-model="addFormData.description"
                type="textarea"
                :rows="3"
                placeholder="请输入轮播图描述（可选）"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleAddSubmit" :loading="submitting">
                立即创建
              </el-button>
              <el-button @click="handleAddReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 轮播图/背景图修改 -->
        <el-tab-pane :label="editTabLabel" name="edit" v-if="showEditTab">
          <el-form
            ref="editFormRef"
            :model="editFormData"
            :rules="formRules"
            label-width="100px"
            style="max-width: 600px; margin-top: 20px;"
          >
            <el-form-item label="分组" prop="groupName">
              <el-select v-model="editFormData.groupName" placeholder="请选择分组" style="width: 100%" @change="handleEditGroupChange">
                <el-option label="首页" value="home" />
                <el-option
                  v-for="nav in parentNavigationList.filter(n => n.url !== '/')"
                  :key="nav.id"
                  :value="nav.url.startsWith('/') ? nav.url.substring(1) : nav.url"
                  :label="nav.name"
                />
              </el-select>
              <div class="form-tip">{{ editFormData.groupName === 'home' ? '选择轮播图显示的位置' : '选择背景图显示的位置' }}</div>
            </el-form-item>

            <el-form-item :label="editFormData.groupName === 'home' ? '选择轮播图' : '选择背景图'" prop="id">
              <el-select
                v-model="editFormData.id"
                :placeholder="editFormData.groupName === 'home' ? '请选择要修改的轮播图' : '请选择要修改的背景图'"
                style="width: 100%"
                @change="handleEditCarouselChange"
              >
                <el-option
                  v-for="(item, index) in filteredEditCarouselList"
                  :key="item.id"
                  :label="getEditCarouselLabel(item, index)"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input v-model="editFormData.title" placeholder="请输入标题" />
            </el-form-item>

            <el-form-item label="图片URL" prop="imageUrl">
              <el-input v-model="editFormData.imageUrl" placeholder="请输入图片URL地址" />
              <div class="form-tip">示例：/uploads/1/uploadfiles/banner1.jpg</div>
              <el-image
                v-if="editFormData.imageUrl"
                :src="getFullImageUrl(editFormData.imageUrl)"
                :preview-src-list="[]"
                fit="cover"
                style="width: 200px; height: 100px; margin-top: 10px; border-radius: 4px; cursor: pointer;"
                @click="handleImagePreview(editFormData.imageUrl)"
              />
            </el-form-item>

            <el-form-item label="链接地址" prop="linkUrl">
              <el-input v-model="editFormData.linkUrl" placeholder="请输入点击跳转的链接地址（可选）" />
              <div class="form-tip">留空则不跳转，示例：/business 或 https://example.com</div>
            </el-form-item>

            <el-form-item label="排序顺序" prop="sortOrder" v-if="editFormData.groupName === 'home'">
              <el-input-number
                v-model="editFormData.sortOrder"
                :min="1"
                :max="999"
              />
              <span class="form-tip">轮播图需要设置排序顺序</span>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch
                v-model="editFormData.isEnabled"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>

            <el-form-item label="打开方式" prop="target">
              <el-radio-group v-model="editFormData.target">
                <el-radio label="_self">当前窗口</el-radio>
                <el-radio label="_blank">新窗口</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="描述" prop="description">
              <el-input
                v-model="editFormData.description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述（可选）"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
                保存修改
              </el-button>
              <el-button @click="handleCancelEdit">取消修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 分组管理对话框 -->
    <el-dialog
      v-model="showGroupDialog"
      title="分组管理"
      width="900px"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 16px;">
        <el-button type="primary" @click="showAddGroupForm = true">
          <el-icon><Plus /></el-icon>
          新增分组
        </el-button>
      </div>

      <!-- 分组列表 -->
      <el-table :data="groupList" style="width: 100%">
        <el-table-column label="序号" width="80">
          <template #default="{ row }">
            {{ row.sortOrder }}
          </template>
        </el-table-column>
        <el-table-column label="分组名称" width="150">
          <template #default="{ row }">
            <el-tag :style="getGroupTagStyle(row.groupKey)" size="small">
              {{ row.groupName }}
              <span v-if="row.isEnabled === 0" style="margin-left: 4px; color: #F56C6C;">禁</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分组标识" width="150">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.groupKey }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            {{ row.description || '无' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.isEnabled"
              :active-value="1"
              :inactive-value="0"
              @change="handleGroupStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditGroup(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteGroup(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增/编辑分组对话框 -->
    <el-dialog
      v-model="showAddGroupForm"
      :title="editingGroup ? '编辑分组' : '新增分组'"
      width="500px"
      :close-on-click-modal="false"
      @close="resetGroupForm"
    >
      <el-form
        ref="groupFormRef"
        :model="groupFormData"
        :rules="groupFormRules"
        label-width="100px"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input
            v-model="groupFormData.groupName"
            placeholder="请输入分组名称（如：促销活动）"
            @input="handleGroupNameInput"
          />
          <div class="form-tip">显示给用户看的名称</div>
        </el-form-item>

        <el-form-item label="分组标识" prop="groupKey">
          <el-input
            v-model="groupFormData.groupKey"
            placeholder="自动生成或手动输入（如：promotion）"
            :disabled="editingGroup !== null"
          />
          <div class="form-tip">用于系统内部引用，会根据分组名称自动生成拼音</div>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="groupFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分组描述（可选）"
          />
        </el-form-item>

        <el-form-item label="排序顺序" prop="sortOrder">
          <el-input-number
            v-model="groupFormData.sortOrder"
            :min="1"
            :max="999"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch
            v-model="groupFormData.isEnabled"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddGroupForm = false">取消</el-button>
        <el-button type="primary" @click="handleGroupSubmit" :loading="groupSubmitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 禁用分组确认对话框 -->
    <el-dialog
      v-model="showDisableGroupDialog"
      title="禁用分组确认"
      width="600px"
      :close-on-click-modal="false"
    >
      <div style="padding: 0 10px; min-height: 280px;">
        <p style="margin-bottom: 24px; font-size: 15px; line-height: 1.6;">
          你确定要禁用"<strong style="color: #E6A23C;">{{ currentDisablingGroup?.groupName }}</strong>"分组吗？
        </p>
        <div style="margin-bottom: 16px; font-size: 14px; font-weight: 500; color: #303133;">
          请选择禁用方式：
        </div>
        <el-radio-group v-model="disableMode" style="width: 100%;">
          <div style="margin-bottom: 20px; border: 1px solid #DCDFE6; border-radius: 4px; padding: 12px; transition: all 0.3s;" :style="disableMode === 'group-only' ? 'border-color: #409EFF; background-color: #F0F9FF;' : ''">
            <el-radio label="group-only">
              <span style="font-size: 14px; font-weight: 500; color: #303133;">仅禁用分组</span>
            </el-radio>
            <div style="color: #606266; font-size: 13px; line-height: 1.8; margin-top: 8px; margin-left: 24px;">
              分组将被标记为"禁用"状态，但该分组下的轮播图不受影响，前端继续正常显示。新增轮播图时将无法选择此分组。
            </div>
          </div>
          <div style="border: 1px solid #DCDFE6; border-radius: 4px; padding: 12px; transition: all 0.3s;" :style="disableMode === 'group-and-carousels' ? 'border-color: #409EFF; background-color: #F0F9FF;' : ''">
            <el-radio label="group-and-carousels">
              <span style="font-size: 14px; font-weight: 500; color: #303133;">禁用分组并关闭所有轮播图</span>
            </el-radio>
            <div style="color: #606266; font-size: 13px; line-height: 1.8; margin-top: 8px; margin-left: 24px;">
              分组被禁用，同时该分组下的所有轮播图状态也会被设置为"禁用"，前端不再显示。
            </div>
          </div>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="showDisableGroupDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmDisableGroup" :loading="groupSubmitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FolderAdd, Plus } from '@element-plus/icons-vue'
import { getCarouselList, createCarousel, updateCarousel, deleteCarousel, disableCarouselsByGroup } from '@/api/carousel'
import {
  getCarouselGroupList,
  createCarouselGroup,
  updateCarouselGroup,
  deleteCarouselGroup
} from '@/api/carouselGroup'
import { getNavigationTree } from '@/api/navigation'
import { BASE_URL } from '@/utils/request'

const activeTab = ref('list')
const loading = ref(false)
const carouselList = ref([])
const groupList = ref([])
const navigationTree = ref([])
const selectedGroup = ref('')
const submitting = ref(false)
const addFormRef = ref(null)
const editFormRef = ref(null)
const tableRef = ref(null)
const isDataLoaded = ref(false)
const showEditTab = ref(false)

// 分组管理相关
const showGroupDialog = ref(false)
const showAddGroupForm = ref(false)
const groupFormRef = ref(null)
const groupSubmitting = ref(false)
const editingGroup = ref(null)
const groupFormData = reactive({
  groupKey: '',
  groupName: '',
  description: '',
  sortOrder: 1,
  isEnabled: 1
})

// 禁用分组确认对话框相关
const showDisableGroupDialog = ref(false)
const currentDisablingGroup = ref(null)
const disableMode = ref('group-only')

// 新增表单数据
const addFormData = reactive({
  groupName: 'home',
  title: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: null,
  isEnabled: 1,
  target: '_self',
  description: ''
})

// 修改表单数据
const editFormData = reactive({
  id: null,
  groupName: 'home',
  title: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: null,
  isEnabled: 1,
  target: '_self',
  description: ''
})

const formRules = {
  groupName: [{ required: true, message: '请选择分组', trigger: 'change' }],
  title: [{ required: true, message: '请输入轮播图标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请输入图片URL地址', trigger: 'blur' }]
}

// 分组表单验证规则
const groupFormRules = {
  groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
  groupKey: [
    { required: true, message: '分组标识不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线和连字符', trigger: 'blur' }
  ]
}

// 获取完整的图片 URL
const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return ''

  // 如果是完整的URL（http/https），直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('图片URL（完整URL）:', imageUrl)
    return imageUrl
  }

  // 保存原始路径用于日志
  const originalPath = imageUrl

  // 如果路径以 /api 开头，移除它（因为后面会统一添加）
  if (imageUrl.startsWith('/api')) {
    imageUrl = imageUrl.substring(4)
  }

  // 确保路径以 / 开头
  if (!imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl
  }

  // 拼接完整URL: http://localhost:8080/api + /uploads/...
  // 因为后端的 context-path 是 /api，所以静态资源也在 /api 下
  const fullUrl = `${BASE_URL}/api${imageUrl}`
  console.log('原始路径:', originalPath, '→ 完整URL:', fullUrl)
  return fullUrl
}

// 监听标签页切换，离开修改页时隐藏
watch(activeTab, (newVal) => {
  if (newVal !== 'edit' && showEditTab.value) {
    isDataLoaded.value = false
    showEditTab.value = false
    setTimeout(() => {
      isDataLoaded.value = true
    }, 200)
  }
})

// 获取轮播图列表
const fetchCarouselList = async () => {
  loading.value = true
  isDataLoaded.value = false
  try {
    const res = await getCarouselList()
    carouselList.value = res.data
    // 数据加载完成后更新新增表单的排序值
    addFormData.sortOrder = getNextSortOrder()
  } catch (error) {
    ElMessage.error('获取轮播图列表失败')
  } finally {
    loading.value = false
    setTimeout(() => {
      isDataLoaded.value = true
    }, 100)
  }
}

// 获取分组列表
const fetchGroupList = async () => {
  try {
    const res = await getCarouselGroupList()
    groupList.value = res.data
  } catch (error) {
    ElMessage.error('获取分组列表失败')
  }
}

// 获取导航树形列表
const fetchNavigationTree = async () => {
  try {
    const res = await getNavigationTree()
    navigationTree.value = res.data
  } catch (error) {
    console.error('获取导航列表失败', error)
  }
}

// 根据 groupName 获取导航名称
const getNavigationName = (groupName) => {
  if (!groupName) return ''

  // 特殊处理：首页
  if (groupName === 'home') {
    return '首页'
  }

  // 处理特殊情况：去掉 URL 参数和锚点
  const cleanGroupName = groupName.split('?')[0].split('#')[0]

  // 处理详情页和搜索页：显示具体名称
  if (cleanGroupName.includes('-detail')) {
    const baseGroupName = cleanGroupName.split('-')[0]
    // 查找父级导航名称
    for (const nav of navigationTree.value) {
      const navUrl = nav.url?.startsWith('/') ? nav.url.substring(1) : nav.url
      const cleanNavUrl = navUrl.split('?')[0].split('#')[0]
      if (cleanNavUrl === baseGroupName) {
        // 去掉"中心"后缀
        const navName = nav.name.replace('中心', '')
        return navName + '详情'
      }
    }
    return '详情页'
  }

  if (cleanGroupName.includes('-search')) {
    const baseGroupName = cleanGroupName.split('-')[0]
    // 查找父级导航名称
    for (const nav of navigationTree.value) {
      const navUrl = nav.url?.startsWith('/') ? nav.url.substring(1) : nav.url
      const cleanNavUrl = navUrl.split('?')[0].split('#')[0]
      if (cleanNavUrl === baseGroupName) {
        // 去掉"中心"后缀
        const navName = nav.name.replace('中心', '')
        return navName + '搜索'
      }
    }
    return '搜索页'
  }

  if (cleanGroupName.includes('-article')) {
    const baseGroupName = cleanGroupName.split('-')[0]
    // 查找父级导航名称
    for (const nav of navigationTree.value) {
      const navUrl = nav.url?.startsWith('/') ? nav.url.substring(1) : nav.url
      const cleanNavUrl = navUrl.split('?')[0].split('#')[0]
      if (cleanNavUrl === baseGroupName) {
        // 去掉"中心"后缀
        const navName = nav.name.replace('中心', '')
        return navName + '文章'
      }
    }
    return '文章页'
  }

  // 遍历导航树查找匹配的导航
  for (const nav of navigationTree.value) {
    // 去掉 URL 的 / 前缀进行比较
    const navUrl = nav.url?.startsWith('/') ? nav.url.substring(1) : nav.url
    const cleanNavUrl = navUrl.split('?')[0].split('#')[0]

    // 精确匹配父级导航
    if (cleanNavUrl === cleanGroupName) {
      return nav.name
    }

    // 查找子导航
    if (nav.children && nav.children.length > 0) {
      for (const child of nav.children) {
        const childUrl = child.url?.startsWith('/') ? child.url.substring(1) : child.url
        const cleanChildUrl = childUrl.split('?')[0].split('#')[0]

        // 精确匹配子导航
        if (cleanChildUrl === cleanGroupName) {
          return child.name
        }
      }
    }
  }

  return groupName
}

// 获取父级导航列表（用于筛选）- 包含首页
const parentNavigationList = computed(() => {
  // 添加首页选项
  const homeOption = {
    id: 0,
    name: '首页',
    url: '/',
    parentId: null
  }

  // 获取其他父级导航（排除首页）
  const otherNavs = navigationTree.value.filter(nav => !nav.parentId && nav.url !== '/')

  return [homeOption, ...otherNavs]
})

// 分组筛选后的轮播图列表
const filteredCarouselList = computed(() => {
  if (!selectedGroup.value) {
    return carouselList.value
  }

  // 特殊处理：首页
  if (selectedGroup.value === 'home') {
    return carouselList.value.filter(item => item.groupName === 'home')
  }

  // 查找选中的父级导航
  const selectedNav = navigationTree.value.find(nav => {
    const navUrl = nav.url?.startsWith('/') ? nav.url.substring(1) : nav.url
    const cleanNavUrl = navUrl.split('?')[0].split('#')[0]
    return cleanNavUrl === selectedGroup.value
  })

  if (!selectedNav) {
    return carouselList.value.filter(item => {
      const cleanGroupName = item.groupName.split('?')[0].split('#')[0]
      return cleanGroupName === selectedGroup.value
    })
  }

  // 获取父级 URL（去掉 / 前缀）
  const parentUrl = selectedNav.url?.startsWith('/') ? selectedNav.url.substring(1) : selectedNav.url
  const cleanParentUrl = parentUrl.split('?')[0].split('#')[0]

  // 获取父级及其所有子级的 URL
  const urls = [cleanParentUrl]

  if (selectedNav.children && selectedNav.children.length > 0) {
    selectedNav.children.forEach(child => {
      const childUrl = child.url?.startsWith('/') ? child.url.substring(1) : child.url
      const cleanChildUrl = childUrl.split('?')[0].split('#')[0]
      urls.push(cleanChildUrl)
    })
  }

  // 筛选出匹配的轮播图
  return carouselList.value.filter(item => {
    const cleanGroupName = item.groupName.split('?')[0].split('#')[0]

    // 精确匹配
    if (urls.includes(cleanGroupName)) {
      return true
    }

    // 匹配详情页和搜索页（如 news-detail、news-search 归类到 news）
    if (cleanGroupName.includes('-detail') || cleanGroupName.includes('-search') || cleanGroupName.includes('-article')) {
      const baseGroupName = cleanGroupName.split('-')[0]
      if (baseGroupName === cleanParentUrl) {
        return true
      }
    }

    // 匹配以父级 URL 开头的数字编号（如 business-1、business-2 归类到 business）
    // 但排除详情页、搜索页、文章页
    if (cleanGroupName.startsWith(cleanParentUrl + '-') &&
        !cleanGroupName.includes('-detail') &&
        !cleanGroupName.includes('-search') &&
        !cleanGroupName.includes('-article')) {
      return true
    }

    return false
  })
})

// 处理分组筛选
const handleGroupFilter = () => {
  // 筛选逻辑已通过 computed 实现
}

// 编辑表单的分组筛选列表
const filteredEditCarouselList = computed(() => {
  if (!editFormData.groupName) {
    return []
  }
  // 按照 sortOrder 排序，确保轮播图按顺序显示
  return carouselList.value
    .filter(item => item.groupName === editFormData.groupName)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
})

// 获取编辑轮播图的显示标签
const getEditCarouselLabel = (item, index) => {
  if (item.title.startsWith('轮播图')) {
    // 使用实际的 sortOrder 而不是 index
    return `轮播图-${item.sortOrder}`
  }
  return item.title
}

// 编辑 Tab 标签 - 根据分组判断
const editTabLabel = computed(() => {
  if (editFormData.groupName === 'home') {
    return '轮播图修改'
  } else if (editFormData.groupName) {
    return '背景图修改'
  }
  return '修改'
})

// 处理编辑分组变化
const handleEditGroupChange = () => {
  // 清空选中的轮播图
  editFormData.id = null
  editFormData.title = ''
  editFormData.imageUrl = ''
  editFormData.linkUrl = ''
  editFormData.sortOrder = null
  editFormData.isEnabled = 1
  editFormData.target = '_self'
  editFormData.description = ''
}

// 计算下一个排序值
const getNextSortOrder = () => {
  if (carouselList.value.length === 0) return 1
  const maxSort = Math.max(...carouselList.value.map(item => item.sortOrder || 0))
  return maxSort + 1
}

// 选择轮播图变化时，加载对应轮播图的信息
const handleEditCarouselChange = (carouselId) => {
  if (!carouselId) return

  const carousel = carouselList.value.find(c => c.id === carouselId)

  if (carousel) {
    editFormData.title = carousel.title
    editFormData.imageUrl = carousel.imageUrl
    editFormData.linkUrl = carousel.linkUrl
    editFormData.sortOrder = carousel.sortOrder
    editFormData.isEnabled = carousel.isEnabled
    editFormData.target = carousel.target
    editFormData.description = carousel.description
  }
}

// 修改轮播图
const handleEdit = (row) => {
  // 先设置分组和标题，触发 Tab 标签更新
  editFormData.groupName = row.groupName
  editFormData.title = row.title

  // 然后设置其他字段
  Object.assign(editFormData, {
    id: row.id,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl,
    sortOrder: row.sortOrder,
    isEnabled: row.isEnabled,
    target: row.target,
    description: row.description
  })

  showEditTab.value = true
  activeTab.value = 'edit'
}

// 删除轮播图
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteCarousel(row.id)
    ElMessage.success('删除成功')
    fetchCarouselList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 状态切换
const handleStatusChange = async (row) => {
  if (!isDataLoaded.value) return

  try {
    await updateCarousel(row.id, {
      groupName: row.groupName,
      title: row.title,
      imageUrl: row.imageUrl,
      linkUrl: row.linkUrl,
      sortOrder: row.sortOrder,
      isEnabled: row.isEnabled,
      target: row.target,
      description: row.description
    })
    ElMessage.success('状态更新成功')
    fetchCarouselList()
  } catch (error) {
    ElMessage.error('状态更新失败')
    row.isEnabled = row.isEnabled === 1 ? 0 : 1
  }
}

// 新增表单提交
const handleAddSubmit = async () => {
  if (!addFormRef.value) return

  await addFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await createCarousel(addFormData)
      ElMessage.success('创建成功')
      resetAddForm()
      fetchCarouselList()
      activeTab.value = 'list'
    } catch (error) {
      ElMessage.error('创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 修改表单提交
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await updateCarousel(editFormData.id, editFormData)
      ElMessage.success('更新成功')

      await fetchCarouselList()

      activeTab.value = 'list'

      setTimeout(() => {
        showEditTab.value = false
      }, 0)
    } catch (error) {
      ElMessage.error('更新失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重置新增表单
const handleAddReset = () => {
  resetAddForm()
}

// 取消修改
const handleCancelEdit = () => {
  activeTab.value = 'list'
  setTimeout(() => {
    showEditTab.value = false
  }, 0)
}

// 图片预览处理
const handleImagePreview = (imageUrl) => {
  const fullUrl = getFullImageUrl(imageUrl)
  window.open(fullUrl, '_blank')
}

// 重置新增表单数据
const resetAddForm = () => {
  addFormData.groupName = 'home'
  addFormData.title = ''
  addFormData.imageUrl = ''
  addFormData.linkUrl = ''
  addFormData.sortOrder = getNextSortOrder()
  addFormData.isEnabled = 1
  addFormData.target = '_self'
  addFormData.description = ''
  addFormRef.value?.clearValidate()
}

// 获取分组标签
const getGroupLabel = (groupName) => {
  return getNavigationName(groupName)
}

// 获取分组标签样式
const getGroupTagStyle = (groupName) => {
  // 处理特殊情况：去掉 URL 参数和锚点
  const cleanGroupName = groupName.split('?')[0].split('#')[0]

  // 提取基础分组名（去掉数字后缀、-detail、-search、-article）
  let baseGroupName = cleanGroupName
  if (cleanGroupName.includes('-detail') || cleanGroupName.includes('-search') || cleanGroupName.includes('-article')) {
    baseGroupName = cleanGroupName.split('-')[0]
  } else if (/^[a-z]+-\d+$/.test(cleanGroupName)) {
    // 匹配 business-1、business-2 这种格式
    baseGroupName = cleanGroupName.split('-')[0]
  }

  const styleMap = {
    // 首页 - 蓝色
    'home': { backgroundColor: '#E3F2FD', color: '#1976D2', borderColor: '#90CAF9' },

    // 信息查询 - 紫色
    'track': { backgroundColor: '#F3E5F5', color: '#7B1FA2', borderColor: '#CE93D8' },

    // 关于我们 - 绿色
    'aboutus': { backgroundColor: '#E8F5E9', color: '#388E3C', borderColor: '#81C784' },

    // 主营渠道 - 橙色（所有子级统一使用橙色）
    'business': { backgroundColor: '#FFF3E0', color: '#E65100', borderColor: '#FFB74D' },

    // 新闻中心 - 红色（所有子级统一使用红色）
    'news': { backgroundColor: '#FFEBEE', color: '#C62828', borderColor: '#EF5350' },

    // 帮助中心 - 青色（所有子级统一使用青色）
    'help': { backgroundColor: '#E0F7FA', color: '#00838F', borderColor: '#4DD0E1' },

    // 联系我们 - 蓝灰色
    'contact': { backgroundColor: '#ECEFF1', color: '#37474F', borderColor: '#90A4AE' }
  }

  const style = styleMap[baseGroupName] || { backgroundColor: '#F5F5F5', color: '#606266', borderColor: '#D3D3D3' }

  return {
    backgroundColor: style.backgroundColor,
    color: style.color,
    borderColor: style.borderColor,
    border: `1px solid ${style.borderColor}`
  }
}

// ========== 分组管理相关方法 ==========

// 编辑分组
const handleEditGroup = (row) => {
  editingGroup.value = row
  Object.assign(groupFormData, {
    groupKey: row.groupKey,
    groupName: row.groupName,
    description: row.description,
    sortOrder: row.sortOrder,
    isEnabled: row.isEnabled
  })
  showAddGroupForm.value = true
}

// 删除分组
const handleDeleteGroup = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该分组吗？删除后该分组下的轮播图将无法正常显示！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteCarouselGroup(row.id)
    ElMessage.success('删除成功')
    await fetchGroupList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 分组状态切换
const handleGroupStatusChange = async (row) => {
  // 如果是禁用操作，显示确认对话框
  if (row.isEnabled === 0) {
    // 先恢复状态，等用户确认后再更新
    row.isEnabled = 1
    currentDisablingGroup.value = row
    disableMode.value = 'group-only'
    showDisableGroupDialog.value = true
    return
  }

  // 启用操作直接执行
  try {
    await updateCarouselGroup(row.id, {
      groupKey: row.groupKey,
      groupName: row.groupName,
      description: row.description,
      sortOrder: row.sortOrder,
      isEnabled: row.isEnabled
    })
    ElMessage.success('状态更新成功')
    await fetchGroupList()
  } catch (error) {
    ElMessage.error('状态更新失败')
    row.isEnabled = row.isEnabled === 1 ? 0 : 1
  }
}

// 确认禁用分组
const confirmDisableGroup = async () => {
  if (!currentDisablingGroup.value) return

  groupSubmitting.value = true
  try {
    // 1. 禁用分组
    await updateCarouselGroup(currentDisablingGroup.value.id, {
      groupKey: currentDisablingGroup.value.groupKey,
      groupName: currentDisablingGroup.value.groupName,
      description: currentDisablingGroup.value.description,
      sortOrder: currentDisablingGroup.value.sortOrder,
      isEnabled: 0
    })

    // 2. 如果选择了同时禁用轮播图，调用批量禁用接口
    if (disableMode.value === 'group-and-carousels') {
      await disableCarouselsByGroup(currentDisablingGroup.value.groupKey)
      ElMessage.success('分组已禁用，该分组下的所有轮播图也已禁用')
    } else {
      ElMessage.success('分组已禁用，该分组下的轮播图不受影响')
    }

    // 3. 刷新数据
    await fetchGroupList()
    await fetchCarouselList()

    // 4. 关闭对话框
    showDisableGroupDialog.value = false
    currentDisablingGroup.value = null
  } catch (error) {
    ElMessage.error('禁用失败：' + (error.response?.data?.message || error.message))
    // 恢复状态
    if (currentDisablingGroup.value) {
      currentDisablingGroup.value.isEnabled = 1
    }
  } finally {
    groupSubmitting.value = false
  }
}

// 判断分组是否被禁用
const isGroupDisabled = (groupKey) => {
  const group = groupList.value.find(g => g.groupKey === groupKey)
  return group ? group.isEnabled === 0 : false
}

// 分组排序方法
// 分组排序方法
const sortByGroup = (a, b) => {
  // 定义分组的排序优先级
  const groupOrder = {
    'home': 0,           // 首页
    'track': 1,          // 信息查询
    'aboutus': 2,        // 关于我们
    'business': 3,       // 主营渠道
    'business-1': 3.1,   // 空派专线
    'business-2': 3.2,   // 海派专线
    'business-3': 3.3,   // 陆运专线
    'news': 4,           // 新闻中心
    'news-1': 4.1,       // 公司新闻
    'news-2': 4.2,       // 行业动态
    'news-detail': 4.3,  // 新闻详情
    'news-search': 4.4,  // 新闻搜索
    'help': 5,           // 帮助中心
    'help-search': 5.1,  // 帮助搜索
    'help-article': 5.2, // 帮助文章
    'contact': 6         // 联系我们
  }

  const orderA = groupOrder[a.groupName] ?? 999
  const orderB = groupOrder[b.groupName] ?? 999

  return orderA - orderB
}

// 提交分组表单
const handleGroupSubmit = async () => {
  if (!groupFormRef.value) return

  await groupFormRef.value.validate(async (valid) => {
    if (!valid) return

    groupSubmitting.value = true
    try {
      if (editingGroup.value) {
        // 编辑
        await updateCarouselGroup(editingGroup.value.id, groupFormData)
        ElMessage.success('更新成功')
      } else {
        // 新增
        await createCarouselGroup(groupFormData)
        ElMessage.success('创建成功')
      }

      showAddGroupForm.value = false
      await fetchGroupList()
    } catch (error) {
      ElMessage.error(editingGroup.value ? '更新失败' : '创建失败：' + (error.response?.data?.message || error.message))
    } finally {
      groupSubmitting.value = false
    }
  })
}

// 重置分组表单
const resetGroupForm = () => {
  editingGroup.value = null
  groupFormData.groupKey = ''
  groupFormData.groupName = ''
  groupFormData.description = ''
  groupFormData.sortOrder = groupList.value.length + 1
  groupFormData.isEnabled = 1
  groupFormRef.value?.clearValidate()
}

// 处理分组名称输入，自动生成分组标识
const handleGroupNameInput = () => {
  // 只在新增时自动生成，编辑时不自动生成
  if (editingGroup.value) return

  const name = groupFormData.groupName
  if (!name) {
    groupFormData.groupKey = ''
    return
  }

  // 完善的中文到英文映射表
  const pinyinMap = {
    // 基础页面
    '首页': 'home',
    '主页': 'home',
    '关于': 'about',
    '关于我们': 'about',
    '关于公司': 'about',
    '公司介绍': 'about',

    // 产品相关
    '产品': 'product',
    '产品页面': 'product',
    '产品中心': 'product',
    '产品展示': 'product',
    '商品': 'product',
    '商品中心': 'product',

    // 新闻相关
    '新闻': 'news',
    '新闻页面': 'news',
    '新闻中心': 'news',
    '资讯': 'news',
    '动态': 'news',
    '公司动态': 'news',

    // 联系相关
    '联系': 'contact',
    '联系我们': 'contact',
    '联系方式': 'contact',

    // 物流相关
    '物流': 'logistics',
    '物流查询': 'track',
    '查询': 'track',
    '追踪': 'track',

    // 帮助相关
    '帮助': 'help',
    '帮助中心': 'help',
    '支持': 'support',
    '客服': 'service',

    // 营销相关
    '促销': 'promotion',
    '促销活动': 'promotion',
    '优惠': 'discount',
    '折扣': 'discount',
    '活动': 'activity',
    '公告': 'notice',
    '通知': 'notification',

    // 会员相关
    '会员': 'member',
    '会员中心': 'member',
    '会员专区': 'vip',
    'VIP': 'vip',

    // 其他常用
    '服务': 'service',
    '案例': 'case',
    '合作': 'partner',
    '招聘': 'career',
    '下载': 'download'
  }

  // 先尝试从映射表中查找完全匹配
  if (pinyinMap[name]) {
    groupFormData.groupKey = pinyinMap[name]
    return
  }

  // 尝试模糊匹配（包含关键词）
  for (const [key, value] of Object.entries(pinyinMap)) {
    if (name.includes(key) || key.includes(name)) {
      groupFormData.groupKey = value
      return
    }
  }

  // 如果都没有匹配，使用拼音首字母
  const pinyin = chineseToPinyin(name)
  groupFormData.groupKey = pinyin
}

// 简单的中文转拼音首字母函数
const chineseToPinyin = (chinese) => {
  // 常用汉字拼音首字母映射
  const pinyinMap = {
    '产': 'c', '品': 'p', '中': 'z', '心': 'x',
    '新': 'x', '闻': 'w', '资': 'z', '讯': 'x',
    '关': 'g', '于': 'y', '我': 'w', '们': 'm',
    '联': 'l', '系': 'x', '方': 'f', '式': 's',
    '帮': 'b', '助': 'z', '支': 'z', '持': 'c',
    '会': 'h', '员': 'y', '专': 'z', '区': 'q',
    '服': 'f', '务': 'w', '案': 'a', '例': 'l',
    '合': 'h', '作': 'z', '伙': 'h', '伴': 'b',
    '招': 'z', '聘': 'p', '下': 'x', '载': 'z',
    '公': 'g', '司': 's', '介': 'j', '绍': 's',
    '动': 'd', '态': 't', '查': 'c', '询': 'x',
    '物': 'w', '流': 'l', '追': 'z', '踪': 'z',
    '促': 'c', '销': 'x', '活': 'h', '优': 'y',
    '惠': 'h', '折': 'z', '扣': 'k', '告': 'g',
    '通': 't', '知': 'z', '客': 'k', '商': 's',
    '展': 'z', '示': 's', '页': 'y', '面': 'm'
  }

  let result = ''
  for (let char of chinese) {
    if (pinyinMap[char]) {
      result += pinyinMap[char]
    }
  }

  // 如果转换结果为空或太短，使用时间戳
  if (result.length < 2) {
    const timestamp = Date.now().toString().slice(-6)
    return `group_${timestamp}`
  }

  return result
}

onMounted(() => {
  fetchCarouselList()
  fetchGroupList()
  fetchNavigationTree()
  addFormData.sortOrder = getNextSortOrder()
})
</script>

<style scoped>
.carousel-management {
  padding: 20px;
}

.main-card {
  min-height: 500px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 移除表格外边框 */
:deep(.el-table) {
  border: none !important;
}

:deep(.el-table::before) {
  display: none;
}

/* 标签页样式 */
:deep(.el-tabs__content) {
  padding: 10px 0;
}
</style>
