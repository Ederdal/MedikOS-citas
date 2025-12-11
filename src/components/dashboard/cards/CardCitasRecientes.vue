<template>
  <!-- Contenedor principal que en móviles se organiza verticalmente y en desktop en fila -->
  <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
    <div
      v-for="(appointment, index) in appointments"
      :key="index"
      class="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow transition-colors hover:bg-blue-50 w-full md:max-w-md"
    >
      <!-- Grupo de información (hora y nombre del paciente) -->
      <div class="flex flex-col text-left">
        <p class="font-medium text-gray-800">{{ appointment.time }}</p>
        <p class="text-sm text-gray-600">{{ appointment.patient }}</p>
      </div>
      <!-- Nombre del doctor; se separa con margen superior en móvil y a la izquierda en desktop -->
      <span class="text-sm text-blue-600 mt-2 md:mt-0 md:ml-4">{{ appointment.doctor }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    const appointments = ref([
      { time: '09:00 AM', patient: 'Ana Martínez', doctor: 'Dr. Pérez' },
      { time: '10:30 AM', patient: 'Carlos Sánchez', doctor: 'Dra. Gómez' },
      { time: '11:45 AM', patient: 'Luisa Fernández', doctor: 'Dr. Ruiz' }
    ]);

    return { appointments };
  }
};
</script>
