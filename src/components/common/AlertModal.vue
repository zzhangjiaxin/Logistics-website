<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-container" v-html="message"></div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
let timer = null

const show = () => {
  visible.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    handleClose()
  }, props.duration)
}

const handleClose = () => {
  visible.value = false
  emit('close')
}

defineExpose({
  show,
  handleClose
})
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 20%;
  left: 50%;
  z-index: 9999;
  margin-left: -150px;
  padding: 32px 20px;
  width: 300px;
  color: #fff;
  font-size: 22px;
  line-height: 1.4;
  text-align: center;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.modal-fade-enter-active {
  transition: all 0.5s;
}

.modal-fade-leave-active {
  transition: all 0.5s;
}

.modal-fade-enter-from {
  top: 40%;
  opacity: 0;
}

.modal-fade-enter-to {
  top: 20%;
  opacity: 1;
}

.modal-fade-leave-from {
  top: 20%;
  opacity: 1;
}

.modal-fade-leave-to {
  top: 20%;
  opacity: 0;
}
</style>
