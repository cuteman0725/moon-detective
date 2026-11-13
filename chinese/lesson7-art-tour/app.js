/* 國語第七課 到此「藝」遊 app.js - 主要互動邏輯
   資料來源：南一四上課本、likethinking.com、北新國小教案
   生字、詞語依課本，題目為練習自編 */
(function(){
"use strict";
if(typeof document==="undefined")return;
var $=function(id){return document.getElementById(id);};
var C=Core,KEY="zhArtTourV1";
function each(list,fn){Array.prototype.forEach.call(list,fn);}
function fresh(){return {stars:0,readBest:0,seen:{},wrote:{},matchDone:0,pat:{},stepDone:0,stepPerfect:0,locPerfect:0,chBest:0,bad:{},best:{}};}
var store=fresh();
try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);for(var k in o)store[k]=o[k];}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
var TN={read:"🔍 閱讀理解",part:"🧱 文章結構",bs:"🧩 部首",tot:"✏️ 筆畫",zy:"🔤 注音",look:"👀 形近字／多音字",word:"📚 語詞意思",fill:"📝 選詞填空",sense:"🪄 看到的＋感受",simile:"🔁 首尾呼應",rhet:"🎭 修辭判斷",location:"🏛️ 地點分類",step:"🚶 參觀順序"};
function miss(t){store.bad[t]=(store.bad[t]||0)+1;save();}
function renderScore(){$("score").textContent="⭐ "+store.stars;}
function addStars(n,el){if(n<=0)return;store.stars+=n;save();renderScore();var sc=$("score");sc.classList.remove("pop");void sc.offsetWidth;sc.classList.add("pop");
  if(el&&el.getBoundingClientRect){var r=el.getBoundingClientRect();for(var i=0;i<6;i++){var s=document.createElement("div");s.className="burst";s.textContent=["⭐","✨","🌟"][i%3];
    s.style.left=(r.left+r.width/2)+"px";s.style.top=(r.top+20)+"px";s.style.setProperty("--dx",(Math.random()*160-80)+"px");s.style.setProperty("--dy",(-60-Math.random()*120)+"px");
    document.body.appendChild(s);setTimeout(function(x){return function(){if(x.parentNode)x.parentNode.removeChild(x);};}(s),1200);}}}
var actx=null;function beep(good){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();(good?[660,880]:[260]).forEach(function(f,i){var o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;o.type="triangle";g.gain.setValueAtTime(.08,actx.currentTime+i*.08);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+i*.08+.2);o.connect(g);g.connect(actx.destination);o.start(actx.currentTime+i*.08);o.stop(actx.currentTime+i*.08+.22);});}catch(e){}}
function say(t){try{if(!window.speechSynthesis)return;speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,"").replace(/＿+/g,"什麼"));u.lang="zh-TW";u.rate=.85;speechSynthesis.speak(u);}catch(e){}}
function goTab(p){each(document.querySelectorAll("#tabs button"),function(x){x.classList.toggle("on",x.getAttribute("data-p")===p);});
  each(document.querySelectorAll("section.page"),function(s){s.classList.toggle("active",s.id===p);});
  if(p==="p-rec")renderRec();window.scrollTo(0,0);}
each(document.querySelectorAll("#tabs button"),function(b){b.addEventListener("click",function(){goTab(b.getAttribute("data-p"));});});

