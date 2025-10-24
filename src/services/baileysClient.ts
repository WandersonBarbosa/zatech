import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'

import P from 'pino'
import { Boom } from "@hapi/boom"
import QRCode from 'qrcode'

let sock: any
let qrCodeData: string | null = null


export async function startBaileys() {

    const { state, saveCreds } = await useMultiFileAuthState('auth')

    sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }) })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async (update: { connection: any; lastDisconnect: any; qr: any }) => {
        const { connection, lastDisconnect, qr} = update
         if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('🔌 Conexão fechada. Reconectar?', shouldReconnect)

            // Se a sessão não foi desconectada manualmente, tenta reconectar
            if (shouldReconnect) {
                await startBaileys()
            } else {
                console.log('✅ Sessão encerrada. Exclua a pasta "auth" para iniciar uma nova sessão.');
            }
        }

        if (connection === 'open') {
               console.log('✅ Conectado ao WhatsApp!');
               qrCodeData = null;
        }

        if(qr){
            qrCodeData = qr
            console.log("QR Code recebido, por favor escaneie:")
            console.log(await QRCode.toString(qr, {type:'terminal', small: true}) )
        }

    })


    sock.ev.on('messages.upsert', async (messages: []) => {
   
   

   const msg:any = messages.messages[0]

    if (!msg.message) return

    if (msg.message.buttonsResponseMessage) {
      const id = msg.message.buttonsResponseMessage.selectedButtonId
      console.log('Botão clicado:', id)

      if (id.startsWith('copiar_pix_')) {
        const pix_brcode = id.replace('copiar_pix_', '')
        await sock.sendMessage(msg.key.remoteJid!, { text: `💡 Copie e cole a chave Pix:\n${pix_brcode}` })
      }

      if (id.startsWith('copiar_boleto_')) {
        const linha_digitavel = id.replace('copiar_boleto_', '')
        await sock.sendMessage(msg.key.remoteJid!, { text: `💳 Copie o código do boleto:\n${linha_digitavel}` })
      }
    }
  })
}


export function getQrCode() {
  return qrCodeData
}


export function enviarEFechar(){

   sock.ws.close(); // encerra conexão após envio
   console.log('🔌 Conexão WhatsApp encerrada.');
}


export function getBaileysSocket() {
    if (!sock) {
        throw new Error('Baileys não está iniciado. Chame startBaileys() primeiro.')
    }
    return sock
}


