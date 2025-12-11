<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-colors animate-slide-up">
    <h2 class="text-xl font-bold text-black mb-4 text-center">Actividad de Doctores</h2>
    <div id="doctor-pie" class="w-full h-96"></div>
  </div>
</template>

<script setup lang="ts">
import * as am5 from "@amcharts/amcharts5"
import * as am5percent from "@amcharts/amcharts5/percent"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import { onMounted, onBeforeUnmount } from "vue"

let root: am5.Root
let updateInterval: ReturnType<typeof setInterval>
let series: am5percent.PieSeries

// Función para generar valores aleatorios para los doctores
function generateRandomDoctorData() {
  return [
    { doctor: "Dra. Ana", value: Math.floor(Math.random() * 50) + 10 },
    { doctor: "Dr. Luis", value: Math.floor(Math.random() * 50) + 10 },
    { doctor: "Dra. Sofía", value: Math.floor(Math.random() * 50) + 10 },
    { doctor: "Dr. Marco", value: Math.floor(Math.random() * 50) + 10 },
    { doctor: "Otro", value: Math.floor(Math.random() * 30) + 5 }
  ]
}

onMounted(() => {
  root = am5.Root.new("doctor-pie")
  root.setThemes([am5themes_Animated.new(root)])

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout
    })
  )

  series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "doctor",
      alignLabels: true
    })
  )

  series.labels.template.setAll({
    textType: "circular",
    radius: 15
  })

  series.slices.template.setAll({
    cornerRadius: 10,
    tooltipText: "{category}: {value} atenciones",
    interactive: true
  })

  // Primeros datos iniciales
  const initialData = generateRandomDoctorData()
  series.data.setAll(initialData)

  series.appear(1000, 100)
  chart.appear(1000, 100)

  // Actualizar cada 3 segundos con nuevos datos
  updateInterval = setInterval(() => {
    const newData = generateRandomDoctorData()
    series.data.setAll(newData)
  }, 3000)
})

onBeforeUnmount(() => {
  if (root) root.dispose()
  if (updateInterval) clearInterval(updateInterval)
})
</script>

<style scoped>
#doctor-pie {
  width: 100%;
  height: 400px;
}
</style>
