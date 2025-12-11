/**
 * Servicio IndexedDB para Notas Médicas
 */

export interface NotaMedica {
  id?: number
  paciente: string
  doctor: string
  fechaNota: string
  sintomas: string
  tratamiento: string
  observaciones: string
  fechaSeguimiento: string
  creadoEn?: Date
}

const DB_NAME = 'CiatasApp'
const DB_VERSION = 1
const STORE_NAME = 'notasMedicas'

class NotasMedicasDB {
  private db: IDBDatabase | null = null

  /**
   * Inicializa la base de datos
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          })

          // Crear índices
          store.createIndex('paciente', 'paciente')
          store.createIndex('doctor', 'doctor')
          store.createIndex('fechaNota', 'fechaNota')
          store.createIndex('creadoEn', 'creadoEn')
        }
      }
    })
  }

  /**
   * Obtiene todas las notas médicas
   */
  async getAll(): Promise<NotaMedica[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const notas = request.result as NotaMedica[]
        // Ordenar por fecha de creación descendente (más recientes primero)
        resolve(notas.sort((a, b) => {
          const dateA = new Date(a.creadoEn || 0).getTime()
          const dateB = new Date(b.creadoEn || 0).getTime()
          return dateB - dateA
        }))
      }
    })
  }

  /**
   * Obtiene una nota por ID
   */
  async getById(id: number): Promise<NotaMedica | undefined> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  /**
   * Obtiene notas por paciente
   */
  async getByPaciente(paciente: string): Promise<NotaMedica[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('paciente')
      const request = index.getAll(paciente)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const notas = request.result as NotaMedica[]
        resolve(notas.sort((a, b) => {
          const dateA = new Date(a.creadoEn || 0).getTime()
          const dateB = new Date(b.creadoEn || 0).getTime()
          return dateB - dateA
        }))
      }
    })
  }

  /**
   * Obtiene notas por doctor
   */
  async getByDoctor(doctor: string): Promise<NotaMedica[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('doctor')
      const request = index.getAll(doctor)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const notas = request.result as NotaMedica[]
        resolve(notas.sort((a, b) => {
          const dateA = new Date(a.creadoEn || 0).getTime()
          const dateB = new Date(b.creadoEn || 0).getTime()
          return dateB - dateA
        }))
      }
    })
  }

  /**
   * Agrega una nueva nota
   */
  async add(nota: Omit<NotaMedica, 'id' | 'creadoEn'>): Promise<number> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add({
        ...nota,
        creadoEn: new Date(),
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as number)
    })
  }

  /**
   * Actualiza una nota
   */
  async update(nota: NotaMedica): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(nota)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Elimina una nota por ID
   */
  async delete(id: number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Elimina todas las notas
   */
  async clear(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Cierra la conexión a la BD
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// Instancia única (singleton)
let instance: NotasMedicasDB | null = null

export function getNotasMedicasDB(): NotasMedicasDB {
  if (!instance) {
    instance = new NotasMedicasDB()
  }
  return instance
}

export default NotasMedicasDB
