<template>
  <div class="task-list">
    <!-- Contadores -->
    <v-row class="mb-4" v-if="tasks && tasks.length">
      <v-col cols="6">
        <span class="text-caption text-disabled">Pendentes</span>
        <span class="text-caption font-weight-medium ml-2">{{ pending.length }}</span>
      </v-col>
      <v-col cols="6" class="text-right">
        <span class="text-caption text-disabled">Concluídas</span>
        <span class="text-caption font-weight-medium ml-2">{{ done.length }}</span>
      </v-col>
    </v-row>

    <!-- Lista de tarefas -->
    <v-slide-y-transition group>
      <v-card
        v-for="task in tasks"
        :key="task.id || task._id"
        class="mb-2 task-card"
        variant="flat"
        :class="cardStatusClass(task)"
      >
        <v-card-text class="d-flex align-center">
          <v-checkbox
            class="mr-3"
            :model-value="task.completed"
            density="compact"
            @update:model-value="() => $emit('toggle', task)"
          />

          <div class="flex-grow-1">
            <!-- título + prioridade -->
            <div class="d-flex align-center mb-1">
              <div class="task-title" :class="{ 'task-title--done': task.completed }">
                {{ task.title }}
              </div>

              <!-- prioridade (mantive sua flag) -->
              <v-icon
                v-if="task.priority"
                size="16"
                :class="['ml-2', 'priority-flag', `priority-${task.priority}`]"
              >
                mdi-flag
              </v-icon>
            </div>

            <!-- meta: data + status -->
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <template v-if="task.dueDate">
                <v-icon size="14" class="mr-1">mdi-calendar-blank-outline</v-icon>
                {{ formatDate(task.dueDate) }}
              </template>
              <span v-else class="text-disabled">Sem data</span>

              <v-chip
                size="x-small"
                label
                class="ml-3 status-chip"
                :class="chipStatusClass(task)"
              >
                <span class="status-dot" />
                {{ statusLabel(task) }}
              </v-chip>
            </div>
          </div>

          <!-- ações -->
          <v-btn icon variant="text" density="comfortable" @click="$emit('edit', task)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon variant="text" density="comfortable" @click="$emit('delete', task)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>

    <!-- Estado vazio -->
    <div v-if="!tasks || !tasks.length" class="empty">
      <v-icon size="32" class="mb-2">mdi-checkbox-blank-outline</v-icon>
      <p class="text-body-2 text-disabled mb-0">
        Nenhuma tarefa ainda. Comece criando a primeira.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['toggle', 'edit', 'delete'],
  computed: {
    pending() {
      return this.tasks.filter((t) => !t.completed)
    },
    done() {
      return this.tasks.filter((t) => t.completed)
    },
  },
  methods: {
    formatDate(iso) {
      if (!iso) return ''
      const date = new Date(iso)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    },
    statusKey(task) {
      if (task.completed) return 'done'
      if (!task.dueDate) return 'pending'

      const today = new Date()
      const date = new Date(task.dueDate)

      today.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)

      if (date < today) return 'overdue'
      return 'pending'
    },
    statusLabel(task) {
      const key = this.statusKey(task)
      if (key === 'overdue') return 'Atrasada'
      if (key === 'pending') return 'Pendente'
      if (key === 'done') return 'Concluída'
      return ''
    },
    cardStatusClass(task) {
      const key = this.statusKey(task)
      return {
        'task-card--overdue': key === 'overdue',
        'task-card--pending': key === 'pending',
        'task-card--done': key === 'done',
      }
    },
    chipStatusClass(task) {
      return `status-chip--${this.statusKey(task)}`
    },
  },
}
</script>

<style scoped>
.task-card {
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

/* borda colorida na lateral esquerda */
.task-card--overdue {
  border-left: 4px solid #ef4444;
}
.task-card--pending {
  border-left: 4px solid #f59e0b;
}
.task-card--done {
  border-left: 4px solid #22c55e;
}

.task-title {
  font-size: 0.95rem;
}
.task-title--done {
  text-decoration: line-through;
  opacity: 0.6;
}

.empty {
  padding: 24px 0;
  text-align: center;
}

/* chip de status com bolinha */
.status-chip {
  border-radius: 999px;
  padding-inline: 8px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}

/* Vermelho = atrasada */
.status-chip--overdue {
  background: rgba(248, 113, 113, 0.12);
  color: #b91c1c;
}
.status-chip--overdue .status-dot {
  background: #ef4444;
}

/* Amarelo = pendente */
.status-chip--pending {
  background: rgba(250, 204, 21, 0.14);
  color: #854d0e;
}
.status-chip--pending .status-dot {
  background: #f59e0b;
}

/* Verde = concluída */
.status-chip--done {
  background: rgba(34, 197, 94, 0.12);
  color: #166534;
}
.status-chip--done .status-dot {
  background: #22c55e;
}

/* Prioridade (mantive as cores que você já usava) */
.priority-flag {
  margin-left: 6px;
}
.priority-1 {
  color: #e11d48;
}
.priority-2 {
  color: #f97316;
}
.priority-3 {
  color: #0ea5e9;
}
.priority-4 {
  color: #64748b;
}
</style>
