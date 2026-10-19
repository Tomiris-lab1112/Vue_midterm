import { createStore } from 'vuex'
import axios from 'axios'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const emptyMenu = () => Object.fromEntries(DAYS.map((d) => [d, []]))
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export default createStore({
  state: {
    recipes: [],
    loading: false,
    error: null,
    favorites: load('favorites', []),
    menu: load('menu', emptyMenu()),
    user: load('user', null),
    token: localStorage.getItem('token') || null
  },
  getters: {
    isAuthenticated: (s) => !!s.token,
    recipeById: (s) => (id) => s.recipes.find((r) => r.id === Number(id)),
    isFavorite: (s) => (id) => s.favorites.includes(id),
    favoriteRecipes: (s) => s.recipes.filter((r) => s.favorites.includes(r.id)),
    categories: (s) => [...new Set(s.recipes.flatMap((r) => r.mealType))].sort()
  },
  mutations: {
    SET_RECIPES: (s, list) => (s.recipes = list),
    ADD_RECIPE: (s, r) => s.recipes.push(r),
    SET_LOADING: (s, v) => (s.loading = v),
    SET_ERROR: (s, e) => (s.error = e),
    TOGGLE_FAVORITE(s, id) {
      s.favorites = s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id]
      save('favorites', s.favorites)
    },
    ADD_TO_MENU(s, { day, id }) {
      if (!s.menu[day].includes(id)) s.menu[day].push(id)
      save('menu', s.menu)
    },
    REMOVE_FROM_MENU(s, { day, id }) {
      s.menu[day] = s.menu[day].filter((x) => x !== id)
      save('menu', s.menu)
    },
    CLEAR_MENU(s) {
      s.menu = emptyMenu()
      save('menu', s.menu)
    },
    SET_AUTH(s, { user, token }) {
      s.user = user
      s.token = token
      if (token) {
        save('user', user)
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  },
  actions: {
    async fetchRecipes({ commit, state }) {
      if (state.recipes.length) return
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data } = await axios.get('https://dummyjson.com/recipes?limit=0') // GET
        commit('SET_RECIPES', data.recipes)
      } catch (e) {
        commit('SET_ERROR', 'Failed to load recipes: ' + e.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchRecipe({ commit, getters }, id) {
      const cached = getters.recipeById(id)
      if (cached) return cached
      const { data } = await axios.get(`https://dummyjson.com/recipes/${id}`) // GET
      commit('ADD_RECIPE', data)
      return data
    },
    async login({ commit }, { username, password }) {
      const { data } = await axios.post('https://dummyjson.com/auth/login', { username, password }) // POST
      commit('SET_AUTH', { user: { id: data.id, username: data.username, firstName: data.firstName }, token: data.accessToken })
    },
    logout: ({ commit }) => commit('SET_AUTH', { user: null, token: null }),
    toggleFavorite: ({ commit }, id) => commit('TOGGLE_FAVORITE', id),
    addToMenu: ({ commit }, payload) => commit('ADD_TO_MENU', payload),
    removeFromMenu: ({ commit }, payload) => commit('REMOVE_FROM_MENU', payload),
    clearMenu: ({ commit }) => commit('CLEAR_MENU'),
    async saveMenu({ state }) {
      const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', { userId: state.user?.id, menu: state.menu }) // POST
      return data
    }
  }
})
