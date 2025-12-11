<template>
  <!-- Solo aplica min-h-screen a partir de md -->
  <div class="flex h-0 md:min-h-screen">
    <!-- Overlay móvil -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 md:hidden z-10"
      @click="isMobileMenuOpen = false"
    >
    </div>

    <!-- Sidebar -->
    <!-- Se aplica md:h-screen para que en desktop la sidebar abarque la altura de la pantalla, pero no en móvil -->
    <div
    class="bg-blue-400 transform transition-all duration-300 ease-in-out z-20 relative md:h-screen h-auto"
    @mouseenter="!isMobile() && (isExpanded = true)"
      @mouseleave="!isMobile() && (isExpanded = false)"
      :class="{
        'w-64': isExpanded || isMobileMenuOpen,
        'w-16 md:w-20': !isExpanded && !isMobileMenuOpen,
        '-translate-x-full md:translate-x-0': !isMobileMenuOpen
      }"
    >
      <div class="flex flex-col h-full">
        <!-- Encabezado con logo -->
        <div class="px-2 md:px-4 pt-8 flex-shrink-0">
          <div class="flex items-center justify-center md:justify-start mb-6">
            <div class="flex items-center">
              <router-link
                to="/dashboard"
                class="p-1.5 rounded flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <img :src="logoIcon" alt="Logo" class="w-12 h-12 object-contain" />
              </router-link>
              <h6
                class="ml-2 text-white font-semibold text-lg transition-all duration-200"
                :class="{
                  hidden: !isExpanded && !isMobileMenuOpen,
                  block: isExpanded || isMobileMenuOpen
                }"
              >
                MedikOS
              </h6>
            </div>
          </div>
        </div>

        <!-- Búsqueda -->
        <div class="px-2 md:px-4 mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 stroke-current" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              class="w-full rounded pl-8 pr-4 py-2 text-xs bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all duration-200"
              :class="{
                'opacity-100': isExpanded || isMobileMenuOpen,
                'opacity-0': !isExpanded && !isMobileMenuOpen
              }"
            />
          </div>
        </div>

        <!-- Menú principal -->
        <div class="px-2 md:px-4 flex-1 overflow-auto">
          <ul class="space-y-2">
            <li
              v-for="(item, index) in menuItems"
              :key="index"
              @mouseenter="hoveredMenuIndex = index"
              @mouseleave="hoveredMenuIndex = null"
            >
              <div
                @click="toggleSubMenu(index)"
                class="flex items-center p-2 text-sm cursor-pointer rounded-md transition-colors duration-200 hover:bg-white hover:text-blue-600"
                :class="{
                  'justify-center md:justify-start': !isExpanded && !isMobileMenuOpen,
                  'bg-white text-blue-600': activeSubMenu === index
                }"
              >
                <!-- Ícono -->
                <div class="w-5 h-5 flex-shrink-0">
                  <img
                    :src="(activeSubMenu === index || hoveredMenuIndex === index) ? item.iconGif : item.iconPng"
                    class="w-full h-full object-contain"
                    alt="Ícono"
                  />
                </div>
                <!-- Nombre del ítem -->
                <span
                  class="ml-3 truncate"
                  :class="{
                    hidden: !isExpanded && !isMobileMenuOpen,
                    'inline-block': isExpanded || isMobileMenuOpen
                  }"
                >
                  {{ item.name }}
                </span>
                <!-- Flecha para submenú -->
                <button
                  v-if="item.children"
                  class="ml-auto hidden"
                  :class="{ 'inline-block': isExpanded || isMobileMenuOpen }"
                  aria-label="Toggle submenu"
                >
                  <svg
                    class="w-4 h-4 transform transition-transform duration-200"
                    :class="{ 'rotate-180': activeSubMenu === index }"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.25 10.75L12 14.25L8.75 10.75"
                    />
                  </svg>
                </button>
              </div>

              <!-- Submenú -->
              <div
                v-if="item.children"
                class="mt-1 ml-2 pl-4 border-l border-gray-800 transition-all duration-300 overflow-hidden"
                :class="{
                  'max-h-0': activeSubMenu !== index,
                  'max-h-96': activeSubMenu === index
                }"
                @mouseleave="handleMouseLeave(index)"
                @mouseenter="handleMouseEnter"
              >
                <router-link
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  :to="child.route"
                  class="block px-4 py-2 text-xs text-gray-800 hover:text-white hover:bg-blue-600 rounded-md transition-colors duration-200"
                  @click="closeSubMenu"
                >
                  {{ child.name }}
                </router-link>
              </div>
            </li>
          </ul>
        </div>

        <!-- Perfil / Cerrar sesión -->
        <div class="px-2 md:px-4 pb-3 bg-blue-400">
          <hr class="border-t border-white/50 my-2" />
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="relative w-8 h-8 rounded-full">
                <img
                  class="rounded-full object-cover w-full h-full"
                  src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                  alt="Avatar"
                />
              </div>
              <div
                class="ml-3 truncate"
                :class="{
                  hidden: !isExpanded && !isMobileMenuOpen,
                  block: isExpanded || isMobileMenuOpen
                }"
              >
                <div class="text-sm text-white">{{ username }}</div>
                <span class="text-xs text-white">{{ email }}</span>
              </div>
            </div>
            <!-- Botón Cerrar sesión -->
            <div
              @click="showLogoutModal = true"
              class="flex items-center p-2 text-sm cursor-pointer rounded-md transition-colors duration-200 hover:bg-white hover:text-blue-600 absolute bottom-24 left-4"
              :class="{
                hidden: !isExpanded && !isMobileMenuOpen,
                flex: isExpanded || isMobileMenuOpen
              }"
            >
              <div class="w-5 h-5 flex-shrink-0">
                <img :src="logOut" alt="Cerrar sesión" class="w-full h-full object-contain" />
              </div>
              <span class="ml-3 truncate">Cerrar sesión</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Confirmación Logout -->
  <transition name="slide-up">
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 z-50 flex items-end justify-start md:items-end md:justify-start bg-black/30"
      @click.self="showLogoutModal = false"
    >
      <div class="bg-white text-gray-800 p-4 m-4 rounded-xl shadow-lg w-64">
        <p class="text-sm mb-3">¿Deseas cerrar sesión?</p>
        <div class="flex justify-end gap-2">
          <button
            @click="showLogoutModal = false"
            class="text-xs px-3 py-1 rounded-md border border-gray-400 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmLogout"
            class="text-xs px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logoIcon from '/medilogop.png'

