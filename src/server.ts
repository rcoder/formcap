import Fastify from 'fastify'
import Sensible from 'fastify-sensible'
import Cors from 'fastify-cors'

import { openStorage } from './persistence'

const server = Fastify()
server.register(Sensible)
server.register(Cors)

const storage = openStorage()

server.route({
  method: 'GET',
  url: '/form/:id',
  handler: async (req, reply) => {
    let id = req.params.id
    let form = await storage.forms.load(id)
    reply.send(form)
  }
})

server.route({
  method: 'POST',
  url: '/form/:id',
  handler: async (req, reply) => {
    let id = req.params.id
    let clientId = req.ip
    let form = await storage.forms.load(id)
    let submission = await form.submit(clientId, req.body)
    reply.send(submission)
  }
})
