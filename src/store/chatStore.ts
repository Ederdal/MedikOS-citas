import { defineStore } from 'pinia'

interface Message {
  from: string
  to: string
  message: string
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    onlineDoctors: [] as { client_id: string }[],
    onlinePatients: [] as { client_id: string }[],
  }),
  actions: {
    addMessage(message: Message) {
      this.messages.push(message)
    },
    setDoctors(doctors: { client_id: string }[]) {
      this.onlineDoctors = doctors
    },
    setPatients(patients: { client_id: string }[]) {
      this.onlinePatients = patients
    },
  },
})
