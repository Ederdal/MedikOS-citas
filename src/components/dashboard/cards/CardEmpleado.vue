<template>
  <!-- Modal de contacto -->
  <ContactoModal v-if="showModal" @close="showModal = false" />

  <!-- Contenedor principal -->
  <div class="container mx-auto px-4 py-6 text-gray-800" v-if="empleado">
    <!-- Tarjeta / Sección principal -->
    <div class="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row gap-6">
      <!-- Columna izquierda: foto y datos de contacto -->
      <div class="md:w-1/3 flex flex-col items-center">
        <img
          class="w-32 h-32 mb-3 rounded-full shadow-lg object-cover"
          :src="empleado.genero === 'F' ? doctorImgF : doctorImgM"
          alt="Foto de Empleado"
        />
        <h2 class="text-2xl font-bold">{{ empleado.nombreCompleto }}</h2>
        <span class="text-sm text-gray-500">{{ empleado.tipo }}</span>

        <!-- Contact Info -->
        <div class="mt-4 w-full">
          <h3 class="text-lg font-semibold mb-2">Contact Info</h3>
          <ul class="space-y-1 text-sm text-gray-600">
            <li><strong>Género:</strong> {{ empleado.genero }}</li>
            <li><strong>CURP:</strong> {{ empleado.curp }}</li>
            <li><strong>Cédula:</strong> {{ empleado.cedula_profesional }}</li>
            <li><strong>Especialidad:</strong> {{ empleado.especialidad }}</li>
            <li><strong>Departamento:</strong> {{ empleado.departamento }}</li>
            <li><strong>Salario:</strong> ${{ empleado.salario.toFixed(2) }}</li>
          </ul>
        </div>

        <!-- Botón para abrir el modal de contacto -->
        <div class="mt-4 w-full">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            @click="showModal = true"
          >
            Book an Appointment
          </button>
        </div>
      </div>

      <!-- Columna derecha: About Me, Education, Experience, etc. -->
      <div class="md:w-2/3">
        <!-- About Me -->
        <h3 class="text-xl font-bold mb-2">About Me</h3>
        <p class="text-sm text-gray-600 mb-4">
          <!-- Texto de ejemplo, reemplaza con datos reales si los tienes -->
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam
          delectus tempore necessitatibus? Quo necessitatibus harum consectetur
          fugit cumque! Repellendus adipisci, labore laboriosam, quisquam
          maiores rem reiciendis soluta dolore totam provident.
        </p>

        <!-- Education -->
        <h3 class="text-xl font-bold mb-2">Education</h3>
        <div class="overflow-x-auto mb-4">
          <table class="w-full border border-gray-200 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border-b border-gray-200">Year's</th>
                <th class="p-2 border-b border-gray-200">Department</th>
                <th class="p-2 border-b border-gray-200">Institute Name</th>
              </tr>
            </thead>
            <tbody>
              <!-- Ejemplo de filas, ajusta según tus datos -->
              <tr>
                <td class="p-2 border-b border-gray-200">2009-2013</td>
                <td class="p-2 border-b border-gray-200">MBBS, M.D</td>
                <td class="p-2 border-b border-gray-200">University of Wyoming</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-gray-200">2013-2016</td>
                <td class="p-2 border-b border-gray-200">Residency</td>
                <td class="p-2 border-b border-gray-200">Midtown Medical College</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Experience -->
        <h3 class="text-xl font-bold mb-2">Experience</h3>
        <div class="overflow-x-auto mb-4">
          <table class="w-full border border-gray-200 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border-b border-gray-200">Year's</th>
                <th class="p-2 border-b border-gray-200">Position</th>
                <th class="p-2 border-b border-gray-200">Hospital Name</th>
              </tr>
            </thead>
            <tbody>
              <!-- Ejemplo de filas, ajusta según tus datos -->
              <tr>
                <td class="p-2 border-b border-gray-200">2016-2018</td>
                <td class="p-2 border-b border-gray-200">Senior Professor</td>
                <td class="p-2 border-b border-gray-200">Midtown Medical Clinic</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-gray-200">2018-Present</td>
                <td class="p-2 border-b border-gray-200">Head of Department</td>
                <td class="p-2 border-b border-gray-200">City Hospital</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Additional Info -->
        <h3 class="text-xl font-bold mb-2">Additional Info</h3>
        <div class="text-sm text-gray-700 space-y-1">
          <p><strong>Nacimiento:</strong> {{ empleado.fecha_nacimiento }}</p>
          <p><strong>Contratación:</strong> {{ empleado.fecha_contratacion }}</p>
          <p>
            <strong>Fin de Contrato:</strong>
            {{ empleado.fecha_termino_contrato || 'Indefinido' }}
          </p>
          <p>
            <strong>Estado:</strong>
            <span
              class="px-2 py-0.5 rounded-full text-xs"
              :class="empleado.fecha_termino_contrato ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
            >
              {{ empleado.fecha_termino_contrato ? 'Inactivo' : 'Activo' }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import doctorImgF from '@/assets/img/doctora1.avif'
import doctorImgM from '@/assets/img/doctor1.jpg'
import ContactoModal from '@/components/modals/ContactoModal.vue'

// Interfaz para tipar los datos del empleado
interface Empleado {
  personalId: string
  nombreCompleto: string
  genero: string
  fecha_nacimiento: string
  curp: string
  cedula_profesional: string
  especialidad: string
  tipo: string
  fecha_contratacion: string
  fecha_termino_contrato: string | null
  salario: number
  departamento: string
}

const showModal = ref(false)

// Recibimos el empleado como prop
defineProps<{
  empleado: Empleado
}>()
</script>

<style scoped>
/* Puedes agregar estilos personalizados si lo deseas */
</style>
