<script setup>
defineProps({ message: { type: String, required: true } })
defineEmits(['retry'])
</script>
<template>
  <div class="card error">
    ⚠️ {{ message }}
    <button class="ghost" style="margin-left:10px" @click="$emit('retry')">Retry</button>
  </div>
</template>
