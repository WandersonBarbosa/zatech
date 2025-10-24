import axios from "axios"
import { text } from "stream/consumers";


export async function enviarFaturasZap( PHONE_NUMBER: any,mensagem: any, arquivo_url: any, pix_brcode:any ,linha_digitavel: any, sock:any){
    const buttons = [
        {
            buttonId: `copiar_pix_${pix_brcode}`,
            buttonText: { displayText: '📋 PIX: 123e4567-pix-chave-exemplo' },
            type: 1
        },
       {
            buttonId: `abrir_boleto_${linha_digitavel}`,
            buttonText: { displayText: '💳 Boleto: 34191.79001 01043.510047 91020.150008 9 90580000010000' },
            type: 1
       }
    ]


    // Buscar PDF da fatura
        const pdfRes = await axios.get(arquivo_url, { responseType: 'arraybuffer' })

    if (!sock) {
        throw new Error('WhatsApp não conectado');
    }

    try {
        const phone = PHONE_NUMBER.includes('@s.whatsapp.net') ? PHONE_NUMBER : `${PHONE_NUMBER}@s.whatsapp.net`
        
        await sock.sendMessage(phone, {
        text: mensagem,
        footer: 'Sistema automático de cobranças',
        buttons: buttons,
        headerType: 1,})


       // Enviar o boleto PDF
            await sock.sendMessage(phone, {
              document: pdfRes.data,
              mimetype: 'application/pdf',
              fileName: `boleto-.pdf`
            })

            if(pix_brcode === ''){ pix_brcode = " 37792628000187 \n por favor, envie o comprovante do pagamento via Pix aqui neste chat. 📲" }

            const menspix = `🧾Linha digitavel boleto: ${linha_digitavel} \n 🔑💰 Chave pix : ${pix_brcode} \n\n 🤖 **Mensagem Automática** 🤖 \n Esta mensagem foi gerada automaticamente. Por favor, não responda.`
           
            await sock.sendMessage(phone,{
                text:  menspix,
                
            })
        
    }catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
    
}