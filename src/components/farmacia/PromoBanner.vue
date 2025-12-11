<template>
  <div class="bg-orange-100 p-4 rounded shadow">
    <h3 class="text-2xl font-bold mb-2">Up to 50% Off</h3>
    <p class="mb-4">Order the first medicine &amp; get discount</p>
    <div class="flex justify-center">
      <!-- Reemplaza con tu imagen real -->
      <img
        src="https://via.placeholder.com/150"
        alt="Promo Banner"
        class="object-cover"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PromoBanner'
});
</script>

<style scoped>
/* Ajusta colores y estilos a tu gusto */
</style>
