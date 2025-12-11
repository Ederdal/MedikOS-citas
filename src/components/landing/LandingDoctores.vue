<template>
  <div class="flex flex-wrap justify-center gap-4 mb-12">
    <img
      v-for="(doctor, i) in doctores"
      :key="i"
      :src="doctor"
      alt="doctor"
      class="w-30 h-30 rounded-full border-4 border-blue-200 shadow-md hover:scale-105 transition duration-300"
    />
  </div>
</template>

<script setup lang="ts">
import doctor1 from '@/assets/img/doctor1.jpg'
import doctor2 from '@/assets/img/doctor2.jpg'
import doctor3 from '@/assets/img/doctor3.png'
import doctor4 from '@/assets/img/doctor4.png'
import doctor5 from '@/assets/img/doctor5.png'
import doctor6 from '@/assets/img/doctor6.png'
import doctora1 from '@/assets/img/doctora1.avif'
import doctora2 from '@/assets/img/doctora2.jpg'

const doctores: string[] = [
  doctor1, doctor2, doctor3, doctor4,
  doctor5, doctor6, doctora1, doctora2
]
</script>
