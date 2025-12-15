<template>
  <div>
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <VueDatePicker v-model="fromDate" :enable-time="false" :clearable="true" placeholder="Desde" class="w-48" />
      <VueDatePicker v-model="toDate" :enable-time="false" :clearable="true" placeholder="Hasta" class="w-48" />
      <button class="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600" @click="applyRange">Aplicar</button>
      <button class="px-3 py-1 rounded-md bg-gray-400 text-white hover:bg-gray-500" @click="clearCache">Actualizar datos</button>
    </div>
    <div ref="chartDiv" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

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
const fromDate = ref<Date | null>(null);
const toDate = ref<Date | null>(null);

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
  // Agrupar por diagnóstico y por día, sumando totales cuando haya duplicados.
  const porDiagnostico: Record<string, Record<string, number>> = {};

  rawData.forEach(item => {
    const { diagnostico, year, month, day } = item._id;
    // Usar UTC para evitar desfases por zona horaria.
    const fechaUTC = new Date(Date.UTC(year, month - 1, day));
    const claveDia = fechaUTC.toISOString().slice(0, 10); // yyyy-MM-dd

    if (!porDiagnostico[diagnostico]) porDiagnostico[diagnostico] = {};
    porDiagnostico[diagnostico][claveDia] = (porDiagnostico[diagnostico][claveDia] || 0) + item.total;
  });

  // Transformar a arreglo de series ordenadas por fecha.
  const result: EnfermedadData[] = [];
  Object.keys(porDiagnostico).forEach(diagnostico => {
    const puntos: NotaData[] = Object.entries(porDiagnostico[diagnostico])
      .map(([dia, total]) => ({ date: new Date(dia).toISOString(), value: total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    result.push({ diagnostico, data: puntos });
  });

  return result;
}

// --- 7. Función para obtener datos con caché ---
async function getChartData(): Promise<RawData[]> {
  const cacheKey = "notasMedicasChartData";
  const disableCache = import.meta.env.DEV; // En desarrollo, ignora caché para depurar.
  // Intenta obtener datos guardados en localStorage
  const cached = localStorage.getItem(cacheKey);
  if (cached && !disableCache) {
    console.log("Usando datos en caché");
    return JSON.parse(cached) as RawData[];
  }

  // Si no hay datos en caché, realiza la petición con axios
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.warn("Token faltante: no se puede consultar notas médicas");
  }
  // Agregar rango de fechas como query si está definido
  const toISODate = (d: Date) => d.toISOString().slice(0, 10);
  const params = new URLSearchParams();
  if (fromDate.value) params.append('from', toISODate(fromDate.value));
  if (toDate.value) params.append('to', toISODate(toDate.value));
  const baseUrl = `${import.meta.env.VITE_URL}notas-medicas/multiple`;
  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  
  console.log("🌐 Llamando a API:");
  console.log("  URL:", url);
  console.log("  Token presente:", !!token);
  console.log("  Rango fechas:", fromDate.value ? toISODate(fromDate.value) : 'sin desde', '-', toDate.value ? toISODate(toDate.value) : 'sin hasta');
  
  const response = await axios.get<RawData[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log("✅ Respuesta recibida:");
  console.log("  Total de registros:", response.data.length);
  console.log("  Diagnósticos únicos en respuesta:", [...new Set(response.data.map(r => r._id.diagnostico))]);
  console.log("  Datos completos:", response.data);
  
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
    // Mostrar cada punto tal cual sin agrupación automática.
    groupData: false,
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
  }));

  // Crear eje Y (ValueAxis)
  const valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));

  try {
    // --- 9. Obtener datos (desde caché o mediante axios) ---
    let rawData: RawData[] = [];
    try {
      rawData = await getChartData();
      console.log("RawData tamaño:", rawData.length);
    } catch (error) {
      console.warn("No se pudieron cargar datos de la API, usando datos de ejemplo", error);
      // Datos de ejemplo para mostrar la gráfica
      rawData = [
        { _id: { diagnostico: "Neumonía", year: 2025, month: 1, day: 1 }, total: 5 },
        { _id: { diagnostico: "Neumonía", year: 2025, month: 1, day: 5 }, total: 8 },
        { _id: { diagnostico: "Colitis ulcerativa", year: 2025, month: 1, day: 2 }, total: 3 },
        { _id: { diagnostico: "Migraña crónica", year: 2025, month: 1, day: 3 }, total: 4 },
        { _id: { diagnostico: "Otitis media", year: 2025, month: 1, day: 4 }, total: 2 }
      ];
    }

    let enfermedades = transformarDatos(rawData);
    console.log("📊 Total de diagnósticos únicos encontrados:", enfermedades.length);
    console.log("📋 Lista completa de diagnósticos:", enfermedades.map(e => e.diagnostico));
    console.log("🔍 Detalle de cada serie:");
    enfermedades.forEach(e => {
      console.log(`  - ${e.diagnostico}: ${e.data.length} puntos`);
    });
    console.log("Series transformadas completas:", enfermedades);
    // Mostrar todas las series que venga del backend (sin filtrar por lista permitida)

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

      // Suavizado y estilo de línea
      lineSeries.setAll({
        tensionX: 0.8,
        tensionY: 0.8
      });

      // Convertir fechas a timestamp y asignar el valor
      const seriesData = item.data.map(d => ({
        date: new Date(d.date).getTime(),
        value: d.value
      }));
      // Ordenar por fecha ascendente para una línea correcta
      seriesData.sort((a, b) => a.date - b.date);
      // Filtrar por rango si está definido
      if (fromDate.value || toDate.value) {
        const fromTs = fromDate.value ? Date.UTC(fromDate.value.getFullYear(), fromDate.value.getMonth(), fromDate.value.getDate()) : -Infinity;
        const toTs = toDate.value ? Date.UTC(toDate.value.getFullYear(), toDate.value.getMonth(), toDate.value.getDate()) : Infinity;
        const filtered = seriesData.filter(p => p.date >= fromTs && p.date <= toTs);
        console.log(`Serie ${item.diagnostico} filtrada (${filtered.length} puntos)`, filtered);
        lineSeries.data.setAll(filtered);
      } else {
        lineSeries.data.setAll(seriesData);
      }
      console.log(`Serie ${item.diagnostico} puntos:`, seriesData.length);
      console.table(seriesData);

      // Asignar color según el diccionario
      const colorHex = colorMap[item.diagnostico] ?? 0x8e24aa;
      lineSeries.strokes.template.setAll({
        stroke: am5.color(colorHex),
        strokeWidth: 3,
        strokeOpacity: 0.9
      });
      lineSeries.fills.template.setAll({ visible: false });

      // Puntos en la línea
      lineSeries.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: lineSeries.get("stroke"),
            stroke: am5.color(0xffffff),
            strokeWidth: 1
          })
        });
      });

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

function applyRange() {
  // Regenerar el gráfico con el rango seleccionado
  if (root) {
    root.dispose();
  }
  initChart();
}

function clearCache() {
  localStorage.removeItem('notasMedicasChartData');
  if (root) {
    root.dispose();
  }
  initChart();
}

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
