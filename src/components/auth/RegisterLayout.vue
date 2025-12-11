<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-100 ">
    <!-- Lado izquierdo -->
    <div class="hidden md:flex flex-col justify-center items-center bg-blue-400 p-8 pt-12 max-h-[90%] h-[95%] text-white shadow-lg mr-[-2rem] z-0 w-[450px] rounded-b-4xl self-start animate-fade-on">
      <img :src="logo" alt="Illustration" class="w-48" />
      <p class="text-center text-xl opacity-80 mt-4 px-4">Crea tu cuenta para acceder al sistema del hospital</p>
    </div>

    <!-- Formulario -->
    <div class="relative bg-white shadow-lg rounded-lg md:w-[540px] w-full p-8 animate-fade-in">
      <h1 class="text-3xl font-semibold text-blue-400 text-left mb-3">Registro</h1>
      <RegisterForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/img/medik.png'
</script>

<style scoped>
@keyframes fadeOn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-on {
  animation: fadeOn 0.6s ease-in-out both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out both;
}
</style>
