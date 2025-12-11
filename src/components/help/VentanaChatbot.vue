<template>
  <div
    class="absolute top-0 left-0 w-full h-full bg-opacity-95 z-50 flex justify-center items-center rounded-2xl"
  >
    <div class="w-[360px] h-[500px] bg-white rounded-xl shadow-lg border relative">
      <div class="flex justify-between items-center px-4 py-2 border-b">
        <span class="font-semibold text-gray-800">Asistente Virtual</span>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-red-600 text-xl">✖</button>
      </div>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/l6tc833QMbnmk-x6o4QQR"
        width="100%"
        height="100%"
        frameborder="0"
        allow="clipboard-write"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['cerrar'])
</script>
