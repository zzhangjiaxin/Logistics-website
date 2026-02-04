<template>
  <div class="navigation-management">
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <!-- 栏目列表 -->
        <el-tab-pane label="栏目列表" name="list" v-if="!showEditTab">
          <el-table
            ref="tableRef"
            :data="navigationTree"
            style="width: 100%"
            v-loading="loading"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="序号" width="60">
              <template #default="{ row }">
                {{ row.parentId ? '' : row.sortOrder }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="栏目名称" width="200">
              <template #default="{ row }">
                <div class="nav-name-cell">
                  <span
                    v-if="row.children && row.children.length > 0"
                    class="expand-icon"
                    :class="{ 'is-expanded': expandedRows[row.id] }"
                    @click="toggleRowExpansion(row)"
                  >
                  </span>
                  <span class="nav-name" :class="{ 'child-nav-name': row.parentId }">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="url" label="URL名称" min-width="200">
              <template #default="{ row }">
                {{ displayUrl(row.url) }}
              </template>
            </el-table-column>
            <el-table-column prop="sortOrder" label="排序" width="100" sortable />
            <el-table-column label="是否首页" width="100">
              <template #default="{ row }">
                <el-tag :type="row.isHome === 1 ? 'success' : 'info'">
                  {{ row.isHome === 1 ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <template v-if="row.isHome === 1">
                  <el-tag type="warning">首页(默认禁用)</el-tag>
                </template>
                <template v-else>
                  <el-switch
                    v-model="row.isEnabled"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="isParentDisabled(row)"
                    @change="handleStatusChange(row)"
                  />
                  <span v-if="isParentDisabled(row)" class="disabled-tip">父级已禁用</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="打开方式" width="120">
              <template #default="{ row }">
                {{ row.target === '_blank' ? '新窗口' : '当前窗口' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <!-- 首页不显示任何操作按钮 -->
                <template v-if="row.isHome === 1">
                  <span class="disabled-tip">首页不可操作</span>
                </template>
                <template v-else>
                  <el-button type="primary" size="small" @click="handleEdit(row)" :disabled="isParentDisabled(row)">
                    修改
                  </el-button>
                  <el-button type="danger" size="small" @click="handleDelete(row)" :disabled="isParentDisabled(row)">
                    删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 栏目新增 -->
        <el-tab-pane label="栏目新增" name="add" v-if="!showEditTab">
          <el-form
            ref="addFormRef"
            :model="addFormData"
            :rules="formRules"
            label-width="100px"
            style="max-width: 600px; margin-top: 20px;"
          >
            <el-form-item label="父级栏目" prop="parentId">
              <el-select
                v-model="addFormData.parentId"
                placeholder="无（顶级栏目）"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in topLevelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.isHome === 1"
                />
              </el-select>
              <div class="form-tip">选择父级后将作为子栏目显示</div>
            </el-form-item>

            <el-form-item label="栏目名称" prop="name">
              <el-input v-model="addFormData.name" placeholder="请输入栏目名称" />
            </el-form-item>

            <el-form-item label="URL名称" prop="url">
              <el-input v-model="addFormData.url" placeholder="请输入路径，如：track 或 about" @blur="formatAddUrl" />
              <div class="form-tip">输入路径名即可，如：track、about，系统会自动添加 /</div>
            </el-form-item>

            <el-form-item label="排序顺序" prop="sortOrder">
              <el-input-number
                v-model="addFormData.sortOrder"
                :min="1"
                :max="999"
                disabled
              />
              <span class="form-tip">新增时自动排在最后</span>
            </el-form-item>

            <el-form-item label="是否首页" prop="isHome" v-if="!addFormData.parentId">
              <el-switch
                v-model="addFormData.isHome"
                :active-value="1"
                :inactive-value="0"
              />
              <span class="form-tip">首页栏目项默认禁用不可点击</span>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch
                v-model="addFormData.isEnabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="isAddFormParentDisabled"
              />
              <span v-if="isAddFormParentDisabled" class="form-tip" style="color: #F56C6C;">父级已禁用，无法修改状态</span>
            </el-form-item>

            <el-form-item label="打开方式" prop="target">
              <el-radio-group v-model="addFormData.target">
                <el-radio label="_self">当前窗口</el-radio>
                <el-radio label="_blank">新窗口</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleAddSubmit" :loading="submitting">
                立即创建
              </el-button>
              <el-button @click="handleAddReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 栏目修改 -->
        <el-tab-pane label="栏目修改" name="edit" v-if="showEditTab">
          <el-form
            ref="editFormRef"
            :model="editFormData"
            :rules="formRules"
            label-width="100px"
            style="max-width: 600px; margin-top: 20px;"
          >
            <el-form-item label="选择栏目" prop="id">
              <el-select
                v-model="editFormData.id"
                placeholder="请选择要修改的栏目"
                style="width: 100%"
                @change="handleEditNavChange"
              >
                <el-option
                  v-for="item in allNavOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.isHome === 1"
                  :class="{ 'child-nav-option': item.isChild }"
                >
                  <span :style="{ paddingLeft: item.isChild ? '20px' : '0' }">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="栏目名称" prop="name">
              <el-input v-model="editFormData.name" placeholder="请输入栏目名称" />
            </el-form-item>

            <el-form-item label="URL名称" prop="url">
              <el-input v-model="editFormData.url" placeholder="请输入路径，如：track 或 about" @blur="formatEditUrl" />
              <div class="form-tip">输入路径名即可，如：track、about，系统会自动添加 /</div>
            </el-form-item>

            <el-form-item label="排序顺序" prop="sortOrder">
              <el-input-number
                v-model="editFormData.sortOrder"
                :min="1"
                :max="999"
              />
            </el-form-item>

            <el-form-item label="是否首页" prop="isHome" v-if="!editFormData.parentId">
              <el-switch
                v-model="editFormData.isHome"
                :active-value="1"
                :inactive-value="0"
              />
              <span class="form-tip">首页栏目项默认禁用不可点击</span>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch
                v-model="editFormData.isEnabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="isEditFormParentDisabled"
              />
              <span v-if="isEditFormParentDisabled" class="form-tip" style="color: #F56C6C;">父级已禁用，无法修改状态</span>
            </el-form-item>

            <el-form-item label="打开方式" prop="target">
              <el-radio-group v-model="editFormData.target">
                <el-radio label="_self">当前窗口</el-radio>
                <el-radio label="_blank">新窗口</el-radio>
              </el-radio-group>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { getNavigationTree, getTopLevelNavigation, createNavigation, updateNavigation, deleteNavigation } from '@/api/navigation'

const activeTab = ref('list')
const loading = ref(false)
const navigationTree = ref([])
const topLevelList = ref([])
const submitting = ref(false)
const addFormRef = ref(null)
const editFormRef = ref(null)
const tableRef = ref(null)
const expandedRows = reactive({})
const isDataLoaded = ref(false)
const showEditTab = ref(false)

// 新增表单数据
const addFormData = reactive({
  name: '',
  url: '',
  parentId: null,
  sortOrder: null,
  isHome: 0,
  isEnabled: 1,
  target: '_self',
  icon: ''
})

// 修改表单数据
const editFormData = reactive({
  id: null,
  name: '',
  url: '',
  parentId: null,
  sortOrder: null,
  isHome: 0,
  isEnabled: 1,
  target: '_self',
  icon: ''
})

const formRules = {
  name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }]
}

// 标记是否正在从编辑页返回（用于保留展开状态）
const isReturningFromEdit = ref(false)

// 监听标签页切换，离开修改页时隐藏
watch(activeTab, (newVal) => {
  if (newVal !== 'edit' && showEditTab.value) {
    // 先禁用数据加载标记，防止 switch 触发 change 事件
    isDataLoaded.value = false
    showEditTab.value = false
    // 如果不是从编辑页返回，才清空展开状态
    if (!isReturningFromEdit.value) {
      Object.keys(expandedRows).forEach(key => delete expandedRows[key])
    }
    isReturningFromEdit.value = false
    // 延迟恢复数据加载标记
    setTimeout(() => {
      isDataLoaded.value = true
    }, 200)
  }
})

// 切换行展开状态
const toggleRowExpansion = (row) => {
  if (expandedRows[row.id]) {
    delete expandedRows[row.id]
    tableRef.value?.toggleRowExpansion(row, false)
  } else {
    expandedRows[row.id] = true
    tableRef.value?.toggleRowExpansion(row, true)
  }
}

// 获取导航树形列表
const fetchNavigationTree = async () => {
  loading.value = true
  isDataLoaded.value = false
  try {
    const res = await getNavigationTree()
    navigationTree.value = res.data
    // 数据加载完成后更新新增表单的排序值
    addFormData.sortOrder = getNextSortOrder(addFormData.parentId)
  } catch (error) {
    ElMessage.error('获取导航列表失败')
  } finally {
    loading.value = false
    setTimeout(() => {
      isDataLoaded.value = true
    }, 100)
  }
}

// 获取顶级导航列表（用于父级选择器）
const fetchTopLevelList = async () => {
  try {
    const res = await getTopLevelNavigation()
    topLevelList.value = res.data
  } catch (error) {
    console.error('获取顶级导航失败', error)
  }
}

// 判断子导航的父级是否被禁用
const isParentDisabled = (row) => {
  if (!row.parentId) return false
  const parent = navigationTree.value.find(nav => nav.id === row.parentId)
  return parent && parent.isEnabled === 0
}

// 判断新增表单中的父级是否被禁用
const isAddFormParentDisabled = computed(() => {
  if (!addFormData.parentId) return false
  const parent = navigationTree.value.find(nav => nav.id === addFormData.parentId)
  return parent && parent.isEnabled === 0
})

// 判断修改表单中的父级是否被禁用
const isEditFormParentDisabled = computed(() => {
  if (!editFormData.parentId) return false
  const parent = navigationTree.value.find(nav => nav.id === editFormData.parentId)
  return parent && parent.isEnabled === 0
})

// 所有导航选项（树形结构扁平化，子导航带缩进标记）
const allNavOptions = computed(() => {
  const options = []
  for (const nav of navigationTree.value) {
    // 添加顶级导航
    options.push({
      id: nav.id,
      name: nav.name,
      isHome: nav.isHome,
      isChild: false
    })
    // 添加子导航（带缩进标记）
    if (nav.children && nav.children.length > 0) {
      for (const child of nav.children) {
        options.push({
          id: child.id,
          name: child.name,
          isHome: child.isHome,
          isChild: true
        })
      }
    }
  }
  return options
})

// 计算下一个排序值
const getNextSortOrder = (parentId = null) => {
  let navList
  if (parentId) {
    const parent = navigationTree.value.find(nav => nav.id === parentId)
    navList = parent?.children || []
  } else {
    navList = navigationTree.value.filter(nav => !nav.parentId)
  }

  if (navList.length === 0) return 1
  const maxSort = Math.max(...navList.map(nav => nav.sortOrder || 0))
  return maxSort + 1
}

// 监听新增表单父级变化，更新排序值
watch(() => addFormData.parentId, (newVal) => {
  addFormData.sortOrder = getNextSortOrder(newVal)
})

// 选择导航变化时，加载对应导航的信息
const handleEditNavChange = (navId) => {
  if (!navId) return

  // 先在顶级导航中查找
  let nav = navigationTree.value.find(n => n.id === navId)

  // 如果没找到，在子导航中查找
  if (!nav) {
    for (const parent of navigationTree.value) {
      if (parent.children) {
        nav = parent.children.find(c => c.id === navId)
        if (nav) break
      }
    }
  }

  if (nav) {
    editFormData.name = nav.name
    editFormData.url = displayUrl(nav.url)
    editFormData.parentId = nav.parentId
    editFormData.sortOrder = nav.sortOrder
    editFormData.isHome = nav.isHome
    editFormData.isEnabled = nav.isEnabled
    editFormData.target = nav.target
    editFormData.icon = nav.icon
  }
}

// 记录编辑前的父级ID，用于返回时恢复展开状态
const editingParentId = ref(null)

// 修改导航
const handleEdit = (row) => {
  // 记录父级ID，用于返回时恢复展开状态
  editingParentId.value = row.parentId

  Object.assign(editFormData, {
    id: row.id,
    name: row.name,
    url: displayUrl(row.url),
    parentId: row.parentId,
    sortOrder: row.sortOrder,
    isHome: row.isHome,
    isEnabled: row.isEnabled,
    target: row.target,
    icon: row.icon
  })

  showEditTab.value = true
  activeTab.value = 'edit'
}

// 删除导航
const handleDelete = async (row) => {
  const hasChildren = row.children && row.children.length > 0
  const confirmMsg = hasChildren
    ? '该导航下有子导航，删除后子导航也会被删除，确定要删除吗？'
    : '确定要删除该导航吗？'

  try {
    await ElMessageBox.confirm(confirmMsg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteNavigation(row.id)
    ElMessage.success('删除成功')
    fetchNavigationTree()
    fetchTopLevelList()
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
    await updateNavigation(row.id, {
      name: row.name,
      url: row.url,
      parentId: row.parentId,
      sortOrder: row.sortOrder,
      isHome: row.isHome,
      isEnabled: row.isEnabled,
      target: row.target,
      icon: row.icon
    })
    ElMessage.success('状态更新成功')
    fetchNavigationTree()
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
      if (addFormData.parentId) {
        addFormData.isHome = 0
      }

      // 提交时格式化URL（添加 / 前缀）
      const submitData = {
        ...addFormData,
        url: formatUrl(addFormData.url)
      }

      await createNavigation(submitData)
      ElMessage.success('创建成功')
      resetAddForm()
      fetchNavigationTree()
      fetchTopLevelList()
      activeTab.value = 'list'
    } catch (error) {
      ElMessage.error('创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 恢复展开状态
const restoreExpandedState = () => {
  if (editingParentId.value) {
    // 找到父级行并展开
    const parentRow = navigationTree.value.find(nav => nav.id === editingParentId.value)
    if (parentRow) {
      expandedRows[parentRow.id] = true
      // 等待 DOM 更新后展开表格行
      setTimeout(() => {
        tableRef.value?.toggleRowExpansion(parentRow, true)
      }, 100)
    }
  }
}

// 修改表单提交
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (editFormData.parentId) {
        editFormData.isHome = 0
      }

      // 提交时格式化URL（添加 / 前缀）
      const submitData = {
        ...editFormData,
        url: formatUrl(editFormData.url)
      }

      await updateNavigation(editFormData.id, submitData)
      ElMessage.success('更新成功')

      // 保存父级ID用于恢复展开状态
      const parentIdToRestore = editingParentId.value

      await fetchNavigationTree()
      fetchTopLevelList()

      // 恢复展开状态（在切换标签页之前设置）
      if (parentIdToRestore) {
        const parentRow = navigationTree.value.find(nav => nav.id === parentIdToRestore)
        if (parentRow) {
          expandedRows[parentRow.id] = true
          isReturningFromEdit.value = true
        }
      }

      activeTab.value = 'list'

      // 展开表格行
      if (parentIdToRestore) {
        const parentRow = navigationTree.value.find(nav => nav.id === parentIdToRestore)
        if (parentRow) {
          setTimeout(() => {
            tableRef.value?.toggleRowExpansion(parentRow, true)
          }, 100)
        }
      }

      // 延迟隐藏编辑标签页，确保切换完成
      setTimeout(() => {
        showEditTab.value = false
        editingParentId.value = null
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
  // 保存父级ID用于恢复展开状态
  const parentIdToRestore = editingParentId.value

  // 如果有父级需要恢复展开，先设置展开状态再切换标签页
  if (parentIdToRestore) {
    const parentRow = navigationTree.value.find(nav => nav.id === parentIdToRestore)
    if (parentRow) {
      expandedRows[parentRow.id] = true
      isReturningFromEdit.value = true
    }
  }

  activeTab.value = 'list'

  // 恢复展开状态
  if (parentIdToRestore) {
    const parentRow = navigationTree.value.find(nav => nav.id === parentIdToRestore)
    if (parentRow) {
      setTimeout(() => {
        tableRef.value?.toggleRowExpansion(parentRow, true)
      }, 100)
    }
  }

  // 延迟隐藏编辑标签页，确保切换完成
  setTimeout(() => {
    showEditTab.value = false
    editingParentId.value = null
  }, 0)
}

// 格式化URL - 存储时自动添加 / 前缀
const formatUrl = (url) => {
  if (!url || url.trim() === '') return ''
  url = url.trim()
  // 如果是外部链接（http/https）或锚点（#）或已经以 / 开头，不处理
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#') || url.startsWith('/')) {
    return url
  }
  // 否则自动添加 /
  return '/' + url
}

// 显示URL - 去掉开头的 / 用于显示
const displayUrl = (url) => {
  if (!url) return ''
  // 如果是外部链接或锚点，原样显示
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
    return url
  }
  // 去掉开头的 /
  if (url.startsWith('/')) {
    return url.substring(1)
  }
  return url
}

// 新增表单URL格式化（不再在blur时格式化，改为提交时处理）
const formatAddUrl = () => {
  // 不做处理，保持用户输入的原样显示
}

// 修改表单URL格式化（不再在blur时格式化）
const formatEditUrl = () => {
  // 不做处理，保持用户输入的原样显示
}

// 重置新增表单数据
const resetAddForm = () => {
  addFormData.name = ''
  addFormData.url = ''
  addFormData.parentId = null
  addFormData.sortOrder = getNextSortOrder(null)
  addFormData.isHome = 0
  addFormData.isEnabled = 1
  addFormData.target = '_self'
  addFormData.icon = ''
  addFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchNavigationTree()
  fetchTopLevelList()
  addFormData.sortOrder = getNextSortOrder(null)
})
</script>

<style scoped>
.navigation-management {
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

.disabled-tip {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

/* 移除表格外边框 */
:deep(.el-table) {
  border: none !important;
}

:deep(.el-table::before) {
  display: none;
}

/* 将展开箭头从第一列(ID)移动到第二列(导航名称) */
:deep(.el-table) {
  .el-table__body-wrapper .el-table__row > td:first-child {
    .el-table__expand-icon {
      display: none !important;
    }
    .el-table__indent {
      display: none !important;
    }
    .el-table__placeholder {
      display: none !important;
    }
  }

  .el-table__header th:nth-child(2) .cell {
    padding-left: 30px;
  }
}

/* 自定义展开图标样式 - 使用 Element Plus 风格的三角形 */
.nav-name-cell {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 18px;
}

.expand-icon {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  width: 16px;
  height: 16px;

  /* 三角形图标 */
  &::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid #606266;
    transition: transform 0.2s ease;
  }

  &.is-expanded::before {
    transform: rotate(90deg);
  }

  &:hover::before {
    border-left-color: #409eff;
  }

  /* 隐藏原来的 el-icon */
  .el-icon {
    display: none;
  }
}

.nav-name {
  display: inline-block;
}

.child-nav-name {
  margin-left: 16px;
}

/* 标签页样式 */
:deep(.el-tabs__content) {
  padding: 10px 0;
}

/* 子导航选项样式 - 右对齐缩进 */
.child-option {
  padding-left: 20px;
}
</style>
