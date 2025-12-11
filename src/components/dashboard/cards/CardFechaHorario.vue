<template>
  <div class="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-fade-in">
    <h2 class="text-2xl font-bold text-blue-500 mb-4">📅 Agenda del Día</h2>
    <div class="space-y-4 text-sm">
      <div class="flex items-center justify-between">
        <span class="text-gray-600">📆 Fecha:</span>
        <span class="font-medium text-blue-600">{{ formattedDate }}</span>
      </div>

      <div class="h-px bg-gray-200 my-2"></div>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-800">🧾 Notas médicas generadas:</span>
          <span class="font-semibold text-gray-700">{{ notasMedicas }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-800">⏳ Pacientes en espera:</span>
          <span class="font-semibold text-orange-500">{{ pacientesEspera }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-800">📍 Consultorios activos:</span>
          <span class="font-semibold text-gray-700">{{ consultorios }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-800">✅ Consultas finalizadas:</span>
          <span class="font-semibold text-green-600">{{ consultasFinalizadas }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-800">📉 Reprogramaciones:</span>
          <span class="font-semibold text-yellow-500">{{ reprogramaciones }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-800">❌ Cancelaciones:</span>
          <span class="font-semibold text-red-500">{{ cancelaciones }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-800">📈 Hora pico:</span>
          <span class="font-semibold text-gray-700">{{ horaPico }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  setup() {
    const formattedDate = computed(() =>
      new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    )

    const notasMedicas = ref(0)
    const pacientesEspera = ref(0)
    const consultorios = ref(0)
    const consultasFinalizadas = ref(0)
    const reprogramaciones = ref(0)
    const cancelaciones = ref(0)
    const horaPico = ref('')

    const horasPicoEjemplo = ['09:00 AM', '10:30 AM', '12:00 PM', '04:00 PM']

    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

    const actualizarDatos = () => {
      notasMedicas.value = randomInt(10, 40)
      pacientesEspera.value = randomInt(1, 10)
      consultorios.value = randomInt(3, 10)
      consultasFinalizadas.value = randomInt(5, 25)
      reprogramaciones.value = randomInt(0, 5)
      cancelaciones.value = randomInt(0, 3)
      horaPico.value = horasPicoEjemplo[Math.floor(Math.random() * horasPicoEjemplo.length)]
    }

    onMounted(() => {
      actualizarDatos()
      setInterval(actualizarDatos, 5000)
    })

    return {
      formattedDate,
      notasMedicas,
      pacientesEspera,
      consultorios,
      consultasFinalizadas,
      reprogramaciones,
      cancelaciones,
      horaPico
    }
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out both;
}
</style>
