import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'

import { verifyToken } from '../utils/auth.ts'      

async function authPlugin(fastify: FastifyInstance) {
    fastify.decorate('authenticateWebhook', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            const authorization = request.headers.authorization

            if (!authorization) {
                reply.status(401).send({
                success: false,
                message: 'Token de acesso requerido',
                })
                return
            }

            const token = authorization.replace('Bearer ', '')
            const isValid = verifyToken(token)
            console.log('Token válido:', isValid)
            
            return isValid;

        }catch (err) {
            return reply.code(401).send({ error: 'Unauthorized' })
        }
    })    
}