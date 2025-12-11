<template>
  <div>
    <h1 class="text-5xl font-bold mb-4 text-black mt-6 ml-6">Registrar Cita Médica</h1>
    <div class="w-full flex flex-col md:flex-row gap-6 p-6 bg-gray-100">
      <!-- Formulario -->
      <div class="w-full md:w-3/4 bg-white rounded-xl shadow-md p-6 animate-fade-in border border-blue-100">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Paciente: campo con autocompletado -->
            <div>
              <label class="block text-gray-700">Paciente</label>
              <input v-model="pacienteBusqueda" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800"
                @input="onPacienteInput" @blur="hideSuggestions" autocomplete="off" />
              <ul v-if="showSuggestions" class="border border-gray-300 mt-1 rounded-md bg-white">
                <li v-for="persona in personasOptions" :key="persona.id" @mousedown.prevent="selectPersona(persona)"
                  class="px-3 py-2 hover:bg-gray-200 cursor-pointer">
                  <p class="text-black">{{ persona.nombre }} {{ persona.primer_apellido }} {{ persona.segundo_apellido || '' }}</p>
                </li>
              </ul>
              <p v-if="errors.paciente" class="text-red-500 text-sm">{{ errors.paciente }}</p>
            </div>

            <!-- Servicio Médico -->
            <div>
              <label class="block text-gray-700">Servicio Médico</label>
              <select v-model="form.servicio"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800"
                @blur="validateField('servicio')">
                <option disabled value="">Seleccione un servicio</option>
                <option v-for="servicio in servicios" :key="servicio.id" :value="servicio.id">
                  {{ servicio.nombre }}
                </option>
              </select>
              <p v-if="errors.servicio" class="text-red-500 text-sm">{{ errors.servicio }}</p>
            </div>

            <!-- Tipo -->
            <div>
              <label class="block text-gray-700">Tipo</label>
              <select v-model="form.tipo"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800"
                @blur="validateField('tipo')">
                <option disabled value="">Seleccione</option>
                <option>Revisión</option>
                <option>Diagnóstico</option>
                <option>Tratamiento</option>
                <option>Rehabilitación</option>
                <option>Preoperatoria</option>
                <option>Postoperatoria</option>
                <option>Proceminientos</option>
                <option>Seguimiento</option>
              </select>
              <p v-if="errors.tipo" class="text-red-500 text-sm">{{ errors.tipo }}</p>
            </div>

            <!-- Espacio -->
            <div>
              <label class="block text-gray-700">Espacio</label>
              <select v-model="form.espacio"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800"
                @blur="validateField('espacio')">
                <option disabled value="">Seleccione un espacio</option>
                <option v-for="espacio in espacios" :key="espacio.id" :value="espacio.id">
                  {{ espacio.nombre }}
                </option>
              </select>
              <p v-if="errors.espacio" class="text-red-500 text-sm">{{ errors.espacio }}</p>
            </div>

            <!-- Fecha -->
            <div class="relative">
              <label class="block text-gray-700 mb-1">Fecha</label>
              <div class="flex items-center gap-2">
                <input v-model="form.fecha" type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800"
                  @blur="validateField('fecha')" />
                <button type="button" class="bg-blue-400 text-white px-3 py-2 rounded-md hover:bg-blue-500 transition"
                  @click="showCalendar = !showCalendar">
                  📅
                </button>
              </div>
              <p v-if="errors.fecha" class="text-red-500 text-sm">{{ errors.fecha }}</p>
              <div v-if="showCalendar"
                class="calendar-dropdown absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 p-2 z-50 text-gray-800">
                <FullCalendar :options="calendarOptions" />
              </div>
            </div>

            <!-- Observaciones -->
            <div class="md:col-span-2">
              <label class="block text-gray-700">Observaciones</label>
              <textarea v-model="form.observaciones" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800"
                @blur="validateField('observaciones')"></textarea>
              <p v-if="errors.observaciones" class="text-red-500 text-sm">{{ errors.observaciones }}</p>
            </div>
          </div>

          <!-- Botón -->
          <button type="submit" :disabled="!isFormValid"
            class="w-full py-2 rounded-md shadow-sm transition-all text-white bg-blue-400 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            Registrar cita
          </button>
        </form>
      </div>

      <!-- Próximas citas -->
      <div class="w-full md:w-1/4 bg-white rounded-xl shadow-md p-6 animate-fade-on border border-gray-200 self-start">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">📅 Próximas citas</h3>
        <ul class="space-y-3 text-sm">
          <li v-for="(cita, i) in citasProximas" :key="i" class="flex items-center gap-2">
            <img :src="user" alt="icono usuario" class="w-6 h-6" />
            <span class="text-gray-800">{{ cita.nombre }} - {{ cita.hora }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { buscarPersonas, registrarCita, obtenerServicios, obtenerEspacios, obtenerCitasProximas } from '@/services/api/citasService'
import user from '@/assets/img/user.png'

// Usuario de sesión (ejemplo, extraído del token)
const sessionUser = {
  persona_id: '83834a57-0a86-11f0-ba03-c01850938fa1'
}

interface FormData {
  paciente: string  // Se almacenará el ID del paciente seleccionado
  servicio: string
  tipo: string
  espacio: string
  fecha: string
  observaciones: string
}

const form = reactive<FormData>({
  paciente: '',
  servicio: '',
  tipo: '',
  espacio: '',
  fecha: '',
  observaciones: ''
})

const errors = reactive<Record<string, string>>({})

const validateField = (field: keyof FormData) => {
  errors[field] = form[field] ? '' : 'Este campo es obligatorio'
}

const validateForm = () => {
  let valid = true
  Object.keys(form).forEach((field) => {
    validateField(field as keyof FormData)
    if (!form[field as keyof FormData]) valid = false
  })
  return valid
}

const isFormValid = computed(() =>
  Object.keys(form).every(key => form[key as keyof FormData] && !errors[key])
)

// Variables para autocompletado del paciente
const pacienteBusqueda = ref('')  // Texto ingresado para buscar
const personasOptions = ref<Array<any>>([])  // Opciones filtradas del backend
const showSuggestions = ref(false)

const onPacienteInput = async () => {
  if (pacienteBusqueda.value.length >= 2) {
    try {
      const data = await buscarPersonas(pacienteBusqueda.value)
      personasOptions.value = data
      showSuggestions.value = true
    } catch (error) {
      console.error('Error al buscar personas:', error)
      personasOptions.value = []
      showSuggestions.value = false
    }
  } else {
    personasOptions.value = []
    showSuggestions.value = false
  }
}

const selectPersona = (persona: any) => {
  form.paciente = persona.id // Guarda el ID de la persona seleccionada
  pacienteBusqueda.value = `${persona.nombre} ${persona.primer_apellido} ${persona.segundo_apellido }`
  showSuggestions.value = false
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 100)
}

