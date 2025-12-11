import type { LoginPayload, RegisterPayload } from "@/interfaces/auth"
import axios from "axios"

const API_URL: string = import.meta.env.VITE_URL || 'https://back-hospital-7fyy.onrender.com/'
console.log('API_URL en authService:', API_URL)


export const loginUsuario = async (payload: LoginPayload) => {
  const response = await axios.post(`${API_URL}users/login`, payload)
  return response.data
  console.log('datitooooooooooos login', response.data);
}

export async function registerUsuario(payload: RegisterPayload): Promise<{ message: string }> {
  console.log(payload);

  const res = await fetch(`${API_URL}users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al registrar');
  }

  return await res.json();
}
