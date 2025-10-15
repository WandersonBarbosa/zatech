import type { FastifyInstance } from 'fastify'
import { AtlazWebhookSchema } from '../types/schemas.ts'


export async function rotaWebhookAtlaz(fastify: FastifyInstance) {

    fastify.post('/webhook/atlaz', async (request, reply) => {
        
        const body = AtlazWebhookSchema.parse(request.body)

        const {
            telefone,
            mensagem,
            arquivo_url,
            arquivo_tipo,
            linha_digitavel,
            pix_brcode,
        } = body

        /*if (token !== process.env.TOKEN_ATLAZ) {
            return reply.code(403).send({ error: "Token inválido" });
        }
        */
        console.log('Telefone:', telefone);
        console.log('Mensagem:', mensagem);
        console.log('Arquivo URL:', arquivo_url);
        console.log('Arquivo Tipo:', arquivo_tipo);
        console.log('Linha Digitavel:', linha_digitavel);
        console.log('Pix Brcode:', pix_brcode);
        console.log('---');

        return reply.code(200).send(
            {  success: false,
               message: 'enviada com sucesso', 
            });
    })
}