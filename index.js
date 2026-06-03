
// ── Navbar mobile hamburger ──────────────────
const hamBtn     = document.getElementById('ham-btn');
const mobileMenu = document.getElementById('mobile-menu');
hamBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden') === false;
  hamBtn.classList.toggle('ham-open', open);
  // close menu when any link clicked
});
document.querySelectorAll('#mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamBtn.classList.remove('ham-open');
  });
});

// ── Navbar: shrink on scroll ──────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('shadow-md', window.scrollY > 20);
});

// ── Hero entrance animation ───────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const t = document.getElementById('hero-text');
    const i = document.getElementById('hero-img');
    t.style.opacity  = '1';
    t.style.transform = 'translateY(0)';
    i.style.opacity  = '1';
  }, 150);
});

// ── Scroll reveal ─────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // stagger children if data-stagger
      const delay = e.target.style.transitionDelay || '0s';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// ── Animated counters ─────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el      = entry.target;
      const target  = parseInt(el.dataset.target, 10);
      const suffix  = el.dataset.suffix || '';
      const duration = 2000;
      const steps   = 60;
      const step    = duration / steps;
      let current   = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        // Format nicely
        let display;
        if (target >= 1000000)  display = (current / 1000000).toFixed(1) + suffix;
        else if (target >= 1000) display = (current / 1000).toFixed(1) + suffix;
        else                     display = Math.floor(current) + suffix;

        el.textContent = display;
      }, step);

      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Contact form handler ──────────────────────
async function handleFormSubmit(event) {
  event.preventDefault();
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('form-btn-text');
  const msg     = document.getElementById('form-msg');

  btn.textContent = 'Sending… ⏳';

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      msg.textContent  = '✅ Message sent! We\'ll get back to you shortly.';
      msg.className    = 'text-center text-sm font-semibold py-2 rounded-xl bg-green-50 text-green-700 border border-green-200';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    msg.textContent  = '⚠️ Couldn\'t send — please email us directly at hello@foodbridge.org';
    msg.className    = 'text-center text-sm font-semibold py-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-200';
  }

  btn.textContent = 'Send Message 🥦';
}

// ═══════════════════════════════
//  CHATBOT 
// ═══════════════════════════════

const chatToggleBtn = document.getElementById('chat-toggle');
const chatCloseBtn  = document.getElementById('chat-close');
const chatPanel     = document.getElementById('chatbot-panel');
const chatIcon      = document.getElementById('chat-icon');
const chatInput     = document.getElementById('chat-input');
const chatSendBtn   = document.getElementById('chat-send');
const chatMessages  = document.getElementById('chat-messages');

let chatOpen = false;

// ── Open / close ──
function openChat() {
  chatOpen = true;
  chatPanel.classList.add('chat-open');
  chatIcon.textContent = '✕';
  chatInput.focus();
}

function closeChat() {
  chatOpen = false;
  chatPanel.classList.remove('chat-open');
  chatIcon.textContent = '💬';
}

function toggleChat() {
  chatOpen ? closeChat() : openChat();
}

// ── Button listeners (no inline onclick needed) ──
chatToggleBtn.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', closeChat);

// Close when clicking outside the panel
document.addEventListener('click', function (e) {
  if (chatOpen &&
      !chatPanel.contains(e.target) &&
      !chatToggleBtn.contains(e.target)) {
    closeChat();
  }
});

// ── Bot replies ──
const botReplies = {
  donate:    '🍕 Great! Register your business using the contact form above. We onboard you within 24 hours!',
  volunteer: '🙋 Awesome! Fill in the contact form and select "Volunteer" — we will match you to nearby routes.',
  charity:   '🏠 Complete the contact form as "Charity / NGO" and we will verify and onboard you within 48 hours.',
  how:       '🌉 FoodBridge works in 4 steps: List → Match → Pickup → Impact. Scroll up to see the full breakdown!',
  cost:      '💚 Completely free for charities and volunteers. Donors pay a small platform fee for logistics.',
  app:       '📲 Search "FoodBridge" on the iOS App Store or Google Play Store!',
  hello:     '👋 Hello! Great to meet you. Ask me anything about FoodBridge.',
  hi:        '👋 Hi! How can Bridgey help you today?',
  thanks:    '😊 You are welcome! Anything else I can help with?',
  default:   '🤔 Great question! Email us at hello@foodbridge.org — we reply within a few hours. 😊'
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const [key, reply] of Object.entries(botReplies)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return botReplies.default;
}

// ── Append message bubble ──
function appendMessage(text, from) {
  const div = document.createElement('div');

  if (from === 'bot') {
    div.className = 'flex gap-2';
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-orange-200 text-base flex items-center justify-center shrink-0">🥕</div>
      <div class="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm max-w-[85%] text-gray-700 text-sm">${text}</div>`;
  } else {
    div.className = 'flex gap-2 justify-end';
    div.innerHTML = `
      <div class="bg-orange-500 text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] text-sm">${text}</div>`;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ── Typing dots ──
function showTyping() {
  const div = document.createElement('div');
  div.id = 'typing-indicator';
  div.className = 'flex gap-2';
  div.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center shrink-0">🥕</div>
    <div class="bg-white rounded-2xl px-4 py-3 shadow-sm flex gap-1 items-center">
      <span class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay:0s"></span>
      <span class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay:0.15s"></span>
      <span class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay:0.3s"></span>
    </div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// ── Send message ──
function sendMessage(text) {
  const msg = text || chatInput.value.trim();
  if (!msg) return;

  appendMessage(msg, 'user');
  chatInput.value = '';

  showTyping();
  setTimeout(() => {
    removeTyping();
    appendMessage(getBotReply(msg), 'bot');
  }, 800);
}

// ── Wire up send button and Enter key ──
chatSendBtn.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// ── Wire up quick reply chips ──
document.querySelectorAll('.quick-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    sendMessage(btn.dataset.quick);
  });
});