/* ---------- 通用測驗 ---------- */
function runQuiz(boxId,make,opt){
  var box=$(boxId),items=[],i=0,right=0,answered=false;
  function start(){items=make();i=0;right=0;draw();}
  function draw(){
    var it=items[i],h='<div class="prog">';
    for(var k=0;k<items.length;k++)h+='<i class="'+(k<i?(items[k].ok?"ok":"no"):k===i?"cur":"")+'"></i>';
    h+='</div><div class="q">'+it.q+'</div><div class="choices"></div><div class="fb"></div><div class="btns cen"><button class="btn org hidden nx">下一題 ➜</button></div>';
    box.innerHTML=h;answered=false;
    var ch=box.querySelector(".choices");
    it.o.forEach(function(op){var b=document.createElement("button");b.className="btn";b.textContent=op;b.addEventListener("click",function(){pickAns(b,op);});ch.appendChild(b);});
    box.querySelector(".nx").addEventListener("click",function(){i++;if(i<items.length)draw();else finish();});
  }
  function pickAns(b,op){
    if(answered)return;answered=true;var it=items[i],ok=op===it.a,f=box.querySelector(".fb");it.ok=ok;
    each(box.querySelectorAll(".choices .btn"),function(x){if(x.textContent===it.a)x.classList.add("ok");x.disabled=x!==b&&x.textContent!==it.a;});
    if(ok){right++;b.classList.add("ok");beep(true);addStars(1,b);f.className="fb show good";f.innerHTML="✅ 答對了！"+(it.tip?" "+it.tip:"");}
    else{b.classList.add("no");beep(false);miss(it.type||opt.type);f.className="fb show bad";f.innerHTML="再想想：正確答案是「<b>"+it.a+"</b>」。"+(it.tip?" "+it.tip:"");}
    var nx=box.querySelector(".nx");nx.textContent=i<items.length-1?"下一題 ➜":"看成績 🎉";nx.classList.remove("hidden");
  }
  function finish(){
    var st=C.stars(right,items.length);addStars(st,box);
    if(opt.best){store.best[opt.best]=Math.max(store.best[opt.best]||0,right);save();}
    if(opt.onDone)opt.onDone(right,items.length);
    box.innerHTML='<div class="done">🎉 答對 <b>'+right+'</b> / '+items.length+' 題　'+(st?"再加 "+st+" 顆星！":"")+'<br>'+(right===items.length?"全對！太厲害了！":"錯的地方再看一次課本，再挑戰一次吧！")+'</div><div class="btns cen"><button class="btn pink again">🔄 再玩一次</button></div>';
    box.querySelector(".again").addEventListener("click",start);
  }
  start();
  return {restart:start};
}

/* ---------- 課文 ---------- */
var SAY=["終於到了戶外教育日！天空有點灰，但我的心情很晴朗，因為老師帶我們參觀宜蘭傳藝園區。",
 "進入園區，我的眼睛為之一亮。街道旁是古色古香的磚紅色建築，一個個紅燈籠，看起來喜氣洋洋。",
 "走進魯班街，傳習所介紹陶器、玉石、藍染等藝術品，令人目不轉睛。琉璃閃著七彩光芒，讓我流連忘返。",
 "接著，我們到劇場觀賞「噶瑪蘭公主」。演員又唱又跳、翻跟斗，還有人走在細細的鋼索上，大家不禁為他捏了一把冷汗。精采的表演讓全場尖叫！",
 "看完表演後，我們到渡船頭坐木船遊河。船穿過爬滿綠色植物的石拱橋。微風吹過岸邊金黃的落羽松，頑皮的魚在船邊出沒，白色的水鳥也飛來打招呼。",
 "最後一站是文昌街。大家各自挑著喜歡的紀念品，有人買了金魚造型香包，有人買了捏麵人。我決定只帶滿心的喜悅回家和爸媽分享。",
 "回程時，原本灰色的天空出現了一片雲彩，溫暖的顏色就像我內心的喜悅和滿足。這次的活動讓我看到許多傳統文化，值得一來再來！"];
each(document.querySelectorAll("[data-say]"),function(b){b.addEventListener("click",function(){say(SAY[+b.getAttribute("data-say")]);});});

