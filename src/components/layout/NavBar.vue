<template>
  <nav
    class="bg-blue-400 text-white p-4 flex items-center justify-between rounded-lg m-4 relative"
    :class="{ 'animate-navbar': navbarVisible }"
  >
    <!-- Logo -->
    <div class="flex items-center">
      <router-link to="/dashboard"><img :src="logoIcon" alt="Logo" class="h-12 w-12"></router-link>
      <span class="ml-3 text-xl font-semibold">MedikOS</span>
    </div>

    <!-- Botón menú móvil -->
    <button @click="toggleMenu" class="md:hidden focus:outline-none">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- Overlay (cierra al hacer clic fuera) -->
    <transition name="fade">
      <div
        v-if="menuOpen"
        class="fixed inset-0 bg-opacity-30 z-40 md:hidden"
        @click="closeMenu"
      ></div>
    </transition>

    <!-- Menú desplegable móvil -->
    <transition name="slide-fade">
      <div
        v-if="menuOpen"
        class="fixed top-16 right-4 bg-blue-400 text-white md:hidden rounded-lg z-50 w-60 shadow-lg"
      >
        <div class="p-4">
          <router-link @click="closeMenu" to="/dashboard" class="block px-4 py-2 hover:bg-gray-700 rounded">Inicio</router-link>
          <router-link @click="closeMenu" to="/citas-medicas" class="block px-4 py-2 hover:bg-gray-700 rounded">Citas médicas</router-link>
          <router-link @click="closeMenu" to="/citas-medicas/registrar" class="block px-4 py-2 hover:bg-gray-700 rounded">Agendar cita</router-link>
          <router-link @click="closeMenu" to="/nota-medica" class="block px-4 py-2 hover:bg-gray-700 rounded">Nota médica</router-link>
          <router-link @click="closeMenu" to="/graficas" class="block px-4 py-2 hover:bg-gray-700 rounded">Gráficas</router-link>
          <router-link @click="closeMenu" to="/personal" class="block px-4 py-2 hover:bg-gray-700 rounded">Doctores</router-link>
          <router-link @click="closeMenu" to="/farmacia/medicamentos" class="block px-4 py-2 hover:bg-gray-700 rounded">Farmacia</router-link>
          <router-link @click="closeMenu" to="/perfil" class="block px-4 py-2 hover:bg-gray-700 rounded">Perfil</router-link>
          <router-link @click="closeMenu" to="/ayuda" class="block px-4 py-2 hover:bg-gray-700 rounded">Ayuda</router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script lang="ts">
import logoIcon from '../../assets/img/medik.png'

export default {
  name: 'NavBar',
  data() {
    return {
      menuOpen: false,
      logoIcon,
      navbarVisible: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      document.body.style.overflow = this.menuOpen ? 'hidden' : 'auto';
    },
    closeMenu() {
      this.menuOpen = false;
      document.body.style.overflow = 'auto';
    },
    handleScroll() {
      if (this.menuOpen) {
        this.closeMenu();
      }
    }
  },
  mounted() {
    this.navbarVisible = true;
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.body.style.overflow = 'auto';
  }
};
</script>

<style scoped>
/* Animación al cargar el navbar */
@keyframes slideDownFade {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-navbar {
  animation: slideDownFade 0.5s ease-out;
}

/* Transiciones para el menú móvil */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
