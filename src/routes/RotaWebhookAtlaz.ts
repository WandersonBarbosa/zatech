import type { FastifyInstance } from 'fastify'
import { AtlazWebhookSchema } from '../types/schemas.ts'
import { startBaileys,getQrCode } from '../services/baileysClient.ts'
import { enviarFaturasZap } from '../services/enviaMensagemAtlaz.ts'
import { en } from 'zod/locales'

export async function rotaWebhookAtlaz(fastify: FastifyInstance) {

    fastify.post('/webhook/atlaz', async (request, reply) => {
        
        const body = AtlazWebhookSchema.parse(request.body)
        const sock = startBaileys()
        
        const {
            token,
            telefone,
            mensagem,
            arquivo_url,
            arquivo_tipo,
            linha_digitavel,
            pix_brcode,
        } = body

        if (token !== process.env.TOKEN_ATLAZ) {
            console.log("Token inválido")
            return reply.code(403).send({ error: "Token inválido" });
        }
        
        await enviarFaturasZap(telefone, mensagem, arquivo_url,linha_digitavel, pix_brcode, sock)

        return reply.code(200).send(
            {  success: false,
               message: 'enviada com sucesso', 
            })
    })

    fastify.get('/iniciar-servidor',  (request, reply)=>{
    
         startBaileys();
        reply.status(200).send({ ok: true , qr:getQrCode()});
    })
}