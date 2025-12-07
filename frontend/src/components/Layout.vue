<template>
  <v-app :class="{ 'theme--dark': ui.dark }">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link to="/dashboard">Dashboard</v-list-item>
        <v-list-item link to="/tasks">Tasks</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white">
      <v-toolbar-title>ToDo</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- NOVO: botão para pegar o token do Swagger -->
      <v-btn
        text
        class="mr-2"
        @click="openTokenDialog"
      >
        Token Swagger
      </v-btn>

      <!-- Botão de tema claro/escuro -->
      <v-btn icon @click="toggleTheme">
        <v-icon>
          {{ ui.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
        </v-icon>
      </v-btn>

      <!-- Login / Logout -->
      <v-btn text v-if="!auth.user" @click="login">Entrar</v-btn>
      <v-btn text v-else @click="logout">Sair</v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <!-- Diálogo com o access_token para Swagger -->
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
  </v-app>
</template>

<script>
import { ref } from 'vue'
import { useUiStore } from '../stores/ui'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

export default {
  name: 'Layout',
  setup() {
    const ui = useUiStore()
    const auth = useAuthStore()

    const drawer = ref(false)
    const toggleTheme = () => ui.toggleTheme()
    const login = () => auth.signInWithGoogle()
    const logout = () => auth.signOut()

    // --- Estado do diálogo de token ---
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
          console.error('[Layout] getSession error:', supabaseError)
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
        console.error('[Layout] exception ao obter token:', err)
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
        console.error('[Layout] copy error:', err)
        error.value =
          'Não foi possível copiar para a área de transferência.'
      }
    }

    return {
      drawer,
      ui,
      toggleTheme,
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
/* --- Tema escuro global --- */
.theme--dark {
  background-color: #020617;
  color: #e5e7eb;
}

/* Wrap da aplicação em modo escuro */
.theme--dark :deep(.v-application__wrap) {
  background-color: #020617;
}

/* App bar em modo escuro */
.theme--dark :deep(.v-app-bar) {
  background-color: #020617 !important;
  color: #e5e7eb !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.5);
}

/* Página de dashboard */
.theme--dark :deep(.dashboard-page) {
  background: #020617;
}

/* Cards principais (dashboard) */
.theme--dark :deep(.dashboard-card),
.theme--dark :deep(.dashboard-side) {
  background-color: #020617;
  border-color: rgba(148, 163, 184, 0.5);
  color: #e5e7eb;
}

/* Cards de tarefa */
.theme--dark :deep(.task-card) {
  background-color: #020617;
  border-color: rgba(148, 163, 184, 0.45);
}

/* Título das tarefas */
.theme--dark :deep(.task-card .task-title) {
  color: #e5e7eb;
}

/* Formulário de tarefa */
.theme--dark :deep(.task-form-card) {
  background-color: #020617;
  border-color: rgba(148, 163, 184, 0.45);
}

/* Texto "apagado" um pouco mais claro no escuro */
.theme--dark :deep(.text-medium-emphasis),
.theme--dark :deep(.text-caption) {
  color: #cbd5f5 !important;
}

/* Chips de status em modo escuro */
.theme--dark :deep(.status-chip--overdue) {
  background: rgba(248, 113, 113, 0.18);
  color: #fecaca;
}
.theme--dark :deep(.status-chip--pending) {
  background: rgba(250, 204, 21, 0.18);
  color: #facc15;
}
.theme--dark :deep(.status-chip--done) {
  background: rgba(34, 197, 94, 0.18);
  color: #bbf7d0;
}
</style>
