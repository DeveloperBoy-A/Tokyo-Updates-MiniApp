(() => {
  'use strict';
  const tg = window.Telegram?.WebApp;
  if (tg) { tg.ready(); tg.expand(); try { tg.setHeaderColor('#080910'); tg.setBackgroundColor('#080910'); } catch (_) {} }

  // Frontend preview catalog only. Replace these examples with your bot/database feed for real files.
  const catalog = [
    {id:'stranger-things',title:'Stranger Things',year:2016,type:'Series',genres:['Sci-Fi','Thriller'],language:['Hindi','English'],quality:['1080p','720p'],rating:'8.7',featured:true,episodes:'4 Seasons',description:'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, supernatural forces and one extraordinary girl.',poster:'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg'},
    {id:'squid-game',title:'Squid Game',year:2021,type:'Series',genres:['Thriller','Action'],language:['Hindi','Korean','English'],quality:['1080p','720p','480p'],rating:'8.0',featured:true,episodes:'3 Seasons',description:'Hundreds of cash-strapped contestants accept a strange invitation to compete in children’s games, with a huge prize and deadly stakes.',poster:'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg'},
    {id:'alice-borderland',title:'Alice in Borderland',year:2020,type:'Series',genres:['Sci-Fi','Action','Thriller'],language:['Hindi','Japanese','English'],quality:['1080p','720p'],rating:'7.8',featured:true,episodes:'3 Seasons',description:'A gamer and his friends find themselves in a deserted Tokyo where survival depends on winning dangerous games.',poster:'https://image.tmdb.org/t/p/w500/Ac8ruycRXzgcsndTZFK6ouGA0FA.jpg'},
    {id:'sweet-home',title:'Sweet Home',year:2020,type:'Series',genres:['Horror','Action','Sci-Fi'],language:['Hindi','Korean','English'],quality:['1080p','720p','480p'],rating:'7.3',featured:true,episodes:'3 Seasons',description:'Residents of an apartment building fight to survive as people begin turning into terrifying monsters.',poster:'https://image.tmdb.org/t/p/w500/6eMg6p0l3N6l1j5Z4u8tQY6wY5p.jpg'},
    {id:'interstellar',title:'Interstellar',year:2014,type:'Movies',genres:['Sci-Fi','Adventure','Drama'],language:['Hindi','English'],quality:['2160p 4K','1080p','720p'],rating:'8.7',featured:true,description:'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.',poster:'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'},
    {id:'the-matrix',title:'The Matrix',year:1999,type:'Movies',genres:['Sci-Fi','Action'],language:['Hindi','English'],quality:['1080p','720p'],rating:'8.7',description:'A hacker learns that the world he knows is a simulated reality and joins a rebellion against its controllers.',poster:'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'},
    {id:'free-guy',title:'Free Guy',year:2021,type:'Movies',genres:['Comedy','Action','Sci-Fi'],language:['Hindi','English'],quality:['1080p','720p'],rating:'7.1',description:'A bank teller discovers he is a background character in a video game and decides to become the hero of his own story.',poster:'https://image.tmdb.org/t/p/w500/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg'},
    {id:'john-wick',title:'John Wick',year:2014,type:'Movies',genres:['Action','Thriller'],language:['Hindi','English'],quality:['1080p','720p','480p'],rating:'7.4',description:'A retired hitman returns to the underworld after a personal loss puts him back on a collision course with his past.',poster:'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg'},
    {id:'the-office',title:'The Office',year:2005,type:'Series',genres:['Comedy'],language:['Hindi','English'],quality:['1080p','720p'],rating:'9.0',episodes:'9 Seasons',description:'A mockumentary following the everyday, awkward and often hilarious lives of office employees.',poster:'https://image.tmdb.org/t/p/w500/qWnJzyZH8Tj6z8Y1s0Xq3jJ9H5e.jpg'},
    {id:'one-piece',title:'One Piece',year:1999,type:'Anime',genres:['Action','Adventure','Comedy'],language:['Hindi','Japanese','English'],quality:['1080p','720p'],rating:'9.0',episodes:'Ongoing',description:'A young pirate and his crew set sail in search of the legendary treasure known as One Piece.',poster:'https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg'},
    {id:'your-name',title:'Your Name',year:2016,type:'Anime',genres:['Anime','Romance','Drama'],language:['Hindi','Japanese','English'],quality:['1080p','720p'],rating:'8.4',description:'Two teenagers mysteriously begin switching bodies and form a connection that crosses time and distance.',poster:'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg'},
    {id:'demon-slayer',title:'Demon Slayer',year:2019,type:'Anime',genres:['Anime','Action','Fantasy'],language:['Hindi','Japanese','English'],quality:['1080p','720p'],rating:'8.6',episodes:'Multiple Seasons',description:'A young swordsman joins the fight against demons while searching for a way to save his sister.',poster:'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg'},
    {id:'Wednesday',title:'Wednesday',year:2022,type:'Series',genres:['Comedy','Fantasy','Mystery'],language:['Hindi','English'],quality:['1080p','720p'],rating:'8.0',featured:true,episodes:'2 Seasons',description:'Wednesday Addams investigates a string of mysteries at Nevermore Academy while navigating a new school and unusual powers.',poster:'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg'},
    {id:'top-gun',title:'Top Gun: Maverick',year:2022,type:'Movies',genres:['Action','Drama'],language:['Hindi','English'],quality:['2160p 4K','1080p','720p'],rating:'8.2',description:'After decades of service, Maverick trains a new generation of elite pilots for a dangerous mission.',poster:'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'},
    {id:'kung-fu-panda',title:'Kung Fu Panda',year:2008,type:'Movies',genres:['Comedy','Action','Animation'],language:['Hindi','English'],quality:['1080p','720p'],rating:'7.6',description:'An unlikely kung fu fan is chosen to fulfil an ancient prophecy and protect his valley.',poster:'https://image.tmdb.org/t/p/w500/wWt4JYXTg5Wr3xBW2phBrMKgp3x.jpg'}
  ];

  const state = { category:'All', genre:'', query:'', page:1, pageSize:9, selected:null };
  const $ = id => document.getElementById(id);
  const grid = $('catalogGrid'), count = $('resultCount'), search = $('searchInput');
  let toastTimer;
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function showToast(message) {
    const node = $('toast'); node.textContent = message; node.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 3200);
    if (tg?.HapticFeedback) try { tg.HapticFeedback.impactOccurred('light'); } catch (_) {}
  }
  function filteredItems() {
    const q = state.query.trim().toLocaleLowerCase();
    return catalog.filter(item => {
      const catMatch = state.category === 'All' || (state.category === 'Featured' ? item.featured : item.type.toLowerCase() === state.category.toLowerCase());
      const genreMatch = !state.genre || item.genres.some(g => g.toLowerCase() === state.genre.toLowerCase());
      const text = [item.title,item.year,item.type,item.description,...item.genres,...item.language].join(' ').toLowerCase();
      return catMatch && genreMatch && (!q || text.includes(q));
    });
  }
  function renderCatalog() {
    const items = filteredItems(), pages = Math.max(1, Math.ceil(items.length / state.pageSize));
    state.page = Math.min(state.page, pages);
    const visible = items.slice((state.page-1)*state.pageSize, state.page*state.pageSize);
    count.textContent = `${items.length} TITLES`;
    $('pageInfo').textContent = `PAGE ${state.page} / ${pages}`;
    $('prevPage').disabled = state.page <= 1; $('nextPage').disabled = state.page >= pages;
    if (!visible.length) { grid.innerHTML = '<div class="empty-state">No titles found. Try another title or genre.</div>'; return; }
    grid.innerHTML = visible.map(item => `<article class="catalog-card" tabindex="0" role="button" aria-label="View ${esc(item.title)} details" data-open-title="${esc(item.id)}">
      <div class="poster-wrap"><div class="poster-fallback">${esc(item.title.slice(0,1))}</div><img src="${esc(item.poster)}" alt="${esc(item.title)} poster" loading="lazy" onload="this.previousElementSibling.style.display='none'" onerror="this.style.display='none'"><span class="poster-badge">${item.featured?'TOKYO PICK':esc(item.type.toUpperCase())}</span><span class="poster-rating">★ ${esc(item.rating)}</span></div>
      <h3 class="card-title" title="${esc(item.title)}">${esc(item.title)}</h3><div class="card-meta"><span>${esc(item.year)}</span><span>·</span><span>${esc(item.type==='Movies'?'Movie':item.type)}</span></div><div class="card-genre">${esc(item.genres.slice(0,2).join(' · '))}</div><div class="card-language">AUDIO · ${esc(item.language.slice(0,2).join(' / '))}</div>
    </article>`).join('');
  }
  function setCategory(category) {
    state.category = category; state.page = 1;
    document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    renderCatalog();
  }
  function setGenre(genre) {
    state.genre = state.genre === genre ? '' : genre; state.category = 'All'; state.page = 1;
    document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.category === 'All'));
    document.querySelectorAll('.genre-tile').forEach(btn => btn.classList.toggle('genre-selected', btn.dataset.genre === state.genre));
    renderCatalog();
    $('discover').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function openDetails(id) {
    const item = catalog.find(x => x.id === id); if (!item) return;
    state.selected = item;
    $('detailType').textContent = `${item.type.toUpperCase()} · ${item.year}`;
    $('detailTitle').textContent = item.title;
    $('detailMeta').innerHTML = `<span>★ ${esc(item.rating)}</span><span>•</span><span>${esc(item.year)}</span><span>•</span><span>${esc(item.episodes || 'Feature film')}</span>`;
    $('detailDescription').textContent = item.description;
    $('detailPoster').src = item.poster; $('detailPoster').alt = item.title;
    $('detailTags').innerHTML = [...item.genres,...item.language.map(l => `Audio: ${l}`)].map(tag => `<span class="detail-tag">${esc(tag)}</span>`).join('');
    $('qualityList').innerHTML = item.quality.map((quality,index) => `<label class="quality-option"><input type="radio" name="quality" value="${esc(quality)}" ${index===0?'checked':''}><span>${esc(quality)}</span><small>${index===0?'Recommended':'Available in demo'}</small></label>`).join('');
    const titleQuery = encodeURIComponent(item.title + ' ' + item.year);
    $('imdbLink').href = `https://www.imdb.com/find/?q=${titleQuery}`;
    $('tmdbLink').href = `https://www.themoviedb.org/search?query=${titleQuery}`;
    $('detailModal').classList.remove('hidden'); document.body.style.overflow='hidden';
    if (tg?.BackButton) { try { tg.BackButton.show(); tg.BackButton.onClick(closeDetails); } catch (_) {} }
  }
  function closeDetails() {
    $('detailModal').classList.add('hidden'); document.body.style.overflow='';
    if (tg?.BackButton) try { tg.BackButton.hide(); tg.BackButton.offClick(closeDetails); } catch (_) {}
  }
  grid.addEventListener('click', e => { const card=e.target.closest('[data-open-title]'); if(card) openDetails(card.dataset.openTitle); });
  grid.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && e.target.matches('[data-open-title]')) { e.preventDefault(); openDetails(e.target.dataset.openTitle); } });
  $('categoryFilters').addEventListener('click', e => { const btn=e.target.closest('[data-category]'); if(btn) { state.genre=''; document.querySelectorAll('.genre-tile').forEach(x=>x.classList.remove('genre-selected')); setCategory(btn.dataset.category); } });
  $('genreTiles').addEventListener('click', e => { const btn=e.target.closest('[data-genre]'); if(btn) setGenre(btn.dataset.genre); });
  let searchTimer;
  search.addEventListener('input', () => { state.query=search.value; state.page=1; $('clearSearch').classList.toggle('visible',!!search.value); clearTimeout(searchTimer); searchTimer=setTimeout(renderCatalog,100); });
  $('clearSearch').addEventListener('click', () => { search.value='';state.query='';state.page=1;$('clearSearch').classList.remove('visible');renderCatalog();search.focus(); });
  $('prevPage').addEventListener('click',()=>{if(state.page>1){state.page--;renderCatalog();$('discover').scrollIntoView({behavior:'smooth'});}});
  $('nextPage').addEventListener('click',()=>{if(state.page<Math.ceil(filteredItems().length/state.pageSize)){state.page++;renderCatalog();$('discover').scrollIntoView({behavior:'smooth'});}});
  document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeDetails));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetails();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus();}});
  $('downloadBtn').addEventListener('click',()=>{
    const quality=document.querySelector('input[name="quality"]:checked')?.value||'1080p';
    const msg=`Preview only: ${state.selected?.title||'This title'} · ${quality}. Real download links and shortener verification must come from your bot/database backend. No file is being downloaded from this static page.`;
    if(tg?.showAlert) tg.showAlert(msg); else showToast(msg);
  });
  function showProfile() {
    const panel=$('profilePanel'); panel.classList.remove('hidden'); panel.scrollIntoView({behavior:'smooth',block:'start'});
    const user=tg?.initDataUnsafe?.user;
    if(!user){$('profileName').textContent='Guest viewer';$('profileHandle').textContent='Open this Mini App from Telegram to connect';$('profileStatus').textContent='Preview profile · not saved';$('avatarLetter').textContent='U';$('profileAvatar').textContent='U';return;}
    const name=[user.first_name,user.last_name].filter(Boolean).join(' ')||'Telegram viewer';
    $('profileName').textContent=name;$('profileHandle').textContent=user.username?'@'+user.username:'Telegram account connected';$('profileStatus').textContent='Telegram session detected · backend login not configured';
    const letter=(user.first_name||'U').slice(0,1).toUpperCase();$('avatarLetter').textContent=letter;$('profileAvatar').textContent=letter;
  }
  $('profileBtn').addEventListener('click',showProfile); $('navProfile').addEventListener('click',showProfile);
  $('closeProfile').addEventListener('click',()=>$('profilePanel').classList.add('hidden'));
  $('vipBtn').addEventListener('click',()=>{const msg='VIP preview only. Real membership, payments and status require a secure backend or Telegram bot integration.';if(tg?.showAlert)tg.showAlert(msg);else showToast(msg);});
  $('shareBtn').addEventListener('click',()=>{
    const botUsername=document.body.dataset.botUsername||'';
    const link=botUsername?`https://t.me/${botUsername}?startapp=tokyo`:window.location.href;
    const shareUrl=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Check out Tokyo Updates!')}`;
    if(tg?.openTelegramLink)tg.openTelegramLink(shareUrl);
    else if(navigator.share)navigator.share({title:'Tokyo Updates',text:'Check out Tokyo Updates!',url:link}).catch(()=>{});
    else if(navigator.clipboard)navigator.clipboard.writeText(link).then(()=>showToast('Mini App link copied')).catch(()=>showToast(link));
    else showToast(link);
  });
  document.querySelectorAll('.nav-item[href]').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));link.classList.add('active');}));
  renderCatalog();
})();