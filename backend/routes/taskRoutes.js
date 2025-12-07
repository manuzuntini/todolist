const express = require('express')
const router = express.Router()
const controller = require('../controllers/taskController')
const checkAuth = require('../middleware/auth')

// Todas as rotas de tarefas exigem usuário autenticado
router.use(checkAuth)

router.get('/', controller.getAllTasks)
router.post('/', controller.createTask)
router.put('/:id', controller.updateTask)
router.delete('/:id', controller.deleteTask)

module.exports = router