// Variables para otros selects y citas
const servicios = ref<Array<{ id: string; nombre: string }>>([])
const espacios = ref<Array<{ id: string; nombre: string }>>([])
const citasProximas = ref<Array<{ nombre: string; hora: string; fecha: string }>>([])

const showCalendar = ref(false)
const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: { left: 'prev', center: 'title', right: 'next' },
  aspectRatio: 2.5,
  contentHeight: 220,
  events: citasProximas.value.map(cita => ({
    title: `Cita: ${cita.nombre}`,
    start: cita.fecha,
    color: '#3B82F6'
  })),
  selectable: true,
  dateClick: (info: any) => {
    form.fecha = info.dateStr
    showCalendar.value = false
  }
})

// Función para registrar la cita
const handleSubmit = async () => {
  if (!validateForm()) return

  const payload = {
    personal_medico_id: sessionUser.persona_id,
    paciente_id: form.paciente,
    servicio_medico_id: form.servicio,
    folio: `FOLIO-${new Date().getTime()}`,
    tipo: form.tipo,
    espacio_id: form.espacio,
    fecha_programada: new Date(form.fecha).toISOString(),
    observaciones: form.observaciones
  }

  try {
    await registrarCita(payload)
    alert(`✅ Cita registrada para el ${form.fecha}`)
    // Opcional: refrescar citas próximas
    fetchCitasProximas()
  } catch (err) {
    alert('❌ Ocurrió un error al registrar la cita.')
  }
}

// Funciones para obtener datos desde el backend
const fetchServicios = async () => {
  try {
    const data = await obtenerServicios()
    // Transformamos cada objeto para tener propiedades en minúsculas
    servicios.value = data.map((s: any) => ({
      id: s.ID,
      nombre: s.Nombre,
      // Puedes incluir otros campos si los necesitas
      observaciones: s.Observaciones,
      descripcion: s.Descripcion
    }))
    console.log('Servicios obtenidos:', servicios.value)
  } catch (error) {
    console.error('Error al obtener servicios:', error)
  }
}



const fetchEspacios = async () => {
  try {
    const data = await obtenerEspacios()
    espacios.value = data.map((s: any) => ({
      id: s.ID,
      nombre: s.Nombre,
      // Puedes incluir otros campos si los necesitas
      observaciones: s.Observaciones,
      descripcion: s.Descripcion
    }))
    console.log('Espacios obtenidos:', data)
  } catch (error) {
    console.error('Error al obtener espacios:', error)
  }
}

const fetchCitasProximas = async () => {
  try {
    const data = await obtenerCitasProximas(sessionUser.persona_id)
    citasProximas.value = data
  } catch (error) {
    console.error('Error al obtener citas próximas:', error)
  }
}

onMounted(() => {
  fetchServicios()
  fetchEspacios()
  fetchCitasProximas()
})
</script>

<style scoped>
/* Tus estilos existentes */
</style>