// Importa imágenes de forma estática en lugar de usar import.meta.url
import dashboardPng from '@/assets/img/dashboard.png'
import dashboardGif from '@/assets/img/dashboard.gif'
import agendaPng from '@/assets/img/agenda.png'
import agendaGif from '@/assets/img/agenda.gif'
import notasPng from '@/assets/img/notas.png'
import notasGif from '@/assets/img/notas.gif'
import graficaPng from '@/assets/img/grafica-de-ondas.png'
import graficaGif from '@/assets/img/grafica-de-ondas.gif'
import usuarioPng from '@/assets/img/usuario.png'
import usuarioGif from '@/assets/img/usuario.gif'
import ayudaPng from '@/assets/img/mesa-de-ayuda.png'
import ayudaGif from '@/assets/img/mesa-de-ayuda.gif'
import logOut from '@/assets/img/logOut.png'
import type { MenuItem } from '@/interfaces/sideBar'

import { useGrupoSanguineoStore } from "@/store/useGrupoSanguineoStore";
import { useSocket } from "@/services/sockets/socket";

const router = useRouter()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { connect: connectWebSocket, close } = useSocket();

// Estados de control
const isExpanded = ref<boolean>(false)
const isMobileMenuOpen = ref<boolean>(false)
const activeSubMenu = ref<number | null>(null)
const hoveredMenuIndex = ref<number | null>(null)

