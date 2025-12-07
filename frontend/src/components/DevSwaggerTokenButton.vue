<template>
  <!-- Só renderiza em ambiente de desenvolvimento -->
  <div v-if="isDev">
    <v-btn
      color="secondary"
      variant="text"
      size="small"
      @click="openDialog"
    >
      Token Swagger
    </v-btn>

    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <v-card-title class="text-h6">
          Token JWT para Swagger
        </v-card-title>

        <v-card-text>
          <p class="mb-3 text-body-2">
            Este é o <strong>access_token</strong> da sua sessão atual no Supabase.
            Use-o no botão <strong>Authorize</strong> do Swagger.
            <br />
            <strong>Não exiba isso em produção.</strong>
          </p>

          <v-alert
            v-if="error"
            type="error"
            density="compact"
            class="mb-3"
          >
            {{ error }}
          </v-alert>

          <v-skeleton-loader
            v-if="loading"
            type="paragraph"
          />

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

            <v-btn
              :disabled="!token"
              @click="copyToken"
            >
              Copiar token
            </v-btn>

            <span v-if="copied" class="ml-3 text-success">
              Copiado!
            </span>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const dialog = ref(false)
const token = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

// Só deixa aparecer em ambiente de desenvolvimento
const isDev = import.meta.env.DEV

async function openDialog() {
  dialog.value = true
  copied.value = false
  loading.value = true
  error.value = ''
  token.value = ''

  try {
    const { data, error: supabaseError } = await supabase.auth.getSession()

    if (supabaseError) {
      console.error('[DevSwaggerTokenButton] getSession error:', supabaseError)
      error.value = supabaseError.message || 'Erro ao obter sessão do Supabase'
      return
    }

    const accessToken = data.session?.access_token

    if (!accessToken) {
      error.value = 'Nenhum usuário autenticado. Faça login primeiro.'
      return
    }

    token.value = accessToken
  } catch (err) {
    console.error('[DevSwaggerTokenButton] exception:', err)
    error.value = err.message || 'Erro inesperado ao obter token'
  } finally {
    loading.value = false
  }
}

async function copyToken() {
  if (!token.value) return
  try {
    await navigator.clipboard.writeText(token.value)
    copied.value = true
  } catch (err) {
    console.error('[DevSwaggerTokenButton] copy error:', err)
    error.value = 'Não foi possível copiar para a área de transferência.'
  }
}
</script>
