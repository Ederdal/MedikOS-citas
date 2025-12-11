<template>
  <div class="bg-white p-4 rounded shadow border-blue-900 mb-6">
    <h3 class="text-xl font-bold mb-4 text-black">Productos Mas Comprados</h3>

    <!-- Iteración de cada producto en la lista -->
    <div
      v-for="product in products"
      :key="product.id"
      class="flex items-start space-x-4 mb-4 last:mb-0"
    >
      <!-- Imagen pequeña -->
      <img
        :src="product.image"
        alt="Imagen del producto"
        class="w-16 h-16 object-cover rounded"
      />

      <!-- Detalles del producto -->
      <div>
        <h4 class="text-sm font-semibold mb-1 text-black">
          {{ product.title }}
        </h4>
        <!-- Rating (otra vez, ejemplo con Font Awesome) -->
        <div class="flex items-center space-x-1 text-yellow-400 text-xs">
          <i
            v-for="n in 5"
            :key="n"
            :class="starClass(n)"
          ></i>
        </div>
        <!-- Precio -->
        <div class="text-primary font-bold text-sm mt-1 text-black">
          ${{ product.price.toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface BestSeller {
  id: number;
  title: string;
  image: string;
  rating: number;
  price: number;
}

export default defineComponent({
  name: 'BestSellerList',
  props: {
    products: {
      type: Array as PropType<BestSeller[]>,
      required: true
    }
  },
  setup(props) {
    const starClass = (starNumber: number) => {
      // Ajustar si usas otro set de íconos
      return starNumber <= props.products[0].rating
        ? 'fas fa-star'
        : 'far fa-star';
    };

    return {
      starClass
    };
  }
});
</script>

<style scoped>
/* Ajusta estilos a tu gusto */
</style>
