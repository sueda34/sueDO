<template>
  <v-main class="pa-6">
    <v-container fluid class="d-flex justify-center">
      <v-card max-width="920" class="mx-auto pa-6 elevation-4">
        <v-row class="mb-4" align="center" justify="space-between">
          <v-col cols="12" class="d-flex justify-between align-center">
            <div>
              <h1 class="display-1 todo-title">TODO LIST</h1>
              <div class="subtitle">Add tasks, edit them, and mark complete.</div>
            </div>
            <v-btn color="error" variant="tonal" @click="handleSignOut">
              Sign Out
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mb-4" align="center" justify="space-between">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="newTaskTitle"
              label="New task title"
              outlined
              dense
              clearable
              placeholder="Type a new task here"
            />
          </v-col>

          <v-col cols="12" md="3" class="d-flex justify-center">
            <v-btn color="primary" class="ma-0" @click="addTask" :disabled="!newTaskTitle">
              <v-icon left>mdi-plus</v-icon>
              Add Task
            </v-btn>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-end">
            <v-select
              v-model="filter"
              :items="filters"
              label="Filter tasks"
              outlined
              dense
              class="todo-filter-select"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-list two-line>
              <template v-if="filteredTasks.length === 0">
                <v-list-item>
                  <v-list-item-content>
                    <v-alert type="info" border="start" colored-border>
                      No tasks match the current filter. Add a new task or change the filter.
                    </v-alert>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-else>
                <v-list-item v-for="task in filteredTasks" :key="task.id">
                  <TodoCard
                    :task="task"
                    @toggle-complete="toggleComplete"
                    @edit-task="startEdit"
                    @delete-task="deleteTask"
                  />
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TodoCard from '../components/TodoCard.vue'
import { useUserStore } from '../store/user.js'

const router = useRouter()
const userStore = useUserStore()

const filters = ['All', 'Active', 'Completed']
// Sample tasks to start with
const tasks = ref([
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Finish homework', completed: true },
  { id: 3, title: 'Plan study schedule', completed: false }
])
const newTaskTitle = ref('')
const filter = ref('All')
const editDialog = ref(false)
const editTaskId = ref(null)
const editTitle = ref('')
const nextTaskId = ref(4)

// Filter tasks based on selected filter
const filteredTasks = computed(() => {
  if (filter.value === 'Active') {
    return tasks.value.filter((task) => !task.completed)
  }
  if (filter.value === 'Completed') {
    return tasks.value.filter((task) => task.completed)
  }
  return tasks.value
})

// Add a new task to the list
function addTask() {
  if (!newTaskTitle.value.trim()) return
  tasks.value.unshift({
    id: nextTaskId.value++,
    title: newTaskTitle.value.trim(),
    completed: false
  })
  newTaskTitle.value = ''
}

// Toggle task completion status
function toggleComplete(task) {
  const item = tasks.value.find((entry) => entry.id === task.id)
  if (item) {
    item.completed = !item.completed
  }
}

function startEdit(task) {
  editTaskId.value = task.id
  editTitle.value = task.title
  editDialog.value = true
}

function saveEdit() {
  // Find the task and update it
  const item = tasks.value.find((entry) => entry.id === editTaskId.value)
  if (item && editTitle.value.trim()) {
    item.title = editTitle.value.trim()
  }
  cancelEdit()
}

function cancelEdit() {
  // Close the dialog and reset the form
  editDialog.value = false
  editTaskId.value = null
  editTitle.value = ''
}

function deleteTask(task) {
  // Remove the task from the list
  tasks.value = tasks.value.filter((entry) => entry.id !== task.id)
}

async function handleSignOut() {
  // Sign out the user and go back to the login page
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
}
.subtitle {
  color: rgba(0, 0, 0, 0.65);
  margin-top: 4px;
  font-size: 0.95rem;
}
.todo-filter-select {
  min-width: 180px;
  max-width: 280px;
  width: 100%;
}
</style>
