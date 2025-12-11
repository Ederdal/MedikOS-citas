<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <!-- Asegúrate de tener p-4 en móvil y p-8 en md+ -->
    <div class="p-4 md:p-8">
      <DashboardHeader />
      <DashboardCards />
    </div>
  </div>
</template>

<script lang="ts">
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardCards from '@/components/dashboard/DashboardCards.vue'

export default {
  name: 'DashboardPage',
  components: {
    DashboardHeader,
    DashboardCards,
  },
};
</script>

<style scoped>
/* Asegúrate de no tener nada que fuerce ancho extra */
html, body {
  margin: 0;
  padding: 0;
}
</style>
