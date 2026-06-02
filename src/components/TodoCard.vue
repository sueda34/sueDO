<template>
  <v-card :elevation="2" class="pa-4 mb-3" :class="taskClass">
    <v-row align="center" justify="space-between" no-gutters>
      <v-col cols="12" md="8">
        <v-checkbox
          :model-value="task.completed"
          @update:model-value="handleToggle"
          :label="task.title"
          class="task-checkbox"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="4" class="d-flex justify-end gap-2 mt-4 mt-md-0">
        <v-btn icon color="primary" @click="$emit('edit-task', task)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="$emit('delete-task', task)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-complete', 'edit-task', 'delete-task'])

// Handle when checkbox is clicked
function handleToggle(value) {
  emit('toggle-complete', { ...props.task, completed: value })
}

// Add strikethrough style to completed tasks
const taskClass = computed(() => ({
  'task-completed': props.task.completed
}))
</script>

<style scoped>
.task-completed {
  opacity: 0.78;
}
.task-completed .v-label {
  text-decoration: line-through;
  color: rgba(0, 0, 0, 0.45);
}
.task-checkbox .v-label {
  text-decoration: inherit;
}
</style>
