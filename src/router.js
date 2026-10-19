import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import RecipesView from './views/RecipesView.vue'
import RecipeDetailView from './views/RecipeDetailView.vue'
import FavoritesView from './views/FavoritesView.vue'
import MenuView from './views/MenuView.vue'
import LoginView from './views/LoginView.vue'

const routes = [
  { path: '/', name: 'recipes', component: RecipesView },
  { path: '/recipes/:id', name: 'recipe-detail', component: RecipeDetailView, props: true }, // dynamic route
  { path: '/favorites', name: 'favorites', component: FavoritesView, meta: { requiresAuth: true } },
  { path: '/menu', name: 'menu', component: MenuView, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
