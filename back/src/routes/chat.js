const router = require('express').Router()
const { db } = require('../firebase')
const OpenAI = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/chat — used by the embedded widget (public, no auth)
router.post('/', async (req, res) => {
  const { widgetId, message, section, history = [] } = req.body
  if (!widgetId || !message) return res.status(400).json({ error: 'Missing fields' })

  try {
    const snap = await db.collection('widgets').doc(widgetId).get()
    if (!snap.exists) return res.status(404).json({ error: 'Widget not found' })
    const cfg = snap.data()

    const systemPrompt = buildSystemPrompt(cfg, section)

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 300,
    })

    const reply = completion.choices[0].message.content || ''
    const showPayment = shouldShowPayment(reply, message)

    // Persist the lead interaction
    await persistLead(cfg, widgetId, message, reply, section)

    res.json({ reply, showPayment })
  } catch (err) {
    console.error('chat error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/behavior/message — mounted at /api/behavior, so path here is /message
router.post('/message', async (req, res) => {
  const { widgetId, section, businessName } = req.body
  if (!widgetId || !section) return res.status(400).json({ error: 'Missing fields' })

  try {
    const snap = await db.collection('widgets').doc(widgetId).get()
    const cfg = snap.exists ? snap.data() : {}

    const prompt = `Eres el agente de ventas de "${cfg.businessName || businessName}".
El visitante lleva tiempo en la sección "${section}" de la página.
Escribe un mensaje proactivo, consultivo y breve (máximo 25 palabras) para invitarlo a conversar.
No uses saludos. Directo al punto. Sin comillas.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 80,
    })

    res.json({ message: completion.choices[0].message.content?.trim() || '' })
  } catch (err) {
    console.error('behavior message error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

function buildSystemPrompt(cfg, section) {
  return `Eres ${cfg.agentName || 'un asistente de ventas'} para "${cfg.businessName}".
Nicho: ${cfg.niche || 'general'}.
Tono: ${cfg.tone || 'cercano y directo'}.
El visitante está en la sección "${section || 'la página'}" del sitio web.

Tu objetivo:
1. Consultar y entender la necesidad del visitante.
2. Calificar si puede ser cliente.
3. Si hay intención clara de compra, ofrecer el link de pago con este mensaje exacto al final: "PAYMENT_LINK_OFFER".

Responde siempre en el idioma del visitante. Máximo 3 oraciones por respuesta. Sin asteriscos ni markdown.`
}

function shouldShowPayment(reply, userMessage) {
  const paymentIntent = ['PAYMENT_LINK_OFFER', 'pagar', 'comprar', 'precio', 'costo'].some(
    (kw) => reply.toLowerCase().includes(kw.toLowerCase())
  )
  return paymentIntent
}

async function persistLead(cfg, widgetId, message, reply, section) {
  try {
    const ref = db.collection('leads').doc()
    await ref.set({
      id: ref.id,
      widgetId,
      ownerUid: cfg.ownerUid,
      stage: 'engaged',
      section: section || null,
      lastMessage: message,
      lastReply: reply,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  } catch {
    // non-critical
  }
}

module.exports = router
