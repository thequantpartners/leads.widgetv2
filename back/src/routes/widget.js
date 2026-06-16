const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { db } = require('../firebase')

// Get or create the user's widget config
async function getUserWidget(uid) {
  const snap = await db.collection('widgets').where('ownerUid', '==', uid).limit(1).get()
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// GET /api/widget
router.get('/', requireAuth, async (req, res) => {
  try {
    const widget = await getUserWidget(req.uid)
    if (!widget) return res.status(404).json({ error: 'Widget not found' })
    res.json(widget)
  } catch (err) {
    console.error('widget get error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/widget
router.patch('/', requireAuth, async (req, res) => {
  try {
    const widget = await getUserWidget(req.uid)
    if (!widget) return res.status(404).json({ error: 'Widget not found' })

    const allowed = [
      'businessName', 'niche', 'tone', 'agentName', 'accentColor',
      'welcomeMessage', 'paymentLink', 'googleAdsId', 'conversionLabel',
      'behaviorRules', 'active',
    ]
    const patch = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key]
    }

    await db.collection('widgets').doc(widget.id).update(patch)
    res.json({ ...widget, ...patch })
  } catch (err) {
    console.error('widget patch error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// serveScript — exported and mounted directly at GET /w/:widgetId.js in index.js
async function serveScript(req, res) {
  try {
    const widgetId = req.params.widgetId
    const snap = await db.collection('widgets').doc(widgetId).get()
    if (!snap.exists) return res.status(404).send('// widget not found')

    const cfg = snap.data()
    if (!cfg.active) return res.status(403).send('// widget inactive')

    res.setHeader('Content-Type', 'application/javascript')
    res.setHeader('Cache-Control', 'public, max-age=60')
    res.send(buildWidgetScript(cfg, widgetId))
  } catch (err) {
    console.error('widget script error', err)
    res.status(500).send('// error')
  }
}

function buildWidgetScript(cfg, widgetId) {
  const apiBase = process.env.PUBLIC_APP_URL || ''
  return `
(function() {
  if (window.__SIGNAL_LOADED__) return;
  window.__SIGNAL_LOADED__ = true;

  var CFG = ${JSON.stringify({
    widgetId,
    businessName: cfg.businessName,
    agentName: cfg.agentName,
    accentColor: cfg.accentColor,
    welcomeMessage: cfg.welcomeMessage,
    paymentLink: cfg.paymentLink,
    googleAdsId: cfg.googleAdsId,
    conversionLabel: cfg.conversionLabel,
    behaviorRules: cfg.behaviorRules || [],
    apiBase,
  })};

  // ── SECTION KEYWORDS ─────────────────────────────────────────
  var SECTION_KEYWORDS = {
    pricing: ['pric','precio','plan','tarif','cost','valor','invert'],
    features: ['feature','caracteristic','beneficio','incluye','funcionalidad'],
    testimonials: ['testimoni','review','opinion','cliente','resultado'],
    faq: ['faq','pregunta','duda','frecuente'],
    contact: ['contact','contac','llamar','email','whatsapp'],
    checkout: ['checkout','comprar','buy','pagar','carrito','cart'],
    hero: ['hero','inicio','home','bienvenid'],
  };

  // ── SECTION DETECTOR ─────────────────────────────────────────
  var currentSection = null;
  var sectionStart = null;
  var triggered = {};

  function detectSection(el) {
    var text = (el.id + ' ' + el.className + ' ' + (el.dataset.section || '')).toLowerCase();
    // also check the first heading inside
    var h = el.querySelector('h1,h2,h3');
    if (h) text += ' ' + h.textContent.toLowerCase();
    for (var section in SECTION_KEYWORDS) {
      var kws = SECTION_KEYWORDS[section];
      for (var j = 0; j < kws.length; j++) {
        if (text.indexOf(kws[j]) !== -1) return section;
      }
    }
    return null;
  }

  function setupObserver() {
    var els = document.querySelectorAll('section,[id],[data-section]');
    if (!els.length) els = document.querySelectorAll('div');
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var section = detectSection(entry.target);
          if (section && section !== currentSection) {
            currentSection = section;
            sectionStart = Date.now();
          }
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function(el) { obs.observe(el); });
  }

  // ── BEHAVIOR TRACKER ─────────────────────────────────────────
  function startTracker() {
    setInterval(function() {
      if (!currentSection || !sectionStart) return;
      if (triggered[currentSection]) return;
      var elapsed = (Date.now() - sectionStart) / 1000;
      var rules = CFG.behaviorRules.filter(function(r) {
        return r.enabled && r.section === currentSection && elapsed >= r.thresholdSeconds;
      });
      if (!rules.length) return;
      triggered[currentSection] = true;
      var rule = rules[0];
      fetchAIMessage(currentSection, rule.message);
    }, 1000);
  }

  // ── AI MESSAGE ────────────────────────────────────────────────
  function fetchAIMessage(section, customMessage) {
    if (customMessage) {
      showBubble(customMessage);
      return;
    }
    fetch(CFG.apiBase + '/api/behavior/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        widgetId: CFG.widgetId,
        section: section,
        businessName: CFG.businessName,
      }),
    })
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.message) showBubble(d.message); })
      .catch(function() {});
  }

  // ── EVENT TRACKING ────────────────────────────────────────────
  function track(event, data) {
    navigator.sendBeacon(CFG.apiBase + '/api/events', JSON.stringify({
      widgetId: CFG.widgetId,
      event: event,
      section: currentSection,
      data: data || {},
    }));
    // Google Ads
    if (event === 'paid' && CFG.googleAdsId && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: CFG.googleAdsId + '/' + (CFG.conversionLabel || ''),
      });
    }
    if (event === 'engaged' && window.gtag) {
      window.gtag('event', 'signal_engaged', { widget_id: CFG.widgetId });
    }
  }

  // ── UI ────────────────────────────────────────────────────────
  var ACCENT = CFG.accentColor || '#c9f24a';
  var bubble = null;

  function showBubble(message) {
    if (bubble) bubble.remove();
    bubble = document.createElement('div');
    bubble.style.cssText = 'position:fixed;bottom:80px;right:20px;max-width:240px;background:#1c1c27;border:1px solid rgba(201,242,74,0.3);border-radius:16px 16px 4px 16px;padding:14px 16px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.4;color:#f4f4f6;z-index:99998;box-shadow:0 4px 24px -4px rgba(0,0,0,0.5);animation:__signal_in 0.4s cubic-bezier(.16,1,.3,1)';

    var close = document.createElement('button');
    close.innerHTML = '&#10005;';
    close.style.cssText = 'position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:#16161f;border:1px solid #25252f;color:#6c6c78;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1';
    close.onclick = function() { bubble.remove(); bubble = null; };

    bubble.textContent = message;
    bubble.appendChild(close);
    document.body.appendChild(bubble);

    track('bubble_shown', { message: message });
    setTimeout(function() { if (bubble) { bubble.remove(); bubble = null; } }, 10000);

    // Click on bubble opens chat
    bubble.addEventListener('click', function(e) {
      if (e.target === close) return;
      openChat();
    });
    bubble.style.cursor = 'pointer';
  }

  function openChat() {
    if (document.getElementById('__signal_chat__')) return;
    var chat = buildChatUI();
    document.body.appendChild(chat);
    if (bubble) { bubble.remove(); bubble = null; }
    track('engaged');
  }

  function buildChatUI() {
    var panel = document.createElement('div');
    panel.id = '__signal_chat__';
    panel.style.cssText = 'position:fixed;bottom:80px;right:20px;width:340px;height:480px;background:#0f0f15;border:1px solid #25252f;border-radius:20px;display:flex;flex-direction:column;font-family:system-ui,sans-serif;z-index:99999;box-shadow:0 8px 40px -8px rgba(0,0,0,0.7);overflow:hidden;animation:__signal_in 0.4s cubic-bezier(.16,1,.3,1)';

    // header
    var header = document.createElement('div');
    header.style.cssText = 'padding:14px 16px;background:#16161f;border-bottom:1px solid #25252f;display:flex;align-items:center;justify-content:space-between';
    var hTitle = document.createElement('div');
    hTitle.style.cssText = 'font-size:14px;font-weight:600;color:#f4f4f6';
    hTitle.textContent = CFG.agentName || 'Asistente';
    var hClose = document.createElement('button');
    hClose.innerHTML = '&#10005;';
    hClose.style.cssText = 'background:none;border:none;color:#6c6c78;cursor:pointer;font-size:16px;padding:0 4px';
    hClose.onclick = function() { panel.remove(); };
    header.appendChild(hTitle);
    header.appendChild(hClose);

    // messages
    var msgs = document.createElement('div');
    msgs.style.cssText = 'flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px';

    // welcome
    appendMsg(msgs, CFG.welcomeMessage || 'Hola, ¿en qué te puedo ayudar?', 'agent');

    // input area
    var inputRow = document.createElement('div');
    inputRow.style.cssText = 'padding:12px;border-top:1px solid #25252f;display:flex;gap:8px';
    var inp = document.createElement('input');
    inp.placeholder = 'Escribe aquí…';
    inp.style.cssText = 'flex:1;background:#08080c;border:1px solid #25252f;border-radius:10px;padding:10px 14px;font-size:13px;color:#f4f4f6;outline:none';
    inp.onfocus = function() { inp.style.borderColor = ACCENT; };
    inp.onblur = function() { inp.style.borderColor = '#25252f'; };

    var sendBtn = document.createElement('button');
    sendBtn.textContent = '→';
    sendBtn.style.cssText = 'width:40px;height:40px;border-radius:10px;background:' + ACCENT + ';border:none;cursor:pointer;font-size:16px;font-weight:700;color:#0a0d02;flex-shrink:0';

    var sending = false;
    async function sendMessage() {
      var text = inp.value.trim();
      if (!text || sending) return;
      sending = true;
      inp.value = '';
      appendMsg(msgs, text, 'user');
      msgs.scrollTop = msgs.scrollHeight;

      try {
        var r = await fetch(CFG.apiBase + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId: CFG.widgetId,
            message: text,
            section: currentSection,
            history: [],
          }),
        });
        var d = await r.json();
        appendMsg(msgs, d.reply, 'agent');
        if (d.showPayment && CFG.paymentLink) {
          appendPayment(msgs);
          track('payment_shown');
        }
      } catch {
        appendMsg(msgs, 'Ocurrió un error. Intenta de nuevo.', 'agent');
      } finally {
        sending = false;
        msgs.scrollTop = msgs.scrollHeight;
      }
    }

    sendBtn.onclick = sendMessage;
    inp.onkeydown = function(e) { if (e.key === 'Enter') sendMessage(); };
    inputRow.appendChild(inp);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(msgs);
    panel.appendChild(inputRow);
    return panel;
  }

  function appendMsg(container, text, role) {
    var bubble = document.createElement('div');
    var isAgent = role === 'agent';
    bubble.style.cssText = 'max-width:85%;padding:10px 13px;border-radius:' + (isAgent ? '16px 16px 16px 4px' : '16px 16px 4px 16px') + ';font-size:13px;line-height:1.45;' + (isAgent ? 'background:#16161f;color:#f4f4f6;align-self:flex-start' : 'background:' + ACCENT + ';color:#0a0d02;align-self:flex-end;font-weight:500');
    bubble.textContent = text;
    container.appendChild(bubble);
  }

  function appendPayment(container) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'align-self:flex-start;width:100%';
    var btn = document.createElement('a');
    btn.href = CFG.paymentLink;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.textContent = '💳 Ir al pago';
    btn.style.cssText = 'display:block;padding:12px 16px;background:' + ACCENT + ';border-radius:12px;color:#0a0d02;font-weight:700;font-size:13px;text-decoration:none;text-align:center';
    btn.onclick = function() { track('paid'); };
    wrap.appendChild(btn);
    container.appendChild(wrap);
  }

  // ── LAUNCHER BUTTON ───────────────────────────────────────────
  function buildLauncher() {
    // Inject keyframe once
    if (!document.getElementById('__signal_style__')) {
      var style = document.createElement('style');
      style.id = '__signal_style__';
      style.textContent = '@keyframes __signal_in{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}';
      document.head.appendChild(style);
    }

    var btn = document.createElement('button');
    btn.id = '__signal_launcher__';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:52px;height:52px;border-radius:50%;background:' + ACCENT + ';border:none;cursor:pointer;z-index:99997;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 0 ' + ACCENT + '40;animation:__signal_pulse 2s infinite';
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#0a0d02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var pulsing = btn.style.animation;
    btn.onmouseover = function() { btn.style.animation = 'none'; btn.style.transform = 'scale(1.08)'; };
    btn.onmouseout = function() { btn.style.animation = pulsing; btn.style.transform = ''; };
    btn.onclick = openChat;
    document.body.appendChild(btn);
  }

  // ── INIT ──────────────────────────────────────────────────────
  function init() {
    buildLauncher();
    track('viewed');
    if (CFG.behaviorRules.length > 0) {
      setupObserver();
      startTracker();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`
}

module.exports = { router, serveScript }
