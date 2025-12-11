<template>
  <div class="bg-white shadow rounded-2xl p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
    <ul class="space-y-3 text-sm">
      <li
        v-for="(pregunta, index) in preguntasFiltradas"
        :key="index"
        @click="$emit('seleccionar', index)"
        class="text-blue-600 hover:underline cursor-pointer"
      >
        {{ pregunta.pregunta }}
      </li>
    </ul>

    <div
      v-if="preguntaSeleccionada !== null"
      class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded relative"
    >
      <button
        @click="$emit('cerrar')"
        class="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        ✖
      </button>
      <p class="text-sm text-gray-800">{{ preguntas[preguntaSeleccionada].respuesta }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  preguntas: { pregunta: string; respuesta: string }[]
  preguntasFiltradas: { pregunta: string; respuesta: string }[]
  preguntaSeleccionada: number | null
}>()
defineEmits(['seleccionar', 'cerrar'])
</script>
