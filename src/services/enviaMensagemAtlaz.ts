import axios from "axios"


export async function enviarFaturasZap( PHONE_NUMBER: any,mensagem: any, pix_brcode:any , link_boleto: any , sock:any){
    const buttons = [
        {
            buttonId: 'copiar_pix',
            buttonText: { displayText: '📋 PIX: 123e4567-pix-chave-exemplo' },
            type: 1
        },
       {
            buttonId: 'abrir_boleto',
            buttonText: { displayText: '💳 Boleto: 34191.79001 01043.510047 91020.150008 9 90580000010000' },
            type: 1
       }
    ]


    // Buscar PDF da fatura
        const pdfRes = await axios.get(link_boleto, { responseType: 'arraybuffer' })

    if (!sock) {
        throw new Error('WhatsApp não conectado');
    }

    try {
        const phone = PHONE_NUMBER.includes('@s.whatsapp.net') ? PHONE_NUMBER : `${PHONE_NUMBER}@s.whatsapp.net`
        
        await sock.sendMessage(phone, {
        text: mensagem,
        buttons: buttons,
        headerType: 1,})

        // Enviar o boleto PDF
            await sock.sendMessage(phone, {
              document: pdfRes.data,
              mimetype: 'application/pdf',
              fileName: `boleto-.pdf`
            })
            
            await sock.sendMessage(phone, {
                image: { url: pix_brcode },
                caption: 'Aqui está o QR Code do PIX para pagamento.',
            })
        
    }catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
    
}