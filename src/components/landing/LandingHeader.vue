<template>
  <div class="text-center mb-10">
    <img :src="hospIcon" alt="icon" class="mx-auto w-40 mb-4" />
    <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Atención Médica de Calidad</h1>
    <p class="text-gray-600 mt-2 mx-auto text-xl">
  <span class="font-semibold text-xl">MedikOS</span> ofrece atención integral con profesionales altamente capacitados y tecnología de punta.
  Nuestro compromiso es garantizar tu salud, proporcionándote servicios médicos en un <span class="font-semibold">entorno moderno, seguro y confiable</span>.
</p>

  </div>
</template>

<script setup lang="ts">
import hospIcon from '@/assets/img/medikosgrande.png';
</script>
