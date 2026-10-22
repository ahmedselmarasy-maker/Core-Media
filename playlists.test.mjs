import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {}, URL, URLSearchParams };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../youtube-utils.js', import.meta.url), 'utf8'), context);
const yt = context.window.cmYouTube;
const cms = JSON.parse(fs.readFileSync(new URL('../data/cms.json', import.meta.url), 'utf8'));

const mapping = [
  ['PLH30EsvyyXzM', 'education', 'أعمال المدرسين'],
  ['PLfiqxe869HDs', 'cafes', 'أعمال الكافيهات'],
  ['PLUQ3lchMfSpU', 'medical', 'أعمال القطاع الطبي'],
];
assert.equal(cms.brands.length, 26);
const imported = cms.brands.filter(b => !String(b.id).startsWith('cm-youtube-'));
assert.equal(imported.length, 23);
assert.equal(imported.reduce((n,b) => n + b.media.length,0),153);
assert.ok(!cms.site.sectors.egyptCategories.some(category => category.id === 'playlists'));
for (const [id, category, title] of mapping) {
  const brand = cms.brands.find(brand => brand.media.some(media => media.file.includes(id)));
  assert.ok(brand, `Missing playlist ${id}`);
  assert.equal(brand.name, title);
  assert.equal(brand.egyptCategory, category);
  assert.ok(cms.site.sectors.egyptCategories.some(item => item.id === category));
  const item = brand.media.find(media => media.file.includes(id));
  const parsed = yt.parse(item.file);
  assert.equal(parsed.kind, 'playlist');
  assert.equal(parsed.playlistId, id);
  assert.equal(yt.canonical(item.file), `https://www.youtube.com/playlist?list=${id}`);
  assert.match(yt.embed(item.file), /embed\/videoseries\?/);
}
assert.equal(yt.parse('https://www.youtube.com/shorts/aqz-KE-bpKQ').kind, 'video');
assert.equal(yt.parse('https://evil.test/playlist?list=PLH30EsvyyXzM'), null);
assert.ok(!cms.site.sectors.egyptCategories.some(category => category.id === 'playlists'));
const siteScript = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');
assert.ok(siteScript.includes('window.cmPlaylistLoader.asPortfolioBrands'));
assert.ok(siteScript.includes('discoverPlaylistVideos(brand, item, true)'));
console.log('PASS: Playlists assigned to original categories and frontend expands each playlist into standalone video cards.');
