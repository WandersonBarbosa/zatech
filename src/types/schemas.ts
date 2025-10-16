import { z } from 'zod'

export const AtlazWebhookSchema = z.object({
    token: z.string().min(1, "Token é obrigatório"),
    telefone: z.string().min(10, "Telefone inválido"),
    mensagem: z.string().optional(),
    arquivo_url: z.string().optional().nullable(),
    arquivo_tipo: z.string().optional().nullable(),
    linha_digitavel: z.string().optional().nullable(),
    pix_brcode: z.string().optional().nullable(),
})


// Export types
export type AtlazWebhookSchema = z.infer<typeof AtlazWebhookSchema>;