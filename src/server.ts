import Fastify from "fastify"
import cors from '@fastify/cors'


// Import routes
import { rotaWebhookAtlaz } from './routes/RotaWebhookAtlaz.ts'
import { startBaileys } from "./services/baileysClient.ts"

const app = Fastify({ logger: false })
 app.register(cors,{ })


// Register routes
app.register(rotaWebhookAtlaz,{ prefix: '/api/v1' })



// Health check endpoint
app.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }
})

const PORT = process.env.PORT || 3333

// Inicia servidor
const start = async () => {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
    console.log("🚀 Webhook Atlaz rodando em http://localhost:3333");
    startBaileys()
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start()