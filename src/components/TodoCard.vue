<template>
  <div class="task-item" :class="taskClass">
    <div class="task-content">
      <div class="task-checkbox-wrapper">
        <input 
          type="checkbox" 
          :id="checkboxId"
          :checked="task.completed"
          @change="handleToggle"
          class="task-checkbox-input"
        />
        <label class="task-label" :for="checkboxId">{{ task.title }}</label>
      </div>
    </div>
    <div class="task-actions">
      <v-btn size="small" icon color="primary" @click="$emit('edit-task', task)">
        <v-icon size="small">mdi-pencil</v-icon>
      </v-btn>
      <v-btn size="small" icon color="error" @click="$emit('delete-task', task)">
        <v-icon size="small">mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
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

const checkboxId = computed(() => `task-checkbox-${props.task.id}`)

function handleToggle() {
  console.log('TodoCard: handleToggle called for task', props.task.title)
  emit('toggle-complete', props.task)
}

const taskClass = computed(() => ({
  'task-completed': props.task.completed
}))
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
}

.task-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.task-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.task-checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
  accent-color: #1976d2;
}

.task-label {
  cursor: pointer;
  margin: 0;
  font-size: 0.95rem;
}

.task-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.task-completed {
  opacity: 0.6;
}

.task-completed .task-label {
  text-decoration: line-through;
  color: rgba(0, 0, 0, 0.45);
}

.task-completed .task-checkbox-input {
  accent-color: #4caf50;
}
</style>
