<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
    @click="goToDetail">
    <!-- Foto o placeholder -->
    <div class="w-full h-48 overflow-hidden rounded-md mb-4">
      <img :src="imageUrl" :alt="empleado.nombreCompleto" class="w-full h-full object-cover" />
    </div>

    <!-- Nombre y especialidad/rol -->
    <h3 class="text-lg font-bold text-gray-800 mb-1">
      {{ displayName }}
    </h3>
    <p class="text-sm text-gray-600 mb-2">
      {{ empleado.especialidad || 'Sin especialidad' }}
    </p>
    <p class="text-sm text-gray-600 mb-2">
      {{ empleado.tipo || 'Sin Tipo' }}
    </p>
    <!-- Departamento (opcional) -->
    <p class="text-xs text-gray-500 mb-3">
      Departamento: {{ empleado.departamento }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import imagenDoctor from '../../assets/img/doctor1.jpg'
import imagenDoctora from '../../assets/img/doctora2.jpg'

export interface Empleado {
  personalId: string;
  nombreCompleto: string;
  genero: string;             // "F" o "M"
  fecha_nacimiento: string;
  curp: string;
  cedula_profesional: string;
  especialidad: string;
  tipo: string;               // "doctor", "enfermero", etc.
  fecha_contratacion: string;
  fecha_termino_contrato: string | null;
  salario: number;
  departamento: string;
}

export default defineComponent({
  name: 'PersonalCard',
  props: {
    empleado: {
      type: Object as PropType<Empleado>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    // Placeholder de imagen según género (o según tipo)
    const imageUrl = computed(() => {
      if (props.empleado.genero === 'M') {
        return imagenDoctor;
      } else {
        return imagenDoctora;
      }
    });

    // Prefijo según tipo
    const displayName = computed(() => {
      // Si no existe 'tipo', retornamos el nombre completo directamente
      if (!props.empleado?.tipo) {
        return props.empleado?.nombreCompleto || '';
      }
      const lowerTipo = props.empleado.tipo.toLowerCase();
      if (lowerTipo === 'doctor') {
        return `Dr. ${props.empleado.nombreCompleto}`;
      } else if (lowerTipo === 'enfermero') {
        return `Enf. ${props.empleado.nombreCompleto}`;
      } else {
        return props.empleado.nombreCompleto;
      }
    });


    // Redirección al detalle según el tipo
    const goToDetail = () => {
      const lowerTipo = props.empleado.tipo.toLowerCase();
      // Maneja equivalencias
      if (lowerTipo === 'doctor' || lowerTipo === 'medico') {
        router.push(`/personal/doctor/${props.empleado.personalId}`);
      } else if (lowerTipo === 'enfermero' || lowerTipo === 'enfermera') {
        router.push(`/personal/enfermero/${props.empleado.personalId}`);
      } else {
        alert(`Detalle no implementado para tipo: ${props.empleado.tipo}`);
      }
    };

    return {
      imageUrl,
      displayName,
      goToDetail
    };
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
