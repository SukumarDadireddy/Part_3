const express = require('express')
const Anthropic = require('@anthropic-ai/sdk')

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (request, response, next) => {
  const { message } = request.body

  if (!message || typeof message !== 'string' || !message.trim()) {
    return response.status(400).json({ error: 'message is required' })
  }

  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message.trim() }],
    })

    const text = msg.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    response.json({ reply: text, usage: msg.usage })
  } catch (error) {
    next(error)
  }
})

module.exports = router
