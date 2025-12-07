<template>
  <div>
    <v-app-bar app color="white" elevate-on-scroll>
      <v-toolbar-title>ToDo</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Botão para abrir o token SEM CONDIÇÃO (sempre mostra) -->
      <v-btn
        text
        class="mr-2"
        @click="openTokenDialog"
      >
        Token Swagger
      </v-btn>

      <v-btn text to="/dashboard">Dashboard</v-btn>
      <v-btn text to="/tasks">Tasks</v-btn>

      <v-btn text v-if="!auth.user" @click="login">
        Entrar com Google
      </v-btn>

      <v-btn text v-else @click="logout">
        Sair
      </v-btn>
    </v-app-bar>

    <!-- Diálogo com o token -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <v-card-title class="text-h6">
          Token JWT para Swagger
        </v-card-title>

        <v-card-text>
          <p class="mb-3">
            Este é o <strong>access_token</strong> da sua sessão atual no Supabase.
            Use-o no botão <strong>Authorize</strong> do Swagger.
            <br />
            <strong>Não use isso em produção.</strong>
          </p>

          <div v-if="error" class="mb-3" style="color: #c00;">
            {{ error }}
          </div>

          <div v-if="loading">
            Carregando token...
          </div>

          <div v-else>
            <v-textarea
              v-model="token"
              label="access_token"
              auto-grow
              readonly
              rows="4"
              variant="outlined"
              hide-details
              class="mb-3"
            />

            <v-btn :disabled="!token" @click="copyToken">
              Copiar token
            </v-btn>

            <span v-if="copied" class="ml-3" style="color: #2e7d32;">
              Copiado!
            </span>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

export default {
  name: 'Navbar',
  setup() {
    const auth = useAuthStore()
    const login = () => auth.signInWithGoogle()
    const logout = () => auth.signOut()

    const dialog = ref(false)
    const token = ref('')
    const loading = ref(false)
    const error = ref('')
    const copied = ref(false)

    const openTokenDialog = async () => {
      dialog.value = true
      copied.value = false
      loading.value = true
      error.value = ''
      token.value = ''

      try {
        const { data, error: supabaseError } = await supabase.auth.getSession()

        if (supabaseError) {
          console.error('[Navbar] getSession error:', supabaseError)
          error.value =
            supabaseError.message || 'Erro ao obter sessão do Supabase'
          return
        }

        const accessToken = data.session?.access_token

        if (!accessToken) {
          error.value = 'Nenhum usuário autenticado. Faça login primeiro.'
          return
        }

        token.value = accessToken
      } catch (err) {
        console.error('[Navbar] exception ao obter token:', err)
        error.value = err.message || 'Erro inesperado ao obter token'
      } finally {
        loading.value = false
      }
    }

    const copyToken = async () => {
      if (!token.value) return
      try {
        await navigator.clipboard.writeText(token.value)
        copied.value = true
      } catch (err) {
        console.error('[Navbar] copy error:', err)
        error.value = 'Não foi possível copiar para a área de transferência.'
      }
    }

    return {
      auth,
      login,
      logout,
      dialog,
      token,
      loading,
      error,
      copied,
      openTokenDialog,
      copyToken,
    }
  },
}
</script>

<style scoped>
</style>
