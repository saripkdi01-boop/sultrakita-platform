(function(){
  const features=window.getSultraKitaSettingsFeatures?window.getSultraKitaSettingsFeatures():[];
  const groups=[...new Set(features.map(feature=>feature.group))];
  const groupLabel={
    'Pengaturan & privasi':'PENGATURAN & PRIVASI',
    'Privasi & keamanan':'PRIVASI & KEAMANAN',
    'Aktivitas':'AKTIVITAS',
    'Transaksi':'TRANSAKSI',
    'Data':'DATA',
    'Tampilan':'TAMPILAN',
    'Lainnya':'LAINNYA'
  };
  function createItem(feature,compact){
    const item=document.createElement('a');
    item.className=compact?'drawer-registry-item':'settings-registry-item';
    item.dataset.featureId=feature.id;
    item.dataset.status=feature.status;
    item.setAttribute('aria-label',feature.title);
    if(feature.route&&feature.status==='active'){item.href=feature.route;const anchor=feature.route.split('#')[1];if(anchor&&(location.hash==='#'+anchor||(!location.hash&&feature.id==='account')))item.classList.add('active');}
    else {item.href='#';item.setAttribute('aria-disabled','true');item.addEventListener('click',event=>event.preventDefault());}
    const icon=document.createElement('span');icon.className=compact?'drawer-setting-icon':'settings-icon';icon.textContent=feature.icon;icon.setAttribute('aria-hidden','true');
    const copy=document.createElement('span');copy.className=compact?'drawer-registry-copy':'settings-registry-copy';
    const title=document.createElement('b');title.textContent=feature.title;copy.appendChild(title);
    const description=document.createElement('small');description.textContent=feature.status==='coming_soon'?'Segera hadir':feature.description;copy.appendChild(description);
    const chevron=document.createElement('strong');chevron.className='registry-chevron';chevron.textContent=feature.status==='active'?'›':'·';
    item.append(icon,copy,chevron);return item;
  }
  function render(targetId,compact){const root=document.getElementById(targetId);if(!root)return;root.replaceChildren();groups.forEach(group=>{const items=features.filter(feature=>feature.group===group);if(!items.length)return;const heading=document.createElement('strong');heading.className=compact?'drawer-registry-heading':'settings-registry-heading';heading.textContent=groupLabel[group]||group.toUpperCase();root.appendChild(heading);items.forEach(feature=>root.appendChild(createItem(feature,compact)));});}
  function init(){render('drawer-settings-registry',true);render('settings-nav-registry',false);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
