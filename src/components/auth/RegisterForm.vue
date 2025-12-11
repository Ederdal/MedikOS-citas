<template>
  <form class="space-y-3 text-sm" @submit.prevent="submitRegister">
    <!-- Nombre de usuario -->
    <div>
      <label class="block text-gray-700 mb-1">Nombre de usuario</label>
      <input
        type="text"
        v-model="form.username"
        @input="validateField('username')"
        @blur="validateField('username')"
        class="w-full px-2 py-1.5 border rounded bg-teal-50 text-sm text-gray-800 focus:ring-1 focus:ring-blue-400"
      />
      <p v-if="errors.username" class="text-xs text-red-500 mt-1">{{ errors.username }}</p>
    </div>

    <!-- Campos personales -->
    <div v-for="field in fields" :key="field.name">
      <label class="block text-gray-700 mb-1">{{ field.label }}</label>
      <input
        :type="field.type"
        v-model="form[field.name]"
        @input="validateField(field.name)"
        @blur="validateField(field.name)"
        class="w-full px-2 py-1.5 border rounded bg-teal-50 text-sm text-gray-800 focus:ring-1 focus:ring-blue-400"
      />
      <p v-if="errors[field.name]" class="text-xs text-red-500 mt-1">{{ errors[field.name] }}</p>
    </div>

    <!-- Género y Fecha -->
    <div class="flex gap-3">
      <div class="w-1/2">
        <label class="block text-gray-700 mb-1">Género</label>
        <select
          v-model="form.genero"
          @blur="validateField('genero')"
          class="w-full px-2 py-1.5 border rounded bg-teal-50 text-sm text-gray-800 focus:ring-1 focus:ring-blue-400"
        >
          <option disabled value="">Seleccionar género</option>
          <option>Masculino</option>
          <option>Femenino</option>
          <option>N/B</option>
        </select>
        <p v-if="errors.genero" class="text-xs text-red-500 mt-1">{{ errors.genero }}</p>
      </div>

      <div class="w-1/2">
        <label class="block text-gray-700 mb-1">Fecha de nacimiento</label>
        <input
          type="date"
          v-model="form.fecha_nacimiento"
          @blur="validateField('fecha_nacimiento')"
          class="w-full px-2 py-1.5 border rounded bg-teal-50 text-sm text-gray-800 focus:ring-1 focus:ring-blue-400"
        />
        <p v-if="errors.fecha_nacimiento" class="text-xs text-red-500 mt-1">{{ errors.fecha_nacimiento }}</p>
      </div>
    </div>

    <!-- Contraseña -->
    <div>
      <label class="block text-gray-700 mb-1">Contraseña</label>
      <input
        type="password"
        v-model="form.password"
        @input="validateField('password')"
        @blur="validateField('password')"
        class="w-full px-2 py-1.5 border rounded bg-teal-50 text-sm text-gray-800 focus:ring-1 focus:ring-blue-400"
      />
      <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
    </div>

    <!-- Botón -->
    <button
      type="submit"
      :disabled="!isFormValid"
      class="w-full bg-blue-400 text-white py-1.5 rounded hover:bg-blue-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Registrarse
    </button>

    <!-- Enlaces -->
    <div class="flex justify-between text-xs text-gray-700 mt-2">
      <p>
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="text-blue-500 hover:underline">Iniciar sesión</router-link>
      </p>
      <router-link to="/" class="text-blue-500 hover:underline flex items-center gap-1">
        ← Inicio
      </router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerUsuario } from '@/services/api/authService'
import type { RegisterPayload } from '@/interfaces/auth'

const router = useRouter()
const toast = useToast()

const form = ref({
  username: '',
  nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  genero: '',
  fecha_nacimiento: '',
  password: ''
})

const errors = ref<Record<string, string>>({
  username: '',
  nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  genero: '',
  fecha_nacimiento: '',
  password: ''
})

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'primer_apellido', label: 'Primer Apellido', type: 'text' },
  { name: 'segundo_apellido', label: 'Segundo Apellido', type: 'text' }
]

const validateField = (name: string) => {
  const value = form.value[name]
  if (!value) {
    errors.value[name] = 'Este campo es obligatorio.'
  } else {
    errors.value[name] = ''
  }

  if (name === 'password' && value && value.length < 6) {
    errors.value.password = 'Debe tener al menos 6 caracteres.'
  }
}

const validate = () => {
  let valid = true
  Object.keys(form.value).forEach((key) => {
    validateField(key)
    if (!form.value[key]) valid = false
  })
  return valid
}

const isFormValid = computed(() =>
  Object.values(form.value).every(v => !!v) && Object.values(errors.value).every(e => e === '')
)

const submitRegister = async () => {
  if (!validate()) return

  try {
    const payload: RegisterPayload = { ...form.value }

    const response = await registerUsuario(payload)
    toast.add({ title: 'Éxito', description: response.message || 'Registro exitoso', color: 'success' })
    router.push('/login')

  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message || 'Ocurrió un error al registrar.' })
  }
}
</script>
