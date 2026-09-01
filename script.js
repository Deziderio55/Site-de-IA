const products = [
  { id: 1, name: 'NOVA Runner', category: 'corrida', label: 'NOVO', detail: 'Leveza para todos os dias', price: 389, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85' },
  { id: 2, name: 'NOVA Street', category: 'casual', label: 'BEST-SELLER', detail: 'Clássico, do seu jeito', price: 329, image: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85' },
  { id: 3, name: 'NOVA Terra', category: 'trilha', label: 'ESSENCIAL', detail: 'A cidade é só o começo', price: 449, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'NOVA Flux', category: 'corrida', label: 'NOVO', detail: 'Energia em cada passada', price: 419, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85' },
  { id: 5, name: 'NOVA Canvas', category: 'casual', label: 'LIMITADO', detail: 'Textura, forma e atitude', price: 279, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'NOVA Peak', category: 'trilha', label: 'RESISTENTE', detail: 'Feito para sair da rota', price: 499, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'NOVA Daily', category: 'casual', label: 'VERSÁTIL', detail: 'Conforto que não para', price: 299, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85' },
  { id: 8, name: 'NOVA Sprint', category: 'corrida', label: 'PERFORMANCE', detail: 'Seu melhor tempo começa aqui', price: 459, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85' }
];

const grid = document.querySelector('#product-grid');
const formatPrice = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let selectedFilter = 'todos';
let cart = [];

function renderProducts() {
  const query = document.querySelector('#search-input').value.toLowerCase().trim();
  const sort = document.querySelector('#sort-products').value;
  let visible = products.filter(product => selectedFilter === 'todos' || product.category === selectedFilter).filter(product => `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(query));
  if (sort === 'low') visible.sort((a, b) => a.price - b.price);
  if (sort === 'high') visible.sort((a, b) => b.price - a.price);
  grid.replaceChildren();
  if (!visible.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'cart-empty';
    emptyMessage.textContent = 'Nenhum par encontrado.';
    grid.append(emptyMessage);
    return;
  }
  visible.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const visual = document.createElement('div');
    visual.className = 'product-visual';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    const tag = document.createElement('span');
    tag.className = 'product-tag';
    tag.textContent = product.label;
    const addButton = document.createElement('button');
    addButton.className = 'quick-add';
    addButton.dataset.add = product.id;
    addButton.setAttribute('aria-label', `Adicionar ${product.name} ao carrinho`);
    addButton.textContent = '+';
    visual.append(image, tag, addButton);
    const info = document.createElement('div');
    info.className = 'product-info';
    const details = document.createElement('div');
    const name = document.createElement('h3');
    name.textContent = product.name;
    const description = document.createElement('p');
    description.textContent = product.detail;
    details.append(name, description);
    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = formatPrice(product.price);
    info.append(details, price);
    card.append(visual, info);
    grid.append(card);
  });
}

function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.cart-count').textContent = count;
  document.querySelector('.drawer-count').textContent = `(${count})`;
  document.querySelector('.cart-total').textContent = formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0));
  document.querySelector('.cart-empty').classList.toggle('hidden', cart.length > 0);
  const cartItems = document.querySelector('.cart-items');
  cartItems.replaceChildren();
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    const details = document.createElement('div');
    const name = document.createElement('h3');
    name.textContent = item.name;
    const quantity = document.createElement('p');
    quantity.textContent = `${item.quantity} × ${formatPrice(item.price)}`;
    details.append(name, quantity);
    cartItem.append(image, details);
    cartItems.append(cartItem);
  });
}

document.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    const existing = cart.find(item => item.id === product.id);
    existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });
    renderCart();
    document.querySelector('.cart-drawer').classList.add('open');
    document.querySelector('.cart-drawer').setAttribute('aria-hidden', 'false');
    document.querySelector('.overlay').classList.add('visible');
  }
  if (event.target.closest('.cart-toggle')) { document.querySelector('.cart-drawer').classList.add('open'); document.querySelector('.overlay').classList.add('visible'); }
  if (event.target.closest('.close-cart') || event.target.closest('.overlay')) { document.querySelector('.cart-drawer').classList.remove('open'); document.querySelector('.overlay').classList.remove('visible'); }
  if (event.target.closest('.search-toggle')) { document.querySelector('.search-panel').classList.add('open'); document.querySelector('#search-input').focus(); }
  if (event.target.closest('.close-search')) document.querySelector('.search-panel').classList.remove('open');
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(item => item.classList.remove('active')); button.classList.add('active'); selectedFilter = button.dataset.filter; renderProducts(); }));
document.querySelector('#sort-products').addEventListener('change', renderProducts);
document.querySelector('#search-input').addEventListener('input', renderProducts);
document.querySelector('#newsletter-form').addEventListener('submit', event => { event.preventDefault(); document.querySelector('#newsletter-message').textContent = 'Pronto. Você está na lista da NOVA.'; event.target.reset(); });
renderProducts();
renderCart();
