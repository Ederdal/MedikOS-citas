<template>
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
    <!-- Título -->
    <div>
      <h1 class="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-black">
        MedikOS
      </h1>
      <p class="text-gray-600 text-sm md:text-base">{{ currentDate }}</p>
    </div>

    <!-- Ícono de notificaciones -->
    <div class="relative mt-4 md:mt-0">
      <button class="text-gray-600 hover:text-blue-600 transition-colors">
        <!-- Icono -->
        <svg class="w-6 h-6" >...</svg>
        <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </div>
  </div>
</template>



<script lang="ts">
import { computed } from 'vue';

export default {
  name: 'DashboardHeader',
  setup() {
    const currentDate = computed(() =>
      new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    );
    return { currentDate };
  }
};
</script>

<style scoped>
/* Aquí puedes incluir estilos adicionales para el header si lo requieres */
</style>
