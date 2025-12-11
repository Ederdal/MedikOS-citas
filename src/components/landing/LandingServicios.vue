<template>
  <div class="max-w-7xl mx-auto">
    <h2 class="text-3xl font-semibold text-center text-gray-800 mb-2">Nuestros Servicios</h2>
    <br>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="(servicio, i) in servicios" :key="i" class="bg-white p-5 rounded-md shadow hover:shadow-lg transition duration-300">
        <p class="text-lg text-gray-800">
          <span class="font-semibold">{{ servicio.titulo }}:</span><br>{{ servicio.descripcion }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Servicio {
  titulo: string
  descripcion: string
}

const servicios: Servicio[] = [
  { titulo: 'Consulta General', descripcion: 'Atención primaria y diagnóstico de enfermedades comunes.' },
  { titulo: 'Especialidades Médicas', descripcion: 'Cardiología, Pediatría, Ginecología, Neurología y más.' },
  { titulo: 'Emergencias', descripcion: 'Servicio de urgencias las 24 horas.' },
  { titulo: 'Laboratorio Clínico', descripcion: 'Análisis de sangre y estudios de laboratorio.' },
  { titulo: 'Imagenología', descripcion: 'Radiografías, ultrasonidos y resonancias magnéticas.' },
  { titulo: 'Rehabilitación Física', descripcion: 'Terapias para recuperación de movilidad y dolor.' },
  { titulo: 'Cirugías', descripcion: 'Procedimientos quirúrgicos con equipos de última generación.' },
  { titulo: 'Personal', descripcion: 'Contamos con un personal capacitado y capaz de hacer su trabajo.' }
]
</script>
