// routes/empleado.routes.ts
import axios from "axios";

const API_URL: string = import.meta.env.VITE_URL;

const getToken = (): string => sessionStorage.getItem("token") || "";

// Función para obtener todos los doctores
export const getAllDoctores = async (): Promise<Empleado[]> => {
  try {
    const response = await axios.get(`${API_URL}personalMedico/getAllDoctors`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los doctores:", error);
    throw error;
  }
};

// Función para obtener todos los enfermeros
export const getAllEnfermeros = async (): Promise<Empleado[]> => {
  try {
    const response = await axios.get(`${API_URL}personalMedico/getAllNurses`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los enfermeros:", error);
    throw error;
  }
};

export const getNurseById = async (
  id: string | number
): Promise<{ nombreCompleto: string; departamento: string; email: string }> => {
  const token = sessionStorage.getItem("token") || "";
  const response = await axios.get(`${API_URL}personalMedico/nurse/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface Empleado {
  personalId: string;
  nombreCompleto: string;
  genero: string;
  fecha_nacimiento: string;
  curp: string;
  cedula_profesional: string;
  especialidad: string;
  tipo: string;
  fecha_contratacion: string;
  fecha_termino_contrato: string | null;
  salario: number;
  departamento: string;
}


export const getDoctorById = async (id: string | number): Promise<Empleado> => {
  const token = sessionStorage.getItem("token") || '';
  const response = await axios.get(`${API_URL}personalMedico/doctor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
