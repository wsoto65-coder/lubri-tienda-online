const products = [
  {id:1,name:'Aceite Sintético 5W-30 API SP Premium',detail:'1 galón · Protección para motores modernos',category:'Lubricantes',price:38.50,stock:14,icon:'🛢️',kind:'can-5w',tag:'Producto destacado'},
  {id:2,name:'Aceite Diésel 15W-40 Heavy Duty CK-4',detail:'4 litros · Servicio pesado',category:'Lubricantes',price:45.00,stock:9,icon:'🛢️',kind:'can-diesel',tag:'Diésel pesado'},
  {id:3,name:'Lubricante 20W-50 para motores a gas',detail:'4 litros · Gasolina / GNV / GLP',category:'Lubricantes',price:34.00,stock:12,icon:'🛢️',kind:'can-gas',tag:'Uso mixto'},
  {id:4,name:'Aceite 4T 10W-40 JASO MA2',detail:'1 litro · Motos 4 tiempos',category:'Motos',price:14.50,stock:20,icon:'🛢️',kind:'can-moto',tag:'Para motos'},
  {id:5,name:'Batería automotriz de arranque 12V',detail:'Consulta grupo y amperaje disponible',category:'Baterías',price:119.00,stock:7,icon:'🔋',kind:'battery',tag:'Garantía'},
  {id:6,name:'Filtro de aceite premium',detail:'Aplicaciones gasolina y diésel',category:'Filtros',price:12.50,stock:24,icon:'⚙️',kind:'filter',tag:''},
  {id:7,name:'Aditivo limpiainyectores',detail:'Tratamiento · 300 ml',category:'Aditivos',price:9.90,stock:18,icon:'🧪',kind:'additive',tag:'Limpieza'},
  {id:8,name:'Filtro de aire',detail:'Confirma compatibilidad con tu vehículo',category:'Filtros',price:16.00,stock:0,icon:'🧰',kind:'air-filter',tag:''},
  {id:9,name:'Bujía de encendido',detail:'Consulta referencia y compatibilidad',category:'Accesorios',price:6.75,stock:32,icon:'🔩',kind:'spark',tag:''},
  {id:10,name:'Aromatizante para auto',detail:'Fragancia fresca · Larga duración',category:'Accesorios',price:4.50,stock:21,icon:'🌿',kind:'care',tag:'Car care'}
];
const cart = new Map();
let activeCategory = 'Todos';
const grid = document.getElementById('product-grid');
const searchInput = document.getElementById('product-search');
const sortInput = document.getElementById('sort-products');
const money = value => new Intl.NumberFormat('es', {style:'currency',currency:'USD'}).format(value);
function renderProducts(){
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  let visible = products.filter(product => (activeCategory === 'Todos' || product.category === activeCategory) && `${product.name} ${product.detail} ${product.category}`.toLocaleLowerCase('es').includes(query));
  if(sortInput.value === 'price-asc') visible.sort((a,b)=>a.price-b.price);
  if(sortInput.value === 'price-desc') visible.sort((a,b)=>b.price-a.price);
  grid.innerHTML = visible.map(product => `<article class="product-card"><div class="product-art ${product.kind}"><span class="product-tag">${product.tag || product.category}</span><span class="stock-tag">${product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}</span><div class="product-visual ${product.kind}"><span class="can-cap"></span><span class="can-handle"></span><span class="can-brand">LOS PITS</span><span class="can-spec">${product.category === 'Motos' ? 'MOTO' : 'ENGINE'}<small>${product.name.match(/\d+W-\d+/)?.[0] || product.category.toUpperCase()}</small></span><span class="product-emoji" aria-hidden="true">${product.icon}</span></div></div><div class="product-info"><span class="product-category">Multicentro Los Pits</span><h3>${product.name}</h3><p>${product.detail}</p><div class="product-bottom"><strong>${money(product.price)}</strong><button class="add-button" data-add="${product.id}" aria-label="Añadir ${product.name}" ${product.stock === 0 ? 'disabled' : ''}>Añadir <span>+</span></button></div><button class="detail-button" data-add="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Ver detalle <span>→</span></button></div></article>`).join('');
  document.getElementById('empty-state').hidden = visible.length > 0;
}
function renderCart(){
  const items = [...cart.entries()].map(([id,qty])=>({product:products.find(p=>p.id===id),qty}));
  const count = items.reduce((sum,item)=>sum+item.qty,0);
  const subtotal = items.reduce((sum,item)=>sum+item.product.price*item.qty,0);
  document.getElementById('cart-count').textContent=count;
  document.getElementById('drawer-count').textContent=`(${count})`;
  document.getElementById('cart-subtotal').textContent=money(subtotal);
  document.getElementById('cart-empty').style.display=count?'none':'flex';
  document.getElementById('cart-footer').style.display=count?'block':'none';
  document.getElementById('cart-items').innerHTML=items.map(({product,qty})=>`<div class="cart-line"><div class="cart-thumb">${product.icon}</div><div><p class="cart-line-name">${product.name}</p><span class="cart-line-price">${money(product.price)}</span><div class="qty-control"><button data-qty="${product.id}" data-delta="-1" aria-label="Quitar una unidad">−</button><span>${qty}</span><button data-qty="${product.id}" data-delta="1" aria-label="Añadir una unidad" ${qty>=product.stock?'disabled':''}>+</button></div></div><button class="remove-item" data-remove="${product.id}" aria-label="Eliminar ${product.name}">×</button></div>`).join('');
}
function openCart(){document.getElementById('cart-drawer').classList.add('open');document.getElementById('cart-drawer').setAttribute('aria-hidden','false');document.getElementById('cart-backdrop').classList.add('visible');document.body.style.overflow='hidden'}
function closeCart(){document.getElementById('cart-drawer').classList.remove('open');document.getElementById('cart-drawer').setAttribute('aria-hidden','true');document.getElementById('cart-backdrop').classList.remove('visible');document.body.style.overflow=''}
let toastTimer;
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2100)}
grid.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;const id=Number(button.dataset.add),product=products.find(item=>item.id===id),qty=cart.get(id)||0;if(qty>=product.stock){toast('No hay más unidades disponibles.');return}cart.set(id,qty+1);renderCart();toast('Producto añadido al carrito')});
document.getElementById('cart-items').addEventListener('click',event=>{const qtyButton=event.target.closest('[data-qty]');const removeButton=event.target.closest('[data-remove]');if(removeButton)cart.delete(Number(removeButton.dataset.remove));if(qtyButton){const id=Number(qtyButton.dataset.qty),next=(cart.get(id)||0)+Number(qtyButton.dataset.delta),product=products.find(item=>item.id===id);if(next<=0)cart.delete(id);else cart.set(id,Math.min(next,product.stock))}renderCart()});
function setCategory(category){activeCategory=category;document.querySelectorAll('[data-category]').forEach(button=>button.classList.toggle('active',button.dataset.category===category));renderProducts()}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{setCategory(button.dataset.category);document.getElementById('catalogo').scrollIntoView({behavior:'smooth'})}));
searchInput.addEventListener('input',renderProducts);sortInput.addEventListener('change',renderProducts);
document.getElementById('open-cart').addEventListener('click',openCart);document.getElementById('close-cart').addEventListener('click',closeCart);document.getElementById('cart-backdrop').addEventListener('click',closeCart);document.getElementById('continue-shopping').addEventListener('click',closeCart);
document.querySelector('.checkout-button').addEventListener('click',()=>{if(!cart.size){toast('Agrega productos primero.');return}});
document.querySelector('.search-toggle').addEventListener('click',()=>{document.getElementById('catalogo').scrollIntoView({behavior:'smooth'});setTimeout(()=>searchInput.focus(),450)});
document.getElementById('mobile-menu').addEventListener('click',()=>{const nav=document.getElementById('main-nav');const open=nav.classList.toggle('open');document.getElementById('mobile-menu').setAttribute('aria-expanded',String(open))});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{document.getElementById('main-nav').classList.remove('open');document.getElementById('mobile-menu').setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart()});
document.getElementById('year').textContent=new Date().getFullYear();
renderProducts();renderCart();
