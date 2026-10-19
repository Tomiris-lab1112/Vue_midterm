<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
const store = useStore()
const router = useRouter()
onMounted(() => store.dispatch('fetchRecipes'))
</script>

<template>
  <h2>Favorite recipes</h2>
  <LoadingSpinner v-if="store.state.loading" />
  <template v-else>
    <div class="grid">
      <RecipeCard v-for="r in store.getters.favoriteRecipes" :key="r.id" :recipe="r" favorite
                  @toggle-favorite="store.dispatch('toggleFavorite', $event)"
                  @open="(id) => router.push(`/recipes/${id}`)" />
    </div>
    <p v-if="!store.getters.favoriteRecipes.length" class="muted">No favorites yet.</p>
  </template>
</template>
