<template>
  <div class="container mx-auto p-6 text-black">
    <h2 class="text-2xl font-bold mb-6">
      Personal Médico
    </h2>

    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <!-- Filtro por tipo -->
      <div>
        <label for="tipo" class="block mb-1 font-semibold text-black">Tipo de Personal</label>
        <select id="tipo" v-model="filtroTipo" class="text-black border rounded px-3 py-2">
          <option class="text-black" value="Todos">Todos</option>
          <option class="text-black" value="medico">Medico</option>
          <option class="text-black" value="enfermero">Enfermero</option>
        </select>
      </div>

      <!-- Filtro por departamento -->
      <div>
        <label for="departamento" class="block mb-1 font-semibold text-black">Departamento</label>
        <select id="departamento" v-model="filtroDepartamento" class="border rounded px-3 py-2 text-black">
          <option class="text-black" value="Todos">Todos</option>
          <!-- Opciones dinámicas -->
          <option class="text-black" v-for="dept in listaDepartamentos" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>
      </div>
    </div>

    <!-- Mensaje de carga -->
    <div v-if="loading" class="text-center text-gray-600">
      Cargando personal...
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <PersonalCard
        v-for="(emp, index) in empleadosFiltrados"
        :key="emp.personalId || index"
        :empleado="emp"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import PersonalCard, { type Empleado } from '@/components/personal/PersonalCard.vue';
import { getAllDoctores, getAllEnfermeros } from '@/services/api/personalService';

export default defineComponent({
  name: 'PersonalView',
  components: { PersonalCard },
  setup() {
    const empleados = ref<Empleado[]>([]);
    const loading = ref(true);

    // Filtros
    const filtroTipo = ref('Todos');
    const filtroDepartamento = ref('Todos');

    // Lista de departamentos (puede hacerse dinámico si se requiere)
    const listaDepartamentos = [
      "Tele-Robótica",
      "Jefatura de Enseñanza Médica",
      "Consulta Externa",
      "Terapia y Rehabilitación Física",
      "Biomédica Conservación y Mantenimiento",
      "Validación",
      "Recursos Materiales",
      "Almacén",
      "Insumos Especializados",
      "Servicios Generales",
      "Intendencia",
      "Ropería",
      "Vigilancia",
      "Dietética",
      "Farmacia Intrahospitalaria",
      "Dirección General",
      "Junta de Gobierno",
      "Departamento de Calidad",
      "Comité de Transplante",
      "Sub-Dirección Médica",
      "Sub-Dirección Administrativa",
      "Comités Hospitalarios",
      "Atención a Quejas",
      "Seguridad del Paciente",
      "Comunicación Social",
      "Relaciones Públicas",
      "Coordinación de Asuntos Jurídicos y Administrativos",
      "Violencia Intrafamiliar",
      "Medicinal Legal",
      "Trabajo Social",
      "Unidad de Vigilancia Epidemiológica Hospitalaria",
      "Centro de Investigación de Estudios de la Salud",
      "Ética e Investigación",
      "Jefatura de Enfermería",
      "Subjefatura de Enfermeras",
      "Coordinación Enseñanza Enfermería",
      "Supervisoras de Turno",
      "Jefas de Servicio",
      "Clínicas y Programas",
      "Recursos Humanos",
      "Archivo y Correspondencia",
      "Recursos Financieros",
      "Departamento Administrativo Hemodinamia",
      "Farmacia del Seguro Popular",
      "Enlace Administrativo",
      "Control de Gastos Catastróficos",
      "Informática",
      "Tecnología en la Salud",
      "Registros Médicos"
    ];

    // Carga de datos concurrente para doctores y enfermeros
    onMounted(async () => {
      try {
        const [doctores, enfermeros] = await Promise.all([
          getAllDoctores(),
          getAllEnfermeros()
        ]);
        // Unificamos ambas listas en un solo arreglo
        empleados.value = [...doctores, ...enfermeros];
        console.log('Empleados cargados:', empleados.value);
      } catch (error) {
        console.error('Error al cargar personal:', error);
      } finally {
        loading.value = false;
      }
    });

    // Computed para filtrar según tipo y departamento
    const empleadosFiltrados = computed(() => {
      let filtrados = empleados.value;
      if (filtroTipo.value !== 'Todos') {
        filtrados = filtrados.filter(emp =>
          emp.tipo.toLowerCase() === filtroTipo.value.toLowerCase()
        );
      }
      if (filtroDepartamento.value !== 'Todos') {
        filtrados = filtrados.filter(emp =>
          emp.departamento === filtroDepartamento.value
        );
      }
      return filtrados;
    });

    return {
      empleados,
      loading,
      filtroTipo,
      filtroDepartamento,
      listaDepartamentos,
      empleadosFiltrados
    };
  }
});
</script>

<style scoped></style>
