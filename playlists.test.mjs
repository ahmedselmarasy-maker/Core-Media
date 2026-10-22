import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const c={window:{},URL,URLSearchParams};vm.createContext(c);
vm.runInContext(fs.readFileSync(new URL('../youtube-utils.js',import.meta.url),'utf8'),c);
const yt=c.window.cmYouTube;
const ids=['PLH30EsvyyXzM','PLfiqxe869HDs','PLUQ3lchMfSpU'];
const cms=JSON.parse(fs.readFileSync(new URL('../data/cms.json',import.meta.url),'utf8'));
assert.equal(cms.brands.length,3);
assert.ok(cms.site.sectors.egyptCategories.some(c=>c.id==='playlists'));
for(let i=0;i<ids.length;i++){
 const url=`https://youtube.com/playlist?list=${ids[i]}&si=share`;
 const p=yt.parse(url);
 assert.equal(p.kind,'playlist');
 assert.equal(p.playlistId,ids[i]);
 assert.equal(yt.canonical(url),`https://www.youtube.com/playlist?list=${ids[i]}`);
 assert.equal(yt.thumbnail(url),'');
 assert.match(yt.embed(url),/embed\/videoseries\?/);
 assert.ok(yt.embed(url).includes(`list=${ids[i]}`));
 assert.equal(cms.brands[i].media[0].file,yt.canonical(url));
 assert.equal(cms.brands[i].egyptCategory,'playlists');
}
assert.equal(yt.parse('https://youtu.be/aqz-KE-bpKQ').kind,'video');
assert.equal(yt.parse('https://www.youtube.com/shorts/aqz-KE-bpKQ').short,true);
assert.equal(yt.parse('https://evil.test/playlist?list=PLH30EsvyyXzM'),null);
assert.equal(yt.parse('https://youtube.com/playlist?list=abc'),null);
console.log('PASS: 3 playlists, IDs, embeds, CMS cards, existing videos, blocked offsite URLs');
