<template>
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <!-- Encabezado general -->
    <div class="text-center my-6">
      <h1 class="text-3xl font-bold text-gray-800">Panel de Estadísticas Médicas</h1>
      <p class="text-gray-600 mt-2">Selecciona una categoría para visualizar su información correspondiente en forma gráfica.</p>
    </div>

    <!-- Botones de tabs -->
    <div class="flex flex-col md:flex-row justify-center gap-4 my-4 animate-fade-in">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="switchTab(tab.id)"
        :class="[
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === tab.id
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Descripción de la gráfica seleccionada -->
    <div class="text-center max-w-2xl mx-auto mb-4 text-gray-700 animate-fade-in">
      <p class="text-md md:text-lg font-medium italic">{{ descripcionActual }}</p>
    </div>

    <!-- Contenedor del componente -->
    <div class="card bg-white rounded-xl shadow-lg p-4 md:p-6 min-h-[400px] relative border border-gray-200 sm:overflow-x-auto animate-fade-in">
      <transition name="fade">
        <div
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center bg-blue-400 bg-opacity-40 z-50 rounded-xl"
        >
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-10 w-10 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p class="text-white text-sm">Cargando gráfica...</p>
          </div>
        </div>
      </transition>

      <!-- Componente activo -->
      <component v-if="!loading" :is="activeComponent" />
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, markRaw, onMounted } from 'vue';
import OrganigramaHospital from '@/components/charts/OrganigramaHospital.vue';
import GrupoSanguineo from '@/components/charts/GrupoSanguineo.vue';
import GraficaNotasMedicas from '@/components/charts/GraficaNotasMedicas.vue';
import PacientesDoctor from '@/components/charts/PacientesDoctor.vue';

interface TabItem {
  id: string;
  label: string;
  component: any;
}

const tabs = ref<TabItem[]>([
  {
    id: 'organigrama',
    label: 'Organigrama',
    component: markRaw(OrganigramaHospital)
  },
  {
    id: 'sangre',
    label: 'Grupos Sanguíneos',
    component: markRaw(GrupoSanguineo)
  },
  {
    id: 'notas',
    label: 'Notas Médicas por diagnóstico',
    component: markRaw(GraficaNotasMedicas)
  },
  {
    id: 'pacientes',
    label: 'Pacientes Doctor',
    component: markRaw(PacientesDoctor)
  }
]);

const activeTab = ref<string>(tabs.value[0].id);
const loading = ref(false);

const activeComponent = computed(() => {
  return tabs.value.find(t => t.id === activeTab.value)?.component || null;
});

const switchTab = (tabId: string) => {
  if (activeTab.value === tabId) return;

  loading.value = true;
  activeTab.value = tabId;

  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

onMounted(() => {
  // Mostrar loading al iniciar la vista
  loading.value = true;

  // Simular tiempo de carga inicial (puedes ajustar los ms)
  setTimeout(() => {
    loading.value = false;
  }, 2000);
});

const descripciones: Record<string, string> = {
  organigrama: 'Visualiza la estructura jerárquica del personal del hospital.',
  sangre: 'Muestra los distintos grupos sanguíneos de los pacientes registrados.',
  notas: 'Gráfica de frecuencia de diagnósticos en las notas médicas emitidas.',
  pacientes: 'Lista los pacientes asignados a cada doctor en el sistema.'
};


const descripcionActual = computed(() => {
  return descripciones[activeTab.value] || '';
});


</script>


<style scoped>
.card {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.card {
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

</style>
