<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Paciente - Chat</h2>

    <hr class="my-4" />

    <h3 class="text-lg font-semibold text-gray-800">Doctores Conectados:</h3>
    <ul class="mb-4 text-gray-800">
      <li
        v-for="doctor in doctors"
        :key="doctor.client_id"
        @click="selectDoctor(doctor.client_id)"
        :class="{
          'cursor-pointer p-2 rounded': true,
          'bg-green-200': doctor.client_id === selectedDoctor,
          'hover:bg-gray-200': doctor.client_id !== selectedDoctor,
        }"
      >
        Doctor Client_ID: {{ doctor.client_id }}
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
        v-model="message"
        type="text"
        placeholder="Escribe un mensaje"
        class="border p-2 w-full text-gray-800 rounded"
      />
      <button @click="sendMessage" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
        Enviar
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue'

interface Doctor {
  client_id: string
}

const token = sessionStorage.getItem('token') || ''
const ws = ref<WebSocket | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clientId = ref(sessionStorage.getItem('id') || '')
const selectedDoctor = ref('')
const doctors = ref<Doctor[]>([])
const message = ref('')
const chatBox = ref<string[]>([])

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
    obtenerDoctores()
  }

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.from) {
      chatBox.value.push(`Mensaje del Doctor: ${data.message}`)
    }
  }

  ws.value.onclose = () => {
    console.log('Conexión cerrada')
  }

  ws.value.onerror = (error) => {
    console.error('Error en WebSocket:', error)
  }
}

const obtenerDoctores = async () => {
  try {
    const response = await fetch('http://localhost:8000/users/online-doctors')
    const data = await response.json()
    doctors.value = data
  } catch (error) {
    console.error('Error al obtener doctores:', error)
  }
}

const selectDoctor = (doctorId: string) => {
  selectedDoctor.value = doctorId
}

const sendMessage = () => {
  if (!selectedDoctor.value) {
    alert('Selecciona un doctor')
    return
  }
  if (!message.value.trim()) {
    alert('Escribe un mensaje')
    return
  }
  ws.value?.send(
    JSON.stringify({
      to: selectedDoctor.value,
      message: message.value,
    })
  )
  chatBox.value.push(`Tú: ${message.value}`)
  message.value = ''
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
