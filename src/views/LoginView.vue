<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const store = useStore()
const route = useRoute()
const router = useRouter()
const username = ref('emilys')
const password = ref('emilyspass')
const error = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = null
  try {
    await store.dispatch('login', { username: username.value, password: password.value })
    router.push(route.query.redirect || '/')
  } catch (e) {
    error.value = e.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card" style="max-width:380px;margin:40px auto">
    <h2>Login</h2>
    <p class="muted">Demo account (dummyjson): emilys / emilyspass</p>
    <div class="row" style="flex-direction:column;align-items:stretch">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" @keyup.enter="submit" />
      <button :disabled="loading" @click="submit">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>
