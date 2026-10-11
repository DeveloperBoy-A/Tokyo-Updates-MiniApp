const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }
const state = { category: 'All', query: '', items: [] };
const grid = document.getElementById('catalogGrid');
const count = document.getElementById('resultCount');
const search = document.getElementById('searchInput');
const authHeaders = () => tg?.initData ? { Authorization: `tma ${tg.initData}` } : {};
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
async function loadCatalog() {
  grid.innerHTML = '<div class="loading-card">Loading collection…</div>';
  const params = new URLSearchParams({ q: state.query, category: state.category });
  try {
    const response = await fetch(`/api/catalog?${params}`);
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json(); state.items = data.items || []; renderCatalog();
  } catch (error) { grid.innerHTML = '<div class="empty-state">Could not load collection. Please try again.</div>'; count.textContent = '0 PICKS'; }
}
function renderCatalog() {
  count.textContent = `${state.items.length} PICKS`;
  if (!state.items.length) { grid.innerHTML = '<div class="empty-state">No matches found. Try another search.</div>'; return; }
  grid.innerHTML = state.items.map((item, i) => `<article class="catalog-card"><span class="card-open">↗</span><div><div class="card-art">${escapeHtml(item.title.slice(0,1).toUpperCase())}</div><span class="card-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><div class="card-meta"><span>${escapeHtml(item.year)}</span><span>•</span><span>${escapeHtml(item.language)}</span></div></div></article>`).join('');
}
let searchTimer;
search.addEventListener('input', () => { state.query = search.value; clearTimeout(searchTimer); searchTimer = setTimeout(loadCatalog, 180); });
document.getElementById('categoryFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-category]'); if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.filter').forEach(el => el.classList.toggle('active', el === button)); loadCatalog();
});
function openProfile() {
  const panel = document.getElementById('profilePanel'); panel.classList.remove('hidden'); panel.scrollIntoView({behavior:'smooth', block:'start'});
  const user = tg?.initDataUnsafe?.user;
  const content = document.getElementById('profileContent');
  if (!user) { content.textContent = 'Open this app from Telegram to load your profile.'; return; }
  content.innerHTML = `<strong style="color:var(--text)">${escapeHtml([user.first_name,user.last_name].filter(Boolean).join(' '))}</strong><br>@${escapeHtml(user.username || 'telegram-user')}<br><span style="color:var(--mint)">Telegram Mini App session detected</span>`;
  fetch('/api/me', {headers: authHeaders()}).then(r => r.json()).then(data => { if(data.authenticated) content.innerHTML += `<br>Points: ${Number(data.points)||0} · ${data.premium ? 'VIP active' : 'Standard member'}`; }).catch(()=>{});
}
document.getElementById('profileBtn').addEventListener('click', openProfile);
document.getElementById('navProfile').addEventListener('click', openProfile);
document.getElementById('closeProfile').addEventListener('click', () => document.getElementById('profilePanel').classList.add('hidden'));
document.getElementById('vipBtn').addEventListener('click', async () => {
  if (!tg?.initData) { if (tg?.showAlert) tg.showAlert('VIP purchase Telegram ke andar app open karne par available hai.'); else alert('Open this app from Telegram to purchase VIP.'); return; }
  const button = document.getElementById('vipBtn'); const oldLabel = button.textContent; button.disabled = true; button.textContent = 'Creating invoice…';
  try {
    const response = await fetch('/api/vip/invoice', {method:'POST', headers:{...authHeaders(), 'Content-Type':'application/json'}});
    const data = await response.json();
    if (!response.ok || !data.invoice_url) throw new Error(data.detail || 'Could not create invoice');
    if (tg.openInvoice) tg.openInvoice(data.invoice_url, status => { if (status === 'paid') { tg.showAlert('Payment received! VIP activation is being confirmed.'); openProfile(); } else if (status === 'failed') tg.showAlert('Payment failed. Please try again.'); });
    else window.location.href = data.invoice_url;
  } catch (error) { if (tg.showAlert) tg.showAlert(error.message || 'VIP invoice could not be created.'); else alert(error.message || 'VIP invoice could not be created.'); }
  finally { button.disabled = false; button.textContent = oldLabel; }
});
document.getElementById('shareBtn').addEventListener('click', () => {
  const botUsername = document.body.dataset.botUsername || '';
  const link = botUsername ? `https://t.me/${botUsername}?startapp=ref_${tg?.initDataUnsafe?.user?.id || ''}` : window.location.href;
  if (tg?.openTelegramLink) tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Check out Tokyo Updates Mini App!')}`);
  else if (navigator.share) navigator.share({title:'Tokyo Updates', text:'Check out Tokyo Updates Mini App!', url:link}).catch(()=>{});
  else if (navigator.clipboard) navigator.clipboard.writeText(link).then(()=>alert('Link copied')).catch(()=>{});
});
loadCatalog();
