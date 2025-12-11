<template>
  <div class="max-w-lg mx-auto p-4">
    <!-- Header con navegación -->
    <h2 class="text-xl font-bold text-black mb-4 text-center">Citas del mes</h2>
    <div class="flex items-center justify-between mb-4">
      <button @click="prevMonth" class="p-2 rounded-full hover:bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 class="text-2xl font-bold capitalize text-black">{{ monthYear }}</h2>
      <button @click="nextMonth" class="p-2 rounded-full hover:bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-2 text-center font-semibold text-gray-600">
      <div v-for="(day, index) in weekDays" :key="index">{{ day }}</div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="text-center text-gray-500 my-4">
      Cargando citas...
    </div>

    <!-- Cuadrícula de días -->
    <div v-else class="grid grid-cols-7 gap-2 mt-2">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        @click="selectDay(day)"
        :class="[
          'p-3 rounded-lg cursor-pointer transition-colors border border-gray-200',
          day.currentMonth ? getColorClass(day.appointments.length) : 'bg-gray-50 text-gray-400',
          isToday(day) ? 'ring-2 ring-blue-500' : ''
        ]"
      >
        <div class="text-sm font-medium">
          {{ day.date.getDate() }}
        </div>
        <div v-if="day.appointments.length" class="text-xs mt-1 font-light">
          {{ day.appointments.length }} cita<span v-if="day.appointments.length > 1">s</span>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar citas -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <!-- Contenedor del modal -->
      <div class="bg-white w-11/12 max-w-2xl p-8 rounded-lg shadow-xl relative">
        <h2 class="text-2xl font-bold mb-6 text-black">Citas del día</h2>
        <!-- Lista de citas en “cards” -->
        <div
          v-for="(appointment, i) in selectedAppointments"
          :key="i"
          class="border border-gray-300 p-4 mb-4 rounded-md"
        >
          <p class="text-black text-lg font-semibold mb-1">
            Observaciones: {{ appointment.observaciones }}
          </p>
          <p class="text-black text-base">
            Fecha Programada: {{ formatAppointmentDate(appointment.fecha_programada) }}
          </p>
          <!-- Agrega más campos si lo deseas (tipo, estatus, etc.) -->
        </div>
        <!-- Botón para cerrar el modal -->
        <button
          @click="closeModal"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast() as any

// Interfaces
interface Appointment {
  id: string
  personal_medico_id: string
  paciente_id: string
  servicio_medico_id: string
  folio: string
  tipo: string
  espacio_id: string
  fecha_programada: string
  observaciones: string
  fecha_inicio?: string
  fecha_termino?: string
  estatus?: string
  fecha_registro?: string
  fecha_actualizacion?: string
}

interface Day {
  date: Date
  currentMonth: boolean
  appointments: Appointment[]
}

// Variables principales
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth()) // 0 = Enero
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Título del mes
const monthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
})

// Mapa para citas (fecha => array de citas)
const appointmentsMap = ref<Record<string, Appointment[]>>({})
const loading = ref(false)

// Variables para el modal
const showModal = ref(false)
const selectedAppointments = ref<Appointment[]>([])

// Obtener el id del usuario desde el token en sessionStorage
let userId = ""
const token = sessionStorage.getItem('token')
if (token) {
  try {
    const payloadBase64 = token.split('.')[1]
    const payload = JSON.parse(atob(payloadBase64))
    userId = payload.persona_id
  } catch (error) {
    console.error('Error al decodificar el token:', error)
  }
}
console.log(userId)

// Función para formatear la fecha de cada cita
function formatAppointmentDate(dateStr: string): string {
  const dateObj = new Date(dateStr)
  return dateObj.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}

// Función para formatear un Date a "YYYY-MM-DD"
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Obtener las citas desde el backend utilizando el userId obtenido del token
async function fetchAppointments(year: number, month: number) {
  loading.value = true
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_URL}citas/by_month/${userId}`,
      { params: { year, month: month + 1 },
      headers: {
      Authorization: `Bearer ${token}`
    }
    }
    )
    const data: Appointment[] = response.data
    console.log('Citas obtenidas:', data)
    // Organizar las citas en un mapa indexado por fecha (YYYY-MM-DD)
    const map: Record<string, Appointment[]> = {}
    data.forEach((item) => {
      const dateKey = item.fecha_programada.split('T')[0]
      if (!map[dateKey]) {
        map[dateKey] = []
      }
      map[dateKey].push(item)
    })
    appointmentsMap.value = map
  } catch (error) {
    console.error('Error al obtener citas:', error)
    appointmentsMap.value = {}
  } finally {
    loading.value = false
  }
}

// Generar los días del calendario
const calendarDays = computed<Day[]>(() => {
  const days: Day[] = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const startDayIndex = firstDayOfMonth.getDay() // 0 = Domingo

  // Días del mes anterior
  const prevMonth = currentMonth.value === 0 ? 11 : currentMonth.value - 1
  const prevYear = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const date = new Date(prevYear, prevMonth, daysInPrevMonth - i)
    days.push({
      date,
      currentMonth: false,
      appointments: appointmentsMap.value[formatDate(date)] || []
    })
  }

  // Días del mes actual
  const daysInCurrentMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i)
    days.push({
      date,
      currentMonth: true,
      appointments: appointmentsMap.value[formatDate(date)] || []
    })
  }

  // Días del mes siguiente para completar la cuadrícula
  while (days.length % 7 !== 0) {
    const nextMonth = currentMonth.value === 11 ? 0 : currentMonth.value + 1
    const nextYear = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value
    const dayNumber = days.length - (startDayIndex + daysInCurrentMonth) + 1
    const date = new Date(nextYear, nextMonth, dayNumber)
    days.push({
      date,
      currentMonth: false,
      appointments: appointmentsMap.value[formatDate(date)] || []
    })
  }

  return days
})

// Asignar clases de color según la cantidad de citas
function getColorClass(appointmentsCount: number): string {
  if (appointmentsCount === 0) {
    return 'bg-gray-100 text-gray-600'
  } else if (appointmentsCount < 3) {
    return 'bg-blue-100 text-blue-800'
  } else if (appointmentsCount < 5) {
    return 'bg-blue-200 text-blue-900'
  } else {
    return 'bg-red-200 text-red-900'
  }
}

// Navegar al mes anterior
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// Navegar al mes siguiente
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Actualizar las citas al cambiar mes o año
watch([currentYear, currentMonth], () => {
  fetchAppointments(currentYear.value, currentMonth.value)
}, { immediate: true })

// Seleccionar un día
function selectDay(day: Day) {
  if (day.appointments.length) {
    selectedAppointments.value = day.appointments
    showModal.value = true
  } else {
    toast.info(`No hay citas para ${formatDate(day.date)}`)
  }
}

// Cerrar el modal
function closeModal() {
  showModal.value = false
}

// Verificar si es el día actual
function isToday(day: Day): boolean {
  const todayDate = new Date()
  return day.date.toDateString() === todayDate.toDateString()
}
</script>

<style scoped>
/* Personaliza estilos de tu modal o tarjetas según desees */
</style>
