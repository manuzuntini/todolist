const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Todo List API',
    version: '1.0.0',
    description:
      'API de tarefas (Todo List) usando Express e Supabase para a avaliação.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Token JWT do Supabase. Envie em Authorization: Bearer <token>.',
      },
    },
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2025-12-07T02:40:00.000Z',
          },
          title: { type: 'string', example: 'Estudar para a prova' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Revisar capítulo 3 do livro',
          },
          due_date: {
            type: 'string',
            format: 'date',
            nullable: true,
            example: '2025-12-31',
          },
          priority: {
            type: 'integer',
            nullable: true,
            example: 1,
            description: '1 = mais alta, 4 = mais baixa',
          },
          completed: { type: 'boolean', example: false },
        },
        required: ['id', 'title', 'completed'],
      },
      TaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Estudar Node.js' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Assistir aulas da semana',
          },
          dueDate: {
            type: 'string',
            format: 'date',
            nullable: true,
            example: '2025-12-31',
          },
          priority: { type: 'integer', nullable: true, example: 2 },
          completed: { type: 'boolean', nullable: true, example: false },
        },
        required: ['title'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Erro ao criar tarefa' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'Listar tarefas',
        description: 'Retorna todas as tarefas cadastradas.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de tarefas retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Task' },
                },
              },
            },
          },
          500: {
            description: 'Erro interno ao buscar tarefas.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Criar nova tarefa',
        description:
          'Cria uma nova tarefa. O backend recebe `dueDate` no corpo e grava como `due_date`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Tarefa criada com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
              },
            },
          },
          400: {
            description: 'Dados inválidos (por exemplo, título vazio).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Erro interno ao criar tarefa.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/tasks/{id}': {
      put: {
        tags: ['Tasks'],
        summary: 'Atualizar tarefa',
        description:
          'Atualiza uma tarefa existente. Só altera os campos enviados no corpo.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Tarefa atualizada com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
              },
            },
          },
          404: {
            description: 'Tarefa não encontrada.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Erro interno ao atualizar tarefa.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Excluir tarefa',
        description: 'Exclui uma tarefa pelo ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 },
          },
        ],
        responses: {
          200: {
            description: 'Tarefa excluída com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Deleted',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Tarefa não encontrada.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Erro interno ao excluir tarefa.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/ping': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Endpoint simples para verificar se o backend está no ar.',
        responses: {
          200: {
            description: 'Backend respondendo.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/me': {
      get: {
        tags: ['Auth'],
        summary: 'Usuário autenticado',
        description:
          'Retorna os dados básicos do usuário autenticado via Supabase.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Usuário autenticado retornado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      description:
                        'Objeto de usuário retornado pelo Supabase (id, email, etc).',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Não autenticado ou token inválido.',
          },
        },
      },
    },
  },
}

module.exports = swaggerDocument
