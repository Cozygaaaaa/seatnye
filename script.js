const MENU_ITEMS = [
  { id: 1, name: 'Nasi Goreng Spesial', desc: 'Telur, ayam, kerupuk', price: 28000, image: 'assets/nasi-goreng.svg' },
  { id: 2, name: 'Mie Ayam Bakso', desc: 'Mie homemade + bakso sapi', price: 25000, image: 'assets/mie-ayam.svg' },
  { id: 3, name: 'Ayam Geprek', desc: 'Ayam crispy + sambal, pilih level', price: 26000, image: 'assets/ayam-geprek.svg', levels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'] },
  { id: 4, name: 'Es Teh Manis', desc: 'Dingin segar', price: 8000, image: 'assets/es-teh.svg' },
  { id: 5, name: 'Lemon Tea', desc: 'Panas / dingin', price: 12000, image: 'assets/lemon-tea.svg' },
  { id: 6, name: 'Pisang Coklat', desc: 'Camilan penutup', price: 18000, image: 'assets/pisang-coklat.svg' },
];

const ROUTES = new Set(['menu', 'cart', 'queue', 'dashboard']);
const fmtIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const channel = 'BroadcastChannel' in window ? new BroadcastChannel('seatnye-cashier-sync') : null;

const state = {
  cart: new Map(),
  queue: JSON.parse(localStorage.getItem('cashierQueue') || '[]'),
  unreadNotifications: 0,
};

const el = {
  menuList: document.getElementById('menuList'),
  cartItems: document.getElementById('cartItems'),
  subTotal: document.getElementById('subTotal'),
  taxTotal: document.getElementById('taxTotal'),
  grandTotal: document.getElementById('grandTotal'),
  customerName: document.getElementById('customerName'),
  tableNumber: document.getElementById('tableNumber'),
  paymentMethod: document.getElementById('paymentMethod'),
  clearCartBtn: document.getElementById('clearCartBtn'),
  sendToCashierBtn: document.getElementById('sendToCashierBtn'),
  cashierQueue: document.getElementById('cashierQueue'),
  dashboardOrders: document.getElementById('dashboardOrders'),
  enableNotifBtn: document.getElementById('enableNotifBtn'),
  liveStatus: document.getElementById('liveStatus'),
  menuCardTpl: document.getElementById('menuCardTpl'),
  tabLinks: [...document.querySelectorAll('[data-route]')],
  views: [...document.querySelectorAll('[data-view]')],
  cartBadge: document.getElementById('cartBadge'),
  notifBadge: document.getElementById('notifBadge'),
};

function getCurrentRoute() {
  const route = window.location.hash.replace('#/', '') || 'menu';
  return ROUTES.has(route) ? route : 'menu';
}

function navigate(route) {
  window.location.hash = `/${route}`;
}

function renderRoute() {
  const activeRoute = getCurrentRoute();
  el.tabLinks.forEach((link) => link.classList.toggle('active', link.dataset.route === activeRoute));
  el.views.forEach((view) => view.classList.toggle('active', view.dataset.view === activeRoute));
  if (activeRoute === 'dashboard') {
    state.unreadNotifications = 0;
    renderNotifBadge();
  }
}

function renderNotifBadge() {
  el.notifBadge.textContent = String(state.unreadNotifications);
  el.notifBadge.classList.toggle('hidden', state.unreadNotifications === 0);
}

function itemKey(itemId, level) {
  return `${itemId}::${level || '-'}`;
}

function renderMenu() {
  el.menuList.innerHTML = '';
  MENU_ITEMS.forEach((item) => {
    const card = el.menuCardTpl.content.cloneNode(true);
    const article = card.querySelector('.menu-card');
    const thumb = card.querySelector('.thumb');
    const levelWrap = card.querySelector('.level-wrap');
    const levelSelect = card.querySelector('.level-select');

    thumb.src = item.image;
    thumb.alt = item.name;
    card.querySelector('.name').textContent = item.name;
    card.querySelector('.desc').textContent = item.desc;
    card.querySelector('.price').textContent = fmtIDR(item.price);

    if (item.levels?.length) {
      levelWrap.classList.remove('hidden');
      levelSelect.innerHTML = item.levels.map((lvl) => `<option value="${lvl}">${lvl}</option>`).join('');
    }

    const addSelected = () => addToCart(item, item.levels?.length ? levelSelect.value : null);

    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `Tambah ${item.name} ke pesanan`);
    article.addEventListener('click', (event) => {
      if (event.target.closest('.level-wrap')) return;
      addSelected();
    });
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        addSelected();
      }
    });

    card.querySelector('.add-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      addSelected();
    });

    el.menuList.appendChild(card);
  });
}

function addToCart(item, level = null) {
  const key = itemKey(item.id, level);
  const existing = state.cart.get(key);
  state.cart.set(key, {
    key,
    id: item.id,
    name: item.name,
    level,
    price: item.price,
    qty: existing ? existing.qty + 1 : 1,
  });
  renderCart();
}

function updateQty(key, delta) {
  const item = state.cart.get(key);
  if (!item) return;
  const nextQty = item.qty + delta;
  if (nextQty <= 0) {
    state.cart.delete(key);
  } else {
    state.cart.set(key, { ...item, qty: nextQty });
  }
  renderCart();
}

function clearCart() {
  state.cart.clear();
  renderCart();
}

