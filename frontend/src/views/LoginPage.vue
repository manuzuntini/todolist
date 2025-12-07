<template>
  <v-container class="login-page" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="login-card" elevation="8" rounded="xl">
          <v-card-text class="text-center pa-8">
            <v-avatar size="56" class="mb-4" color="primary">
              <v-icon size="28">mdi-check-bold</v-icon>
            </v-avatar>

            <h1 class="text-h5 mb-1">Bem-vindo(a) ao ToDo</h1>
            <p class="text-body-2 text-medium-emphasis mb-6">
              Um lugar simples para capturar, priorizar e concluir suas tarefas do dia.
            </p>

            <v-btn
              color="red"
              block
              size="large"
              prepend-icon="mdi-google"
              @click="signInWithGoogle"
            >
              Entrar com Google
            </v-btn>

            <p class="text-caption text-medium-emphasis mt-4">
              Usamos apenas o seu e-mail para autenticar, sem acessar o conteúdo do Gmail.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const auth = useAuthStore()
    const signInWithGoogle = () => auth.signInWithGoogle()
    return { signInWithGoogle }
  },
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 64px); /* ajusta pela app-bar do layout */
  background: radial-gradient(circle at top left, #eff6ff, #f9fafb 40%, #ffffff);
}

.login-card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  backdrop-filter: blur(10px);
}
</style>
