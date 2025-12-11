<template>
  <h2 class="text-xl font-semibold text-gray-800 mb-4">👨⚕️ Médicos en Turno</h2>
        <div class="space-y-4">
          <div v-for="(doctor, index) in visibleDoctors" :key="index"
            class="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <img :src="doctor.photo" class="w-10 h-10 rounded-full object-cover">
            <div>
              <p class="font-medium text-gray-800">{{ doctor.name }}</p>
              <p class="text-sm text-gray-600">{{ doctor.specialty }}</p>
            </div>
            <span class="ml-auto text-sm" :class="{
              'text-green-600': doctor.status === 'Disponible',
              'text-gray-400': doctor.status === 'En consulta'
            }">{{ doctor.status }}</span>
          </div>
          <button @click="toggleDoctors"
            class="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            {{ showAllDoctors ? 'Ver menos' : 'Ver todos' }}
          </button>
        </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'

// Datos de ejemplo
const doctors = ref([
  { name: 'Dr. Juan Pérez', specialty: 'Cardiología', status: 'Disponible', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { name: 'Dra. María Gómez', specialty: 'Pediatría', status: 'En consulta', photo: 'https://randomuser.me/api/portraits/women/75.jpg' },
  { name: 'Dr. Carlos Ruiz', specialty: 'Cirugía', status: 'Disponible', photo: 'https://randomuser.me/api/portraits/men/76.jpg' },
  { name: 'Dra. Laura Díaz', specialty: 'Neurología', status: 'Disponible', photo: 'https://randomuser.me/api/portraits/women/76.jpg' }
])

const showAllDoctors = ref(false)

// Computed
const visibleDoctors = computed(() =>
  showAllDoctors.value ? doctors.value : doctors.value.slice(0, 2)
)

// Método
const toggleDoctors = () => {
  showAllDoctors.value = !showAllDoctors.value
}
export default {
  setup() {
    return {
      visibleDoctors,
      toggleDoctors,
      showAllDoctors
    };
  }
}
</script>
