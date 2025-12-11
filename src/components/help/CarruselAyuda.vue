<template>
  <div class="mt-10 flex flex-col justify-center items-center w-full">
    <!-- Título del carrusel -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-10 -mt-5">
      Áreas que maneja el hospital
    </h2>

    <!-- Carrusel de imágenes -->
    <div class="relative flex items-center justify-center space-x-10 w-[500px] h-[220px] overflow-hidden">
      <!-- Imagen izquierda -->
      <img
        :src="visibleImages[0]"
        alt="prev"
        class="w-28 h-28 rounded-full object-cover opacity-60 scale-90 transition-all duration-500"
      />
      <!-- Imagen central -->
      <img
        :src="visibleImages[1]"
        alt="main"
        class="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-500 z-10"
      />
      <!-- Imagen derecha -->
      <img
        :src="visibleImages[2]"
        alt="next"
        class="w-28 h-28 rounded-full object-cover opacity-60 scale-90 transition-all duration-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import sm1 from '@/assets/img/sm1.png'
import sm2 from '@/assets/img/sm2.png'
import sm3 from '@/assets/img/sm3.png'
import sm4 from '@/assets/img/sm4.png'
import sm5 from '@/assets/img/sm5.png'
import sm6 from '@/assets/img/sm6.png'
import sm7 from '@/assets/img/sm7.png'
import sm8 from '@/assets/img/sm8.png'

const images = [sm1, sm2, sm3, sm4, sm5, sm6, sm7, sm8]

const currentIndex = ref(0)

const visibleImages = computed(() => {
  const len = images.length
  const prev = images[(currentIndex.value + len - 1) % len]
  const current = images[currentIndex.value]
  const next = images[(currentIndex.value + 1) % len]
  return [prev, current, next]
})

let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length
  }, 2500)
})

onUnmounted(() => {
  clearInterval(interval)
})

</script>