// Datos de usuario
const username = sessionStorage.getItem('Nombre')
const email = sessionStorage.getItem('Email')
const userRole = sessionStorage.getItem('Rol')

// Menú: ítems con versiones PNG y GIF
const menuItems: MenuItem[] = reactive<MenuItem[]>([
  {
    name: 'Dashboard',
    iconPng: dashboardPng,
    iconGif: dashboardGif,
    route: '/dashboard'
  },
  {
    name: 'Citas médicas',
    iconPng: agendaPng,
    iconGif: agendaGif,
    children: [
      { name: 'Todas las citas', route: '/citas-medicas' },
      { name: 'Chat', route: '/chat' },
      { name: 'Agendar', route: '/citas-medicas/registrar' }
    ]
  },
  {
    name: 'Nota médica',
    iconPng: notasPng,
    iconGif: notasGif,
    route: '/nota-medica'
  },
  {
    name: 'Gráficas',
    iconPng: graficaPng,
    iconGif: graficaGif,
    route: '/graficas'
  },
  {
    name: 'Farmacia',
    iconPng: graficaPng,
    iconGif: graficaGif,
    route: '/farmacia/medicamentos'
  },
  {
    name: 'Doctores',
    iconPng: graficaPng,
    iconGif: graficaGif,
    route: '/personal'
  },
  {
    name: 'Perfil',
    iconPng: usuarioPng,
    iconGif: usuarioGif,
    route: '/perfil'
  },
  {
    name: 'Ayuda',
    iconPng: ayudaPng,
    iconGif: ayudaGif,
    route: '/ayuda'
  },
  ...(userRole === 'Paciente'
    ? [{
      name: 'Paciente (temporal)',
      iconPng: ayudaPng,
      iconGif: ayudaGif,
      route: '/patientChat'
    }]
    : []),
  ...(userRole === 'Médico General'
    ? [{
      name: 'Doctor (temporal)',
      iconPng: ayudaPng,
      iconGif: ayudaGif,
      route: '/doctorChat'
    }]
    : [])
])

const toggleSubMenu = (index: number): void => {
  const item = menuItems[index]
  if (item.children) {
    activeSubMenu.value = activeSubMenu.value === index ? null : index
  } else if (item.route) {
    router.push(item.route)
  }
}

const logout = async () => {
  router.replace('/login')
  sessionStorage.removeItem('token')
  localStorage.removeItem('token')
  sessionStorage.removeItem('id')
  sessionStorage.removeItem('Rol')
  localStorage.removeItem('cacheKey')
  localStorage.removeItem('organigramaHospitalData')
  localStorage.removeItem('chartData')
}

let collapseTimeout: ReturnType<typeof setTimeout> | null = null
const isMobile = () => window.innerWidth < 768

const handleMouseLeave = (index: number) => {
  if (isMobile()) return
  collapseTimeout = setTimeout(() => {
    if (activeSubMenu.value === index) {
      activeSubMenu.value = null
    }
  }, 400)
}
const handleMouseEnter = () => {
  if (collapseTimeout) {
    clearTimeout(collapseTimeout)
    collapseTimeout = null
  }
}
const closeSubMenu = () => {
  if (isMobile()) {
    activeSubMenu.value = null
    isMobileMenuOpen.value = false
  }
}
const showLogoutModal = ref(false)

const confirmLogout = () => {
  showLogoutModal.value = false
  logout()
}
onMounted(() => {
  // Conexión WebSocket
  connectWebSocket()
  const grupoStore = useGrupoSanguineoStore()
  grupoStore.loadCachedData()
})
</script>

<style scoped>
/* Estilos para íconos */
.icon-image {
  transition: filter 0.2s ease;
}

.icon-image:hover {
  filter: brightness(1.2);
}

/* Transiciones para submenú */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
