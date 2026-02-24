<template>
  <div class="login-page">
    <!-- 全屏背景图 -->
    <div class="bg-layer" :style="bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}">
    </div>

    <!-- 登录表单，直接浮在背景图左侧 -->
    <div class="login-area">
      <div class="tab-row">
        <span class="tab active">租户登陆</span>
        <span class="tab-divider">/</span>
        <span class="tab disabled">注册</span>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @keyup.enter="handleLogin"
        hide-required-asterisk
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用 户 名"
            size="large"
            class="login-input"
          >
            <template #prefix>
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="账 号 密 码"
            size="large"
            show-password
            class="login-input"
          >
            <template #prefix>
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </template>
          </el-input>
        </el-form-item>

        <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
          <span v-if="!loading">点击登录</span>
          <span v-else>登录中...</span>
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)

const bgUrl = ref('')
const bgSrc = 'http://localhost:8080/api/uploads/1/background/背景图.png'

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

onMounted(() => {
  const img = new Image()
  img.onload = () => { bgUrl.value = bgSrc }
  img.onerror = () => { bgUrl.value = '' }
  img.src = bgSrc

  const saved = localStorage.getItem('rememberedTenant')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      form.username = data.username || ''
      form.password = data.password || ''
    } catch (e) { /* ignore */ }
  }
})

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await request({ url: '/auth/tenant/login', method: 'post', data: { username: form.username, password: form.password } })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('adminName', res.data.name)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/admin')
  } catch (e) { /* interceptor */ } finally { loading.value = false }
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.login-page {
  height: 100vh;
  position: relative;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

/* ===== 全屏背景图 ===== */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: #1a2550;
  background-size: cover;
  background-position: left top;
  background-repeat: no-repeat;
}

/* ===== 登录区域 - 浮在背景图左侧 ===== */
.login-area {
  position: absolute;
  z-index: 1;
  left: 21%;
  top: 175px;
  width: 320px;
}

/* 登录/注册 标签 */
.tab-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 50px;
  margin-top: 12px;
  margin-left: -19%;
}

.tab {
  font-size: 32px;
  font-weight: 500;
  cursor: default;
  line-height: 1;
}

.tab.active {
  color: #1677ff;
  text-shadow: 0 0 0.5px #1677ff;
  font-weight: 700;
}

.tab.disabled {
  color: #69b1ff;
  font-weight: 400;
  font-size: 22px;
  cursor: not-allowed;
}

.tab-divider {
  font-size: 22px;
  color: #69b1ff;
}

/* 表单 */
.login-form {
  width: 100%;
  margin-left: -39%;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  max-width: 325px;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
  border-radius: 22px;
  border: none;
  margin-top: 18px;
  background: linear-gradient(to right, #1677ff, #69b1ff);
  box-shadow: 0 4px 14px rgba(91, 106, 191, 0.35);
  transition: all 0.25s;
}

.login-btn:hover {
  box-shadow: 0 6px 20px rgba(91, 106, 191, 0.5);
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

/* 输入框图标 */
.field-icon {
  width: 18px;
  height: 18px;
  color: #bbb;
  transition: color 0.3s;
}

/* ===== Element Plus 覆盖 ===== */
:deep(.login-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 23px;
  box-shadow: none !important;
  border: 1px solid #d9d9d9;
  padding: 4px 18px;
  transition: all 0.3s;
  height: 33px;
  max-width: 300px;
}

:deep(.login-input .el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.95);
  border-color: #bfbfbf;
}

:deep(.login-input .el-input__wrapper.is-focus) {
  background: #fff;
  border-color: #5B6ABF;
  box-shadow: 0 0 0 2px rgba(91, 106, 191, 0.15) !important;
}

:deep(.login-input .el-input__inner) {
  color: #333;
  font-size: 14px;
}

:deep(.login-input .el-input__inner::placeholder) {
  color: #aaa;
}

:deep(.login-input .el-input__prefix) {
  margin-right: 6px;
}

:deep(.login-input .el-input__suffix .el-icon) {
  color: #999;
}

:deep(.el-form-item) { margin-bottom: 37px; }
:deep(.el-form-item__error) { padding-top: 4px; padding-left: 14px; color: #ff7875; }

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .login-area {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 480px) {
  .login-area {
    width: 90%;
    max-width: 320px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
