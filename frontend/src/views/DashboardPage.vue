<template>
  <v-container class="dashboard-page" fluid>
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <!-- Cabeçalho -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-medium mb-1">
              Olá<span v-if="displayName">, {{ displayName }}</span>
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Acompanhe e organize suas tarefas do dia.
            </p>
          </div>

          <div class="d-flex flex-column align-end stats">
            <span class="text-caption text-medium-emphasis mb-1">Resumo</span>
            <div class="d-flex gap-2">
              <div class="stat-pill">
                <span class="text-caption text-medium-emphasis">Total: </span>
                <span class="text-subtitle-2 font-weight-medium">
                  {{ total }}
                </span>
              </div>
              <div class="stat-pill">
                <span class="text-caption text-medium-emphasis">Pendentes: </span>
                <span class="text-subtitle-2 font-weight-medium">
                  {{ pending }}
                </span>
              </div>
              <div class="stat-pill">
                <span class="text-caption text-medium-emphasis">Concluídas: </span>
                <span class="text-subtitle-2 font-weight-medium">
                  {{ done }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Conteúdo principal -->
        <v-row>
          <v-col cols="12" md="8">
            <v-sheet class="dashboard-card pa-6" elevation="2" rounded="xl">
              <div class="d-flex align-center justify-space-between mb-4">
                <div>
                  <h2 class="text-h6 mb-1">Minhas tarefas</h2>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    Foque no que precisa ser feito primeiro.
                  </p>
                </div>
              </div>

              <!-- Formulário -->
              <task-form @create="addTask" />

              <!-- Filtros (agora perto da lista) -->
              <div class="d-flex align-center justify-space-between mt-4 mb-2">
                <span class="text-caption text-medium-emphasis mr-3">
                  Filtrar:
                </span>
                <v-chip-group
                  v-model="statusFilter"
                  selected-class="chip-selected"
                  mandatory
                  class="filter-group"
                >
                  <v-chip value="all" size="small" variant="outlined">Todas</v-chip>
                  <v-chip value="pending" size="small" variant="outlined">Pendentes</v-chip>
                  <v-chip value="done" size="small" variant="outlined">Concluídas</v-chip>
                </v-chip-group>
              </div>

              <!-- Lista -->
              <task-list
                :tasks="visibleTasks"
                @toggle="toggleTask"
                @delete="deleteTask"
                @edit="openEdit"
              />

              <task-edit-dialog
                :task="editingTask || {}"
                v-model="showEditDialog"
                @save="onSaveEdit"
              />
            </v-sheet>
          </v-col>

          <!-- Coluna lateral (dicas / espaço futuro) -->
          <v-col cols="12" md="4" class="mt-4 mt-md-0">
            <v-sheet class="dashboard-side pa-5" elevation="1" rounded="xl">
              <h3 class="text-subtitle-1 mb-2">Dica rápida</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Comece sempre pelas tarefas pendentes com maior impacto.  
                Use o check para marcar o que já foi concluído.
              </p>
              <v-divider class="mb-4" />
              <p class="text-caption text-medium-emphasis mb-1">
                Sessão atual
              </p>
              <p class="text-body-2">
                {{
                  total === 0
                    ? 'Você ainda não criou nenhuma tarefa.'
                    : 'Continue mantendo sua lista em dia.'
                }}
              </p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import TaskEditDialog from '../components/TaskEditDialog.vue'

export default {
  name: 'DashboardPage',
  components: { TaskForm, TaskList, TaskEditDialog },
  setup() {
    const tasksStore = useTasksStore()
    const authStore = useAuthStore()

    const showEditDialog = ref(false)
    const editingTask = ref(null)
    const statusFilter = ref('all')

    onMounted(() => {
      tasksStore.fetch()
    })

    const total = computed(() => tasksStore.tasks.length)
    const pending = computed(() =>
      tasksStore.tasks.filter((t) => !t.completed).length
    )
    const done = computed(() =>
      tasksStore.tasks.filter((t) => t.completed).length
    )

    const visibleTasks = computed(() => {
      if (statusFilter.value === 'pending') {
        return tasksStore.tasks.filter((t) => !t.completed)
      }
      if (statusFilter.value === 'done') {
        return tasksStore.tasks.filter((t) => t.completed)
      }
      return tasksStore.tasks
    })

    const displayName = computed(() => {
      const u = authStore.user
      return (
        u?.user_metadata?.full_name ||
        u?.user_metadata?.name ||
        u?.email ||
        ''
      )
    })

    const addTask = async (payload) => {
      await tasksStore.create(payload)
      await tasksStore.fetch()
    }

    const toggleTask = async (task) => {
      const updated = { ...task, completed: !task.completed }
      await tasksStore.toggle(updated)
      await tasksStore.fetch()
    }

    const deleteTask = async (task) => {
      await tasksStore.remove(task)
      await tasksStore.fetch()
    }

    const openEdit = (task) => {
      editingTask.value = { ...task }
      showEditDialog.value = true
    }

    const onSaveEdit = async (edited) => {
      await tasksStore.toggle(edited)
      await tasksStore.fetch()
      showEditDialog.value = false
    }

    return {
      tasksStore,
      authStore,
      showEditDialog,
      editingTask,
      statusFilter,
      visibleTasks,
      total,
      pending,
      done,
      displayName,
      addTask,
      toggleTask,
      deleteTask,
      openEdit,
      onSaveEdit,
    }
  },
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding-top: 32px;
  padding-bottom: 32px;
  background: radial-gradient(circle at top left, #f5f7ff, #fdfdfd);
}

.dashboard-card {
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.dashboard-side {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.05);
}

.stat-pill {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  min-width: 72px;
  text-align: right;
}

.filter-group {
  gap: 4px;
}

.chip-selected {
  background-color: #1d4ed8 !important;
  color: white !important;
  border-color: transparent !important;
}
</style>
