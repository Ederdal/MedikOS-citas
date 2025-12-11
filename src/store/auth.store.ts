import { defineStore } from 'pinia'

const storedToken = localStorage.getItem('token') || ''
const storedEmail = localStorage.getItem('Email')
const storedName = localStorage.getItem('Nombre')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: storedEmail && storedName ? { name: storedName, email: storedEmail } : null,
    token: storedToken
  }),
  actions: {
    login(userData: { name: string; email: string }, token: string) {
      this.user = userData
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('Email', userData.email)
      localStorage.setItem('Nombre', userData.name)
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('Email')
      localStorage.removeItem('Nombre')
    }
  }
})