/* 參觀順序 */
function startStep(){
  var done=0,errs=0,box=$("stepBox"),items=C.shuffle(C.STEPS);
  function draw(){
    var h='<div class="steps">';
    items.forEach(function(st,i){h+='<button class="btn white'+(i<done?" ok":"")+'" data-n="'+st.k+'">'+st.n+'<br><span style="font-size:14px">'+st.d+'</span></button>';});
    h+='</div>';
    if(done>=items.length){var st=errs===0?4:errs<=2?2:1;addStars(st,box);if(errs===0){store.stepPerfect=(store.stepPerfect||0)+1;save();}
      h+='<div class="done">🎉 排好了！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"全對，你是遊記小達人！":"")+'</div><div class="btns cen"><button class="btn pink" id="stepAgain">🔄 再玩一次</button></div>';}
    h+='<div class="fb" id="stepFb"></div>';
    box.innerHTML=h;
    if(done>=items.length){$("stepAgain").addEventListener("click",startStep);return;}
    each(box.querySelectorAll(".steps .btn:not(.ok)"),function(b){b.addEventListener("click",function(){
      var k=b.getAttribute("data-n"),f=$("stepFb");
      if(items[done].k===k){beep(true);done++;draw();if(done>=items.length){store.stepDone=(store.stepDone||0)+1;save();}}
      else{beep(false);errs++;miss("step");f.className="fb show bad";f.textContent="順序不太對，再看看課文！";}});});
  }
  draw();
}
startStep();
runQuiz("partQ",function(){return C.shuffle(C.PARTS).map(function(p){return {q:"「"+p.d+"」",a:p.n,o:["開頭","中間","結尾"]};});},{type:"part"});
runQuiz("readQ",function(){return C.READ.map(function(r){return {q:r.q,a:r.a,o:C.shuffle(r.o)};});},{type:"read",best:"read",onDone:function(r){store.readBest=Math.max(store.readBest||0,r);save();}});

/* ---------- 生字 ---------- */
var cur=C.CHARS[0];
function moeLink(c){return "https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?WORD="+encodeURIComponent(c);}
function renderGrid(){var h="";C.CHARS.forEach(function(ch){h+='<button data-c="'+ch.c+'" class="'+(store.seen[ch.c]?"seen ":"")+(ch.c===cur.c?"on":"")+'" aria-label="'+ch.c+'">'+ch.c+'</button>';});$("charGrid").innerHTML=h;
  each($("charGrid").querySelectorAll("button"),function(b){b.addEventListener("click",function(){showChar(C.charBy(b.getAttribute("data-c")),true);});});}
function showChar(ch,tap){cur=ch;
  if(tap&&!store.seen[ch.c]){store.seen[ch.c]=1;save();if(Object.keys(store.seen).length===C.CHARS.length)addStars(3,$("charGrid"));}
  var bsf=C.BSFORM[ch.bs]&&C.BSFORM[ch.bs]!==ch.bs?"（寫成「"+C.BSFORM[ch.bs]+"」）":"";
  var h='<div class="bigc">'+ch.c+'</div><div class="zy">'+ch.zy+'</div><div class="cinfo">'+
   '<div>🧩 部首：<b>'+ch.bs+'</b>'+bsf+'</div><div>✏️ 筆畫：部首外 <b>'+ch.ex+'</b> 畫／總共 <b>'+ch.tot+'</b> 畫</div>'+
   '<div>📝 造詞：'+ch.words.map(function(w){return '<span class="chip">'+w+'</span>';}).join("")+'</div>'+
   '<div>📖 課文裡：<span class="quote">'+ch.tx+'</span></div>'+
   (ch.idiom?'<div>💡 成語：<span class="chip id">'+ch.idiom+'</span><span class="small">'+C.IDIOMS[ch.idiom]+'</span></div>':"")+
   (ch.look?'<div>👀 小心：「'+ch.c+'」和「'+ch.look+'」'+(ch.look===ch.c?"有兩個讀音":"長得很像")+'</div>':"")+
   '<div class="btns"><button class="btn white small" id="sayC">🔊 念一念</button><a class="btn teal small ext" style="color:#fff;text-decoration:none;display:inline-flex;align-items:center" href="'+moeLink(ch.c)+'" target="_blank" rel="noopener">🎬 看筆順動畫</a></div></div>';
  $("charDet").innerHTML=h;$("sayC").addEventListener("click",function(){say(ch.c+"，"+ch.words.join("，"));});
  $("ghost").textContent=ch.c;clearPad();renderGrid();}
var pad=$("pad"),ctx=pad.getContext("2d"),drawing=false,ink=0,last=null;
function clearPad(){ctx.clearRect(0,0,pad.width,pad.height);ink=0;$("padFb").className="fb";}
function pos(e){var r=pad.getBoundingClientRect();return {x:(e.clientX-r.left)*pad.width/r.width,y:(e.clientY-r.top)*pad.height/r.height};}
pad.addEventListener("pointerdown",function(e){drawing=true;last=pos(e);try{pad.setPointerCapture(e.pointerId);}catch(x){}e.preventDefault();});
pad.addEventListener("pointermove",function(e){if(!drawing)return;var p=pos(e);ctx.strokeStyle="#2b2d42";ctx.lineWidth=16;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();ink+=Math.abs(p.x-last.x)+Math.abs(p.y-last.y);last=p;e.preventDefault();});
function up(){drawing=false;}pad.addEventListener("pointerup",up);pad.addEventListener("pointercancel",up);pad.addEventListener("pointerleave",up);
$("padClear").addEventListener("click",clearPad);
$("padDone").addEventListener("click",function(){var f=$("padFb");
  if(ink<120){f.className="fb show bad";f.innerHTML="先用手指照著淡淡的「"+cur.c+"」描一描喔！";return;}
  var first=!store.wrote[cur.c];store.wrote[cur.c]=1;save();if(first)addStars(1,$("padDone"));beep(true);
  f.className="fb show good";f.innerHTML="👍 寫好了「"+cur.c+"」！"+(first?"得到 1 顆星。":"")+" 已練習 "+Object.keys(store.wrote).length+" / 15 個字。";});
showChar(cur,false);
var cqType="bs",cq;
function makeCQ(){return C.pick(C.CHARS,8).map(function(ch){return C.charQ(cqType,ch);});}
cq=runQuiz("charQ",makeCQ,{type:"bs"});
each(document.querySelectorAll("#cqSeg button"),function(b){b.addEventListener("click",function(){cqType=b.getAttribute("data-t");each(document.querySelectorAll("#cqSeg button"),function(x){x.classList.toggle("on",x===b);});cq.restart();});});
runQuiz("lookQ",function(){return C.shuffle(C.LOOK).slice(0,6).map(function(l){return {q:l.s.replace("＿",'<span class="blank">（　）</span>'),a:l.a,o:C.shuffle([l.a,l.b]),tip:l.tip};});},{type:"look"});

/* ---------- 語詞 ---------- */
var wh="";C.WORDS.forEach(function(w){wh+='<div class="wcard"><b>'+w.w+'</b>'+w.m+'</div>';});$("wordList").innerHTML=wh;
var ih="";for(var idm in C.IDIOMS)ih+='<div class="wcard"><b>'+idm+'</b>'+C.IDIOMS[idm]+'</div>';$("idiomList").innerHTML=ih;
function startMatch(){
  var set=C.pick(C.WORDS,6),selW=null,left=0,errs=0,box=$("matchBox");
  box.innerHTML='<div class="match"><div class="col" id="mW"></div><div class="col" id="mM"></div></div><div class="fb" id="mFb"></div>';
  C.shuffle(set).forEach(function(w){var b=document.createElement("button");b.className="btn";b.textContent=w.w;b.setAttribute("data-w",w.w);
    b.addEventListener("click",function(){if(b.classList.contains("ok"))return;each(box.querySelectorAll("#mW .btn"),function(x){x.classList.remove("sel");});b.classList.add("sel");selW=w.w;say(w.w);});$("mW").appendChild(b);});
  C.shuffle(set).forEach(function(w){var b=document.createElement("button");b.className="btn";b.textContent=w.m;
    b.addEventListener("click",function(){if(b.classList.contains("ok"))return;var f=$("mFb");
      if(!selW){f.className="fb show info";f.textContent="先點左邊的語詞喔！";return;}
      if(C.matchCheck(selW,w.m)){beep(true);b.classList.add("ok");var wb=box.querySelector('#mW [data-w="'+selW+'"]');wb.classList.remove("sel");wb.classList.add("ok");b.disabled=true;wb.disabled=true;
        f.className="fb show good";f.innerHTML="✅ 「"+selW+"」："+w.m;selW=null;left++;
        if(left===set.length){store.matchDone=(store.matchDone||0)+1;var st=Math.max(1,3-errs);addStars(st,box);
          box.insertAdjacentHTML("beforeend",'<div class="done">🎉 全部配對完成！錯 '+errs+' 次，得到 '+st+' 顆星。</div><div class="btns cen"><button class="btn pink" id="mAgain">🔄 換一組</button></div>');$("mAgain").addEventListener("click",startMatch);}}
      else{beep(false);errs++;miss("word");b.classList.remove("no");void b.offsetWidth;b.classList.add("no");f.className="fb show bad";f.textContent="不太對，再想想「"+selW+"」是什麼意思。";}});
    $("mM").appendChild(b);});
}
startMatch();
runQuiz("fillQ",function(){return C.shuffle(C.FILL).map(function(f){return {q:f.s.replace("＿＿",'<span class="blank">（　　）</span>'),a:f.a,o:C.shuffle(f.opts)};});},{type:"fill"});

/* ---------- 句型 ---------- */
var INTRO={
 sense:'<h3>🪄 看到的＋感受</h3><p class="lead">遊記不要寫成流水帳！每一站寫「看到什麼」和「心裡怎麼了」，就生動了。<br>例如：琉璃閃著七彩光芒（看到的），讓我流連忘返（感受）。</p>',
 simile:'<h3>🔁 首尾呼應</h3><p class="lead">開頭和結尾寫同一樣東西（天空），但有一點變化，心情的轉折就寫出來了。<br>開頭：天空有點灰，心情卻晴朗　→　結尾：天空出現溫暖的雲彩，像內心的喜悅</p>',
 rhet:'<h3>🎭 修辭判斷</h3><p class="lead"><b>譬喻</b>：用「像、有如、彷彿、是」把 A 比作 B。<br><b>擬人</b>：把東西當成人來寫。<br><b>摹寫</b>：把看到、聽到、聞到、摸到的感覺寫出來。</p>'};
var patK="sense",pq;
function makePat(){
  if(patK==="sense")return C.shuffle(C.SENSE).map(function(s){return {q:"看到「"+s.see+"」，心裡怎麼了？",a:s.feel,o:C.shuffle(s.o),type:"sense"};});
  if(patK==="simile")return C.shuffle(C.ECHO).map(function(e){return {q:e.q,a:e.a,o:C.shuffle(e.o),type:"simile"};});
  return C.shuffle(C.RHET).map(function(r){return {q:"「"+r.s+"」<br>這是什麼修辭？",a:r.a,o:["譬喻","擬人","摹寫"],tip:r.why,type:"rhet"};});
}
function patIntro(){$("patIntro").innerHTML=INTRO[patK]+(store.pat[patK]?'<p class="small">✅ 這個練習已完成過</p>':"");}
pq=runQuiz("patQ",makePat,{type:"sense",onDone:function(){store.pat[patK]=1;save();patIntro();}});
patIntro();
each(document.querySelectorAll("#patSeg button"),function(b){b.addEventListener("click",function(){patK=b.getAttribute("data-k");each(document.querySelectorAll("#patSeg button"),function(x){x.classList.toggle("on",x===b);});patIntro();pq.restart();});});

/* ---------- 挑戰：地點分類 ---------- */
function startSort(){
  var items=C.shuffle(C.SORT),i=0,errs=0,box=$("sortBox"),placed={};
  C.LOCS.forEach(function(loc){placed[loc.k]=[];});
  function draw(){
    var h='<div class="prog">';for(var k=0;k<items.length;k++)h+='<i class="'+(k<i?(items[k].ok?"ok":"no"):k===i?"cur":"")+'"></i>';
    h+='</div>';
    if(i<items.length){h+='<div class="q">「'+items[i].t+'」</div><div class="btns cen">';C.LOCS.forEach(function(loc){h+='<button class="btn white" data-loc="'+loc.k+'">'+loc.n+'</button>';});h+='</div><div class="fb" id="locFb"></div>';}
    h+='<div class="bins">';C.LOCS.forEach(function(loc){h+='<div class="bin"><b>'+loc.n+'</b>'+placed[loc.k].join("<br>")+'</div>';});h+='</div>';
    if(i>=items.length){var st=errs===0?4:errs<=2?2:1;addStars(st,box);if(errs===0){store.locPerfect=(store.locPerfect||0)+1;save();}
      h+='<div class="done">🎉 分類完成！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"全對，你是遊記小達人！":"")+'</div><div class="btns cen"><button class="btn pink" id="locAgain">🔄 再玩一次</button></div>';}
    box.innerHTML=h;
    if(i>=items.length){$("locAgain").addEventListener("click",startSort);return;}
    each(box.querySelectorAll(".btns .btn"),function(b){b.addEventListener("click",function(){var lk=b.getAttribute("data-loc"),it=items[i];
      if(C.sortCheck(it.t,lk)){beep(true);if(it.ok!==false)it.ok=true;placed[lk].push(it.t);i++;draw();}
      else{beep(false);errs++;it.ok=false;miss("location");var f=$("locFb");f.className="fb show bad";f.textContent="不是這個地點喔！回去看看課文在哪裡寫到的。";}});});
  }
  draw();
}
startSort();
runQuiz("chBox",function(){return C.challenges();},{type:"read",onDone:function(r){store.chBest=Math.max(store.chBest||0,r);save();}});

/* ---------- 紀錄 ---------- */
function renderRec(){
  var s=store,g=C.badges(s);
  $("stats").innerHTML='<div class="stat"><b>'+s.stars+'</b>⭐ 星星</div><div class="stat"><b>'+(s.readBest||0)+'/'+C.READ.length+'</b>閱讀理解最佳</div><div class="stat"><b>'+Object.keys(s.seen).length+'/15</b>看過的生字</div><div class="stat"><b>'+Object.keys(s.wrote).length+'/15</b>描寫過的字</div><div class="stat"><b>'+(s.chBest||0)+'/10</b>挑戰最佳</div><div class="stat"><b>'+Object.keys(s.pat).length+'/3</b>句型完成</div>';
  $("badges").innerHTML=C.BADGES.map(function(b){return '<div class="bdg'+(g[b.id]?" got":"")+'">'+b.n+'<small>'+b.d+'</small></div>';}).join("");
  var ks=Object.keys(s.bad).sort(function(a,b){return s.bad[b]-s.bad[a];});
  $("mist").innerHTML=ks.length?'<table class="rec">'+ks.map(function(k){return "<tr><td>"+(TN[k]||k)+"</td><td>錯 "+s.bad[k]+" 次</td></tr>";}).join("")+"</table>":'<p class="small">還沒有錯題，繼續加油！</p>';
}
$("resetBtn").addEventListener("click",function(){if(!confirm("確定要清除這一課的所有紀錄嗎？"))return;store=fresh();save();renderScore();renderGrid();renderRec();});
renderScore();
})();
