<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()

const search = ref(route.query.q || '')
const mode = ref(route.query.mode || 'name') // name | ingredient
const category = ref(route.query.category || '')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.state.recipes.filter((r) => {
    const matchSearch = !q || (mode.value === 'name'
      ? r.name.toLowerCase().includes(q)
      : r.ingredients.some((i) => i.toLowerCase().includes(q)))
    return matchSearch && (!category.value || r.mealType.includes(category.value))
  })
})

watch([search, mode, category], () => {
  router.replace({ query: { q: search.value || undefined, mode: mode.value !== 'name' ? mode.value : undefined, category: category.value || undefined } })
})

const load = () => store.dispatch('fetchRecipes')
onMounted(load)
</script>

<template>
  <h2>Recipes</h2>
  <div class="row" style="margin-bottom:16px">
    <SearchBar v-model="search" :placeholder="mode === 'name' ? 'Search by recipe name' : 'Search by ingredient (e.g. tomato)'" />
    <select v-model="mode"><option value="name">By name</option><option value="ingredient">By ingredient</option></select>
    <select v-model="category"><option value="">All categories</option><option v-for="c in store.getters.categories" :key="c">{{ c }}</option></select>
  </div>
  <LoadingSpinner v-if="store.state.loading" />
  <ErrorMessage v-else-if="store.state.error" :message="store.state.error" @retry="load" />
  <template v-else>
    <div class="grid">
      <RecipeCard v-for="r in filtered" :key="r.id" :recipe="r" :favorite="store.getters.isFavorite(r.id)"
                  @toggle-favorite="store.dispatch('toggleFavorite', $event)"
                  @open="(id) => router.push({ name: 'recipe-detail', params: { id } })" />
    </div>
    <p v-if="!filtered.length" class="muted">Nothing found.</p>
  </template>
</template>
