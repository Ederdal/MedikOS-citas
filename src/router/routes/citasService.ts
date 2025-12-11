// src/services/api/citasService.ts
import axios from "axios";

const API_BASE = "https://back-hospital-7fyy.onrender.com/"; // Ajusta la URL de tu backend

// Endpoints de selects (servicios, espacios, personas, citas próximas)
export const obtenerServicios = async () => {
  const { data } = await axios.get(`${API_BASE}/selects/servicios`);
  return data;
};

export const obtenerEspacios = async () => {
  const { data } = await axios.get(`${API_BASE}/selects/espacios`);
  return data;
};

export const obtenerPersona = async (personaId: string) => {
  const { data } = await axios.get(`${API_BASE}/selects/personas/${personaId}`);
  return data;
};

export const obtenerCitasProximas = async (medicoId: string) => {
  const { data } = await axios.get(`${API_BASE}/selects/citas-proximas/${medicoId}`);
  return data;
};

// Endpoint para registrar una cita
export const registrarCita = async (formData: any) => {
  const token = localStorage.getItem("token");
  console.log("Token en registrarCita:", token); // <-- Añade este console.log

  try {
    const response = await axios.post(`${API_BASE}/citas/register`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna la respuesta para usarla en el componente
  } catch (error) {
    // Maneja el error o vuelve a lanzarlo
    console.error("Error al registrar cita:", error);
    throw error;
  }
};

export const buscarPersonas = async (nombre: string) => {
  const { data } = await axios.get(`${API_BASE}/selects/personas`, {
    params: { name: nombre },
  });
  return data;
};
