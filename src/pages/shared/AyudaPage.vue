<template>
    <!-- Encabezado -->
  <div class="bg-gray-50 min-h-screen py-10 px-6 text-gray-800">
    <!-- Encabezado -->
    <div class="text-center mb-10">
      <h1 class="text-6xl font-extrabold text-gray-900 mb-10">¿Necesitas ayuda?</h1>
      <div class="flex justify-center max-w-xl mx-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="¿Cómo podemos ayudarte?"
          class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
        />
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg">
          Buscar
        </button>
      </div>
    </div>

    <div class="animate-fade-in">
      <SeccionesAyuda />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative animate-fade-in">
      <PreguntasFrecuentes
        :preguntas="preguntas"
        :preguntasFiltradas="preguntasFiltradas"
        :preguntaSeleccionada="preguntaSeleccionada"
        @seleccionar="preguntaSeleccionada = $event"
        @cerrar="preguntaSeleccionada = null"
      />

      <div class="relative">
        <CarruselAyuda />
        <VentanaChatbot v-if="mostrarChat" @cerrar="mostrarChat = false" />
      </div>
    </div>

    <ChatbotFlotante @abrir="mostrarChat = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const preguntas = ref([
  {
    pregunta: '¿Cómo puedo agendar una cita con un especialista?',
    respuesta: 'Puedes agendar una cita ingresando al módulo de Citas Médicas, seleccionando el especialista y el horario disponible que prefieras.'
  },
  {
    pregunta: '¿Qué debo hacer si necesito cancelar o reprogramar mi cita?',
    respuesta: 'Puedes cancelar o reprogramar desde tu perfil en la sección de Citas. También puedes llamar a recepción si necesitas asistencia.'
  },
  {
    pregunta: '¿El hospital acepta mi seguro médico?',
    respuesta: 'Sí, trabajamos con múltiples aseguradoras. Puedes consultar la lista completa en nuestra sección de seguros aceptados.'
  },
  {
    pregunta: '¿Cómo puedo obtener mis resultados de laboratorio o estudios médicos?',
    respuesta: 'Tus resultados estarán disponibles en el portal en línea dentro de la sección de Resultados Médicos, normalmente 24 a 48 horas después.'
  },
  {
    pregunta: '¿Dónde puedo encontrar información sobre los servicios de emergencia del hospital?',
    respuesta: 'En la sección de Servicios puedes encontrar la ubicación, contacto y disponibilidad de nuestro servicio de emergencias 24/7.'
  },
  {
    pregunta: '¿Qué debo llevar conmigo a la cita médica?',
    respuesta: 'Debes llevar tu identificación oficial, tarjeta del seguro médico (si aplica) y tus estudios o recetas anteriores si tienes.'
  },
  {
    pregunta: '¿Cuál es el horario de atención del hospital?',
    respuesta: 'El hospital está abierto de lunes a viernes de 7:00 a.m. a 9:00 p.m. y sábados de 8:00 a.m. a 4:00 p.m.'
  },
  {
    pregunta: '¿Cómo puedo contactar con el departamento de facturación para preguntas sobre mi factura?',
    respuesta: 'Puedes escribir un correo a facturacion@hospital.com o marcar al número directo del área de facturación que se encuentra en Contacto.'
  },
  {
    pregunta: '¿El hospital tiene algún servicio de transporte para pacientes?',
    respuesta: 'Sí, ofrecemos un servicio de transporte para pacientes con previa solicitud. Puedes agendarlo al momento de programar tu cita.'
  },
  {
    pregunta: '¿Dónde puedo obtener información sobre los programas de salud y prevención que ofrece el hospital?',
    respuesta: 'En nuestra sección de Bienestar y Prevención encontrarás talleres, campañas y programas mensuales disponibles para ti.'
  }
])


const searchTerm = ref('')
const preguntaSeleccionada = ref<number | null>(null)
const mostrarChat = ref(false)

const preguntasFiltradas = computed(() =>
  preguntas.value.filter(p =>
    p.pregunta.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
