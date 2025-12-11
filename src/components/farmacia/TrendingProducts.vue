<template>
  <div class="container mx-auto p-6">
    <!-- Grid principal: 2 columnas en pantallas grandes -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Sección principal -->
      <div class="lg:col-span-9">
        <!-- Encabezado y Tabs -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 class="text-2xl font-bold mb-2 sm:mb-0">
            Trending This Week
          </h2>
          <div class="flex space-x-4">
            <button
              class="text-gray-500 border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Top Rate
            </button>
            <button
              class="text-gray-500 border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Sale Items
            </button>
            <button
              class="text-gray-500 border-b-2 border-transparent hover:border-primary transition-colors"
            >
              New Arrivals
            </button>
          </div>
        </div>

        <!-- Grid de productos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- Barra lateral -->
      <div class="lg:col-span-3">
        <BestSellerList :products="bestSellers" />
        <PromoBanner />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import BestSellerList from '@/components/BestSellerList.vue';
import PromoBanner from '@/components/PromoBanner.vue';

interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  rating: number;  // Valor de 1 a 5
  price: number;
  discount?: number; // Opcional, en porcentaje
}

interface BestSeller {
  id: number;
  title: string;
  image: string;
  rating: number; // Valor de 1 a 5
  price: number;
}

export default defineComponent({
  name: 'TrendingProducts',
  components: {
    ProductCard,
    BestSellerList,
    PromoBanner
  },
  data() {
    return {
      // Productos principales
      products: [
        {
          id: 1,
          title: 'Intelligent Concrete',
          category: 'COVID Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 4,
          price: 584.93,
          discount: 10
        },
        {
          id: 2,
          title: 'Rustic Aluminum Bottle',
          category: 'COVID Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 5,
          price: 633.49
        },
        {
          id: 3,
          title: 'Practical Aluminum Bag',
          category: 'COVID Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 3,
          price: 243.99,
          discount: 5
        },
        {
          id: 4,
          title: 'Lightweight Marble Gloves',
          category: 'COVID Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 4,
          price: 459.99,
          discount: 8
        },
        {
          id: 5,
          title: 'Incredible Aluminum Table',
          category: 'Patient Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 4,
          price: 235.99,
          discount: 15
        },
        {
          id: 6,
          title: 'Sleek Linen Pants',
          category: 'Patient Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 5,
          price: 919.91
        },
        {
          id: 7,
          title: 'Aerodynamic Granite Knife',
          category: 'COVID Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 2,
          price: 546.53
        },
        {
          id: 8,
          title: 'Practical Granite Knife',
          category: 'COVID Care, Wound Care',
          image: 'https://via.placeholder.com/300x300',
          rating: 5,
          price: 684.93,
          discount: 20
        }
      ] as Product[],

      // Lista de best sellers
      bestSellers: [
        {
          id: 9,
          title: 'Incredible Aluminum Table',
          image: 'https://via.placeholder.com/50x50',
          rating: 4,
          price: 235.99
        },
        {
          id: 10,
          title: 'Practical Granite Knife',
          image: 'https://via.placeholder.com/50x50',
          rating: 5,
          price: 684.93
        },
        {
          id: 11,
          title: 'Aerodynamic Granite Knife',
          image: 'https://via.placeholder.com/50x50',
          rating: 5,
          price: 546.53
        },
        {
          id: 12,
          title: 'Intelligent Concrete Computer',
          image: 'https://via.placeholder.com/50x50',
          rating: 4,
          price: 584.93
        }
      ] as BestSeller[]
    };
  }
});
</script>

<style scoped>
.text-primary {
  /* Ajusta este color a tu gusto o mapea una variable de Tailwind */
  color: #007BFF;
}
.border-primary {
  border-color: #007BFF;
}
</style>
