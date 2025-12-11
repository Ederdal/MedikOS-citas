<template>
  <h1 class="text-5xl font-bold mb-4 text-black mt-6 ml-6">Registrar Nota Médica</h1>
  <div class="w-full flex flex-col md:flex-row gap-6 p-6 bg-gray-100">


    <!-- Formulario de nota médica -->
    <div class="w-full md:w-3/4 bg-white rounded-xl shadow-md p-6 animate-fade-in border border-blue-100">

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700">Nombre del paciente</label>
            <input v-model="form.paciente" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800" @blur="validateField('paciente')"/>
            <p v-if="errors.paciente" class="text-red-500 text-sm">{{ errors.paciente }}</p>
          </div>

          <div>
            <label class="block text-gray-700">Nombre del doctor</label>
            <input v-model="form.doctor" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800" readonly />
          </div>

          <div>
            <label class="block text-gray-700">Fecha de nota</label>
            <input v-model="form.fechaNota" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800" readonly />
          </div>

          <div>
            <label class="block text-gray-700">Síntomas</label>
            <select v-model="form.sintomas" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800" @blur="validateField('sintomas')">
              <option disabled value="">Seleccione</option>
              <option>Dolor de cabeza</option>
              <option>Fiebre</option>
              <option>Tos</option>
              <option>Dolor abdominal</option>
            </select>
            <p v-if="errors.sintomas" class="text-red-500 text-sm">{{ errors.sintomas }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-700">Tratamiento</label>
            <input v-model="form.tratamiento" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800" @blur="validateField('tratamiento')"/>
            <p v-if="errors.tratamiento" class="text-red-500 text-sm">{{ errors.tratamiento }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-700">Observaciones</label>
            <textarea v-model="form.observaciones" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800" rows="3" @blur="validateField('observaciones')"/>
            <p v-if="errors.observaciones" class="text-red-500 text-sm">{{ errors.observaciones }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-700">Fecha de seguimiento</label>
            <input v-model="form.fechaSeguimiento" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-gray-800" @blur="validateField('fechaSeguimiento')"/>
            <p v-if="errors.fechaSeguimiento" class="text-red-500 text-sm">{{ errors.fechaSeguimiento }}</p>
          </div>
        </div>

        <button type="submit" class="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition-all shadow-sm">
          Registrar nota médica
        </button>
      </form>
    </div>

    <!-- Información adicional: Notas guardadas en localStorage -->
    <div class="w-full md:w-1/4 bg-white rounded-xl shadow-md p-6 animate-fade-on border border-gray-200 self-start">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">📋 Notas guardadas</h3>
      <div v-if="notasRecientes.length === 0" class="text-gray-500 italic text-sm">
        No hay notas guardadas aún
      </div>
      <ul class="space-y-3 text-sm text-gray-700 max-h-96 overflow-y-auto">
        <li v-for="(nota, index) in notasRecientes" :key="index" class="p-3 border border-gray-100 rounded-md hover:bg-blue-50 transition">
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1">
              <p class="font-medium text-blue-600">{{ nota.paciente }}</p>
              <p class="text-xs text-gray-500">{{ nota.fechaNota }}</p>
              <p class="text-xs text-gray-600 mt-1">💊 <strong>Síntoma:</strong> {{ nota.sintomas }}</p>
              <p class="text-xs text-gray-600">📝 <strong>Tratamiento:</strong> {{ nota.tratamiento }}</p>
            </div>
            <button @click="eliminarNota(index)" class="text-red-500 hover:text-red-700 text-xs font-bold">
              ✕
            </button>
          </div>
        </li>
      </ul>
      <p class="pt-4 text-gray-400 italic text-xs">Total: {{ notasRecientes.length }} nota(s)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

const today = new Date().toISOString().split('T')[0];

const form = reactive({
  paciente: '',
  doctor: '',
  fechaNota: today,
  sintomas: '',
  tratamiento: '',
  observaciones: '',
  fechaSeguimiento: ''
});

const notasRecientes = ref<any[]>([]);

const errors = reactive<Record<string, string>>({});

const validateField = (field: keyof typeof form) => {
  errors[field] = form[field] ? '' : 'Este campo es obligatorio';
};

const validateForm = () => {
  let valid = true;
  Object.keys(form).forEach(field => {
    validateField(field as keyof typeof form);
    if (!form[field as keyof typeof form]) valid = false;
  });
  return valid;
};

// Guardar nota en localStorage
const guardarNotaEnLocalStorage = (nota: any) => {
  const notasGuardadas = JSON.parse(localStorage.getItem('notasMedicas') || '[]');
  notasGuardadas.push({
    ...nota,
    id: Date.now() // ID único basado en timestamp
  });
  localStorage.setItem('notasMedicas', JSON.stringify(notasGuardadas));
};

// Cargar notas desde localStorage
const cargarNotasDesdeLocalStorage = () => {
  const notasGuardadas = JSON.parse(localStorage.getItem('notasMedicas') || '[]');
  notasRecientes.value = notasGuardadas.reverse(); // Mostrar las más recientes primero
};

// Eliminar nota de localStorage
const eliminarNota = (index: number) => {
  const notasGuardadas = JSON.parse(localStorage.getItem('notasMedicas') || '[]');
  const notaAEliminar = notasRecientes.value[index];
  const notasActualizadas = notasGuardadas.filter((n: any) => n.id !== notaAEliminar.id);
  localStorage.setItem('notasMedicas', JSON.stringify(notasActualizadas));
  cargarNotasDesdeLocalStorage(); // Recargar vista
};

const handleSubmit = () => {
  if (validateForm()) {
    const notaMedica = { ...form };
    guardarNotaEnLocalStorage(notaMedica);
    cargarNotasDesdeLocalStorage();
    
    // Limpiar formulario
    form.paciente = '';
    form.sintomas = '';
    form.tratamiento = '';
    form.observaciones = '';
    form.fechaSeguimiento = '';
    form.fechaNota = today;
    
    alert('✅ Nota médica registrada exitosamente');
  }
};

onMounted(() => {
  const nombreDoctor = localStorage.getItem('Nombre') || 'Desconocido';
  form.doctor = nombreDoctor;
  cargarNotasDesdeLocalStorage();
});
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
