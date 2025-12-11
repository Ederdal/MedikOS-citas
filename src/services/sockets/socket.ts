import { useChatStore } from "@/store/chatStore";
import { useGrupoSanguineoStore } from "@/store/useGrupoSanguineoStore";

export function useSocket() {
  const chatStore = useChatStore();
  const grupoStore = useGrupoSanguineoStore();
  let ws: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  const reconnectInterval = 3000; // 3 segundos

  function connect() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    ws = new WebSocket(`wss://${import.meta.env.VITE_WS_URL}ws?token=${token}`);

    ws.onopen = () => {
      console.log("✅ Conexión WebSocket establecida");
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.send(JSON.stringify({ ping: true }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Mensaje recibido:", data);

        if (data.from && data.message) {
          // Mensaje privado del chat
          chatStore.addMessage({ from: data.from, to: data.to ?? '', message: data.message });
        } else if (data.message === "Actualización de personas detectada") {
          // Actualización de gráficas
          const chartData = transformData(data.grupo_sanguineo);
          grupoStore.setChartData(chartData);
          grupoStore.updateCachedData(chartData);
        }
      } catch (err) {
        console.error("❌ Error al parsear mensaje:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❗ WebSocket Error:", err);
    };

    ws.onclose = (event) => {
      console.warn("⚠️ WebSocket desconectado", event.reason || "");
      scheduleReconnect();
    };
  }

  function scheduleReconnect() {
    if (reconnectTimeout) return; // Ya hay un intento programado
    console.log(`🔄 Reintentando conexión en ${reconnectInterval / 1000}s...`);
    reconnectTimeout = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }

  function sendMessage(to: string, message: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ to, message }));
    } else {
      console.warn("❌ No se pudo enviar el mensaje: WebSocket cerrado");
    }
  }

  function close() {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    ws?.close();
  }

  return { connect, sendMessage, close };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformData(data: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = data.reduce((acc: any, item: { Grupo_Sanguineo: string; Genero: string; cantidad_personas: number; porcentaje: number }) => {
    if (!acc[item.Grupo_Sanguineo]) {
      acc[item.Grupo_Sanguineo] = [];
    }
    acc[item.Grupo_Sanguineo].push(item);
    return acc;
  }, {});

  return {
    name: "Grupos Sanguíneos",
    children: Object.keys(grouped).map(grupo => ({
      name: grupo,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: grouped[grupo].map((item: any) => ({
        name: item.Genero,
        value: item.cantidad_personas,
        porcentaje: item.porcentaje
      }))
    }))
  };
}
