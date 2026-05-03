import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import createRazorpayOrder from './api/create-razorpay-order.js'
import verifyRazorpayPayment from './api/verify-razorpay-payment.js'

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

function createLocalResponse(res) {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      res.statusCode = this.statusCode
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    },
  }
}

function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      const routes = {
        '/api/create-razorpay-order': createRazorpayOrder,
        '/api/verify-razorpay-payment': verifyRazorpayPayment,
      }

      Object.entries(routes).forEach(([route, handler]) => {
        server.middlewares.use(route, async (req, res) => {
          try {
            req.body = await parseRequestBody(req)
            await handler(req, createLocalResponse(res))
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid API request.' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [localApiPlugin(), react(), tailwindcss()],
})
