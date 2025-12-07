const express = require('express')
const app = express()
require('dotenv').config()

const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes')
const checkAuth = require('./middleware/auth')

// Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')

app.use(cors())
app.use(express.json())

// logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url)
  next()
})

// >>> Swagger UI em /api-docs <<<
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// rota de teste de auth
app.get('/api/me', checkAuth, (req, res) => res.json({ user: req.user }))

// rotas de tarefas
app.use('/api/tasks', taskRoutes)
app.use('/tasks', taskRoutes)

// health check
app.get('/api/ping', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
