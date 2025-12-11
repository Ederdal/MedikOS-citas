<template>
  <h1 class="text-5xl font-bold text-gray-900 mb-2">Citas Médicas</h1>
  <p class="text-gray-500 mb-8">Visualización de las citas médicas registradas por el Doctor.</p>
  <!-- Filtros -->
  <div class="flex gap-2 flex-wrap mb-6">
    <button @click="selectedStatus = 'Todas'" :class="[
      'px-4 py-2 rounded-full text-sm font-medium transition',
      selectedStatus === 'Todas'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 hover:bg-blue-100 text-gray-600'
    ]">
      Todas
    </button>
    <button v-for="status in statuses" :key="status" @click="selectedStatus = status" :class="[
      'px-4 py-2 rounded-full text-sm font-medium transition',
      selectedStatus === status
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 hover:bg-blue-100 text-gray-600'
    ]">
      {{ status }}
    </button>

  </div>

  <!-- Grid de tarjetas estilo moderno -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <div v-for="cita in filteredCitas" :key="cita.id"
      class="bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition p-5 flex flex-col justify-between group cursor-pointer border border-gray-100"
      @click="abrirDetalle(cita)">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
          {{ cita.tipo }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          <strong>Estatus:</strong> {{ cita.estatus }}
        </p>
        <p class="text-sm text-gray-500 mt-1">
          <strong>Paciente:</strong> {{ cita.paciente_id }}
        </p>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <span class="text-xs text-gray-400">
          {{ formatFecha(cita.fecha_programada) }}
        </span>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <!-- Modal detallado -->
  <div v-if="citaSeleccionada" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
    @click.self="cerrarDetalle">
    <div
      class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative animate-fade-in-up border border-blue-100">

      <!-- Botón cerrar -->
      <button class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl" @click="cerrarDetalle"
        aria-label="Cerrar">
        ✕
      </button>

      <!-- Encabezado -->
      <div class="flex items-center gap-4 mb-6 border-b pb-4">
        <div class="bg-blue-100 text-blue-600 rounded-full p-3">
          📄
        </div>
        <div>
          <h3 class="text-2xl font-bold text-black">Ficha de Cita Médica</h3>
          <p class="text-sm text-gray-500">Folio: <span class="font-medium">{{ citaSeleccionada.folio }}</span></p>
        </div>
      </div>

      <!-- Detalles en secciones -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
        <!-- Columna izquierda -->
        <div>
          <h4 class="text-sm text-gray-500 uppercase tracking-wide mb-1">Información general</h4>
          <div class="space-y-2">
            <p><strong class="text-blue-500">Tipo:</strong> {{ citaSeleccionada.tipo }}</p>
            <p><strong class="text-blue-500">Estatus:</strong> {{ citaSeleccionada.estatus }}</p>
            <p><strong class="text-blue-500">Fecha Programada:</strong> {{
              formatFecha(citaSeleccionada.fecha_programada) }}</p>
            <p v-if="citaSeleccionada.fecha_termino"><strong class="text-blue-500">Fecha Término:</strong> {{
              formatFecha(citaSeleccionada.fecha_termino) }}</p>
          </div>
        </div>

        <!-- Columna derecha -->
        <div>
          <h4 class="text-sm text-gray-500 uppercase tracking-wide mb-1">Participantes</h4>
          <div class="space-y-2">
            <p><strong class="text-blue-500">Médico Asignado:</strong> {{ citaSeleccionada.personal_medico_id }}</p>
            <p><strong class="text-blue-500">Paciente:</strong> {{ citaSeleccionada.paciente_id }}</p>
          </div>
        </div>

        <!-- Observaciones (col-span-2 para pantalla ancha) -->
        <div class="md:col-span-2">
          <h4 class="text-sm text-gray-500 uppercase tracking-wide mb-1">Observaciones</h4>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
            {{ citaSeleccionada.observaciones || 'Sin observaciones registradas.' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

interface CitaMedica {
  id: string
  folio: string
  tipo: string
  fecha_programada: string | null
  fecha_termino: string | null
  observaciones: string
  estatus: string
  personal_medico_id: string
  paciente_id: string
}

const citas = ref<CitaMedica[]>([])
const citaSeleccionada = ref<CitaMedica | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Agrega o quita los estados que necesites
const statuses = ['Programada', 'Reprogramada', 'Atendida', 'Cancelada']
const selectedStatus = ref('Todas')

// Cargar citas desde el backend
const obtenerCitas = async () => {
  loading.value = true
  const token = localStorage.getItem('token')

  try {
    const { data } = await axios.get<CitaMedica[]>(`${import.meta.env.VITE_URL}citas/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    citas.value = data
  } catch (err) {
    error.value = 'Error al obtener citas médicas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  obtenerCitas()
})

// Filtro por estado
const filteredCitas = computed(() => {
  if (selectedStatus.value === 'Todas') return citas.value
  return citas.value.filter(c => c.estatus === selectedStatus.value)
})

// Al hacer clic en una tarjeta, abrimos el modal con los detalles
const abrirDetalle = (cita: CitaMedica) => {
  citaSeleccionada.value = cita
}

// Cerrar el modal
const cerrarDetalle = () => {
  citaSeleccionada.value = null
}

// Formatear fecha
const formatFecha = (fecha: string | null): string => {
  if (!fecha) return '-'
  const hasTimeZone = fecha.endsWith('Z') || /([+-]\d{2}:?\d{2})$/.test(fecha)
  const fechaConZona = hasTimeZone ? fecha : `${fecha}Z`
  const date = new Date(fechaConZona)
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* Ajusta estilos a tu gusto */
</style>
