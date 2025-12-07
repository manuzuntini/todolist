import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    error: null,
    _listenerBound: false,
  }),

  getters: {
    isAuthenticated(state) {
      return !!state.user
    },
  },

  actions: {
    async init() {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        this.session = data.session
        this.user = data.session?.user ?? null

        // já logado → sair da tela de login
        if (this.user && router.currentRoute.value.name === 'Login') {
          await router.push({ name: 'Dashboard' })
        }

        // registra listener uma única vez
        if (!this._listenerBound) {
          this._listenerBound = true
          supabase.auth.onAuthStateChange((event, session) => {
            this.session = session
            this.user = session?.user ?? null

            if (event === 'SIGNED_IN') {
              router.push({ name: 'Dashboard' })
            }

            if (event === 'SIGNED_OUT') {
              router.push({ name: 'Login' })
            }
          })
        }
      } catch (err) {
        console.error('[auth.init]', err)
        this.error = err.message ?? String(err)
        this.session = null
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async signInWithGoogle() {
      this.loading = true
      this.error = null

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            // depois do login o Supabase redireciona pra sua app
            redirectTo: window.location.origin,
          },
        })

        if (error) throw error
        // depois do redirect o init() é chamado de novo (main.js + beforeEach)
      } catch (err) {
        console.error('[signInWithGoogle]', err)
        this.error = err.message ?? String(err)
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      this.loading = true
      this.error = null

      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        this.session = null
        this.user = null
      } catch (err) {
        console.error('[signOut]', err)
        this.error = err.message ?? String(err)
      } finally {
        this.loading = false
      }
    },
  },
})
