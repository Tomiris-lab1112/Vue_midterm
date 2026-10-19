<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { DAYS } from '../store'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const props = defineProps({ id: String }) // from /recipes/:id
const store = useStore()
const router = useRouter()
const recipe = ref(null)
const loading = ref(false)
const error = ref(null)
const day = ref(DAYS[0])
const added = ref(false)
const isFav = computed(() => recipe.value && store.getters.isFavorite(recipe.value.id))

async function load() {
  loading.value = true
  error.value = null
  recipe.value = null
  try {
    recipe.value = await store.dispatch('fetchRecipe', props.id)
  } catch (e) {
    error.value = e.response?.status === 404 ? 'Recipe not found.' : 'Failed to load recipe: ' + e.message
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(() => props.id, load)

function addToMenu() {
  if (!store.getters.isAuthenticated) return router.push({ name: 'login', query: { redirect: `/recipes/${props.id}` } })
  store.dispatch('addToMenu', { day: day.value, id: recipe.value.id })
  added.value = true
  setTimeout(() => (added.value = false), 2000)
}
</script>

<template>
  <router-link to="/">← Back</router-link>
  <LoadingSpinner v-if="loading" />
  <ErrorMessage v-else-if="error" :message="error" @retry="load" />
  <div v-else-if="recipe" class="card" style="margin-top:12px">
    <img class="hero" :src="recipe.image" :alt="recipe.name" />
    <h2>{{ recipe.name }}</h2>
    <p class="muted">{{ recipe.cuisine }} · {{ recipe.difficulty }} · prep {{ recipe.prepTimeMinutes }} min · cook {{ recipe.cookTimeMinutes }} min · {{ recipe.caloriesPerServing }} kcal · ⭐ {{ recipe.rating }}</p>
    <div class="row" style="margin-bottom:12px">
      <button class="ghost" @click="store.dispatch('toggleFavorite', recipe.id)">{{ isFav ? '★ Saved' : '☆ Save to favorites' }}</button>
      <select v-model="day"><option v-for="d in DAYS" :key="d">{{ d }}</option></select>
      <button @click="addToMenu">Add to menu</button>
      <span v-if="added">✅ Added to {{ day }}</span>
    </div>
    <h3>Ingredients</h3>
    <ul><li v-for="(i, idx) in recipe.ingredients" :key="idx">{{ i }}</li></ul>
    <h3>Instructions</h3>
    <ol><li v-for="(s, idx) in recipe.instructions" :key="idx">{{ s }}</li></ol>
  </div>
</template>
