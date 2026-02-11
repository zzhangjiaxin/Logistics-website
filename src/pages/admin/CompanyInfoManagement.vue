<template>
  <div class="company-info-management">
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <!-- 分支机构列表 -->
        <el-tab-pane label="公司信息列表" name="list" v-if="!showEditTab">
          <el-table
            :data="branchTree"
            style="width: 100%"
            v-loading="loading"
            row-key="rowKey"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            default-expand-all
          >
            <el-table-column label="分组 / 分支 / 地址标签" min-width="220">
              <template #default="{ row }">
                <span v-if="row.level === 'group'" class="group-name">{{ row.groupName }}</span>
                <span v-else-if="row.level === 'branch'" class="branch-name">{{ row.name || '(未命名)' }}</span>
                <span v-else class="address-label-text">{{ row.addressLabel || '地址' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" min-width="320">
              <template #default="{ row }">
                <span v-if="row.level === 'address'" class="address-text">{{ row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="电话" width="140">
              <template #default="{ row }">
                <span v-if="row.level === 'address'">{{ row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.level === 'address'" :type="row.isEnabled === 1 ? 'success' : 'info'" size="small">
                  {{ row.isEnabled === 1 ? '启用' : '禁用' }}
                </el-tag>
                <el-tag v-else-if="row.level === 'group'" :type="row.isEnabled ? 'success' : 'info'" size="small">
                  {{ row.isEnabled ? '启用' : '禁用' }}
                </el-tag>
                <el-tag v-else-if="row.level === 'branch'" :type="row.isEnabled ? 'success' : 'info'" size="small">
                  {{ row.isEnabled ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template #default="{ row }">
                <template v-if="row.level === 'group'">
                  <el-button :type="row.isEnabled ? 'warning' : 'success'" size="small" @click="handleToggleGroupEnabled(row)">
                    {{ row.isEnabled ? '禁用' : '启用' }}
                  </el-button>
                  <el-button type="primary" size="small" @click="handleGroupBranchEdit(row)">修改</el-button>
                  <el-button type="danger" size="small" @click="handleGroupBranchDelete(row)">删除</el-button>
                </template>
                <template v-if="row.level === 'branch'">
                  <el-button :type="row.isEnabled ? 'warning' : 'success'" size="small" @click="handleToggleBranchEnabled(row)">
                    {{ row.isEnabled ? '禁用' : '启用' }}
                  </el-button>
                </template>
                <template v-if="row.level === 'address'">
                  <el-button :type="row.isEnabled === 1 ? 'warning' : 'success'" size="small" @click="handleToggleAddressEnabled(row)">
                    {{ row.isEnabled === 1 ? '禁用' : '启用' }}
                  </el-button>
                  <el-button type="primary" size="small" @click="handleEdit(row)">修改</el-button>
                  <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 新增 -->
        <el-tab-pane label="新增" name="add" v-if="!showEditTab">
          <el-form
            ref="addFormRef"
            :model="addFormData"
            :rules="addFormRules"
            label-width="100px"
            style="max-width: 600px; margin-top: 20px;"
          >
            <el-form-item label="新增类型">
              <el-radio-group v-model="addType" @change="handleAddTypeChange">
                <el-radio label="branch">新增分组/分支（含地址）</el-radio>
                <el-radio label="address">在已有分支下新增地址</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 在已有分支下新增地址 -->
            <template v-if="addType === 'address'">
              <el-form-item label="选择分支" prop="existingBranch">
                <el-cascader
                  v-model="addFormData.existingBranch"
                  :options="branchCascaderOptions"
                  :props="{ expandTrigger: 'hover' }"
                  placeholder="请选择分组和分支"
                  style="width: 100%"
                  @change="handleCascaderChange"
                />
                <div class="form-tip">选择要添加地址的分组和分支</div>
              </el-form-item>
            </template>

            <!-- 新增分组/分支 -->
            <template v-if="addType === 'branch'">
              <el-form-item label="分组名称" prop="groupName">
                <el-select
                  v-model="addFormData.groupName"
                  placeholder="选择已有分组或输入新分组"
                  filterable
                  allow-create
                  default-first-option
                  style="width: 100%"
                >
                  <el-option
                    v-for="group in existingGroups"
                    :key="group"
                    :label="group"
                    :value="group"
                  />
                </el-select>
                <div class="form-tip">输入新分组名将直接创建分组（无需填写地址）；选择已有分组则为该分组新增分支</div>
              </el-form-item>

              <template v-if="!isNewGroup">
                <el-form-item label="分支名称" prop="name">
                  <el-input v-model="addFormData.name" placeholder="如：深圳会展湾、深圳坂田" maxlength="100" />
                  <div class="form-tip">留空表示该分组下没有子分支（如越南总部）</div>
                </el-form-item>
              </template>
            </template>

            <template v-if="addType === 'address' || (addType === 'branch' && !isNewGroup)">
              <el-form-item label="地址标签" prop="addressLabel">
                <el-input v-model="addFormData.addressLabel" placeholder="如：总部地址、福永仓库地址" maxlength="50" />
                <div class="form-tip">显示在地址前面的标签文字，默认为"地址"</div>
              </el-form-item>

              <el-form-item label="地址" prop="address">
                <el-input v-model="addFormData.address" placeholder="请输入详细地址" maxlength="500" type="textarea" :rows="2" />
              </el-form-item>

              <el-form-item label="电话" prop="phone">
                <template v-if="addBranchHasPhone">
                  <div class="form-tip" style="color: #e6a23c;">该分支下已有其他地址填写了电话，每个分支只能填写一个联系电话</div>
                </template>
                <template v-else>
                  <el-input v-model="addFormData.phone" placeholder="请输入联系电话" maxlength="50" />
                </template>
              </el-form-item>

              <el-form-item label="经纬度">
                <template v-if="addBranchHasCoord">
                  <div class="form-tip" style="color: #e6a23c;">该分支下已有其他地址设置了坐标，每个分支只能设置一个地址的坐标</div>
                </template>
                <template v-else>
                  <div style="display: flex; gap: 10px; width: 100%;">
                    <el-input v-model.number="addFormData.latitude" placeholder="纬度，如 22.6295" style="flex:1" />
                    <el-input v-model.number="addFormData.longitude" placeholder="经度，如 113.8253" style="flex:1" />
                  </div>
                  <div class="form-tip">用于前端地图展示，可从百度地图拾取坐标。每个分支只能设置一个地址的坐标</div>
                </template>
              </el-form-item>
            </template>

            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch v-model="addFormData.isEnabled" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleAddSubmit" :loading="submitting">立即创建</el-button>
              <el-button @click="handleAddReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 修改 -->
        <el-tab-pane label="修改地址" name="edit" v-if="showEditTab">
          <el-form
            ref="editFormRef"
            :model="editFormData"
            :rules="editFormRules"
            label-width="100px"
            style="max-width: 600px; margin-top: 20px;"
          >
            <el-form-item label="分组名称" prop="groupName">
              <el-input v-model="editFormData.groupName" disabled />
            </el-form-item>

            <el-form-item label="分支名称" prop="name">
              <el-input v-model="editFormData.name" disabled />
            </el-form-item>

            <el-form-item label="地址标签" prop="addressLabel">
              <el-input v-model="editFormData.addressLabel" placeholder="如：总部地址、福永仓库地址" maxlength="50" />
            </el-form-item>

            <el-form-item label="地址" prop="address">
              <el-input v-model="editFormData.address" placeholder="请输入详细地址" maxlength="500" type="textarea" :rows="2" />
            </el-form-item>

            <el-form-item label="电话" prop="phone">
              <template v-if="editBranchHasPhone">
                <div class="form-tip" style="color: #e6a23c;">该分支下已有其他地址填写了电话，每个分支只能填写一个联系电话</div>
              </template>
              <template v-else>
                <el-input v-model="editFormData.phone" placeholder="请输入联系电话" maxlength="50" />
              </template>
            </el-form-item>

            <el-form-item label="经纬度">
              <template v-if="editBranchHasCoord">
                <div class="form-tip" style="color: #e6a23c;">该分支下已有其他地址设置了坐标，每个分支只能设置一个地址的坐标</div>
              </template>
              <template v-else>
                <div style="display: flex; gap: 10px; width: 100%;">
                  <el-input v-model.number="editFormData.latitude" placeholder="纬度，如 22.6295" style="flex:1" />
                  <el-input v-model.number="editFormData.longitude" placeholder="经度，如 113.8253" style="flex:1" />
                </div>
                <div class="form-tip">用于前端地图展示，可从百度地图拾取坐标。每个分支只能设置一个地址的坐标</div>
              </template>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch v-model="editFormData.isEnabled" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleEditSubmit" :loading="submitting">保存修改</el-button>
              <el-button @click="handleCancelEdit">取消修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改分组/分支名称弹窗 -->
    <el-dialog
      v-model="groupBranchDialogVisible"
      title="修改分组信息"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="groupBranchFormRef"
        :model="groupBranchEditData"
        :rules="groupBranchFormRules"
        label-width="100px"
      >
        <el-form-item label="分组名称" prop="newGroupName">
          <el-input v-model="groupBranchEditData.newGroupName" placeholder="请输入分组名称" maxlength="100" />
        </el-form-item>
        <el-form-item
          v-for="(branch, index) in groupBranchEditData.branches"
          :key="index"
          label="分支名称"
        >
          <el-input v-model="branch.newName" placeholder="分支名称（留空表示无子分支）" maxlength="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupBranchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGroupBranchEditSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { getCompanyBranches, addCompanyBranch, updateCompanyBranch, deleteCompanyBranch } from '@/api/companyInfo'
import { notifyDataChange } from '@/utils/crossTabSync'

const activeTab = ref('list')
const loading = ref(false)
const submitting = ref(false)
const showEditTab = ref(false)
const addFormRef = ref(null)
const editFormRef = ref(null)
const addType = ref('branch') // 'branch' | 'address'

// 分组/分支编辑弹窗
const groupBranchDialogVisible = ref(false)
const groupBranchFormRef = ref(null)
const groupBranchEditData = reactive({
  oldGroupName: '',
  newGroupName: '',
  branches: [] // [{ oldName, newName, ids }]
})
const groupBranchFormRules = {
  newGroupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
}

// 原始数据列表
const branchList = ref([])

// 已有的分组名称
const existingGroups = computed(() => {
  const groups = new Set()
  branchList.value.forEach(b => {
    if (b.groupName) groups.add(b.groupName)
  })
  return Array.from(groups)
})

// 判断当前输入的分组名是否为新分组
const isNewGroup = computed(() => {
  const gn = addFormData.groupName
  if (!gn) return false
  return !existingGroups.value.includes(gn)
})

// 新增时：判断该分支下是否已有其他地址设了坐标
const addBranchHasCoord = computed(() => {
  let groupName, branchName
  if (addType.value === 'address' && addFormData.existingBranch) {
    groupName = addFormData.existingBranch[0]
    branchName = addFormData.existingBranch[1] === '(无分支名)' ? '' : addFormData.existingBranch[1]
  } else if (addType.value === 'branch') {
    groupName = addFormData.groupName
    branchName = addFormData.name || ''
  } else {
    return false
  }
  if (!groupName) return false
  return branchList.value.some(
    b => (b.groupName || '其他') === groupName &&
         (b.name || '') === branchName &&
         b.latitude !== null && b.latitude !== undefined && b.latitude !== '' &&
         b.longitude !== null && b.longitude !== undefined && b.longitude !== ''
  )
})

// 新增时：判断该分支下是否已有其他地址填了电话
const addBranchHasPhone = computed(() => {
  let groupName, branchName
  if (addType.value === 'address' && addFormData.existingBranch) {
    groupName = addFormData.existingBranch[0]
    branchName = addFormData.existingBranch[1] === '(无分支名)' ? '' : addFormData.existingBranch[1]
  } else if (addType.value === 'branch') {
    groupName = addFormData.groupName
    branchName = addFormData.name || ''
  } else {
    return false
  }
  if (!groupName) return false
  return branchList.value.some(
    b => (b.groupName || '其他') === groupName &&
         (b.name || '') === branchName &&
         b.phone !== null && b.phone !== undefined && b.phone !== ''
  )
})

// 修改时：判断该分支下是否已有其他地址（排除当前编辑的）设了坐标
const editBranchHasCoord = computed(() => {
  if (!editFormData.id) return false
  return branchList.value.some(
    b => Number(b.id) !== Number(editFormData.id) &&
         (b.groupName || '其他') === (editFormData.groupName || '其他') &&
         (b.name || '') === (editFormData.name || '') &&
         b.latitude !== null && b.latitude !== undefined && b.latitude !== '' &&
         b.longitude !== null && b.longitude !== undefined && b.longitude !== ''
  )
})

// 修改时：判断该分支下是否已有其他地址（排除当前编辑的）填了电话
const editBranchHasPhone = computed(() => {
  if (!editFormData.id) return false
  return branchList.value.some(
    b => Number(b.id) !== Number(editFormData.id) &&
         (b.groupName || '其他') === (editFormData.groupName || '其他') &&
         (b.name || '') === (editFormData.name || '') &&
         b.phone !== null && b.phone !== undefined && b.phone !== ''
  )
})

// 级联选择器选项：分组 → 分支名
const branchCascaderOptions = computed(() => {
  const groupMap = {}

  for (const branch of branchList.value) {
    const gn = branch.groupName || '其他'
    if (!groupMap[gn]) {
      groupMap[gn] = { value: gn, label: gn, children: [] }
    }
    const branchName = branch.name || '(无分支名)'
    const exists = groupMap[gn].children.find(c => c.value === branchName)
    if (!exists) {
      groupMap[gn].children.push({ value: branchName, label: branchName })
    }
  }

  return Object.values(groupMap)
})

// 三级树形数据：分组 → 分支名 → 地址记录
const branchTree = computed(() => {
  const groups = []
  const groupMap = {}

  for (const branch of branchList.value) {
    const gn = branch.groupName || '其他'
    const bn = branch.name || ''

    // 第一级：分组
    if (!groupMap[gn]) {
      groupMap[gn] = {
        rowKey: 'group-' + gn,
        level: 'group',
        groupName: gn,
        totalCount: 0,
        children: [],
        _branchMap: {},
        _allEnabled: true
      }
      groups.push(groupMap[gn])
    }
    const groupNode = groupMap[gn]

    // 跟踪分组整体启用状态
    if (branch.isEnabled !== 1) groupNode._allEnabled = false

    // 纯分组记录（没有地址），只计数不创建子节点
    if (!branch.address) {
      groupNode.totalCount++
      continue
    }

    groupNode.totalCount++

    // 第二级：分支名（同名合并）
    if (!groupNode._branchMap[bn]) {
      groupNode._branchMap[bn] = {
        rowKey: 'branch-' + gn + '-' + bn,
        level: 'branch',
        groupName: gn,
        name: bn,
        children: [],
        _allEnabled: true
      }
      groupNode.children.push(groupNode._branchMap[bn])
    }
    const branchNode = groupNode._branchMap[bn]

    // 跟踪分支整体启用状态
    if (branch.isEnabled !== 1) branchNode._allEnabled = false

    // 第三级：地址记录
    branchNode.children.push({
      rowKey: 'address-' + branch.id,
      level: 'address',
      id: branch.id,
      groupName: gn,
      name: bn,
      addressLabel: branch.addressLabel,
      address: branch.address,
      phone: branch.phone,
      latitude: branch.latitude,
      longitude: branch.longitude,
      isEnabled: branch.isEnabled
    })
  }

  // 如果某个分支下只有一个地址且分支名为空，则跳过分支层级直接挂到分组下
  for (const group of groups) {
    const newChildren = []
    for (const branchNode of group.children) {
      branchNode.isEnabled = branchNode._allEnabled
      delete branchNode._allEnabled
      if (!branchNode.name && branchNode.children.length === 1) {
        newChildren.push(branchNode.children[0])
      } else {
        newChildren.push(branchNode)
      }
    }
    group.children = newChildren
    group.isEnabled = group._allEnabled
    delete group._allEnabled
    delete group._branchMap
  }

  return groups
})

// 表单校验规则
const addFormRules = computed(() => {
  if (addType.value === 'address') {
    return {
      existingBranch: [{ required: true, message: '请选择分组和分支', trigger: 'change' }],
      address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
    }
  } else if (isNewGroup.value) {
    return {
      groupName: [{ required: true, message: '请输入分组名称', trigger: 'change' }]
    }
  } else {
    return {
      groupName: [{ required: true, message: '请选择或输入分组名称', trigger: 'change' }],
      address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
    }
  }
})

const editFormRules = {
  groupName: [{ required: true, message: '请选择或输入分组名称', trigger: 'change' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
}

// 新增表单
const addFormData = reactive({
  existingBranch: null, // [groupName, branchName]
  groupName: '',
  name: '',
  addressLabel: '地址',
  address: '',
  phone: '',
  latitude: null,
  longitude: null,
  isEnabled: 1
})

// 编辑表单
const editFormData = reactive({
  id: null,
  groupName: '',
  name: '',
  addressLabel: '地址',
  address: '',
  phone: '',
  latitude: null,
  longitude: null,
  isEnabled: 1
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getCompanyBranches()
    if (res.data) {
      branchList.value = res.data
    }
  } catch (error) {
    console.error('获取分支机构信息失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换新增类型时清空表单
const handleAddTypeChange = () => {
  addFormData.existingBranch = null
  addFormData.groupName = ''
  addFormData.name = ''
  addFormData.addressLabel = '地址'
  addFormData.address = ''
  addFormData.phone = ''
  addFormData.latitude = null
  addFormData.longitude = null
  addFormData.isEnabled = 1
  addFormRef.value?.clearValidate()
}

// 级联选择变化
const handleCascaderChange = (val) => {
  if (val && val.length === 2) {
    addFormData.groupName = val[0]
    addFormData.name = val[1] === '(无分支名)' ? '' : val[1]
    // 同步该分支下的启用状态
    const branchName = val[1] === '(无分支名)' ? '' : val[1]
    const records = branchList.value.filter(
      b => (b.groupName || '其他') === val[0] && (b.name || '') === branchName
    )
    const allDisabled = records.length > 0 && records.every(r => r.isEnabled !== 1)
    addFormData.isEnabled = allDisabled ? 0 : 1
  }
}

// 选择已有分组时，同步该分组的启用状态
watch(() => addFormData.groupName, (gn) => {
  if (!gn || addType.value !== 'branch') return
  // 新分组默认启用
  if (!existingGroups.value.includes(gn)) {
    addFormData.isEnabled = 1
    return
  }
  // 已有分组：检查该分组下所有记录是否全部禁用
  const records = branchList.value.filter(b => (b.groupName || '其他') === gn)
  const allDisabled = records.length > 0 && records.every(r => r.isEnabled !== 1)
  addFormData.isEnabled = allDisabled ? 0 : 1
})

// 新增提交
const handleAddSubmit = async () => {
  if (!addFormRef.value) return

  await addFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      let groupName = addFormData.groupName
      let name = addFormData.name

      if (addType.value === 'address' && addFormData.existingBranch) {
        groupName = addFormData.existingBranch[0]
        name = addFormData.existingBranch[1] === '(无分支名)' ? '' : addFormData.existingBranch[1]
      }

      if (addType.value === 'branch' && isNewGroup.value) {
        name = ''
      }

      await addCompanyBranch({
        groupName,
        name,
        addressLabel: addFormData.addressLabel || '地址',
        address: addFormData.address || '',
        phone: addBranchHasPhone.value ? '' : (addFormData.phone || ''),
        latitude: addBranchHasCoord.value ? null : addFormData.latitude,
        longitude: addBranchHasCoord.value ? null : addFormData.longitude,
        isEnabled: addFormData.isEnabled
      })

      ElNotification({ title: '成功', message: '创建成功', type: 'success', duration: 3000 })
      notifyDataChange('company-info')
      handleAddReset()
      await fetchData()
      activeTab.value = 'list'
    } catch (error) {
      ElNotification({ title: '错误', message: error.message || '创建失败', type: 'error', duration: 3000 })
    } finally {
      submitting.value = false
    }
  })
}

// 重置新增表单
const handleAddReset = () => {
  addFormData.existingBranch = null
  addFormData.groupName = ''
  addFormData.name = ''
  addFormData.addressLabel = '地址'
  addFormData.address = ''
  addFormData.phone = ''
  addFormData.latitude = null
  addFormData.longitude = null
  addFormData.isEnabled = 1
  addFormRef.value?.clearValidate()
}

// 点击修改
const handleEdit = (row) => {
  Object.assign(editFormData, {
    id: row.id,
    groupName: row.groupName,
    name: row.name || '',
    addressLabel: row.addressLabel || '地址',
    address: row.address || '',
    phone: row.phone || '',
    latitude: row.latitude != null ? row.latitude : null,
    longitude: row.longitude != null ? row.longitude : null,
    isEnabled: row.isEnabled
  })
  showEditTab.value = true
  activeTab.value = 'edit'
}

// 修改提交
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await updateCompanyBranch(editFormData.id, {
        groupName: editFormData.groupName,
        name: editFormData.name,
        addressLabel: editFormData.addressLabel || '地址',
        address: editFormData.address,
        phone: editBranchHasPhone.value ? '' : editFormData.phone,
        latitude: editBranchHasCoord.value ? null : editFormData.latitude,
        longitude: editBranchHasCoord.value ? null : editFormData.longitude,
        isEnabled: editFormData.isEnabled
      })

      ElNotification({ title: '成功', message: '修改成功', type: 'success', duration: 3000 })
      notifyDataChange('company-info')
      await fetchData()
      activeTab.value = 'list'
      setTimeout(() => { showEditTab.value = false }, 0)
    } catch (error) {
      ElNotification({ title: '错误', message: error.message || '修改失败', type: 'error', duration: 3000 })
    } finally {
      submitting.value = false
    }
  })
}

// 取消修改
const handleCancelEdit = () => {
  activeTab.value = 'list'
  setTimeout(() => { showEditTab.value = false }, 0)
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${row.addressLabel || '地址'}：${row.address || ''}」吗？`,
      '删除确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )

    await deleteCompanyBranch(row.id)
    ElNotification({ title: '成功', message: '删除成功', type: 'success', duration: 3000 })
    notifyDataChange('company-info')
    await fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElNotification({ title: '错误', message: '删除失败', type: 'error', duration: 3000 })
    }
  }
}

// 点击分组的修改按钮
const handleGroupBranchEdit = (row) => {
  // 收集该分组下的分支信息
  const branches = []
  for (const child of row.children) {
    if (child.level === 'branch') {
      branches.push({
        oldName: child.name,
        newName: child.name,
        ids: child.children.map(c => c.id)
      })
    } else if (child.level === 'address') {
      // 被提升的地址节点（无分支名且只有一条地址）
      // 不作为可编辑分支显示
    }
  }

  Object.assign(groupBranchEditData, {
    oldGroupName: row.groupName,
    newGroupName: row.groupName,
    branches
  })
  groupBranchDialogVisible.value = true
}

// 提交分组/分支名称修改（批量更新所有受影响的记录）
const handleGroupBranchEditSubmit = async () => {
  if (!groupBranchFormRef.value) return
  await groupBranchFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const promises = []

      // 更新有分支名的记录
      for (const branch of groupBranchEditData.branches) {
        for (const id of branch.ids) {
          const original = branchList.value.find(b => b.id === id)
          if (!original) continue
          promises.push(updateCompanyBranch(id, {
            groupName: groupBranchEditData.newGroupName,
            name: branch.newName,
            addressLabel: original.addressLabel,
            address: original.address,
            phone: original.phone,
            latitude: original.latitude,
            longitude: original.longitude,
            isEnabled: original.isEnabled
          }))
        }
      }

      // 更新被提升的地址节点（无分支名，直接挂在分组下）
      const allBranchIds = new Set(groupBranchEditData.branches.flatMap(b => b.ids))
      const groupRecords = branchList.value.filter(
        b => b.groupName === groupBranchEditData.oldGroupName && !allBranchIds.has(b.id)
      )
      for (const record of groupRecords) {
        promises.push(updateCompanyBranch(record.id, {
          groupName: groupBranchEditData.newGroupName,
          name: record.name,
          addressLabel: record.addressLabel,
          address: record.address,
          phone: record.phone,
          latitude: record.latitude,
          longitude: record.longitude,
          isEnabled: record.isEnabled
        }))
      }

      await Promise.all(promises)

      ElNotification({ title: '成功', message: '修改成功', type: 'success', duration: 3000 })
      notifyDataChange('company-info')
      groupBranchDialogVisible.value = false
      await fetchData()
    } catch (error) {
      ElNotification({ title: '错误', message: error.message || '修改失败', type: 'error', duration: 3000 })
    } finally {
      submitting.value = false
    }
  })
}

// 删除分组（批量删除该分组下所有记录）
const handleGroupBranchDelete = async (row) => {
  const label = `分组「${row.groupName}」下的所有 ${row.totalCount} 条记录`

  try {
    await ElMessageBox.confirm(
      `确定要删除${label}吗？此操作不可恢复。`,
      '删除确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )

    // 从原始列表中按 groupName 找出所有记录的 id
    const ids = branchList.value
      .filter(b => (b.groupName || '其他') === row.groupName)
      .map(b => b.id)

    if (ids.length === 0) {
      ElNotification({ title: '提示', message: '没有找到可删除的记录', type: 'warning', duration: 3000 })
      return
    }

    await Promise.all(ids.map(id => deleteCompanyBranch(id)))
    ElNotification({ title: '成功', message: '删除成功', type: 'success', duration: 3000 })
    notifyDataChange('company-info')
    await fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElNotification({ title: '错误', message: '删除失败', type: 'error', duration: 3000 })
    }
  }
}

// 切换分组启用/禁用（级联所有分支和地址）
const handleToggleGroupEnabled = async (row) => {
  const newEnabled = row.isEnabled ? 0 : 1
  const label = newEnabled === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(
      `确定要${label}分组「${row.groupName}」下的所有记录吗？`,
      `${label}确认`,
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    const records = branchList.value.filter(b => (b.groupName || '其他') === row.groupName)
    await Promise.all(records.map(r => updateCompanyBranch(r.id, {
      groupName: r.groupName,
      name: r.name,
      addressLabel: r.addressLabel,
      address: r.address,
      phone: r.phone,
      latitude: r.latitude,
      longitude: r.longitude,
      isEnabled: newEnabled
    })))
    ElNotification({ title: '成功', message: `${label}成功`, type: 'success', duration: 3000 })
    notifyDataChange('company-info')
    await fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElNotification({ title: '错误', message: `${label}失败`, type: 'error', duration: 3000 })
    }
  }
}

// 切换分支启用/禁用（级联该分支下所有地址）
const handleToggleBranchEnabled = async (row) => {
  const newEnabled = row.isEnabled ? 0 : 1
  const label = newEnabled === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(
      `确定要${label}分支「${row.name || '(未命名)'}」下的所有地址吗？`,
      `${label}确认`,
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    const records = branchList.value.filter(
      b => (b.groupName || '其他') === row.groupName && (b.name || '') === row.name
    )
    await Promise.all(records.map(r => updateCompanyBranch(r.id, {
      groupName: r.groupName,
      name: r.name,
      addressLabel: r.addressLabel,
      address: r.address,
      phone: r.phone,
      latitude: r.latitude,
      longitude: r.longitude,
      isEnabled: newEnabled
    })))
    ElNotification({ title: '成功', message: `${label}成功`, type: 'success', duration: 3000 })
    notifyDataChange('company-info')
    await fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElNotification({ title: '错误', message: `${label}失败`, type: 'error', duration: 3000 })
    }
  }
}

// 切换单个地址启用/禁用
const handleToggleAddressEnabled = async (row) => {
  const newEnabled = row.isEnabled === 1 ? 0 : 1
  const label = newEnabled === 1 ? '启用' : '禁用'
  try {
    const original = branchList.value.find(b => b.id === row.id)
    if (!original) return
    await updateCompanyBranch(row.id, {
      groupName: original.groupName,
      name: original.name,
      addressLabel: original.addressLabel,
      address: original.address,
      phone: original.phone,
      latitude: original.latitude,
      longitude: original.longitude,
      isEnabled: newEnabled
    })
    ElNotification({ title: '成功', message: `${label}成功`, type: 'success', duration: 3000 })
    notifyDataChange('company-info')
    await fetchData()
  } catch (error) {
    ElNotification({ title: '错误', message: `${label}失败`, type: 'error', duration: 3000 })
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.company-info-management {
  padding: 24px;
  min-height: calc(100vh - 100px);
  background-color: #f5f7fa;
}

.main-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.group-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.branch-name {
  font-weight: 500;
  font-size: 14px;
  color: #409eff;
}

.address-label-text {
  color: #606266;
  font-size: 13px;
}

.address-text {
  color: #606266;
  font-size: 13px;
}

.group-count {
  font-size: 12px;
  color: #909399;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* Tab 样式 */
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

/* 表格样式 */
:deep(.el-table) {
  border: none !important;
  font-size: 14px;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 0;
}

:deep(.el-table td.el-table__cell) {
  padding: 12px 0;
}

:deep(.el-table .cell) {
  padding: 0 12px;
  line-height: 1.6;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 12px;
  font-weight: 500;
}

/* 表单样式 */
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
</style>
