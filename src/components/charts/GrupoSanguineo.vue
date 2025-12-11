<template>
  <div>
    <div ref="chartdiv" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useGrupoSanguineoStore } from "@/store/useGrupoSanguineoStore";

const chartdiv = ref<HTMLElement | null>(null);
let root: am5.Root | null = null;
let series: am5hierarchy.ForceDirected | null = null;

const grupoStore = useGrupoSanguineoStore();

onMounted(() => {
  if (!chartdiv.value) return;

  root = am5.Root.new(chartdiv.value);
  root.setThemes([am5themes_Animated.new(root)]);

  series = root.container.children.push(
    am5hierarchy.ForceDirected.new(root, {
      centerStrength: 0.7,
      manyBodyStrength: -20,
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      minRadius: 30,
      maxRadius: 80
    })
  );

  series.setAll({
    width: am5.percent(100),
    height: am5.percent(100)
  });

  series.labels.template.setAll({
    oversizedBehavior: "wrap",
    textAlign: "center"
  });

  series.nodes.template.set("tooltipText", "{category}: {value}");

  grupoStore.loadCachedData();


});

watch(
  () => grupoStore.chartData,
  (newData) => {
    if (newData && series) {
      if (series.dataItems.length === 0) {
        series.data.setAll([newData]);
      } else {
        const rootDataItem = series.dataItems[0];
        if (rootDataItem) {
          updateNodeValues(rootDataItem, newData);
          series.data.setAll([newData]);
        }
      }
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateNodeValues(dataItem: any, newData: any) {
  if (newData.value !== undefined) {
    const currentValue = dataItem.get("value");
    dataItem.animate({
      key: "value",
      from: currentValue,
      to: newData.value,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }
  if (newData.children && dataItem.children) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newData.children.forEach((newChild: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchingChild = dataItem.children.values.find((child: any) => child.dataContext.name === newChild.name);
      if (matchingChild) {
        updateNodeValues(matchingChild, newChild);
      }
    });
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 90vh;
  min-height: 300px;
  max-height: 90vh;
}

@media (min-width: 768px) {
  .chart-container {
    height: 75vh;
  }
}

@media (min-width: 1280px) {
  .chart-container {
    height: 85vh;
  }
}
</style>
