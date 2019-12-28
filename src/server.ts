import Fastify from 'fastify'
import Sensible from 'fastify-sensible'
import Cors from 'fastify-cors'

import { openStorage } from './persistence'

const server = Fastify({ logger: { level: 'debug' }})
server.register(Sensible)
server.register(Cors)

const storage = openStorage()

const formBySlugOrId = async (slugOrId: string) => {
  let bySlug = await storage.forms.find({ slug: slugOrId })
  return (bySlug.length > 0) ? bySlug[0] : (await storage.forms.load(slugOrId))
}

server.route({
  method: 'GET',
  url: '/forms',
  handler: async (_, reply) => {
    reply.send(await storage.forms.find({}))
  }
})

server.route({
  method: 'GET',
  url: '/forms/:id',
  handler: async (req, reply) => {
    let id = req.params.id
    let form = await formBySlugOrId(id)
    reply.send(form)
  }
})

server.route({
  method: 'POST',
  url: '/forms/:id',
  handler: async (req, reply) => {
    let id = req.params.id
    let clientId = req.ip
    let form = await formBySlugOrId(id)
    let submission = await form.submit(clientId, req.body)
    await storage.submissions.save(submission)
    reply.send(submission)
  }
})

server.listen((err, address) => {
  if (err) throw err

  console.log(address)
})
