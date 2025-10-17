import type { FastifyInstance } from 'fastify'
import { AtlazWebhookSchema } from '../types/schemas.ts'
import { startBaileys ,getBaileysSocket ,getQrCode } from '../services/baileysClient.ts'
import { enviarFaturasZap } from '../services/enviaMensagemAtlaz.ts'
import { formatPhoneNumber } from '../services/formataNumero.ts'

export async function rotaWebhookAtlaz(fastify: FastifyInstance) {

    fastify.post('/webhook/atlaz', async (request, reply) => {
        
        const body = AtlazWebhookSchema.parse(request.body)
        const sock:any = getBaileysSocket()
        
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
        const formatted = formatPhoneNumber(telefone)

        await enviarFaturasZap(telefone, mensagem, arquivo_url,linha_digitavel, pix_brcode, sock)

        return reply.code(200).send(
            {  success: false,
               message: 'enviada com sucesso', 
            })
    })

    fastify.get('/iniciar-servidor',  async (request, reply)=>{
    
        await startBaileys()
        reply.status(200).send({ ok: true });
    })

    fastify.get('/obter-qrcode', async (request, reply) => {
        try {
            const qrCode = getQrCode()
            if (qrCode) {
                return reply.code(200).send({ qrCode });
            } else {
                return reply.code(404).send({ error: 'QR Code não disponível no momento.' });
            }
        } catch (error) {
            console.error('Erro ao obter o QR Code:', error);
            return reply.code(500).send({ error: 'Erro interno do servidor.' });
        }
    })

}