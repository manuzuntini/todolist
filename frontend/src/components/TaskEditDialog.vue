<template>
  <v-dialog v-model="show" max-width="500">
    <v-card>
      <v-card-title>Edit Task</v-card-title>
      <v-card-text>
        <v-text-field v-model="local.title" label="Título"></v-text-field>
        <v-checkbox v-model="local.completed" label="Concluída"></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'

export default {
  name: 'TaskEditDialog',
  props: { task: { type: Object, required: true }, modelValue: { type: Boolean, default: false } },
  emits: ['update:modelValue', 'save'],
  setup(props, { emit }) {
    const show = computed({
      get: () => props.modelValue,
      set: (v) => emit('update:modelValue', v)
    })
    const local = reactive({ title: props.task.title, completed: props.task.completed })
    const close = () => emit('update:modelValue', false)
    const save = () => {
      emit('save', { ...props.task, ...local })
      close()
    }
    return { show, local, close, save }
  }
}
</script>
