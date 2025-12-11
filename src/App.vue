<template>
  <UApp>
    <div class="h-screen flex flex-col md:flex-row">
      <!-- Navbar superior en móvil y escritorio -->
      <div v-if="!['/login', '/registro', '/'].includes(route.path)" class="md:hidden z-50">
        <NavBar @toggle-sidebar="toggleSidebar" />
      </div>

      <!-- Sidebar solo si no estamos en login o registro -->
      <template v-if="!['/login', '/registro', '/'].includes(route.path)">
        <SideBar
          :class="{
            'fixed top-0 left-0 z-40 md:static md:z-auto': true,
            'translate-x-0': isMobileMenuOpen,
            '-translate-x-full md:translate-x-0': !isMobileMenuOpen,
            'transition-transform duration-300 ease-in-out': true
          }"
        />

        <!-- Contenido Principal -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <div v-if="route.path === '/dashboard'" class="hidden md:block">
            <NavBar @toggle-sidebar="toggleSidebar" />
          </div>
          <main class="flex-1 p-4 overflow-y-auto bg-gray-100">
            <router-view />
          </main>
        </div>
      </template>

      <!-- Si está en /login o /registro, solo se muestra router-view -->
      <template v-else>
        <router-view class="flex-1" />
      </template>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMobileMenuOpen = ref(false);

const toggleSidebar = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
