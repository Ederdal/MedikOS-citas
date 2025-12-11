<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Médico General - Chat</h2>

    <hr class="my-4" />

    <h3 class="text-lg font-semibold text-gray-800">Pacientes en Chat:</h3>
    <ul class="mb-4">
      <li
        v-for="patientId in Object.keys(patients)"
        class="text-gray-800"
        :key="patientId"
        @click="selectPatient(patientId)"
        :class="{
          'cursor-pointer p-2 rounded': true,
          'bg-green-200': patientId === selectedPatient,
          'hover:bg-gray-200': patientId !== selectedPatient,
        }"
      >
        Paciente: {{ patientId }}
      </li>
    </ul>

    <h3 class="text-lg font-semibold text-gray-800 mb-2">Chat:</h3>
    <div
      ref="chatContainer"
      class="bg-white border rounded p-4 h-[50vh] overflow-y-auto flex flex-col-reverse space-y-reverse space-y-2"
    >
      <div
        v-for="(msg, index) in chatBox"
        :key="index"
        :class="[
          'px-4 py-2 rounded-lg shadow text-sm max-w-[70%] transition-all duration-300 ease-in-out',
          msg.startsWith('Tú:') ? 'self-end bg-blue-400 text-white' : 'self-start bg-gray-200 text-gray-800'
        ]"
      >
        {{ msg }}
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <input
        v-model="responseMessage"
        type="text"
        placeholder="Escribe tu respuesta"
        class="border p-2 w-full text-gray-800 rounded"
      />
      <button @click="sendResponse" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
        Responder
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

interface PatientsMap {
  [key: string]: string[]
}

const token = sessionStorage.getItem('token') || ''
const ws = ref<WebSocket | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clientId = ref(sessionStorage.getItem('id') || '')
const patients = ref<PatientsMap>({})
const selectedPatient = ref('')
const responseMessage = ref('')

const chatBox = computed(() => {
  if (selectedPatient.value && patients.value[selectedPatient.value]) {
    return patients.value[selectedPatient.value]
  }
  return []
})

const chatContainer = ref<HTMLElement | null>(null)

watch(chatBox, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})

onMounted(() => {
  if (token) connect()
})

const connect = () => {
  ws.value = new WebSocket(`ws://localhost:8000/ws?token=${token}`)

  ws.value.onopen = () => {
    console.log('Conectado al WebSocket')
  }

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.from) {
      if (!patients.value[data.from]) {
        patients.value[data.from] = []
      }
      patients.value[data.from].push(data.message)
    }
  }

  ws.value.onclose = () => {
    console.log('Conexión cerrada')
  }

  ws.value.onerror = (error) => {
    console.error('Error en WebSocket:', error)
  }
}

const selectPatient = (patientId: string) => {
  selectedPatient.value = patientId
}

const sendResponse = () => {
  if (!selectedPatient.value) {
    alert('Selecciona un paciente')
    return
  }
  if (!responseMessage.value.trim()) {
    alert('Escribe un mensaje')
    return
  }
  ws.value?.send(
    JSON.stringify({
      to: selectedPatient.value,
      message: responseMessage.value,
    })
  )
  patients.value[selectedPatient.value].push(`Tú: ${responseMessage.value}`)
  responseMessage.value = ''
}
</script>

<style scoped>
@keyframes slide-right {
  0% {
    transform: translateX(50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-left {
  0% {
    transform: translateX(-50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-right {
  animation: slide-right 0.3s ease;
}
.animate-slide-left {
  animation: slide-left 0.3s ease;
}
</style>
