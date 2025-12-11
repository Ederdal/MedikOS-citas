<template>
  <div class="empleado-detail">
    <div v-if="loading">Cargando...</div>
    <CardEmpleado v-else-if="empleado" :empleado="empleado" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CardEmpleado from '../dashboard/cards/CardEmpleado.vue';
import { getDoctorById, type Empleado } from '@/services/api/personalService';

export default defineComponent({
  name: 'EmpleadoDoctor',
  components: { CardEmpleado },
  setup() {
    const route = useRoute();
    const empleado = ref<Empleado | null>(null);
    const loading = ref(true);
    const id = route.params.id;

    onMounted(async () => {
      try {
        const idParam = Array.isArray(id) ? id[0] : id;
        empleado.value = await getDoctorById(idParam ?? '');
      } catch (error) {
        console.error('Error al cargar los datos del doctor:', error);
      } finally {
        loading.value = false;
      }
    });

    return { empleado, loading };
  }
});
</script>

<style scoped>
.empleado-detail {
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>
