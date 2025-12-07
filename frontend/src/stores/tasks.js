import { defineStore } from 'pinia'
import { supabase } from '../supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        console.log('[tasks.fetch] chamando', `${API_BASE_URL}/tasks`)
        const headers = await getAuthHeader()
        const res = await fetch(`${API_BASE_URL}/tasks`, { headers })
        console.log('[tasks.fetch] status', res.status)
        if (!res.ok) {
          throw new Error(`Erro ao buscar tasks: ${res.status}`)
        }
        const data = await res.json()
        this.tasks = (data || []).map((t) => ({
          ...t,
          dueDate: t.due_date ?? null,
        }))
      } catch (err) {
        console.error('[tasks.fetch] erro', err)
        this.error = err.message ?? String(err)
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.error = null
      try {
        console.log('[tasks.create] payload', payload)
        const headers = await getAuthHeader()
        const res = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
        })
        console.log('[tasks.create] status', res.status)
        if (!res.ok) {
          throw new Error(`Erro ao criar task: ${res.status}`)
        }
        const task = await res.json()
        this.tasks.push({
          ...task,
          dueDate: task.due_date ?? null,
        })
      } catch (err) {
        console.error('[tasks.create] erro', err)
        this.error = err.message ?? String(err)
      }
    },

    async toggle(task) {
      this.error = null
      const id = task.id
      try {
        console.log('[tasks.toggle] id', id)
        const headers = await getAuthHeader()
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(task),
        })
        console.log('[tasks.toggle] status', res.status)
        if (!res.ok) {
          throw new Error(`Erro ao atualizar task: ${res.status}`)
        }
        const updated = await res.json()
        const idx = this.tasks.findIndex((t) => t.id === id)
        if (idx !== -1) {
          this.tasks[idx] = {
            ...updated,
            dueDate: updated.due_date ?? null,
          }
        }
      } catch (err) {
        console.error('[tasks.toggle] erro', err)
        this.error = err.message ?? String(err)
      }
    },

    async remove(task) {
      this.error = null
      const id = task.id
      try {
        console.log('[tasks.remove] id', id)
        const headers = await getAuthHeader()
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'DELETE',
          headers,
        })
        console.log('[tasks.remove] status', res.status)
        if (!res.ok) {
          throw new Error(`Erro ao deletar task: ${res.status}`)
        }
        this.tasks = this.tasks.filter((t) => t.id !== id)
      } catch (err) {
        console.error('[tasks.remove] erro', err)
        this.error = err.message ?? String(err)
      }
    },
  },
})
