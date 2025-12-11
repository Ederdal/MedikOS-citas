<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Productos de la Farmacia</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :title="product.title"
        :description="product.description"
        :image="product.image"
        :price="product.price"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductCard from './ProductCard.vue';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
}

export default defineComponent({
  name: 'ProductsView',
  components: { ProductCard },
  data() {
    return {
      products: [
        {
          id: 1,
          title: 'Producto 1',
          description: 'Descripción del producto 1',
          image: 'https://via.placeholder.com/300x200',
          price: 10.99
        },
        {
          id: 2,
          title: 'Producto 2',
          description: 'Descripción del producto 2',
          image: 'https://via.placeholder.com/300x200',
          price: 20.50
        },
        {
          id: 3,
          title: 'Producto 3',
          description: 'Descripción del producto 3',
          image: 'https://via.placeholder.com/300x200',
          price: 15.75
        }
        // Agrega más productos según sea necesario
      ] as Product[]
    };
  }
});
</script>

<style scoped>
/* Aquí puedes agregar estilos adicionales si lo requieres */
</style>
