<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const user = computed(() => store.state.user)
const favCount = computed(() => store.state.favorites.length)
function logout() { store.dispatch('logout'); router.push('/') }
</script>

<template>
  <header class="card row" style="border-radius:0;margin:0;justify-content:space-between">
    <div class="row">
      <strong>🍲 RecipeFinder</strong>
      <router-link to="/">Recipes</router-link>
      <router-link to="/favorites">Favorites ({{ favCount }})</router-link>
      <router-link to="/menu">Weekly menu</router-link>
    </div>
    <div class="row">
      <template v-if="user">
        <span class="muted">Hi, {{ user.firstName }}</span>
        <button class="ghost" @click="logout">Logout</button>
      </template>
      <router-link v-else to="/login">Login</router-link>
    </div>
  </header>
  <main class="container"><router-view /></main>
</template>
