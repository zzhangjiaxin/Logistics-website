<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="card-header">
        <h3>个人信息</h3>
      </div>

      <!-- 头像 -->
      <div class="avatar-section">
        <div class="avatar-wrapper" @click="triggerUpload">
          <img v-if="form.avatarUrl" :src="BASE_URL + form.avatarUrl" class="avatar-img" />
          <div v-else class="avatar-placeholder">{{ (form.nickname || form.username || '').charAt(0) }}</div>
          <div class="avatar-overlay"><el-icon><Camera /></el-icon></div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleUpload" />
        <span class="avatar-tip">点击头像更换</span>
      </div>

      <!-- 统一表单 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="profile-form">
        <div class="form-row">
          <el-form-item label="用户名" prop="username" class="form-col">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="昵称" class="form-col">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="邮箱" class="form-col">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="电话" class="form-col">
            <el-input v-model="form.phone" placeholder="请输入电话" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="原密码" class="form-col">
            <el-input v-model="form.oldPassword" type="password" show-password placeholder="不修改请留空" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" class="form-col">
            <el-input v-model="form.newPassword" type="password" show-password placeholder="不修改请留空" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="确认密码" prop="confirmPassword" class="form-col">
            <el-input v-model="form.confirmPassword" type="password" show-password placeholder="不修改请留空" />
          </el-form-item>
          <div class="form-col"></div>
        </div>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import request, { BASE_URL } from '@/utils/request'

const form = reactive({
  username: '', nickname: '', email: '', phone: '', avatarUrl: '',
  oldPassword: '', newPassword: '', confirmPassword: ''
})
const fileInput = ref(null)
const formRef = ref(null)
const saving = ref(false)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  newPassword: [{ min: 6, message: '密码至少6位', trigger: 'blur' }],
  confirmPassword: [{
    validator: (_, value, cb) => {
      if (form.newPassword && value !== form.newPassword) return cb(new Error('两次密码不一致'))
      cb()
    }, trigger: 'blur'
  }]
}

const fetchProfile = async () => {
  try {
    const res = await request({ url: '/auth/tenant/profile', method: 'get' })
    Object.assign(form, res.data)
  } catch (e) { /* interceptor */ }
}

const handleSave = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 如果填了新密码，必须填原密码
  if (form.newPassword && !form.oldPassword) {
    ElMessage.warning('请输入原密码')
    return
  }

  saving.value = true
  try {
    // 保存基本信息
    const res = await request({
      url: '/auth/tenant/profile', method: 'put',
      data: { username: form.username, nickname: form.nickname, email: form.email, phone: form.phone }
    })
    if (res.data?.name) localStorage.setItem('adminName', res.data.name)

    // 如果填了密码就修改密码
    if (form.oldPassword && form.newPassword) {
      await request({
        url: '/auth/tenant/password', method: 'put',
        data: { oldPassword: form.oldPassword, newPassword: form.newPassword }
      })
      ElMessage.success('保存成功，密码已修改，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('adminName')
      setTimeout(() => { window.location.href = '/admin/login' }, 1000)
      return
    }

    ElMessage.success('保存成功')
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (e) { /* interceptor */ } finally { saving.value = false }
}

const triggerUpload = () => fileInput.value.click()

const handleUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { ElMessage.warning('头像不能超过2MB'); return }
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await request({ url: '/auth/tenant/avatar', method: 'post', data: fd })
    form.avatarUrl = res.data.avatarUrl
    ElMessage.success('头像更新成功')
  } catch (e) { /* interceptor */ }
  e.target.value = ''
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-page { padding: 20px; }

.profile-card {
  background: #fff;
  border-radius: 8px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.avatar-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #409eff, #304156);
  color: #fff; font-size: 28px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}

.avatar-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 22px;
  opacity: 0; transition: opacity 0.2s;
}

.avatar-wrapper:hover .avatar-overlay { opacity: 1; }
.avatar-tip { font-size: 12px; color: #909399; }

.profile-form { max-width: 700px; margin-left: 270px; }
.form-row { display: flex; gap: 150px; }
.form-col { flex: 1; }

@media (max-width: 600px) {
  .form-row { flex-direction: column; gap: 0; }
}
</style>
