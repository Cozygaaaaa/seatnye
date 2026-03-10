const MENU_ITEMS = [
  { id: 1, name: 'Nasi Goreng Spesial', desc: 'Telur, ayam, kerupuk', price: 28000, image: 'assets/nasi-goreng.svg' },
  { id: 2, name: 'Mie Ayam Bakso', desc: 'Mie homemade + bakso sapi', price: 25000, image: 'assets/mie-ayam.svg' },
  { id: 3, name: 'Ayam Geprek', desc: 'Level sambal 1-5', price: 26000, image: 'assets/ayam-geprek.svg' },
  { id: 4, name: 'Es Teh Manis', desc: 'Dingin segar', price: 8000, image: 'assets/es-teh.svg' },
  { id: 5, name: 'Lemon Tea', desc: 'Panas / dingin', price: 12000, image: 'assets/lemon-tea.svg' },
  { id: 6, name: 'Pisang Coklat', desc: 'Camilan penutup', price: 18000, image: 'assets/pisang-coklat.svg' },
];

const fmtIDR = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const state = {
  cart: new Map(),
  queue: JSON.parse(localStorage.getItem('cashierQueue') || '[]'),
};

const el = {
  menuList: document.getElementById('menuList'),
  cartItems: document.getElementById('cartItems'),
  grandTotal: document.getElementById('grandTotal'),
  customerName: document.getElementById('customerName'),
  tableNumber: document.getElementById('tableNumber'),
  paymentMethod: document.getElementById('paymentMethod'),
  clearCartBtn: document.getElementById('clearCartBtn'),
  sendToCashierBtn: document.getElementById('sendToCashierBtn'),
  cashierQueue: document.getElementById('cashierQueue'),
  menuCardTpl: document.getElementById('menuCardTpl'),
};

function renderMenu() {
  el.menuList.innerHTML = '';
  MENU_ITEMS.forEach((item) => {
    const card = el.menuCardTpl.content.cloneNode(true);
    const article = card.querySelector('.menu-card');
    const thumb = card.querySelector('.thumb');

    thumb.src = item.image;
    thumb.alt = item.name;

    card.querySelector('.name').textContent = item.name;
    card.querySelector('.desc').textContent = item.desc;
    card.querySelector('.price').textContent = fmtIDR(item.price);

    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `Tambah ${item.name} ke pesanan`);
    article.addEventListener('click', () => addToCart(item));
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        addToCart(item);
      }
    });

    card.querySelector('.add-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      addToCart(item);
    });

    el.menuList.appendChild(card);
  });
}

function addToCart(item) {
  const existing = state.cart.get(item.id);
  const qty = existing ? existing.qty + 1 : 1;
  state.cart.set(item.id, { ...item, qty });
  renderCart();
}

function clearCart() {
  state.cart.clear();
  renderCart();
}

function getCartTotal() {
  return [...state.cart.values()].reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const items = [...state.cart.values()];
  if (items.length === 0) {
    el.cartItems.className = 'cart-items empty';
    el.cartItems.textContent = 'Belum ada item.';
  } else {
    el.cartItems.className = 'cart-items';
    el.cartItems.innerHTML = items
      .map(
        (item) => `
          <div class="cart-row">
            <span>${item.name} x${item.qty}</span>
            <strong>${fmtIDR(item.price * item.qty)}</strong>
          </div>
        `,
      )
      .join('');
  }
  el.grandTotal.textContent = fmtIDR(getCartTotal());
}

function renderQueue() {
  if (state.queue.length === 0) {
    el.cashierQueue.className = 'queue empty';
    el.cashierQueue.textContent = 'Belum ada transaksi masuk.';
    return;
  }

  el.cashierQueue.className = 'queue';
  el.cashierQueue.innerHTML = state.queue
    .map(
      (trx) => `
      <article class="queue-item">
        <div class="queue-item-head">
          <strong>${trx.customer} (Meja ${trx.table})</strong>
          <strong>${fmtIDR(trx.total)}</strong>
        </div>
        <small>${trx.time} • ${trx.payment}</small>
        <small>${trx.items.map((i) => `${i.name} x${i.qty}`).join(', ')}</small>
      </article>
    `,
    )
    .join('');
}

function sendToCashier() {
  const customer = el.customerName.value.trim() || 'Guest';
  const table = el.tableNumber.value.trim() || '-';
  const payment = el.paymentMethod.value;
  const items = [...state.cart.values()];

  if (!items.length) {
    alert('Pesanan masih kosong.');
    return;
  }

  const trx = {
    id: Date.now(),
    customer,
    table,
    payment,
    items,
    total: getCartTotal(),
    time: new Date().toLocaleString('id-ID'),
  };

  state.queue.unshift(trx);
  localStorage.setItem('cashierQueue', JSON.stringify(state.queue));
  clearCart();
  renderQueue();
}

el.clearCartBtn.addEventListener('click', clearCart);
el.sendToCashierBtn.addEventListener('click', sendToCashier);

renderMenu();
renderCart();
renderQueue();
