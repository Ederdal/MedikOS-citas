<template>
  <div class="bg-gray-100 py-10 px-4 md:px-12 animate-fade-in overflow-y-auto">
    <LandingHeader />
    <LandingServicios />
    <LandingCallToAction />
    <LandingDoctores />
    <LandingPorQueElegirnos />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out both;
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
</style>
