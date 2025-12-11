<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <!-- Foto del doctor (placeholder según género) -->
    <div class="w-full h-48 overflow-hidden rounded-md mb-4">
      <img
        :src="imageUrl"
        :alt="displayName"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Nombre y especialidad -->
    <h3 class="text-lg font-bold text-gray-800 mb-1">
      {{ displayName }}
    </h3>
    <p class="text-sm text-gray-600 mb-2">
      {{ doctor.especialidad }}
    </p>

    <!-- Departamento (opcional) -->
    <p class="text-xs text-gray-500 mb-3">
      Departamento: {{ doctor.departamento }}
    </p>

    <!-- Puedes agregar más detalles o íconos de redes sociales si lo requieres -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

export interface Doctor {
  personalId: string;
  nombreCompleto: string;
  genero: string;         // "F" o "M"
  fecha_nacimiento: string;
  curp: string;
  cedula_profesional: string;
  especialidad: string;
  tipo: string;           // "Medico" o "Enfermero", etc.
  fecha_contratacion: string;
  fecha_termino_contrato: string | null;
  salario: number;
  departamento: string;
}

export default defineComponent({
  name: 'DoctorCard',
  props: {
    doctor: {
      type: Object as PropType<Doctor>,
      required: true
    }
  },
  setup(props) {
    // Si el doctor no tiene imagen, usamos un placeholder según el género
    const imageUrl = computed(() => {
      // Puedes reemplazar estas URLs por imágenes reales
      return props.doctor.genero === 'F'
        ? 'https://via.placeholder.com/200x200?text=Doctora'
        : 'https://via.placeholder.com/200x200?text=Doctor';
    });

    // Calcula el nombre a mostrar según el tipo
    const displayName = computed(() => {
      if (props.doctor.tipo.toLowerCase() === 'medico') {
        return `Dr. ${props.doctor.nombreCompleto}`;
      } else if (props.doctor.tipo.toLowerCase() === 'enfermero') {
        return `Enf. ${props.doctor.nombreCompleto}`;
      } else {
        return props.doctor.nombreCompleto;
      }
    });

    return {
      imageUrl,
      displayName
    };
  }
});
</script>

<style scoped>
/* Puedes ajustar estilos según tu preferencia */
</style>
