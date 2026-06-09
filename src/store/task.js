import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase.js'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function getCurrentUserId() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      throw sessionError
    }
    if (!session?.user?.id) {
      throw new Error('No active user session')
    }
    return session.user.id
  }

  async function fetchTasks() {
    loading.value = true
    error.value = null

    try {
      const userId = await getCurrentUserId()
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('inserted_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      tasks.value = data ?? []
    } catch (fetchError) {
      console.error('Error fetching tasks:', fetchError)
      error.value = fetchError
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  async function createTask(title) {
    loading.value = true
    error.value = null

    try {
      const userId = await getCurrentUserId()
      const { error: insertError } = await supabase.from('tasks').insert([
        {
          user_id: userId,
          title,
          completed: false
        }
      ])
      if (insertError) {
        throw insertError
      }
      await fetchTasks()
    } catch (insertError) {
      console.error('Error creating task:', insertError)
      error.value = insertError
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id, updates) {
    loading.value = true
    error.value = null

    try {
      const userId = await getCurrentUserId()
      const { error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)

      if (updateError) {
        throw updateError
      }

      await fetchTasks()
    } catch (updateError) {
      console.error('Error updating task:', updateError)
      error.value = updateError
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id) {
    loading.value = true
    error.value = null

    try {
      const userId = await getCurrentUserId()
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (deleteError) {
        throw deleteError
      }

      await fetchTasks()
    } catch (deleteError) {
      console.error('Error deleting task:', deleteError)
      error.value = deleteError
    } finally {
      loading.value = false
    }
  }

  async function toggleComplete(task) {
    console.log('TaskStore: toggleComplete called with', task)
    const result = await updateTask(task.id, { completed: !task.completed })
    console.log('TaskStore: toggleComplete finished, result:', result)
    return result
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
  }
})
