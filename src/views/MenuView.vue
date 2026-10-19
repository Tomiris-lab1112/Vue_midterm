<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { DAYS } from '../store'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const store = useStore()
const status = ref('')
const saving = ref(false)
const total = computed(() => DAYS.reduce((n, d) => n + store.state.menu[d].length, 0))
const name = (id) => store.getters.recipeById(id)?.name ?? `Recipe #${id}`

onMounted(() => store.dispatch('fetchRecipes'))

async function save() {
  saving.value = true
  status.value = ''
  try {
    await store.dispatch('saveMenu')
    status.value = '✅ Menu saved to server'
  } catch (e) {
    status.value = '⚠️ Could not save: ' + e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <h2>Weekly menu <span class="muted">({{ total }} dishes)</span></h2>
  <LoadingSpinner v-if="store.state.loading" />
  <template v-else>
    <div class="card" v-for="d in DAYS" :key="d">
      <strong>{{ d }}</strong>
      <p v-if="!store.state.menu[d].length" class="muted" style="margin:6px 0 0">No dishes</p>
      <div v-for="id in store.state.menu[d]" :key="id" class="row" style="justify-content:space-between;margin-top:6px">
        <router-link :to="`/recipes/${id}`">{{ name(id) }}</router-link>
        <button class="ghost" @click="store.dispatch('removeFromMenu', { day: d, id })">Remove</button>
      </div>
    </div>
    <div class="row">
      <button :disabled="saving || !total" @click="save">{{ saving ? 'Saving...' : 'Save menu' }}</button>
      <button class="ghost" :disabled="!total" @click="store.dispatch('clearMenu')">Clear</button>
      <span>{{ status }}</span>
    </div>
  </template>
</template>
