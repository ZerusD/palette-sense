// Local dev server for /api/generate — runs the REAL serverless handler on
// :3000 (the Vite proxy target) without needing the Vercel CLI.
// Usage: npm run dev:api   (alongside `npm run dev` for the UI)
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from '../api/generate.js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

// minimal .env.local loader (KEY=VALUE lines; existing env vars win)
const envPath = path.join(root, '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const PORT = 3000

http
  .createServer((req, res) => {
    if (!req.url.startsWith('/api/generate')) {
      res.writeHead(404)
      res.end()
      return
    }
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', async () => {
      let body
      try {
        body = raw ? JSON.parse(raw) : undefined
      } catch {
        body = undefined
      }
      // shim of the Vercel response helpers the handler uses
      const vres = {
        setHeader: (k, v) => res.setHeader(k, v),
        status(code) {
          res.statusCode = code
          return this
        },
        json(obj) {
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(obj))
          return this
        },
      }
      try {
        await handler({ method: req.method, body }, vres)
      } catch (e) {
        console.error('dev-api unhandled error:', e)
        res.statusCode = 500
        res.end('{"error":"dev server error"}')
      }
    })
  })
  .listen(PORT, () => {
    console.log(
      'dev api on :' + PORT + ' → POST /api/generate  (key ' +
        (process.env.ANTHROPIC_API_KEY ? 'loaded' : 'MISSING — put it in .env.local') + ')',
    )
  })
