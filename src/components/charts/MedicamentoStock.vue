<template>
  <div ref="chartdiv" class="chart-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default defineComponent({
  name: "MedicationsGroupedChart",
  setup() {
    const chartdiv = ref<HTMLElement | null>(null);
    let root: am5.Root | null = null;
    // Definir umbral para marcar en rojo los valores bajos
    const lowThreshold = 15;

    // Datos de ejemplo: cada objeto representa un medicamento
    const data = [
      { name: "Paracetamol", inventario: 50, venta: 40 },
      { name: "Ibuprofeno", inventario: 30, venta: 25 },
      { name: "Amoxicilina", inventario: 20, venta: 15 },
      { name: "Loratadina", inventario: 40, venta: 35 },
      { name: "Omeprazol", inventario: 10, venta: 8 } // Se marcará en rojo
    ];

    onMounted(() => {
      if (!chartdiv.value) return;

      // Crear el root de amCharts
      root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);

      // Crear el gráfico XY
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout
        })
      );

      // Agregar leyenda centrada
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );

      // Crear eje X, usando el campo "name" para las categorías (medicamento)
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "name",
          renderer: am5xy.AxisRendererX.new(root, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
            minGridDistance: 30
          }),
          tooltip: am5.Tooltip.new(root, {})
        })
      );
      xAxis.get("renderer").grid.template.set("forceHidden", true);
      xAxis.data.setAll(data);

      // Crear eje Y para los valores
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Función para crear series (columnas agrupadas) para cada campo (inventario o venta)
      function makeSeries(name: string, fieldName: string, color: am5.Color) {
        const series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            stacked: true,
            valueYField: fieldName,
            categoryXField: "name",
            stroke: color,
            fill: color
          })
        );

        series.columns.template.setAll({
          tooltipText: "{name}\n{categoryX}: {valueY}",
          width: am5.percent(90),
          tooltipY: 0
        });
        series.data.setAll(data);

        // Adaptador para cambiar a rojo la columna si el valor es menor al umbral
        series.columns.template.adapters.add("fill", (fill, target) => {
          const dataItem = target.dataItem;
          if (dataItem && dataItem.dataContext) {
            const value = dataItem.dataContext[fieldName];
            if (value < lowThreshold) {
              return am5.color(0xff0000); // rojo
            }
          }
          return fill;
        });
        series.columns.template.adapters.add("stroke", (stroke, target) => {
          const dataItem = target.dataItem;
          if (dataItem && dataItem.dataContext) {
            const value = dataItem.dataContext[fieldName];
            if (value < lowThreshold) {
              return am5.color(0xff0000); // rojo
            }
          }
          return stroke;
        });

        series.appear();
        legend.data.push(series);
        return series;
      }

      // Crear series: Inventario y Venta
      makeSeries("Inventario", "inventario", am5.color(0x216e6a));
      makeSeries("Venta", "venta", am5.color(0x133f3d));

      // Animar el gráfico al cargar
      chart.appear(1000, 100);
    });

    onUnmounted(() => {
      if (root) {
        root.dispose();
        root = null;
      }
    });

    return { chartdiv };
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>
