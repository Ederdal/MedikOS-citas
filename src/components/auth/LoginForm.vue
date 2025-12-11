<template>
  <form class="space-y-3" @submit.prevent="handleLogin">
    <!-- Campos -->
    <UFormField name="usuario">
      <label for="usuario" class="text-gray-500">Usuario</label>
      <input
        v-model="authForm.usuario"
        type="text"
        @blur="touched.usuario = true; validateForm()"
        class="w-full bg-teal-50 px-3 py-2 rounded-md border border-gray-500 text-sm focus:ring-2 focus:ring-blue-400 text-gray-800"
      />
      <p v-if="touched.usuario && errors.usuario" class="text-xs text-red-500 mt-1">{{ errors.usuario }}</p>
    </UFormField>

    <UFormField name="password">
      <label for="password" class="text-gray-500">Contraseña</label>
      <input
        v-model="authForm.password"
        type="password"
        @blur="touched.password = true; validateForm()"
        class="w-full bg-teal-50 px-3 py-2 rounded-md border border-gray-500 text-sm focus:ring-2 focus:ring-blue-400 text-gray-800"
      />
      <p v-if="touched.password && errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
    </UFormField>

    <!-- Extras -->
    <div class="flex justify-between items-center text-xs">
      <label class="flex items-center text-gray-700">
        <input type="checkbox" class="mr-2 scale-90" /> Recordarme
      </label>
      <a href="#" class="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
    </div>

    <!-- Botón de Login -->
    <button
      type="submit"
      :disabled="!isFormValid || loading"
      class="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition-all text-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="loader"></span>
      {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
    </button>

    <p class="text-xs text-right mt-4 text-gray-800">
      ¿No tienes una cuenta?
      <router-link to="/registro" class="text-blue-500 hover:underline">Registrar</router-link>
    </p>
    <p class="text-xs text-left mt-4 text-gray-800">
      <router-link to="/" class="text-blue-500 hover:underline flex items-center gap-1">
        ← Volver a inicio
      </router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { loginUsuario } from '@/services/api/authService';
import type { LoginPayload } from '@/interfaces/auth';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const authForm = ref({ usuario: '', password: '' });
const errors = ref({ usuario: '', password: '' });
const touched = ref({ usuario: false, password: false });

const validateForm = () => {
  errors.value.usuario = touched.value.usuario && !authForm.value.usuario.trim()
    ? 'El usuario es requerido.'
    : '';
  errors.value.password = touched.value.password && !authForm.value.password.trim()
    ? 'La contraseña es requerida.'
    : '';
};

const isFormValid = computed(() =>
  authForm.value.usuario.trim().length > 0 && authForm.value.password.trim().length > 0
);

watch(() => authForm.value.usuario, validateForm);
watch(() => authForm.value.password, validateForm);

const handleLogin = async () => {
  touched.value.usuario = true;
  touched.value.password = true;
  validateForm();

  if (!isFormValid.value) return;

  try {
    loading.value = true;
    const loginPayload: LoginPayload = {
      nombre_usuario: authForm.value.usuario,
      contrasena: authForm.value.password,
    };

    const { token, roles } = await loginUsuario(loginPayload);

    localStorage.setItem('token', token);
    localStorage.setItem('Rol', roles);

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      localStorage.setItem('id', payload.id);
      console.log('Payload decodificado del JWT:', payload);
    } catch (decodeError) {
      console.error('Error al decodificar el token:', decodeError);
    }

    router.replace('/dashboard');
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.response?.data?.message || 'Error al iniciar sesión',
    })
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.loader {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
