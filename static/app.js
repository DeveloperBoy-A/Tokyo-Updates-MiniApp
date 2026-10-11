const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }
const state = { category: 'All', query: '' };
const sampleCatalog = [
  {id:'tokyo-001',title:'Tokyo Picks',year:2026,type:'Featured',language:'Hindi',quality:'HD',description:'Featured picks from Tokyo Updates.'},
  {id:'tokyo-002',title:'Series Spotlight',year:2026,type:'Series',language:'Hindi',quality:'HD',description:'Discover a series spotlight.'},
  {id:'tokyo-003',title:'Weekend Watchlist',year:2025,type:'Movies',language:'English',quality:'Full HD',description:'A sample watchlist card.'},
  {id:'tokyo-004',title:'Anime Corner',year:2026,type:'Anime',language:'Japanese',quality:'HD',description:'Explore the anime corner.'},
  {id:'tokyo-005',title:'Night Mode',year:2026,type:'Featured',language:'Hindi',quality:'HD',description:'A sample Tokyo featured pick.'},
  {id:'tokyo-006',title:'Borderline',year:2025,type:'Series',language:'Japanese',quality:'HD',description:'A sample series card.'}
];
const grid = document.getElementById('catalogGrid');
const count = document.getElementById('resultCount');
const search = document.getElementById('searchInput');
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function loadCatalog() {
  const query = state.query.trim().toLocaleLowerCase();
  const items = sampleCatalog.filter(item =>
    (state.category === 'All' || item.type.toLowerCase() === state.category.toLowerCase()) &&
    (!query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
  );
  count.textContent = `${items.length} PICKS`;
  if (!items.length) { grid.innerHTML = '<div class="empty-state">No matches found. Try another search.</div>'; return; }
  grid.innerHTML = items.map(item => `<article class="catalog-card"><span class="card-open">↗</span><div><div class="card-art">${escapeHtml(item.title.slice(0,1).toUpperCase())}</div><span class="card-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><div class="card-meta"><span>${escapeHtml(item.year)}</span><span>•</span><span>${escapeHtml(item.language)}</span><span>•</span><span>${escapeHtml(item.quality)}</span></div></div></article>`).join('');
}
let searchTimer;
search.addEventListener('input', () => { state.query = search.value; clearTimeout(searchTimer); searchTimer = setTimeout(loadCatalog, 100); });
document.getElementById('categoryFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-category]'); if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.filter').forEach(el => el.classList.toggle('active', el === button));
  loadCatalog();
});
function openProfile() {
  const panel = document.getElementById('profilePanel'); panel.classList.remove('hidden'); panel.scrollIntoView({behavior:'smooth',block:'start'});
  const user = tg?.initDataUnsafe?.user;
  const content = document.getElementById('profileContent');
  if (!user) { content.textContent = 'Demo mode: open from Telegram to show your Telegram profile.'; return; }
  content.innerHTML = `<strong style="color:var(--text)">${escapeHtml([user.first_name,user.last_name].filter(Boolean).join(' '))}</strong><br>@${escapeHtml(user.username || 'telegram-user')}<br><span style="color:var(--mint)">Telegram Mini App connected · Demo mode</span><br><small>Profile and VIP status are not saved in this static test.</small>`;
}
document.getElementById('profileBtn').addEventListener('click', openProfile);
document.getElementById('navProfile').addEventListener('click', openProfile);
document.getElementById('closeProfile').addEventListener('click', () => document.getElementById('profilePanel').classList.add('hidden'));
document.getElementById('vipBtn').addEventListener('click', () => {
  const message = 'Testing mode only: VIP payments are disabled. No bot token, database URI, or payment setup is needed for this UI demo.';
  if (tg?.showAlert) tg.showAlert(message); else alert(message);
});
document.getElementById('shareBtn').addEventListener('click', () => {
  const botUsername = document.body.dataset.botUsername || '';
  const link = botUsername ? `https://t.me/${botUsername}?startapp=demo` : window.location.href;
  if (tg?.openTelegramLink) tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Check out Tokyo Updates Mini App demo!')}`);
  else if (navigator.share) navigator.share({title:'Tokyo Updates',text:'Check out Tokyo Updates Mini App demo!',url:link}).catch(()=>{});
  else if (navigator.clipboard) navigator.clipboard.writeText(link).then(()=>alert('Demo link copied')).catch(()=>{});
});
loadCatalog();
