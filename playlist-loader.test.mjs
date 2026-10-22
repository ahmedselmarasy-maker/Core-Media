import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../playlist-loader.js', import.meta.url), 'utf8');
const yt = fs.readFileSync(new URL('../youtube-utils.js', import.meta.url), 'utf8');
const make = (fetch) => {
  const window = { setTimeout, clearTimeout, setInterval, clearInterval, location: {origin: 'https://core-media-eg.vercel.app'} };
  const context = { URL, URLSearchParams, window, fetch, document: { body: { appendChild(){} }, head: { appendChild(){} }, createElement:()=>({ style:{}, dataset:{}, appendChild(){}, remove(){} }), querySelector(){return null;} } };
  vm.createContext(context);
  vm.runInContext(yt,context); vm.runInContext(source,context);
  return window.cmPlaylistLoader;
};
const service = make(async url => ({ ok:true, json:async () => ({ videos: [
  {id:'dQw4w9WgXcQ', title: 'Clip A'},
  {id:'aqz-KE-bpKQ', title: 'Clip B'},
  {id:'dQw4w9WgXcQ', title: 'Duplicate'},
] }) }));
const videos = await service.getVideos('https://www.youtube.com/playlist?list=PLH30EsvyyXzM');
assert.equal(videos.length,3);
const cards = service.asPortfolioBrands({ id:'test-education',name:'أعمال المدرسين', market:'egypt', egyptCategory:'education', sortOrder:0 }, {orientation:'auto'}, videos);
assert.equal(cards.length, 2);
assert.equal(cards[0].egyptCategory,'education');
assert.equal(cards[1].media[0].file,'https://www.youtube.com/watch?v=aqz-KE-bpKQ');
assert.ok(cards.every(card=>card.media.length===1 && card.media[0].type==='video'));
assert.ok(cards.every(card=>card.coverUrl.startsWith('https://i.ytimg.com/vi/')));

const fallbackContext = (()=>{
  const w = { setTimeout,clearTimeout,setInterval,clearInterval, location:{origin:'https://core-media-eg.vercel.app'}};
  const ctx = { URL,URLSearchParams,window:w,fetch:async ()=>({ok:false,status:503}),document:{
     body:{appendChild(){}},head:{appendChild(){}},createElement(){return {style:{},dataset:{},appendChild(){},remove(){}};},querySelector(){return null;}
  }};
  w.YT = { Player: class { constructor(node,options){this.options=options;setTimeout(()=>options.events.onReady({target:this}),5);} mute(){} cuePlaylist(){} getPlaylist(){return ['dQw4w9WgXcQ','aqz-KE-bpKQ'];} destroy(){} } };
  vm.createContext(ctx);vm.runInContext(yt,ctx);vm.runInContext(source,ctx);
  return w.cmPlaylistLoader;
})();
const fallback = await fallbackContext.getVideos('https://www.youtube.com/playlist?list=PLfiqxe869HDs');
assert.equal(fallback.length,2);
assert.equal(fallback[0].id,'dQw4w9WgXcQ');
console.log('PASS: 1 card per video; category retained; API fallback to IFrame Player getPlaylist.');
