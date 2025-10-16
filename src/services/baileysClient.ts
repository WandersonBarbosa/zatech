import  {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} from "baileys"


import { Boom } from "@hapi/boom"

let sock: any
let qrCodeData: string | null = null


export async function startBaileys() {

    const { state, saveCreds } = await useMultiFileAuthState('auth')

    sock = makeWASocket({ auth: state, printQRInTerminal: true })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update: { connection: any; lastDisconnect: any; qr: any }) => {
        const { connection, lastDisconnect, qr} = update

        if (connection === 'open') {
               console.log('✅ Conectado ao WhatsApp!');
               qrCodeData = null;
        }

        if(qr){
            qrCodeData = qr
            console.log("QR Code recebido, por favor escaneie:")
            console.log(qrCodeData)
        }

        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Conexão fechada devido a ', lastDisconnect?.error, ', reconectando: ', shouldReconnect)
        }
    })

    return sock
}


export function getQrCode() {
  return qrCodeData
}


export function enviarEFechar(){

   sock.ws.close(); // encerra conexão após envio
   console.log('🔌 Conexão WhatsApp encerrada.');
}
