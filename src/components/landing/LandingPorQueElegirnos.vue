<template>
  <div class="text-center mb-6">
    <h2 class="text-3xl font-semibold text-black">¿Por qué elegirnos?</h2>
    <br><br>
    <p class="text-gray-700 mx-auto text-xl">
        En <span class="font-semibold text-xl">MedikOS</span>, nos dedicamos a brindar atención médica de excelencia con un enfoque humano y tecnología de vanguardia.
      </p>
    <br>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
    <div v-for="(item, i) in razones" :key="i" class="bg-white p-5 rounded-md shadow hover:shadow-lg transition duration-300">
      <h3 class="font-semibold text-gray-800 mb-1 text-lg">{{ item.titulo }}</h3>
      <p class="text-lg text-gray-800">{{ item.descripcion }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Razon {
  titulo: string
  descripcion: string
}

const razones: Razon[] = [
  { titulo: 'Equipo Médico Especializado', descripcion: 'Profesionales altamente capacitados en diversas especialidades.' },
  { titulo: 'Infraestructura Moderna', descripcion: 'Equipadas con la más alta tecnología para diagnósticos precisos.' },
  { titulo: 'Atención 24/7', descripcion: 'Urgencias disponibles todo el día, todos los días.' },
  { titulo: 'Programas de Salud', descripcion: 'Planes de prevención y bienestar para ti y tu familia.' },
  { titulo: 'Investigación y Desarrollo', descripcion: 'Tratamientos innovadores para mejores soluciones.' },
  { titulo: 'Seguridad y Confianza', descripcion: 'Protocolos estrictos de bioseguridad y cuidado del paciente.' }
]
</script>
