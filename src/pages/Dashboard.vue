<template>
  <v-main class="pa-6">
    <v-container fluid class="d-flex justify-center">
      <v-card max-width="920" class="mx-auto pa-6 elevation-4">
        <!-- Header with Logo and Sign Out -->
        <div class="dashboard-header mb-6">
          <div>
            <h1 class="display-1 todo-title">TODO LIST</h1>
            <div class="subtitle">Add tasks, edit them, and mark complete.</div>
          </div>
          <v-btn color="error" variant="tonal" @click="handleSignOut" class="sign-out-btn">
            Sign Out
          </v-btn>
        </div>

        <!-- Input Section -->
        <div class="mb-6">
          <v-text-field
            v-model="newTaskTitle"
            label="New task title"
            outlined
            dense
            clearable
            placeholder="Type a new task here"
          />
        </div>

        <!-- Actions Section: Add Task, Mark All Done, Filter -->
        <div class="actions-container mb-6">
          <v-btn 
            color="primary" 
            @click="addTask" 
            :disabled="!newTaskTitle || taskStore.loading"
            class="add-task-btn"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Task
          </v-btn>

          <v-btn
            size="small"
            color="success"
            variant="tonal"
            @click="markAllComplete"
            :disabled="filteredTasks.length === 0 || taskStore.loading"
            class="mark-all-btn"
          >
            Mark All Done
          </v-btn>

          <v-select
            v-model="filter"
            :items="filters"
            label="Filter tasks"
            outlined
            dense
            class="todo-filter-select"
            style="max-width: 150px;"
          />
        </div>

        <!-- Tasks Loading State -->
        <div v-if="taskStore.loading" class="text-center mb-4">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>

        <!-- Error Alert -->
        <div v-else-if="taskStore.error" class="mb-4">
          <v-alert type="error">
            {{ taskStore.error.message || 'Unable to load tasks. Please try again.' }}
          </v-alert>
        </div>

        <!-- Tasks List -->
        <div v-else>
          <div v-if="filteredTasks.length === 0" class="mb-4">
            <v-alert type="info" border="start" colored-border>
              No tasks match the current filter. Add a new task or change the filter.
            </v-alert>
          </div>

          <div v-else class="tasks-list">
            <TodoCard
              v-for="task in filteredTasks"
              :key="task.id"
              :task="task"
              @toggle-complete="toggleComplete"
              @edit-task="startEdit"
              @delete-task="deleteTask"
            />
          </div>
        </div>
      </v-card>
    </v-container>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit task</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editTitle"
            label="Task title"
            outlined
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelEdit">Cancel</v-btn>
          <v-btn color="primary" :disabled="!editTitle" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TodoCard from '../components/TodoCard.vue'
import { useUserStore } from '../store/user.js'
import { useTaskStore } from '../store/task.js'

const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore()

const filters = ['All', 'Active', 'Completed']
const newTaskTitle = ref('')
const filter = ref('All')
const editDialog = ref(false)
const editTaskId = ref(null)
const editTitle = ref('')

const filteredTasks = computed(() => {
  const taskList = taskStore.tasks || []
  if (filter.value === 'Active') {
    return taskList.filter((task) => !task.completed)
  }
  if (filter.value === 'Completed') {
    return taskList.filter((task) => task.completed)
  }
  return taskList
})

async function loadTasks() {
  if (!userStore.user) {
    await userStore.fetchUser()
  }

  if (!userStore.user) {
    return
  }

  await taskStore.fetchTasks()
}

onMounted(() => {
  loadTasks()
})

async function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return

  await taskStore.createTask(title)
  newTaskTitle.value = ''
}

async function toggleComplete(task) {
  console.log('Dashboard: toggleComplete called with', task)
  await taskStore.toggleComplete(task)
  console.log('Dashboard: toggleComplete finished, tasks are now:', taskStore.tasks)
}

function startEdit(task) {
  editTaskId.value = task.id
  editTitle.value = task.title
  editDialog.value = true
}

async function saveEdit() {
  if (!editTitle.value.trim()) return

  await taskStore.updateTask(editTaskId.value, { title: editTitle.value.trim() })
  cancelEdit()
}

function cancelEdit() {
  editDialog.value = false
  editTaskId.value = null
  editTitle.value = ''
}

async function deleteTask(task) {
  await taskStore.deleteTask(task.id)
}

async function markAllComplete() {
  const incompleteTasks = filteredTasks.value.filter(t => !t.completed)
  for (const task of incompleteTasks) {
    await taskStore.toggleComplete(task)
  }
}

async function handleSignOut() {
  await userStore.signOut()
  router.push('/login')
}
</script>

<style scoped>
.v-card {
  min-height: 340px;
}

.todo-title {
  margin: 0;
  letter-spacing: 0.05em;
  color: #b8860b; /* dunkles Gold für bessere Lesbarkeit */
}

.subtitle {
  color: rgba(0, 0, 0, 0.65);
  margin-top: 4px;
  font-size: 0.95rem;
}

/* Header Layout */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.sign-out-btn {
  white-space: nowrap;
  align-self: flex-start;
}

/* Actions Container */
.actions-container {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.add-task-btn {
  min-width: 140px;
}

.mark-all-btn {
  white-space: nowrap;
}

.todo-filter-select {
  min-width: 150px;
  max-width: 180px;
}

/* Tasks List */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
