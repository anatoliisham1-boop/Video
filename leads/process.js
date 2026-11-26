// Turns OpenStreetMap data (leads/raw.json) into a lead list:
// leads/warszawa.csv and leads/warszawa.md. Places with Instagram/Facebook come first.
const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'raw.json'), 'utf8'));
const TYPE = { hairdresser: 'Fryzjer/Barber', beauty: 'Salon beauty', cafe: 'Kawiarnia' };
const CHAINS = /starbucks|costa|green caff|coffeedesk|mcdonald|kfc|żabka|carrefour|wars|etno|so coffee|columbus|klifford|hair studio pl/i;

const leads = [];
for (const el of raw.elements) {
  const t = el.tags || {};
  if (!t.name || t.brand || CHAINS.test(t.name)) continue;
  const kind = TYPE[t.shop] || TYPE[t.amenity];
  if (!kind) continue;
  const insta = t['contact:instagram'] || t.instagram || '';
  const fb = t['contact:facebook'] || t.facebook || '';
  const site = t.website || t['contact:website'] || '';
  const phone = t.phone || t['contact:phone'] || '';
  if (!insta && !fb && !site && !phone) continue;
  const street = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
  const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
  leads.push({
    name: t.name, kind, address: street || '', district: t['addr:suburb'] || t['addr:city_district'] || '',
    instagram: insta, facebook: fb, website: site, phone,
    maps: lat ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name + ' ' + street + ' Warszawa')}` : '',
    score: (insta ? 3 : 0) + (fb ? 2 : 0) + (site ? 1 : 0) + (phone ? 1 : 0),
  });
}
leads.sort((a, b) => b.score - a.score || a.kind.localeCompare(b.kind));

const csvEsc = v => `"${String(v).replace(/"/g, '""')}"`;
const cols = ['name', 'kind', 'address', 'district', 'instagram', 'facebook', 'website', 'phone', 'maps'];
fs.writeFileSync(path.join(__dirname, 'warszawa.csv'),
  '﻿' + cols.join(';') + '\n' + leads.map(l => cols.map(c => csvEsc(l[c])).join(';')).join('\n'));

const link = (u, label) => u ? `[${label}](${u.startsWith('http') ? u : 'https://instagram.com/' + u.replace('@', '')})` : '';
const counts = leads.reduce((m, l) => (m[l.kind] = (m[l.kind] || 0) + 1, m), {});
let md = `# Список потенційних клієнтів: Варшава\n\nДжерело: OpenStreetMap. Мережі й заклади без жодного контакту відфільтровано.\n` +
  `Усього: **${leads.length}** (${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(', ')}).\n` +
  `Спочатку йдуть ті, у кого є Instagram чи Facebook: їм найлегше написати.\n\n` +
  `| # | Назва | Тип | Адреса | Контакт |\n|---|---|---|---|---|\n`;
leads.slice(0, 150).forEach((l, i) => {
  const contact = [link(l.instagram, 'Instagram'), l.facebook ? `[Facebook](${l.facebook})` : '',
    l.website ? `[сайт](${l.website})` : '', l.phone].filter(Boolean).join(' · ');
  md += `| ${i + 1} | ${l.name} | ${l.kind} | ${l.address} | ${contact} |\n`;
});
md += `\nПовний список (${leads.length}) у файлі \`leads/warszawa.csv\`, він відкривається в Excel або Google Sheets.\n`;
fs.writeFileSync(path.join(__dirname, 'warszawa.md'), md);
console.log('leads:', leads.length, counts, 'with instagram:', leads.filter(l => l.instagram).length);
