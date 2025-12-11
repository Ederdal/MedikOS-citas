<template>
  <div class="empleado-detail">
    <div v-if="loading">Cargando...</div>
    <CardEmpleado v-else :empleado="empleado" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getNurseById } from '@/services/api/personalService';
import CardEmpleado from '../dashboard/cards/CardEmpleado.vue';

export default defineComponent({
  name: 'EmpleadoEnfermero',
  components: { CardEmpleado },
  setup() {
    const route = useRoute();
    const empleado = ref<{ nombreCompleto: string; departamento: string; email: string }>({
      nombreCompleto: '',
      departamento: '',
      email: ''
    });
    const loading = ref(true);
    const id = route.params.id;

    onMounted(async () => {
      try {
        empleado.value = await getNurseById(id);
      } catch (error) {
        console.error('Error al cargar los datos del enfermero:', error);
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
