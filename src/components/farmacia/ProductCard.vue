<template>
  <div class="border border-gray-200 p-4 rounded shadow-sm hover:shadow-md transition-shadow">
    <!-- Imagen con descuento -->
    <div class="relative">
      <img
        :src="product.image"
        alt="Imagen del producto"
        class="w-full h-48 object-cover rounded"
      />
      <div
        v-if="product.discount"
        class="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded"
      >
        -{{ product.discount }}%
      </div>
    </div>

    <!-- Texto y detalles -->
    <div class="mt-4">
      <h3 class="text-sm text-blue-700 font-semibold">
        {{ product.title }}
      </h3>
      <p class="text-xs text-gray-700">
        {{ product.category }}
      </p>

      <!-- Rating (ejemplo con Font Awesome) -->
      <div class="flex items-center space-x-1 text-yellow-400 text-sm mt-2">
        <i
          v-for="n in 5"
          :key="n"
          :class="starClass(n)"
        ></i>
      </div>

      <!-- Precios -->
      <div class="flex items-center space-x-2 mt-2">
        <span class="text-lg font-bold text-blue-500 text-primary">
          ${{ discountedPrice }}
        </span>
        <span
          v-if="product.discount"
          class="text-gray-500 line-through text-sm"
        >
          ${{ product.price.toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';

interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  rating: number;  // Valor de 1 a 5
  price: number;
  discount?: number;
}

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as PropType<Product>,
      // Si deseas usar un valor por defecto, no lo marques como required.
      // Si siempre se debe pasar un producto, elimina la propiedad default.
      default: () => ({
        id: 0,
        title: "",
        category: "",
        image: "https://via.placeholder.com/300x300",
        rating: 0,
        price: 0,
        discount: 0,
      })
    }
  },
  setup(props) {
    // Cálculo del precio con descuento
    const discountedPrice = computed(() => {
      if (!props.product.discount) {
        return props.product.price.toFixed(2);
      }
      const discountAmount = (props.product.price * props.product.discount) / 100;
      return (props.product.price - discountAmount).toFixed(2);
    });

    // Función para determinar la clase de las estrellas
    const starClass = (starNumber: number) => {
      return starNumber <= props.product.rating
        ? 'fas fa-star'
        : 'far fa-star';
    };

    return {
      discountedPrice,
      starClass
    };
  }
});
</script>

<style scoped>
/* Puedes personalizar más estilos aquí */
</style>
