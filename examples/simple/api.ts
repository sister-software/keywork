/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import { KeyworkResourceError, RequestRouter } from 'keywork'
import type { TodoItemPageProps } from './public/pages/TodoItem.js'

const mockTodos = new Map<string, TodoItemPageProps>([
  [
    '1',
    {
      id: '1',
      title: 'Todo 1',
      completed: false,
    },
  ],
  [
    '2',
    {
      id: '2',
      title: 'Todo 2',
      completed: false,
    },
  ],
  [
    '3',
    {
      id: '3',
      title: 'Todo 3',
      completed: true,
    },
  ],
])

export const apiRouter = new RequestRouter()

apiRouter.get('/todos', () => {
  return mockTodos
})

apiRouter.get<{ id: string }>('/todo/:id', async ({ params }) => {
  const todo = mockTodos.get(params.id)

  if (!todo) {
    return new KeyworkResourceError(`Todo ${params.id} not found`, 404)
  }

  return todo
})
