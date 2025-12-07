<template>
  <v-card class="pa-4 task-form-card" variant="outlined">
    <v-form @submit.prevent="onSubmit">
      <!-- Título / descrição -->
      <v-text-field
        v-model="title"
        variant="plain"
        hide-details
        placeholder="O que você precisa fazer?"
        class="mb-2 text-subtitle-1"
      />
      <v-textarea
        v-model="description"
        variant="plain"
        hide-details
        auto-grow
        rows="1"
        placeholder="Descrição (opcional)"
        class="mb-3 text-body-2"
      />

      <!-- Linha de ações (Data / Prioridade / Cancelar / Adicionar) -->
      <div class="d-flex align-center justify-space-between flex-wrap">
        <div class="d-flex align-center flex-wrap">
          <!-- Data -->
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                size="small"
                class="mr-2 mb-2"
              >
                <v-icon size="16" class="mr-1">mdi-calendar-blank-outline</v-icon>
                Data
              </v-btn>
            </template>
            <v-card>
              <v-date-picker
                v-model="dueDate"
                color="primary"
                @update:model-value="dateMenu = false"
              />
              <v-card-actions class="justify-end">
                <v-btn text @click="clearDate">Limpar</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <!-- Prioridade -->
          <v-menu
            v-model="priorityMenu"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                size="small"
                class="mr-2 mb-2"
              >
                <v-icon size="16" class="mr-1">mdi-flag-outline</v-icon>
                Prioridade
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="item in priorities"
                :key="item.value"
                @click="setPriority(item.value)"
              >
                <v-list-item-title>
                  <v-icon size="16" class="mr-2" :color="item.color">
                    mdi-flag
                  </v-icon>
                  {{ item.label }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="setPriority(null)">
                <v-list-item-title>Sem prioridade</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Ações -->
        <div class="d-flex align-center mt-2 mt-sm-0">
          <v-btn
            text
            size="small"
            class="mr-2"
            @click="resetForm"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            size="small"
            type="submit"
            :disabled="!titleTrimmed"
          >
            Adicionar tarefa
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'TaskForm',
  emits: ['create'],
  setup(_, { emit }) {
    const title = ref('')
    const description = ref('')
    const dueDate = ref(null)
    const priority = ref(null)

    const dateMenu = ref(false)
    const priorityMenu = ref(false)

    const priorities = [
      { value: 1, label: 'Alta', color: '#e11d48' },
      { value: 2, label: 'Média', color: '#f97316' },
      { value: 3, label: 'Baixa', color: '#0ea5e9' },
      { value: 4, label: 'Muito baixa', color: '#64748b' },
    ]

    const titleTrimmed = computed(() => title.value.trim().length > 0)

    const clearDate = () => {
      dueDate.value = null
      dateMenu.value = false
    }

    const setPriority = (value) => {
      priority.value = value
      priorityMenu.value = false
    }

    const resetForm = () => {
      title.value = ''
      description.value = ''
      dueDate.value = null
      priority.value = null
    }

    const onSubmit = () => {
      if (!titleTrimmed.value) return

      emit('create', {
        title: title.value.trim(),
        description: description.value || null,
        dueDate: dueDate.value,
        priority: priority.value,
        completed: false,
      })

      resetForm()
    }

    return {
      title,
      description,
      dueDate,
      priority,
      dateMenu,
      priorityMenu,
      priorities,
      titleTrimmed,
      clearDate,
      setPriority,
      resetForm,
      onSubmit,
    }
  },
}
</script>

<style scoped>
.task-form-card {
  border-radius: 24px;
}
</style>
