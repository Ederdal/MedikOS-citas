<template>
  <h2 class="text-xl font-semibold text-gray-800 mb-4">📊 Estadísticas</h2>
  <div id="chart-estadisticas" class="w-full h-64"></div>
</template>

<script lang="ts" setup>
import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import { onMounted, onBeforeUnmount } from 'vue'

// Gráfica dinámica
let chartRoot: am5.Root
let updateInterval: ReturnType<typeof setInterval>
let xAxis: am5xy.CategoryAxis<am5xy.AxisRenderer>
let series: am5xy.ColumnSeries

function getRandomData() {
  return [
    { categoria: "Pacientes hoy", valor: Math.floor(Math.random() * 100) },
    { categoria: "Ocupación camas", valor: Math.floor(Math.random() * 100) }
  ]
}

onMounted(() => {
  chartRoot = am5.Root.new("chart-estadisticas")
  chartRoot.setThemes([am5themes_Animated.new(chartRoot)])

  const chart = chartRoot.container.children.push(
    am5xy.XYChart.new(chartRoot, {
      layout: chartRoot.verticalLayout
    })
  )

  xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(chartRoot, {
      categoryField: "categoria",
      renderer: am5xy.AxisRendererX.new(chartRoot, { minGridDistance: 5 })
    })
  )

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(chartRoot, {
      renderer: am5xy.AxisRendererY.new(chartRoot, {})
    })
  )

  series = chart.series.push(
    am5xy.ColumnSeries.new(chartRoot, {
      name: "Datos",
      xAxis,
      yAxis,
      valueYField: "valor",
      categoryXField: "categoria",
      tooltip: am5.Tooltip.new(chartRoot, {
        labelText: "{categoryX}: {valueY}"
      })
    })
  )

  const initialData = getRandomData()
  xAxis.data.setAll(initialData)
  series.data.setAll(initialData)

  series.appear(1000)
  chart.appear(1000, 100)

  updateInterval = setInterval(() => {
    const newData = getRandomData()
    xAxis.data.setAll(newData)
    series.data.setAll(newData)
  }, 30000)
})

onBeforeUnmount(() => {
  if (chartRoot) chartRoot.dispose()
  if (updateInterval) clearInterval(updateInterval)
})


</script>
