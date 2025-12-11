import { defineStore } from "pinia";
import { ref } from "vue";

export const useGrupoSanguineoStore = defineStore("grupoSanguineo", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData = ref<any>(null);
  const isWebSocketClosed = ref(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setChartData(data: any) {
    chartData.value = data;
    sessionStorage.setItem('chartData', JSON.stringify(data)); // Guardar en cache
  }

  function loadCachedData() {
    const cached = sessionStorage.getItem('chartData');
    if (cached) {
      chartData.value = JSON.parse(cached);
    }
  }

  function setWebSocketClosed(state: boolean) {
    isWebSocketClosed.value = state;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateCachedData(newData: any) {
    chartData.value = newData;
    sessionStorage.setItem('chartData', JSON.stringify(newData)); // actualizar sesión
  }

  return {
    chartData,
    isWebSocketClosed,
    setChartData,
    updateCachedData,
    setWebSocketClosed,
    loadCachedData
  };
});
