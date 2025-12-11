<template>
  <div ref="chartdiv" class="chart-container"></div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from 'axios';
import router from '@/router';

export default {
  name: "OrganigramaHospital",
  setup() {
    const chartdiv = ref<HTMLElement | null>(null);
    let root: am5.Root | null = null;

    interface Node {
      name: string;
      value?: number;
      children?: Node[];
      tipo?: string;
      responsable?: string;
      personalId?: string;
    }

    // Función recursiva para asignar valores a cada nodo
    const assignValues = (node: Node): void => {
      if (!node.children || node.children.length === 0) {
        node.value = 1;
      } else {
        let sum = 0;
        node.children.forEach((child: Node) => {
          assignValues(child);
          sum += child.value ?? 0;
        });
        node.value = sum;
      }
    };

    // Función para obtener los datos con caché
    const getOrganigramaData = async (): Promise<Node> => {
      const cacheKey = "organigramaHospitalData";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log("Usando datos en caché");
        return JSON.parse(cached) as Node;
      }
      // Obtener el token desde sessionStorage (o localStorage)
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_URL}graficas/hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Datos obtenidos de la API:", response);
      // Guarda los datos en la caché para la siguiente recarga
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      return response.data;
    };

    onMounted(async () => {
      if (!chartdiv.value) return;

      root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5hierarchy.Sunburst.new(root, {
          singleBranchOnly: true,
          downDepth: 1,
          initialDepth: 2,
          valueField: "value",
          categoryField: "name",
          childDataField: "children",
        })
      );

      // Adaptador de tooltip para personalizar el texto según el tipo de nodo
      chart.nodes.template.adapters.add("tooltipText", (text, target) => {
        const data = target.dataItem?.dataContext as Node;
        if (data.tipo === "doctor" || data.tipo === "enfermero") {
          return "{category}: {value}";
        }
        if (data.name === "Hospital") {
          return "{category}: {value}\n" + data.responsable;
        }
        if (data.responsable) {
          return "{category}: {value}\nResponsable: " + data.responsable;
        }
        return "{category}: {value}";
      });

      // Listener de clic para redirigir a la ruta del doctor o enfermero, si existe personalId
      chart.nodes.template.events.on("click", (e) => {
        const dataContext = e.target.dataItem?.dataContext as Node;
        if (!dataContext) return;
        if (dataContext.personalId) {
          if (dataContext.tipo === "doctor") {
            router.push(`/personal/doctor/${dataContext.personalId}`);
          } else if (dataContext.tipo === "enfermero") {
            router.push(`/personal/enfermero/${dataContext.personalId}`);
          }
        }
      });

      try {
        // Obtener datos desde caché o mediante axios
        const data = await getOrganigramaData();
        console.log("Datos recibidos:", data);

        // Filtrar áreas que se desean ignorar
        if (data.children && Array.isArray(data.children)) {
          data.children = data.children.filter((area: Node) => {
            return area.name !== "Departamentos Administrativos" && area.name !== "Servicios de Apoyo";
          });
        }

        // Asigna los valores recursivamente
        assignValues(data);

        // Establecer la data en el gráfico
        chart.data.setAll([data]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    });

    onUnmounted(() => {
      if (root) {
        root.dispose();
        root = null;
      }
    });

    return { chartdiv };
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 60vh;
  min-height: 300px;
  max-height: 90vh;
}

@media (min-width: 768px) {
  .chart-container {
    height: 70vh;
  }
}

@media (min-width: 1280px) {
  .chart-container {
    height: 80vh;
  }
}
</style>
