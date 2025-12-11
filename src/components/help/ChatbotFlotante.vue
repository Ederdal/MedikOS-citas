<template>
  <div
    class="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex justify-center items-center text-2xl shadow-lg cursor-pointer"
    @click="$emit('abrir')"
  >
    💬
  </div>
</template>

<script setup lang="ts">
defineEmits(['abrir'])
</script>
