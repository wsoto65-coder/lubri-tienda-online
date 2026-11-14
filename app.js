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

// Supplemental storefront sections based on the provided About, Contact, and Help screenshots.
const businessSection = document.getElementById('ayuda');
if (businessSection) businessSection.id = 'ubicacion';
const technicalSection = document.getElementById('nosotros');
if (technicalSection) technicalSection.id = 'lineas-tecnicas';
const main = document.querySelector('main');
main.insertAdjacentHTML('beforeend', `
  <section class="about-section section-wrap" id="nosotros">
    <div class="about-copy">
      <p class="eyebrow"><span></span> QUIÉNES SOMOS</p>
      <h2>Multicentro <em>Los Pits</em></h2>
      <p class="about-rif">RIF: J-504770515</p>
      <p>En Multicentro Los Pits somos especialistas en la distribución y comercialización de lubricantes de alta gama, baterías automotrices e industriales, sistemas de filtración y repuestos para vehículos livianos y flotas pesadas.</p>
      <p>Ubicados en la 4ta carrera Sur entre calles 16 y 17 Sur, El Tigre, estado Anzoátegui, acompañamos a talleres mecánicos, transportistas, empresas y particulares ofreciendo asesoría técnica especializada y atención cercana.</p>
      <p>Horario de atención: de lunes a sábado de 8:00 am a 5:00 pm y domingos de 9:00 am a 12:30 pm.</p>
    </div>
  </section>
  <section class="request-section section-wrap" id="formulario-cotizacion">
    <div class="request-heading"><p class="eyebrow"><span></span> ATENCIÓN AL CLIENTE Y EMPRESAS</p><h2>Contáctanos y cotiza con nosotros</h2><p>Asesoría técnica para flotas, maquinaria pesada, talleres y particulares. Déjanos tu requerimiento para preparar la consulta.</p></div>
    <div class="request-layout">
      <aside class="contact-card">
        <p class="eyebrow"><span></span> CONTACTO COMERCIAL</p><h3>Multicentro Los Pits</h3><p class="contact-rif">RIF: J-504770515</p>
        <h4>Dirección comercial</h4><p>4ta carrera Sur entre calles 16 y 17 Sur, El Tigre, estado Anzoátegui.</p>
        <h4>Atención por Instagram</h4><p>Escríbenos a <a href="https://www.instagram.com/multilospits/" target="_blank" rel="noopener noreferrer">@multilospits ↗</a></p>
        <a class="button button-red" href="https://www.google.com/maps/search/?api=1&amp;query=4ta+carrera+Sur+entre+calles+16+y+17+Sur%2C+El+Tigre%2C+Anzoategui%2C+Venezuela" target="_blank" rel="noopener noreferrer">Ver ubicación <span>↗</span></a>
        <div class="hours-card"><h4>Horarios de servicio</h4><p><span>Lunes a sábado</span><b>8:00 am - 5:00 pm</b></p><p><span>Domingos</span><b>9:00 am - 12:30 pm</b></p></div>
      </aside>
      <form class="quote-form" id="quote-form">
        <h3>Formulario de cotización y pedidos especiales</h3><p>Completa tus datos y el requerimiento. Al enviar, se preparará el texto para que lo compartas por el Instagram oficial.</p>
        <div class="form-grid">
          <label>Nombre completo *<input name="name" autocomplete="name" required placeholder="Ej. Carlos Mendoza"></label>
          <label>Teléfono / WhatsApp *<input name="phone" type="tel" autocomplete="tel" required placeholder="Tu número de contacto"></label>
          <label>Correo electrónico<input name="email" type="email" autocomplete="email" placeholder="nombre@ejemplo.com"></label>
          <label>Tipo de cliente<select name="clientType"><option>Particular / Vehículo propio</option><option>Taller mecánico</option><option>Empresa / Flota</option><option>Maquinaria pesada</option><option>Transportista</option></select></label>
          <label class="form-wide">Detalle del producto, viscosidad o repuesto que necesitas *<textarea name="details" required rows="4" placeholder="Indica producto, tipo de motor, viscosidad, batería, filtros o repuestos que buscas."></textarea></label>
        </div>
        <button class="button button-red" type="submit">Preparar solicitud <span>↗</span></button>
        <p class="form-status" id="form-status" role="status" aria-live="polite">El formulario no envía datos automáticamente. Podrás copiar el mensaje y compartirlo en Instagram.</p>
        <textarea class="prepared-message" id="prepared-message" aria-label="Mensaje preparado para copiar" readonly hidden></textarea>
        <button class="copy-message" id="copy-message" type="button" hidden>Copiar mensaje</button>
      </form>
    </div>
  </section>
  <section class="help-section section-wrap" id="ayuda">
    <div class="help-heading"><p class="eyebrow"><span></span> CENTRO DE AYUDA</p><h2>Ayuda al cliente</h2><p>Información útil para consultar antes de cotizar o realizar un pedido.</p></div>
    <div class="faq-list">
      <details><summary>¿Cuánto tarda el envío?</summary><p>Los tiempos y la cobertura dependen del destino y la disponibilidad. Confirma el plazo y el costo del despacho con nosotros antes de cerrar tu pedido.</p></details>
      <details><summary>¿Puedo devolver un producto?</summary><p>Consulta las condiciones de devolución antes de comprar. Conserva el producto, su empaque y comprobante, y contáctanos por Instagram para recibir orientación.</p></details>
      <details><summary>¿El pago es seguro?</summary><p>La tienda aún no procesa pagos en línea. Coordina y confirma el método de pago directamente con Multicentro Los Pits por su cuenta oficial.</p></details>
      <details><summary>¿Necesito crear una cuenta?</summary><p>No necesitas crear una cuenta para consultar el catálogo y solicitar una cotización.</p></details>
    </div>
    <div class="help-cards"><article><span>ENVÍOS</span><p>Confirma cobertura, costo y fecha estimada de entrega al solicitar tu cotización.</p></article><article><span>DEVOLUCIONES</span><p>Escríbenos para conocer el procedimiento y las condiciones aplicables a tu producto.</p></article></div>
  </section>
`);
const supplementalStyles = document.createElement('style');
supplementalStyles.textContent = `
.about-section,.request-section,.help-section{background:#101013;border-top:1px solid #29292e;padding-top:46px;padding-bottom:46px}.about-copy{max-width:760px;margin:0 auto}.about-copy h2,.request-heading h2,.help-heading h2{font:700 clamp(25px,3vw,34px)/1.2 var(--display);letter-spacing:-.04em;margin:0 0 7px}.about-copy h2 em{font-style:normal;color:var(--red)}.about-copy>p:not(.eyebrow){font-size:11px;line-height:1.8;color:#d0d0d5;margin:12px 0}.about-copy .about-rif{color:#ff6269;font-weight:800;font-size:10px;margin:0}.request-section{background:#0c0c0e}.request-heading{text-align:center;max-width:670px;margin:0 auto 25px}.request-heading .eyebrow,.help-heading .eyebrow{justify-content:center}.request-heading>p:last-child,.help-heading>p:last-child{font-size:10px;line-height:1.7;color:#b9b9c0}.request-layout{display:grid;grid-template-columns:.82fr 1.18fr;gap:18px;max-width:980px;margin:auto}.contact-card,.quote-form{background:linear-gradient(145deg,#19191e,#121215);border:1px solid #38383f;border-radius:10px;padding:21px}.contact-card h3,.quote-form h3{font:700 15px var(--display);margin:0 0 8px}.contact-card h4{font-size:9px;color:#ff6067;text-transform:uppercase;letter-spacing:.08em;margin:17px 0 5px}.contact-card p,.quote-form>p{font-size:9px;line-height:1.7;color:#c5c5cb}.contact-card .contact-rif{color:#ff6067;font-weight:700;margin:0}.contact-card a:not(.button){color:#fff;text-decoration:underline;text-underline-offset:3px}.contact-card .button{margin-top:7px}.hours-card{border-top:1px solid #34343a;margin-top:18px;padding-top:10px}.hours-card p{display:flex;justify-content:space-between;gap:8px}.hours-card b{color:#fff}.quote-form>p{margin:0 0 15px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.form-grid label{display:flex;flex-direction:column;gap:6px;color:#ff6a70;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}.form-grid input,.form-grid select,.form-grid textarea,.prepared-message{width:100%;border:1px solid #414149;border-radius:5px;background:#0d0d11;color:white;padding:10px;font:400 10px var(--font);outline:none}.form-grid input:focus,.form-grid select:focus,.form-grid textarea:focus,.prepared-message:focus{border-color:var(--red)}.form-grid input::placeholder,.form-grid textarea::placeholder{color:#888}.form-grid select option{background:#141418}.form-grid .form-wide{grid-column:1/-1}.quote-form>button[type=submit]{margin-top:14px;cursor:pointer}.form-status{min-height:20px}.prepared-message{min-height:100px;margin:6px 0;resize:vertical}.copy-message{background:transparent;color:#fff;border:1px solid #555;padding:8px 12px;border-radius:4px;cursor:pointer;font-size:9px}.help-section{background:#101013}.help-heading{text-align:center;margin-bottom:20px}.faq-list{max-width:760px;margin:0 auto;display:grid;gap:8px}.faq-list details{border:1px solid #383840;border-radius:7px;background:linear-gradient(110deg,#16161a,#1b1b20);overflow:hidden}.faq-list summary{cursor:pointer;list-style:none;padding:14px 16px;font-size:10px;font-weight:700}.faq-list summary::-webkit-details-marker{display:none}.faq-list summary:before{content:'›';color:var(--red);font-size:15px;margin-right:8px}.faq-list details[open] summary:before{content:'⌄'}.faq-list details p{margin:0;padding:0 16px 15px 34px;color:#c1c1c7;font-size:9px;line-height:1.7}.help-cards{max-width:760px;margin:18px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:12px}.help-cards article{border:1px solid #45454d;border-radius:8px;background:linear-gradient(130deg,#1d1d23,#151519);padding:15px}.help-cards article span{color:#ff5e65;font-size:9px;font-weight:800;letter-spacing:.1em}.help-cards article p{font-size:9px;line-height:1.65;color:#c4c4ca;margin:7px 0 0}@media(max-width:700px){.about-section,.request-section,.help-section{padding-top:32px;padding-bottom:32px}.request-layout{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}.form-grid .form-wide{grid-column:auto}.help-cards{grid-template-columns:1fr}.hours-card p{font-size:8px}}
`;
document.head.appendChild(supplementalStyles);
const quoteForm = document.getElementById('quote-form');
const preparedMessage = document.getElementById('prepared-message');
const copyMessageButton = document.getElementById('copy-message');
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(quoteForm);
  const message = [
    'Hola Multicentro Los Pits, deseo solicitar una cotización.',
    `Nombre: ${values.get('name')}`,
    `Teléfono: ${values.get('phone')}`,
    `Correo: ${values.get('email') || 'No indicado'}`,
    `Tipo de cliente: ${values.get('clientType')}`,
    `Requerimiento: ${values.get('details')}`
  ].join('\n');
  preparedMessage.value = message;
  preparedMessage.hidden = false;
  copyMessageButton.hidden = false;
  document.getElementById('form-status').textContent = 'Solicitud preparada. Cópiala y envíala por mensaje directo a @multilospits en Instagram.';
  window.open('https://www.instagram.com/multilospits/', '_blank', 'noopener,noreferrer');
});
copyMessageButton.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(preparedMessage.value); document.getElementById('form-status').textContent = 'Mensaje copiado. Pégalo en el chat de Instagram con @multilospits.'; }
  catch { preparedMessage.focus(); preparedMessage.select(); document.getElementById('form-status').textContent = 'Seleccionamos el mensaje: cópialo y pégalo en Instagram.'; }
});
document.getElementById('year').textContent=new Date().getFullYear();
renderProducts();renderCart();
