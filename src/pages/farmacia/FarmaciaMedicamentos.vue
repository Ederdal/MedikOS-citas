<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4 text-black">Vista de Medicamentos</h1>

    <!-- Sección de productos en grid -->
    <div class="flex content-between">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <div class="hidden lg:block ml-25 h-115 border-l-2 rounded shadow border-blue-800">
        <BestSellerList :products="products" />
      </div>
    </div>

    <!-- Barra de búsqueda (opcional) -->
    <div class="mb-4 flex items-center">
      <input v-model="searchTerm" type="text" placeholder="Buscar medicamento..."
        class="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" />
      <button class="ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        @click="onSearch">
        Buscar
      </button>
    </div>

    <!-- Tabla de medicamentos -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Dosis</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Presentación</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Categoría</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Precio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Vencimiento</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(med, index) in filteredMedications" :key="index" :class="index % 2 === 1 ? 'bg-gray-50' : ''"
            class="hover:bg-gray-100 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.dosage }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.presentation }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">S/ {{ med.price.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.expirationDate }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">{{ med.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-black">
              <button class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                @click="verDetalles(med)">
                Ver Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Componente adicional de stock, si lo necesitas -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import ProductCard from '@/components/farmacia/ProductCard.vue';
import BestSellerList from '@/components/farmacia/BestSellerList.vue';

interface Medication {
  name: string;
  dosage: string;
  presentation: string;
  category: string;
  stock: number;
  price: number;
  expirationDate: string;
  description: string;
}

export default defineComponent({
  name: 'MedicationView',
  components: {
    ProductCard,
    BestSellerList
  },
  setup() {
    const products = ref([
      {
        id: 1,
        title: 'Ibuprofeno 200mg',
        category: 'Antiinflamatorio',
        image: 'https://demo2.wpopal.com/pharmacy2/wp-content/uploads/2022/03/product-7-1-460x460.jpg',
        rating: 4,
        price: 12.99,
        discount: 15
      },
      {
        id: 2,
        title: 'Paracetamol 500mg',
        category: 'Analgésico',
        image: 'https://onepharmacy.mx/cdn/shop/files/TEMPRA_PARACETAMOL_TABLETAS_500_MG_CAJA_C100_60f8a504-6758-4d57-830d-906a84d1eda2.png?v=1721166037',
        rating: 5,
        price: 9.99
      },
      {
        id: 3,
        title: 'Amoxicilina 500mg',
        category: 'Antibiótico',
        image: 'https://surtitienda.vteximg.com.br/arquivos/ids/176394-500-500/07501001258030.1.jpg?v=637062387207830000',
        rating: 3,
        price: 18.5,
        discount: 10
      },
      {
        id: 4,
        title: 'Loratadina 10mg',
        category: 'Antihistamínico',
        image: 'https://www.fahorro.com/media/catalog/product/7/5/7506472803833_1_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700',
        rating: 4,
        price: 7.5
      },
      {
        id: 5,
        title: 'Omeprazol 20mg',
        category: 'Inhibidor de bomba de protones',
        image: 'https://onepharmacy.mx/cdn/shop/files/XARELTO_RIVAROXABAN_COMPRIMIDOS_10_MG_1bc74934-40ce-4038-aeb2-490427382902_533x.png?v=1721166238',
        rating: 5,
        price: 11.75,
        discount: 5
      }
    ]);

    const medications = ref<Medication[]>([
      {
        name: 'Paracetamol',
        dosage: '500 mg',
        presentation: 'Tabletas',
        category: 'Analgésico',
        stock: 50,
        price: 1.2,
        expirationDate: '2025-12-31',
        description: 'Alivia dolor y reduce la fiebre.'
      },
      {
        name: 'Ibuprofeno',
        dosage: '200 mg',
        presentation: 'Cápsulas',
        category: 'Antiinflamatorio',
        stock: 30,
        price: 2.5,
        expirationDate: '2024-06-30',
        description: 'Reduce inflamación y dolor.'
      },
      {
        name: 'Amoxicilina',
        dosage: '500 mg',
        presentation: 'Cápsulas',
        category: 'Antibiótico',
        stock: 20,
        price: 3.1,
        expirationDate: '2023-09-15',
        description: 'Combate infecciones bacterianas.'
      },
      {
        name: 'Loratadina',
        dosage: '10 mg',
        presentation: 'Tabletas',
        category: 'Antihistamínico',
        stock: 40,
        price: 2.0,
        expirationDate: '2026-01-10',
        description: 'Alivia síntomas de alergia.'
      },
      {
        name: 'Omeprazol',
        dosage: '20 mg',
        presentation: 'Cápsulas',
        category: 'Inhibidor de bomba de protones',
        stock: 25,
        price: 4.5,
        expirationDate: '2025-03-01',
        description: 'Reduce la producción de ácido estomacal.'
      }
    ]);

    const searchTerm = ref('');

    const filteredMedications = computed(() => {
      if (!searchTerm.value.trim()) {
        return medications.value;
      }
      return medications.value.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const verDetalles = (med: Medication) => {
      alert(`Detalles de ${med.name}: ${med.description}`);
    };

    const onSearch = () => {
      console.log('Buscando:', searchTerm.value);
    };

    return {
      products,
      searchTerm,
      filteredMedications,
      verDetalles,
      onSearch
    };
  },
});
</script>

<style scoped>
/* Puedes ajustar estos colores según tu preferencia. */
.text-primary {
  color: #1D4ED8;
  /* Azul de Tailwind (blue-700) por ejemplo */
}
</style>
