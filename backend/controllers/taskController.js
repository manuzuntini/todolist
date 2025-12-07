const supabase = require('../lib/supabaseClient')

/**
 * GET /api/tasks ou /tasks
 * Retorna as tarefas apenas do usuário autenticado (req.user.id).
 */
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    console.log('GET /tasks - listando tarefas para user', userId)

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('completed', { ascending: true })
      .order('due_date', { ascending: true, nullsLast: true })
      .order('priority', { ascending: true, nullsLast: true })
      .order('id', { ascending: true })

    if (error) {
      console.error('getAllTasks error:', error)
      return res.status(500).json({
        message: 'Erro ao buscar tarefas',
        details: error,
      })
    }

    return res.json(data ?? [])
  } catch (err) {
    console.error('getAllTasks exception:', err)
    return res.status(500).json({
      message: err.message || 'Erro inesperado ao buscar tarefas',
    })
  }
}

/**
 * POST /api/tasks ou /tasks
 * Cria uma tarefa associada ao usuário autenticado.
 */
exports.createTask = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    console.log('POST /tasks body recebido:', req.body)

    const { title, description, dueDate, priority, completed } = req.body

    if (!title || !String(title).trim()) {
      console.warn('createTask - título vazio')
      return res.status(400).json({ message: 'Título é obrigatório' })
    }

    const payload = {
      user_id: userId,
      title: String(title).trim(),
      description: description ?? null,
      due_date: dueDate ?? null,
      priority: priority ?? null,
      completed: !!completed,
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      console.error('createTask error (Supabase):', error)
      return res.status(500).json({
        message: 'Erro ao criar tarefa',
        details: error,
      })
    }

    console.log('createTask - tarefa criada com sucesso, id', data.id)

    return res.status(201).json(data)
  } catch (err) {
    console.error('createTask exception:', err)
    return res.status(500).json({
      message: err.message || 'Erro inesperado ao criar tarefa',
    })
  }
}

/**
 * PUT /api/tasks/:id
 * Atualiza uma tarefa do usuário autenticado.
 */
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    const id = Number(req.params.id)
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    console.log('PUT /tasks/:id atualizando id', id, 'para user', userId)

    const { title, description, dueDate, priority, completed } = req.body

    const payload = {}

    if (title !== undefined) payload.title = String(title).trim()
    if (description !== undefined) payload.description = description
    if (dueDate !== undefined) payload.due_date = dueDate
    if (priority !== undefined) payload.priority = priority
    if (completed !== undefined) payload.completed = completed

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) {
      console.error('updateTask error (Supabase):', error)
      return res.status(500).json({
        message: 'Erro ao atualizar tarefa',
        details: error,
      })
    }

    if (!data) {
      // Ou não existe, ou não pertence ao usuário
      return res.status(404).json({ message: 'Tarefa não encontrada' })
    }

    console.log('updateTask - tarefa atualizada com sucesso')

    return res.json(data)
  } catch (err) {
    console.error('updateTask exception:', err)
    return res.status(500).json({
      message: err.message || 'Erro inesperado ao atualizar tarefa',
    })
  }
}

/**
 * DELETE /api/tasks/:id
 * Remove uma tarefa do usuário autenticado.
 */
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    const id = Number(req.params.id)
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    console.log('DELETE /tasks/:id deletando id', id, 'para user', userId)

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('deleteTask error (Supabase):', error)
      return res.status(500).json({
        message: 'Erro ao deletar tarefa',
        details: error,
      })
    }

    console.log('deleteTask - tarefa deletada com sucesso')

    return res.json({ message: 'Deleted' })
  } catch (err) {
    console.error('deleteTask exception:', err)
    return res.status(500).json({
      message: err.message || 'Erro inesperado ao deletar tarefa',
    })
  }
}
