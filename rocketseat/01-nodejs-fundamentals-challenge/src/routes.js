import { randomUUID } from 'node:crypto'
import { Database } from "./database.js";
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database;

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      // FILTRO
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      }: null)

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end('Title and description are required!')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params
      const { title, description, completed_at } = req.body

      const existingTask = database.get('tasks', id);
      if (!existingTask) {
        return res.writeHead(404).end('Task not found!')
      }

      if (!title || !description) {
        return res.writeHead(400).end('Title and description are required!')
      }

      const updatedCompletedAt = completed_at !== undefined ? completed_at : null;

      database.update('tasks', id, {
        title,
        description,
        completed_at: updatedCompletedAt,
        created_at: existingTask.created_at,
        updated_at: new Date().toISOString(),
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params

      const existingTask = database.get('tasks', id);
      if (!existingTask) {
        return res.writeHead(404).end('Task not found!')
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  },
  
]