// POST /api/generate — the ONE Anthropic call per Generate (PRD B1–B4).
//
// - Key: ANTHROPIC_API_KEY from the environment, used ONLY here. Never sent to
//   or readable by the browser (B2).
// - System prompt: the compiled color-theory KB (src/lib/colorTheoryPrompt.js),
//   marked as a cacheable prefix. NOTE: Sonnet 4.6's minimum cacheable prefix
//   is 2048 tokens and the KB prompt is currently ~700, so the marker is a
//   silent no-op today — kept because it's harmless, required by the spec, and
//   activates automatically if the KB grows (B4).
// - Strict JSON: structured outputs (output_config.format) guarantee the
//   response parses and has the right keys; validatePaletteResponse still
//   enforces what a schema can't — hex format and palette.length === count (B3, G2).
// - One call, never a loop: a malformed result returns an error, it is never
//   re-asked. (The SDK's built-in retry applies only to failed HTTP requests —
//   429/5xx/network — not to content we dislike.)
import Anthropic from '@anthropic-ai/sdk'
import { COLOR_THEORY_SYSTEM_PROMPT } from '../src/lib/colorTheoryPrompt.js'
import { validatePaletteResponse } from '../src/lib/validate.js'

const MODEL = 'claude-sonnet-4-6' // swappable to 'claude-haiku-4-5'
const MAX_TOKENS = 2048 // a 6-color palette with rationales is well under this
const TEMPERATURE = 0.3 // low for reliable, grounded output (B3)

// Contract from PRD §7. Structured outputs require additionalProperties:false
// and full `required` lists; array length and hex format are not expressible
// here, so validatePaletteResponse covers those.
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    paletteName: { type: 'string', description: 'Short, evocative palette name — 2 to 4 words.' },
    harmonyType: {
      type: 'string',
      description:
        "The harmony label ONLY, a few words like 'Analogous' or 'Split-complementary'. Never a sentence — reasoning belongs in moodExplanation.",
    },
    moodExplanation: { type: 'string' },
    palette: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hex: { type: 'string' },
          role: {
            type: 'string',
            description: 'One-word functional role: primary, secondary, accent, neutral, background, or text.',
          },
          name: { type: 'string' },
          rationale: { type: 'string' },
        },
        required: ['hex', 'role', 'name', 'rationale'],
        additionalProperties: false,
      },
    },
  },
  required: ['paletteName', 'harmonyType', 'moodExplanation', 'palette'],
  additionalProperties: false,
}

const HEX = /^#?[0-9a-fA-F]{6}$/
const normalizeHex = (v) => '#' + String(v).replace('#', '').toUpperCase()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set')
    return res.status(500).json({ error: 'The server is missing its configuration.' })
  }

  // ---- validate + sanitize the request (defensive caps) ----
  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const { mainColor, color2, color3, moodTags, freeText, count } = body

  if (!HEX.test(String(mainColor || ''))) {
    return res.status(400).json({ error: 'mainColor must be a 6-digit hex' })
  }
  const n = Number(count)
  if (!Number.isInteger(n) || n < 3 || n > 6) {
    return res.status(400).json({ error: 'count must be an integer from 3 to 6' })
  }
  const tags = Array.isArray(moodTags)
    ? moodTags.filter((t) => typeof t === 'string').slice(0, 16).map((t) => t.trim().slice(0, 32))
    : []
  const intent = typeof freeText === 'string' ? freeText.trim().slice(0, 300) : ''

  const request = {
    mainColor: normalizeHex(mainColor),
    ...(HEX.test(String(color2 || '')) && { color2: normalizeHex(color2) }),
    ...(HEX.test(String(color3 || '')) && { color3: normalizeHex(color3) }),
    moodTags: tags,
    ...(intent && { freeText: intent }),
    count: n,
  }

  // ---- the one call ----
  const client = new Anthropic({ apiKey })
  let response
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: [
        {
          type: 'text',
          text: COLOR_THEORY_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      output_config: { format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
      messages: [{ role: 'user', content: JSON.stringify(request) }],
    })
  } catch (err) {
    if (err instanceof Anthropic.APIConnectionError) {
      console.error('Anthropic connection error:', err.message)
    } else if (err instanceof Anthropic.RateLimitError) {
      console.error('Anthropic rate limited')
    } else if (err instanceof Anthropic.APIError) {
      console.error('Anthropic API error:', err.status, err.message)
    } else {
      console.error('generate failed:', err)
    }
    return res.status(502).json({ error: 'The palette engine is unavailable right now.' })
  }

  // ---- parse + validate the model output (friendly failure, G2) ----
  if (response.stop_reason === 'refusal') {
    console.error('model refused the request')
    return res.status(502).json({ error: 'The palette engine declined this request.' })
  }
  const text = response.content.find((b) => b.type === 'text')?.text ?? ''
  let data
  try {
    data = JSON.parse(text)
  } catch {
    console.error('model returned unparseable JSON; stop_reason:', response.stop_reason)
    return res.status(502).json({ error: 'The palette engine returned an unreadable response.' })
  }
  const problem = validatePaletteResponse(data, n)
  if (problem) {
    console.error('response failed validation:', problem)
    return res.status(502).json({ error: 'The palette engine returned an incomplete palette.' })
  }

  // server-side observability only (Vercel logs): model + token usage per call
  console.log('generate ok:', MODEL, JSON.stringify(response.usage))
  return res.status(200).json(data)
}
