<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <!-- Lado izquierdo (visible solo escritorio) -->
    <div class="hidden md:flex flex-col justify-center items-center bg-blue-400
             p-8 pt-12 max-h-[90%] h-[95%] text-white shadow-lg mr-[-2rem]
             z-0 w-[450px] rounded-b-4xl self-start animate-fade-on">
      <img :src="logo" alt="Illustration" class="w-65" />
      <h1 class="text-3xl font-semibold text-center mt-4">Bienvenido</h1>
      <p class="text-center text-sm opacity-80 mt-4 px-4">
        Accede al panel de administración del hospital
      </p>
    </div>
    <div class="flex flex-col items-center justify-center w-300 md:w-[450px] h-200 mb-40 md:mb-0">
      <div class="md:hidden flex flex-col w-full justify-center items-center bg-blue-400 p-8 pt-12 max-h-[90%] h-[95%] text-white ">
        <img :src="logo" alt="Logo en versión móvil" class="block md:hidden w-24 mx-auto mb-4" />
        <h1 class="text-3xl font-semibold text-center mt-4 text-white">Bienvenido</h1>
        <p class="text-center text-sm opacity-80 mt-4 px-4 text-white">
          Accede al panel de administración del hospital
        </p>
      </div>
      <!-- Formulario -->
      <div class="relative md:w-[420px] w-full p-8 mb-40 animate-fade-in bg-white shadow-lg rounded-lg">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/img/medik.png'
</script>

<style scoped>
@keyframes fadeOn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-on {
  animation: fadeOn 0.6s ease-in-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
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
