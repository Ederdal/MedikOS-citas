<template>
    <div ref="chartDiv" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// Referencia al div donde se montará la gráfica
const chartDiv = ref<HTMLDivElement | null>(null);

// Variables de amCharts
let root!: am5.Root;
let chart!: am5xy.XYChart;
let xAxis!: am5xy.CategoryAxis<am5xy.AxisRenderer>;
let yAxis!: am5xy.ValueAxis<am5xy.AxisRenderer>;
let series!: am5xy.ColumnSeries;

onMounted(() => {
  if (!chartDiv.value) return;

  // 1. Crear el root
  root = am5.Root.new(chartDiv.value);

  // 2. Aplicar tema animado
  root.setThemes([am5themes_Animated.new(root)]);

  // 3. Crear XYChart
  chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      paddingLeft: 0
    })
  );

  // 4. Agregar cursor (opcional)
  const cursor = am5xy.XYCursor.new(root, {});
  cursor.lineY.set("visible", false);
  chart.set("cursor", cursor);
  // 5. Eje X (CategoryAxis)
  const xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 30,
    minorGridEnabled: true
  });
  xRenderer.grid.template.set("visible", false);

  xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "name", // campo que identifica la categoría
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  // 6. Eje Y (ValueAxis)
  const yRenderer = am5xy.AxisRendererY.new(root, {});
  yRenderer.grid.template.setAll({
    strokeDasharray: [2, 2]
  });

  yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: 0,
    extraMax: 0.1,
    renderer: yRenderer
  }));

  // 7. Crear la serie ColumnSeries
  series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Pacientes",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",    // campo con los valores numéricos
    categoryXField: "name",  // campo con la categoría (niño/a, adulto mayor, etc.)
    sequencedInterpolation: true,
    tooltip: am5.Tooltip.new(root, {
      dy: -25,
      labelText: "{valueY}"
    })
  }));

  // Ajustes de las columnas
  series.columns.template.setAll({
    cornerRadiusTL: 5,
    cornerRadiusTR: 5,
    strokeOpacity: 0
  });

  // Asignar colores a las columnas según su índice
  series.columns.template.adapters.add("fill", (_fill, target) => {
    return chart.get("colors")!.getIndex(series.columns.indexOf(target));
  });
  series.columns.template.adapters.add("stroke", (_stroke, target) => {
    return chart.get("colors")!.getIndex(series.columns.indexOf(target));
  });

  // 8. Datos de ejemplo: categorías de pacientes
  // Reemplaza las imágenes (src) con las que desees usar
  const data = [
    {
      name: "Niño/a",
      value: 250,
      bulletSettings: { src: "https://cdn-icons-png.flaticon.com/512/4225/4225123.png" }
    },
    {
      name: "Adulto mayor",
      value: 180,
      bulletSettings: { src: "https://cdn-icons-png.flaticon.com/128/2926/2926448.png" }
    },
    {
      name: "Mujer",
      value: 350,
      bulletSettings: { src: "https://cdn-icons-png.flaticon.com/128/4829/4829575.png" }
    },
    {
      name: "Hombre",
      value: 220,
      bulletSettings: { src: "https://cdn-icons-png.flaticon.com/128/921/921039.png" }
    }
  ];

  // 9. Bullets (imágenes) sobre las columnas
  series.bullets.push(() => {
    return am5.Bullet.new(root, {
      locationY: 1,
      sprite: am5.Picture.new(root, {
        templateField: "bulletSettings",
        width: 50,
        height: 50,
        centerX: am5.p50,
        centerY: am5.p50,
        shadowColor: am5.color(0x000000),
        shadowBlur: 4,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowOpacity: 0.6
      })
    });
  });

  // 10. Asignar los datos a ejes y serie
  xAxis.data.setAll(data);
  series.data.setAll(data);

  // 11. Animar la aparición
  series.appear(1000);
  chart.appear(1000, 100);
});

onUnmounted(() => {
  // Destruir amCharts para evitar fugas de memoria
  if (root) {
    root.dispose();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}

h2 {
  color: black;
}
</style>
