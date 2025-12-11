import axios from 'axios'

const API_URL: string = import.meta.env.VITE_BACKEND_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getCitasMedicas = async () => {
  const response = await axios.get(`${API_URL}citas/getAll`, {
    headers: getAuthHeaders()
  })
  return response.data
}

export const buscarPersonas = async (nombre: string) => {
  const { data } = await axios.get(`${API_URL}/selects/personas`, {
    params: { name: nombre },
    headers: getAuthHeaders()
  })
  return data
}