function getSubTotal() {
  return [...state.cart.values()].reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getTaxTotal(subtotal) {
  return Math.round(subtotal * 0.1);
}

function getCartCount() {
  return [...state.cart.values()].reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const items = [...state.cart.values()];
  el.cartBadge.textContent = String(getCartCount());

  if (items.length === 0) {
    el.cartItems.className = 'cart-items empty';
    el.cartItems.textContent = 'Belum ada item.';
  } else {
    el.cartItems.className = 'cart-items';
    el.cartItems.innerHTML = items.map((item) => `
      <div class="cart-row" data-key="${item.key}">
        <div>
          <strong>${item.name}</strong>
          <small>${item.level || 'Normal'}</small>
        </div>
        <div class="cart-right">
          <div class="qty-controls">
            <button class="qty-btn" data-action="minus" data-key="${item.key}">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="plus" data-key="${item.key}">+</button>
          </div>
          <strong>${fmtIDR(item.price * item.qty)}</strong>
        </div>
      </div>
    `).join('');
  }

  const subtotal = getSubTotal();
  const tax = getTaxTotal(subtotal);
  el.subTotal.textContent = fmtIDR(subtotal);
  el.taxTotal.textContent = fmtIDR(tax);
  el.grandTotal.textContent = fmtIDR(subtotal + tax);
}

function transactionItemLine(trx) {
  return trx.items.map((i) => `${i.name}${i.level ? ` (${i.level})` : ''} x${i.qty}`).join(', ');
}

function renderQueue() {
  if (state.queue.length === 0) {
    el.cashierQueue.className = 'queue empty';
    el.cashierQueue.textContent = 'Belum ada transaksi masuk.';
    return;
  }

  el.cashierQueue.className = 'queue';
  el.cashierQueue.innerHTML = state.queue.map((trx) => `
    <article class="queue-item">
      <div class="queue-item-head">
        <strong>${trx.customer} (Meja ${trx.table})</strong>
        <strong>${fmtIDR(trx.total)}</strong>
      </div>
      <small>${trx.time} • ${trx.payment}</small>
      <small>Subtotal: ${fmtIDR(trx.subtotal || trx.total)} • Pajak 10%: ${fmtIDR(trx.tax || 0)}</small>
      <small>${transactionItemLine(trx)}</small>
    </article>
  `).join('');
}

function renderDashboard() {
  if (state.queue.length === 0) {
    el.dashboardOrders.className = 'queue empty';
    el.dashboardOrders.textContent = 'Belum ada pesanan baru.';
    return;
  }

  el.dashboardOrders.className = 'queue';
  el.dashboardOrders.innerHTML = state.queue.map((trx, idx) => `
    <article class="queue-item ${idx === 0 ? 'is-new' : ''}">
      <div class="queue-item-head">
        <strong>${trx.customer} (Meja ${trx.table})</strong>
        <strong>${fmtIDR(trx.total)}</strong>
      </div>
      <small>${trx.time} • ${trx.payment}</small>
      <small>${transactionItemLine(trx)}</small>
    </article>
  `).join('');
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  } catch {
    // ignore browser limitation
  }
}

function notifyNewOrder() {
  state.unreadNotifications += 1;
  renderNotifBadge();
  playBeep();

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pesanan Baru Masuk', { body: 'Cek Dashboard Kasir sekarang.' });
  }
}

function syncQueueAndNotify() {
  const latest = JSON.parse(localStorage.getItem('cashierQueue') || '[]');
  const prevLatestId = state.queue[0]?.id;
  const newLatestId = latest[0]?.id;

  state.queue = latest;
  renderQueue();
  renderDashboard();

  if (newLatestId && prevLatestId !== newLatestId) {
    notifyNewOrder();
  }
}

function publishQueueUpdate() {
  localStorage.setItem('cashierQueueSync', String(Date.now()));
  if (channel) {
    channel.postMessage({ type: 'queue-updated' });
  }
}

async function enableNotification() {
  if (!('Notification' in window)) {
    el.liveStatus.textContent = 'Browser ini tidak mendukung notifikasi sistem.';
    return;
  }

  const permission = await Notification.requestPermission();
  el.liveStatus.textContent = permission === 'granted'
    ? 'Notifikasi sistem aktif. Dashboard akan memberi alert pesanan baru.'
    : 'Notifikasi belum diizinkan. Tetap ada badge dan bunyi di halaman.';
}

function sendToCashier() {
  const items = [...state.cart.values()];
  if (!items.length) {
    alert('Pesanan masih kosong.');
    return;
  }

  const subtotal = getSubTotal();
  const tax = getTaxTotal(subtotal);

  state.queue.unshift({
    id: Date.now(),
    customer: el.customerName.value.trim() || 'Guest',
    table: el.tableNumber.value.trim() || '-',
    payment: el.paymentMethod.value,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    time: new Date().toLocaleString('id-ID'),
  });

  localStorage.setItem('cashierQueue', JSON.stringify(state.queue));
  publishQueueUpdate();
  renderQueue();
  renderDashboard();
  notifyNewOrder();
  clearCart();
  navigate('dashboard');
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('storage', (event) => {
  if (event.key === 'cashierQueue' || event.key === 'cashierQueueSync') {
    syncQueueAndNotify();
  }
});
if (channel) {
  channel.onmessage = (event) => {
    if (event.data?.type === 'queue-updated') {
      syncQueueAndNotify();
    }
  };
}

el.clearCartBtn.addEventListener('click', clearCart);
el.sendToCashierBtn.addEventListener('click', sendToCashier);
el.enableNotifBtn.addEventListener('click', enableNotification);
el.cartItems.addEventListener('click', (event) => {
  const btn = event.target.closest('.qty-btn');
  if (!btn) return;
  updateQty(btn.dataset.key, btn.dataset.action === 'plus' ? 1 : -1);
});

renderMenu();
renderCart();
renderQueue();
renderDashboard();
renderNotifBadge();
if (!window.location.hash) navigate('menu');
renderRoute();
