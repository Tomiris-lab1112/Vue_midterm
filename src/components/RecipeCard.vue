<script setup>
defineProps({ recipe: { type: Object, required: true }, favorite: Boolean })
defineEmits(['toggle-favorite', 'open'])
</script>
<template>
  <div class="card">
    <img class="thumb" :src="recipe.image" :alt="recipe.name" loading="lazy" />
    <h3 style="margin:4px 0">{{ recipe.name }}</h3>
    <p class="muted" style="margin:0">{{ recipe.cuisine }} · {{ recipe.difficulty }} · ⏱ {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min · ⭐ {{ recipe.rating }}</p>
    <div class="row">
      <span v-for="m in recipe.mealType" :key="m" class="tag">{{ m }}</span>
    </div>
    <div class="row" style="margin-top:auto">
      <button @click="$emit('open', recipe.id)">View</button>
      <button class="ghost" @click="$emit('toggle-favorite', recipe.id)">{{ favorite ? '★ Saved' : '☆ Save' }}</button>
    </div>
  </div>
</template>
