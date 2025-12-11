<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-slide-up">
        <!-- Botón cerrar -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-black"
          @click="$emit('close')"
        >
          ✖
        </button>

        <!-- Título -->
        <h3 class="text-xl font-bold text-gray-800 mb-4">Horario de Atención</h3>

        <!-- Información -->
        <div class="space-y-2 text-sm text-gray-700">
          <p><strong>Lunes a Viernes:</strong> 9:00 AM - 3:00 PM</p>
          <p><strong>Sábados:</strong> 10:00 AM - 1:00 PM</p>
          <p><strong>Correo:</strong> doctor@example.com</p>
          <p><strong>Teléfono:</strong> +52 123 456 7890</p>
          <p><strong>Ubicación:</strong> Hospital Central, Piso 2</p>
        </div>

        <!-- Botón -->
        <div class="mt-5 flex justify-center">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            @click="$emit('close')"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
defineEmits(['close'])
const isVisible = ref(true)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
