
document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const get = id => document.getElementById(id);
  const nodes = {
    market:get("gallery-market"),category:get("gallery-category"),
    add:get("gallery-add"),form:get("gallery-form"),cancel:get("gallery-cancel"),
    list:get("gallery-items"),count:get("gallery-count"),status:get("gallery-status"),
    filterType:get("gallery-filter-type"),filterStatus:get("gallery-filter-status"),
    search:get("gallery-search"),id:get("gallery-id"),type:get("gallery-item-type"),
    itemMarket:get("gallery-item-market"),itemCategory:get("gallery-item-category"),
    title:get("gallery-title"),url:get("gallery-url"),
    orientation:get("gallery-orientation"),visible:get("gallery-visible"),
    heading:get("gallery-form-heading"),save:get("gallery-save")
  };
  if (!nodes.list) return;
  let items=[],sectionLabels=[],busy=false,ready=false;
  const esc = value => String(value==null?"":value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  const safePreview = value => {
    const url=String(value||"").trim();
    if (/^https?:\/\//i.test(url)||/^\/(?!\/)/.test(url)||/^[\w\u0600-\u06ff#% .-]+\//i.test(url)) return url;
    return "";
  };
  const sectionList = site => {
    const cats=site && site.sectors && site.sectors.egyptCategories;
    return Array.isArray(cats)&&cats.length?cats:[{id:"restaurants",label:"مطاعم"},{id:"cafes",label:"كافيهات"},{id:"medical",label:"طبي"},{id:"education",label:"معلمين"},{id:"other",label:"مشاريع أخرى"}];
  };
  async function api(url, options) {
    const response=await fetch(url,{credentials:"same-origin",cache:"no-store",...(options||{})});
    const json=await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(json.error||("خطأ في الاتصال "+response.status));
    return json;
  }
  function status(message,error) {
    nodes.status.textContent=message||"";
    nodes.status.style.color=error?"#aa3b3b":"#145c7a";
  }
  const market=()=>nodes.market.value;
  const category=()=>nodes.category.value;
  function syncCategories() {
    const current=nodes.category.value, editCurrent=nodes.itemCategory.value;
    const options=sectionLabels.map(item=>'<option value="'+esc(item.id)+'">'+esc(item.label)+'</option>').join("");
    nodes.category.innerHTML=options;
    nodes.itemCategory.innerHTML=options;
    if(sectionLabels.some(x=>x.id===current))nodes.category.value=current;
    if(sectionLabels.some(x=>x.id===editCurrent))nodes.itemCategory.value=editCurrent;
  }
  function filtered() {
    const query=nodes.search.value.trim().toLocaleLowerCase();
    return items.filter(item => item.market===market() && item.category===category())
      .sort((a,b)=>(Number(a.sortOrder)||0)-(Number(b.sortOrder)||0))
      .filter(item=>nodes.filterType.value==="all"||item.type===nodes.filterType.value)
      .filter(item=>nodes.filterStatus.value==="all"||(nodes.filterStatus.value==="visible" ? item.visible!==false : item.visible===false))
      .filter(item=>!query||String(item.title||"").toLocaleLowerCase().includes(query)||String(item.sourceProject||"").toLocaleLowerCase().includes(query));
  }
  function preview(item) {
    const isPlaylist=window.cmYouTube?.parse(item.file)?.kind==="playlist";
    const thumb=item.type==="video" ? (window.cmYouTube?.thumbnail(item.file)||"") : safePreview(item.file);
    return thumb?'<img loading="lazy" alt="" src="'+esc(thumb)+'" />':'<span class="cm-gallery-placeholder"><i>'+(item.type==="video"?"▶":"▧")+'</i>'+(isPlaylist?"قائمة فيديوهات يوتيوب":item.type==="video"?"فيديو":"تصميم")+'</span>';
  }
  function render() {
    if(!ready)return;
    const all=items.filter(i=>i.market===market()&&i.category===category());
    const rows=filtered();
    nodes.count.textContent=rows.length+" عمل من أصل "+all.length+" في القسم — "+all.filter(i=>i.visible!==false).length+" ظاهر للزوار";
    if(!rows.length){nodes.list.innerHTML='<div class="cm-category-empty">مفيش محتوى مطابق. اضغط «إضافة فيديو أو تصميم» للبدء.</div>';return;}
    nodes.list.innerHTML=rows.map(item=>{
      const shown=item.visible!==false,kind=item.type==="video"?"فيديو":"تصميم";
      return '<article class="cm-gallery-item '+(shown?"":"is-hidden")+'"><div class="cm-gallery-preview">'+preview(item)+'</div>'+
        '<div class="cm-gallery-item-body"><strong title="'+esc(item.title)+'">'+esc(item.title||kind)+'</strong>'+
        '<div class="cm-gallery-item-meta">'+kind+(item.sourceProject?' · من الأرشيف: '+esc(item.sourceProject):'')+'</div>'+
        '<span class="cm-gallery-chip '+(shown?"":"off")+'">'+(shown?"ظاهر في الموقع":"مخفي من الموقع")+'</span>'+
        '<div class="cm-gallery-actions"><button type="button" data-act="edit" data-id="'+esc(item.id)+'">تعديل</button>'+
        '<button type="button" data-act="toggle" data-id="'+esc(item.id)+'">'+(shown?"إخفاء":"إظهار")+'</button>'+
        '<button type="button" data-act="up" data-id="'+esc(item.id)+'">↑ أعلى</button>'+
        '<button type="button" data-act="down" data-id="'+esc(item.id)+'">↓ أسفل</button>'+
        '<button type="button" class="cm-gallery-danger" data-act="remove" data-id="'+esc(item.id)+'">حذف</button></div></div></article>';
    }).join("");
  }
  async function load() {
    const result=await api("/api/cms");
    const site=result.cms.site||{};
    items=Array.isArray(site.galleryItems)?structuredClone(site.galleryItems):[];
    sectionLabels=sectionList(site);
    syncCategories();
    ready=true;
    render();
    status("أي تعديل بتحفظه هنا بيتنشر بعد تحديث الموقع من GitHub.");
  }
  async function commit(next, doneMessage) {
    if(busy)return;
    busy=true;nodes.save.disabled=true;status("جاري الحفظ...");
    try{
      const latest=await api("/api/cms");
      const doc=latest.cms;
      doc.site=doc.site||{};
      doc.site.galleryItems=next;
      const result=await api("/api/cms",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({sha:latest.sha,cms:doc})});
      items=next;
      window.dispatchEvent(new CustomEvent("cm-gallery-saved",{detail:{sha:result.sha,site:result.cms.site}}));
      render();status(doneMessage||"تم حفظ التعديل بنجاح. هيتنشر على الموقع بعد تحديث Vercel.");
      return true;
    }catch(error){status(error.message||"تعذر الحفظ.",true);return false;}
    finally{busy=false;nodes.save.disabled=false;}
  }
  function openForm(item) {
    nodes.form.hidden=false;
    nodes.form.scrollIntoView({behavior:"smooth",block:"nearest"});
    nodes.heading.textContent=item?"تعديل العمل":"إضافة فيديو أو تصميم";
    nodes.id.value=item?.id||"";
    nodes.type.value=item?.type||"video";
    nodes.title.value=item?.title||"";
    nodes.url.value=item?.file||"";
    nodes.orientation.value=item?.orientation||"auto";
    nodes.itemMarket.value=item?.market||market();
    nodes.itemCategory.value=item?.category||category();
    nodes.visible.checked=item?item.visible!==false:true;
  }
  nodes.add.addEventListener("click",()=>openForm(null));
  nodes.cancel.addEventListener("click",()=>{nodes.form.hidden=true;nodes.form.reset();});
  for(const select of [nodes.market,nodes.category,nodes.filterType,nodes.filterStatus])select.addEventListener("change",()=>{nodes.form.hidden=true;render();});
  nodes.search.addEventListener("input",render);
  nodes.list.addEventListener("click",async event=>{
    const btn=event.target.closest("button[data-act]");if(!btn||busy)return;
    const item=items.find(i=>i.id===btn.dataset.id);if(!item)return;
    const act=btn.dataset.act;
    if(act==="edit"){openForm(item);return;}
    const next=structuredClone(items),chosen=next.find(i=>i.id===item.id);
    if(act==="toggle")chosen.visible=chosen.visible===false;
    else if(act==="remove"){
      if(!confirm("تحذف العمل من العرض نهائيًا؟ الملف الأصلي مش هيتمسح من التخزين."))return;
      next.splice(next.indexOf(chosen),1);
    }else if(act==="up"||act==="down"){
      const siblings=next.filter(i=>i.market===chosen.market&&i.category===chosen.category).sort((a,b)=>(Number(a.sortOrder)||0)-(Number(b.sortOrder)||0));
      const ix=siblings.findIndex(i=>i.id===chosen.id),to=ix+(act==="up"?-1:1);
      if(to<0||to>=siblings.length)return;
      const temp=siblings[ix];siblings[ix]=siblings[to];siblings[to]=temp;
      siblings.forEach((it,index)=>{it.sortOrder=index;});
    }
    await commit(next,"تم حفظ التعديل في القسم.");
  });
  nodes.form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(busy)return;
    const type=nodes.type.value;
    const file=nodes.url.value.trim();
    if(!/^https:\/\//i.test(file)){status("الصورة أو الفيديو لازم يكون له رابط HTTPS مستضاف خارج GitHub.",true);return;}
    const isYoutube=Boolean(window.cmYouTube?.parse(file));
    if(type==="video"&&!isYoutube){status("الفيديوهات الجديدة لازم تكون روابط يوتيوب صحيحة.",true);return;}
    if(type==="design"&&isYoutube){status("اختار النوع «فيديو» لرابط يوتيوب.",true);return;}
    const oldId=nodes.id.value,existing=items.find(i=>i.id===oldId);
    const next=structuredClone(items);
    const name=nodes.title.value.trim()||(type==="video"?"فيديو":"تصميم");
    const destination=nodes.itemMarket.value+"|"+nodes.itemCategory.value;
    const same=next.filter(i=>i.market+"|"+i.category===destination);
    const newItem={id:oldId||crypto.randomUUID(),type,market:nodes.itemMarket.value,category:nodes.itemCategory.value,title:name,file,orientation:nodes.orientation.value,visible:nodes.visible.checked,sortOrder:existing&&existing.market===nodes.itemMarket.value&&existing.category===nodes.itemCategory.value?existing.sortOrder:same.length,sourceProject:existing?.sourceProject||""};
    const ix=next.findIndex(i=>i.id===oldId);
    if(ix<0)next.push(newItem);else next[ix]=newItem;
    const saved=await commit(next,"تم حفظ العمل بنجاح.");
    if(saved){nodes.form.hidden=true;nodes.form.reset();nodes.market.value=newItem.market;nodes.category.value=newItem.category;render();}
  });
  window.addEventListener("cm-admin-ready",()=>load().catch(err=>status(err.message||"تعذر تحميل معرض الأعمال.",true)));
});
