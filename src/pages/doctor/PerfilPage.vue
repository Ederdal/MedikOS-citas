<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <!-- Header del Perfil -->
    <div class="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
      <div class="h-32 bg-blue-400 relative animate-fade-right">
        <div class="absolute -bottom-12 left-6">
          <img
            :src="user.foto"
            class="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            alt="Foto de perfil"
          >
        </div>
      </div>
      <div class="pt-16 px-6 pb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ user.nombre_completo }}</h1>
            <p class="text-gray-600">{{ user.email }}</p>
            <br>
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {{ user.experiencia }} años de experiencia
            </span>
          </div>
          <button class="text-gray-400 hover:text-blue-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Secciones -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <!-- Columna izquierda: Info Personal -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Información Personal -->
        <div class="bg-white p-6 rounded-2xl shadow-md animate-slide-up text-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-black">Información Personal</h2>
          <p><strong>Teléfono:</strong> {{ user.telefono }}</p>
          <p><strong>Dirección:</strong> {{ user.direccion }}</p>
          <p><strong>Idiomas:</strong> {{ user.idiomas }}</p>
        </div>

        <!-- Biografía Profesional -->
        <div class="bg-white p-6 rounded-2xl shadow-md animate-slide-up text-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-black">Biografía Profesional</h2>
          <p>{{ user.biografia }}</p>
        </div>

        <!-- Reseñas -->
        <div class="bg-white p-6 rounded-2xl shadow-md animate-slide-up text-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-black">Reseñas de Pacientes</h2>
          <ul class="space-y-2 text-sm text-gray-700">
            <li v-for="(resena, index) in user.resenas" :key="index">{{ resena }}</li>
          </ul>
        </div>
      </div>

      <!-- Columna derecha: Especialidad + Certificaciones + Horario -->
      <div class="space-y-6">
        <!-- Especialidad -->
        <div class="bg-white p-6 rounded-2xl shadow-md animate-slide-up text-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-black">Especialidad</h2>
          <p>{{ user.especialidad }}</p>
          <p class="text-sm mt-1 text-gray-800">{{ user.descripcion_especialidad }}</p>
        </div>

        <!-- Certificaciones -->
        <div class="bg-white p-6 rounded-2xl shadow-md animate-slide-up text-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-black">Certificaciones</h2>
          <ul class="text-sm list-disc list-inside">
            <li v-for="(cert, index) in user.certificaciones" :key="index">{{ cert }}</li>
          </ul>
        </div>

        <!-- Horario Laboral -->
        <div class="bg-white p-6 rounded-2xl shadow-md animate-slide-up text-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-black">Horario Laboral</h2>
          <ul class="text-sm space-y-1">
            <li><strong>Lunes a Jueves:</strong> {{ user.horario.lunes_jueves }}</li>
            <li><strong>Viernes:</strong> {{ user.horario.viernes }}</li>
            <li><strong>Sábados:</strong> {{ user.horario.sabados }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: string
  nombre_completo: string
  email: string
  experiencia: number
  telefono: string
  direccion: string
  idiomas: string
  especialidad: string
  descripcion_especialidad: string
  certificaciones: string[]
  horario: {
    lunes_jueves: string
    viernes: string
    sabados: string
  }
  biografia: string
  resenas: string[]
  foto: string
}

// Valores por defecto (en espera de obtener los datos desde el endpoint)
const user = ref<User>({
  id: '',
  nombre_completo: 'Dr. Diego Mota',
  email: 'mota@gmail.com',
  experiencia: 10,
  telefono: '+52 55 1234 5678',
  direccion: 'Av. Médicos 123, CDMX',
  idiomas: 'Español, Inglés',
  especialidad: 'Medicina General',
  descripcion_especialidad: 'Con enfoque en atención preventiva y control de enfermedades crónicas.',
  certificaciones: [
    'Certificado por el Consejo Mexicano de Medicina General',
    'Curso en Urgencias Médicas (2022)',
    'Actualización en Telemedicina (2023)'
  ],
  horario: {
    lunes_jueves: '8:00 a.m. – 4:00 p.m.',
    viernes: '8:00 a.m. – 2:00 p.m.',
    sabados: 'Atención previa cita'
  },
  biografia: 'Médico general egresado de la Universidad Nacional de Medicina. Con 10 años de experiencia en atención primaria, diagnóstico clínico y manejo integral de pacientes. Participa activamente en jornadas médicas comunitarias.',
  resenas: [
    '🌟🌟🌟🌟🌟 — “Muy amable y profesional.”',
    '🌟🌟🌟🌟⭐ — “Atención excelente, resuelve todas tus dudas.”',
    '🌟🌟🌟🌟🌟 — “Lo recomiendo ampliamente.”'
  ],
  foto: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
})

onMounted(() => {
  // Aquí puedes realizar la llamada a tu endpoint para actualizar la información del usuario
})
</script>

<style scoped>
@keyframes fadeRight {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-fade-right {
  animation: fadeRight 0.6s ease-in-out both;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}
</style>
