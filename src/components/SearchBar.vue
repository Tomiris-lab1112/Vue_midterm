<script setup>
defineProps({ modelValue: String, placeholder: { type: String, default: 'Search...' } })
defineEmits(['update:modelValue'])
</script>
<template>
  <input :value="modelValue" :placeholder="placeholder" style="flex:1;min-width:200px"
         @input="$emit('update:modelValue', $event.target.value)" />
</template>
