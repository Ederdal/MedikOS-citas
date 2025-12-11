<template>
  <!-- Sección Admin -->
  <div v-if="isAdmin">
    <h2 class="text-base md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
      Citas Próximas
    </h2>
    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-colors animate-fade-left mb-4 h-auto p-4 md:p-6">
      <CardCitasRecientes />
    </div>
  </div>

  <!-- Grid principal -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Ejemplo de card que ocupa 2 columnas en desktop -->
    <div v-if="isAdmin" class="lg:col-span-2">
      <GraficaDoctores />
    </div>

    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow animate-fade-in p-4 md:p-6">
      <CalendarioCitas />
    </div>

    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow animate-fade-in p-4 md:p-6">
      <CardFechaHorario />
    </div>

    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow animate-fade-in p-4 md:p-6">
      <CardEstadisticas />
    </div>

    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-colors animate-slide-up p-4 md:p-6">
      <CardMedicos />
    </div>

    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-colors animate-slide-up p-4 md:p-6">
      <CardContactos />
    </div>
  </div>

  <CarruselCircular />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DashboardCards',
  data() {
    return {
      isAdmin: sessionStorage.getItem('Rol') === 'Administrador',
    };
  },
});
</script>

<style scoped>
@keyframes fade-left {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-left {
  animation: fade-left 0.5s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

/* Hover effect personalizado para cards */
.hover\:shadow-xl {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.hover\:shadow-xl:hover {
  transform: translateY(-2px);
}

/* Estilo para el contenedor de la gráfica de estadísticas */
#chart-estadisticas {
  width: 100%;
  height: 16rem;
}
</style>
