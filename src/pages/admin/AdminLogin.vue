<template>
  <div class="login-page">
    <!-- 粒子背景 -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>

    <!-- 光晕 -->
    <div class="bg-layer">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M4 9l12 7 12-7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16 16v14" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 12.5l6 3.5 6-3.5" stroke="currentColor" stroke-width="1" opacity="0.4"/>
          </svg>
        </div>
        <span class="brand-name">Logistics CMS</span>
      </div>

      <h2>后台管理系统</h2>
      <p class="subtitle">Sign in to your workspace</p>

      <el-form ref="formRef" :model="form" :rules="rules" @keyup.enter="handleLogin" hide-required-asterisk>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="large" :prefix-icon="UserIcon" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password :prefix-icon="LockIcon" />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>验证中...</span>
        </el-button>
      </el-form>

      <div class="card-footer">
        <div class="divider-line"></div>
        <span>SECURE LOGIN</span>
        <div class="divider-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import request from '@/utils/request'

const UserIcon = shallowRef(User)
const LockIcon = shallowRef(Lock)

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)
const canvasRef = ref(null)

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

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

// ===== 粒子动画 =====
let animId = null
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w, h, particles

  function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }

  function initParticles() {
    const count = Math.floor((w * h) / 12000)
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1
    }))
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)

    // 连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = dx * dx + dy * dy
        if (dist < 14400) { // 120px
          const alpha = (1 - dist / 14400) * 0.15
          ctx.beginPath()
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // 粒子
    for (const p of particles) {
      p.x += p.dx
      p.y += p.dy
      if (p.x < 0 || p.x > w) p.dx *= -1
      if (p.y < 0 || p.y > h) p.dy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(56,189,248,${p.o})`
      ctx.fill()
    }

    animId = requestAnimationFrame(draw)
  }

  resize()
  initParticles()
  draw()
  window.addEventListener('resize', () => { resize(); initParticles() })
})

onUnmounted(() => { if (animId) cancelAnimationFrame(animId) })
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #060a13;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.glow-1 {
  width: 600px;
  height: 600px;
  background: rgba(56, 189, 248, 0.07);
  top: -200px;
  right: -150px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: rgba(99, 102, 241, 0.05);
  bottom: -150px;
  left: -120px;
}

/* ===== 卡片 ===== */
.login-card {
  position: relative;
  z-index: 1;
  width: 400px;
  padding: 48px 40px 36px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(24px);
  box-shadow:
    0 0 40px rgba(56, 189, 248, 0.06),
    0 25px 50px rgba(0, 0, 0, 0.4);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 36px;
}

.brand-icon {
  width: 28px;
  height: 28px;
  color: #38bdf8;
}

.brand-icon svg { width: 100%; height: 100%; }

.brand-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: #f0f0f0;
  margin: 0 0 6px 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.25);
  margin: 0 0 36px 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 4px;
}

.login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.login-btn:active { transform: translateY(0); }

.card-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 36px;
}

.card-footer span {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.12);
  letter-spacing: 3px;
  white-space: nowrap;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

/* ===== Element Plus 暗色覆盖 ===== */
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  padding: 4px 14px;
  transition: box-shadow 0.2s;
}
:deep(.el-input__wrapper:hover) { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15) inset; }
:deep(.el-input__wrapper.is-focus) { box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5) inset; }
:deep(.el-input__inner) { color: #e0e0e0; }
:deep(.el-input__inner::placeholder) { color: rgba(255, 255, 255, 0.2); }
:deep(.el-input__prefix .el-icon) { color: rgba(255, 255, 255, 0.25); }
:deep(.el-form-item) { margin-bottom: 20px; }
:deep(.el-form-item__error) { padding-top: 4px; color: #f87171; }
:deep(.el-input__suffix .el-icon) { color: rgba(255, 255, 255, 0.25); }

@media (max-width: 480px) {
  .login-card { width: calc(100% - 32px); padding: 36px 28px 28px; }
}
</style>
