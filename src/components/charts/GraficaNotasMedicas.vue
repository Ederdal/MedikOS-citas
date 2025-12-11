<template>
  <div ref="chartDiv" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import axios from 'axios';

// --- 1. Tipos de datos ---
interface RawData {
  _id: {
    diagnostico: string;
    year: number;
    month: number;
    day: number;
  };
  total: number;
}

interface NotaData {
  date: string; // Fecha en formato ISO
  value: number;
}

interface EnfermedadData {
  diagnostico: string;
  data: NotaData[];
}

// --- 2. Referencia al contenedor de la gráfica ---
const chartDiv = ref<HTMLDivElement | null>(null);

// --- 3. Variables de amCharts ---
let root: am5.Root;
let chart: am5xy.XYChart;
let dateAxis: am5xy.DateAxis<am5xy.AxisRenderer>;

// --- 4. Diccionario de colores para cada diagnóstico ---
const colorMap: Record<string, number> = {
  "Neumonía": 0xe53935,
  "Colitis ulcerativa": 0xfb8c00,
  "Migraña crónica": 0xfdd835,
  "Otitis media": 0x43a047,
  "Infección respiratoria aguda": 0x1e88e5
};

// --- 5. Lista de diagnósticos permitidos ---
const diagnosticosPermitidos = [
  "Neumonía",
  "Colitis ulcerativa",
  "Migraña crónica",
  "Otitis media",
  "Infección respiratoria aguda"
];

// --- 6. Función para transformar los datos crudos ---
function transformarDatos(rawData: RawData[]): EnfermedadData[] {
  const map: Record<string, NotaData[]> = {};

  rawData.forEach(item => {
    const { diagnostico, year, month, day } = item._id;
    const fecha = new Date(year, month - 1, day); // Mes indexado desde 0
    const nota: NotaData = {
      date: fecha.toISOString(),
      value: item.total
    };
    if (!map[diagnostico]) {
      map[diagnostico] = [];
    }
    map[diagnostico].push(nota);
  });

  return Object.keys(map).map(diagnostico => ({
    diagnostico,
    data: map[diagnostico]
  }));
}

// --- 7. Función para obtener datos con caché ---
async function getChartData(): Promise<RawData[]> {
  const cacheKey = "chartData";
  // Intenta obtener datos guardados en localStorage
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    console.log("Usando datos en caché");
    return JSON.parse(cached) as RawData[];
  }

  // Si no hay datos en caché, realiza la petición con axios
  const token = sessionStorage.getItem('token');
  const url = `${import.meta.env.VITE_URL}notas-medicas/multiple`;
  const response = await axios.get<RawData[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  // Guarda la data en caché para la siguiente recarga
  localStorage.setItem(cacheKey, JSON.stringify(response.data));
  return response.data;
}

// --- 8. Función para inicializar la gráfica ---
async function initChart() {
  if (!chartDiv.value) return;

  // Crear instancia raíz y aplicar tema Animated
  root = am5.Root.new(chartDiv.value);
  root.setThemes([am5themes_Animated.new(root)]);

  // Crear el XYChart
  chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    layout: root.verticalLayout
  }));

  // Crear eje X (DateAxis) con agrupación automática
  dateAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "day", count: 1 },
    groupData: true,
    groupIntervals: [
      { timeUnit: "day", count: 1 },
      { timeUnit: "week", count: 1 },
      { timeUnit: "month", count: 1 }
    ],
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
  }));

  // Crear eje Y (ValueAxis)
  const valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));

  try {
    // --- 9. Obtener datos (desde caché o mediante axios) ---
    const rawData = await getChartData();
    let enfermedades = transformarDatos(rawData);

    // Filtrar diagnósticos permitidos
    enfermedades = enfermedades.filter(e =>
      diagnosticosPermitidos.includes(e.diagnostico)
    );

    // --- 10. Crear una serie de línea por cada diagnóstico ---
    enfermedades.forEach(item => {
      const lineSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: item.diagnostico,
        xAxis: dateAxis,
        yAxis: valueAxis,
        valueXField: "date",
        valueYField: "value",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{name}: {valueY}"
        })
      }));

      // Convertir fechas a timestamp y asignar el valor
      const seriesData = item.data.map(d => ({
        date: new Date(d.date).getTime(),
        value: d.value
      }));
      lineSeries.data.setAll(seriesData);

      // Asignar color según el diccionario
      const colorHex = colorMap[item.diagnostico] ?? 0x8e24aa;
      lineSeries.strokes.template.setAll({
        stroke: am5.color(colorHex),
        strokeWidth: 2,
        strokeOpacity: 0.9
      });
      lineSeries.fills.template.setAll({ visible: false });
    });

    // --- 11. Agregar leyenda y configurar el cursor ---
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));
    legend.data.setAll(chart.series.values);

    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

// --- 12. Ciclo de vida: Montaje y desmontaje ---
onMounted(() => {
  initChart();
});

onUnmounted(() => {
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
</style>
