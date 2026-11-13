/* 國語第七課 到此「藝」遊：互動程式
   題目資料在 index.html 的 Core（依南一版課本第 62～71、88～91 頁整理）。 */
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
var TN={read:"🔍 閱讀理解",part:"🧱 遊記的三個部分",bs:"🧩 部首",tot:"✏️ 筆畫",zy:"🔤 注音",look:"👀 形近字",poly:"🔤 多音字「禁」",word:"📚 語詞意思",fill:"📝 選詞填空",sense:"👀 用感官寫",feel:"💗 加上感受",color:"🎨 用顏色寫",mood:"😊 感受的語詞",loc:"🏛️ 地點分類",step:"🚶 參觀順序"};
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

/* ---------- 通用測驗：每一題是 {q, a, o:[選項], tip, type} ---------- */
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
var SAY=["第一段，旅遊背景。戶外教育日終於到了！天空有點灰，作者的心情卻很晴朗，因為老師要帶大家去宜蘭傳藝園區。",
 "第二段，園區。一進園區，作者的眼睛為之一亮。街道旁有古色古香的磚紅色建築，還有一個個紅燈籠，看起來喜氣洋洋。",
 "第三段，魯班街。傳習所介紹陶器、玉石、藍染這些藝術品，讓人目不轉睛。燈光下，琉璃亮出七彩光芒，作者看得流連忘返。",
 "第四段，劇場。大家看噶瑪蘭公主。演員又唱又跳，還翻跟斗、走鋼索。作者最難忘的，是那面赤紅色的大旗，揮起來像熊熊烈火，全場都尖叫。",
 "第五段，月河。大家到渡船頭坐木船，穿過爬滿綠色植物的石拱橋。岸邊有金黃的落羽松，頑皮的魚在船邊出沒，白色的水鳥也飛來打招呼。",
 "第六段，文昌街。這是最後一站。同學各自挑紀念品，有人買金魚造型的香包，有人買捏麵人。作者決定只帶滿心喜悅回家。",
 "第七段，旅遊感想。回程時，灰色的天空出現一片雲彩，就像作者心裡的喜悅和滿足。作者看到許多傳統文化，覺得這裡值得一來再來。"];
each(document.querySelectorAll("[data-say]"),function(b){b.addEventListener("click",function(){say(SAY[+b.getAttribute("data-say")]);});});

/* 參觀順序：依序點 */
function startSteps(){
  var box=$("stepBox"),done=0,errs=0,items=C.shuffle(C.STEPS),N=C.STEPS.length;
  function draw(){
    var h='<ol class="stepdone">';for(var k=0;k<done;k++)h+='<li><b>'+C.STEPS[k].w+'</b>'+C.STEPS[k].t+'</li>';h+='</ol>';
    if(done<N){h+='<div class="q">第 '+(done+1)+' 個寫的是什麼？</div><div class="steps">';
      items.forEach(function(s){h+='<button class="btn white'+(s.n<=done?" ok":"")+'" data-n="'+s.n+'"'+(s.n<=done?" disabled":"")+'>'+s.w+'<small>'+s.t+'</small></button>';});h+='</div><div class="fb" id="stFb"></div>';}
    else{var st=errs===0?3:errs<=2?2:1;addStars(st,box);store.stepDone=(store.stepDone||0)+1;if(errs===0)store.stepPerfect=(store.stepPerfect||0)+1;save();
      h+='<div class="done">🚶 順序排好了！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"一次就排對，你是傳藝小導覽員！":"")+'</div>'+
       '<div class="route"><span>園區</span>➜<span>魯班街</span>➜<span>臨水劇場</span>➜<span>月河</span>➜<span>文昌街</span></div>'+
       '<p class="small">作者用「進入園區」「走進魯班街」「接著」「看完表演」「最後一站」「回程時」帶我們換地方。</p>'+
       '<div class="btns cen"><button class="btn pink" id="stAgain">🔄 再排一次</button></div>';}
    box.innerHTML=h;
    if(done>=N){$("stAgain").addEventListener("click",startSteps);return;}
    each(box.querySelectorAll(".steps .btn"),function(b){b.addEventListener("click",function(){var n=+b.getAttribute("data-n");if(n<=done)return;
      if(C.stepCheck(done,n)){beep(true);done++;say(C.STEPS[n-1].w+"，"+C.STEPS[n-1].t);draw();}
      else{beep(false);errs++;miss("step");var f=$("stFb");f.className="fb show bad";f.textContent="還不是這一個喔！想想作者走的路線，下一個到哪裡？";}});});
  }
  draw();
}
startSteps();
runQuiz("partQ",function(){return C.shuffle(C.PARTS).map(function(p){return C.partQ(p);});},{type:"part"});
runQuiz("readQ",function(){return C.READ.map(function(r){return {q:r.q,a:r.a,o:C.shuffle(r.o),tip:r.tip};});},{type:"read",best:"read",onDone:function(r){store.readBest=Math.max(store.readBest||0,r);save();}});

/* ---------- 生字 ---------- */
var cur=C.CHARS[0];
function moeLink(c){return "https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?WORD="+encodeURIComponent(c);}
function renderGrid(){var h="";C.CHARS.forEach(function(ch){h+='<button data-c="'+ch.c+'" class="'+(store.seen[ch.c]?"seen ":"")+(ch.c===cur.c?"on":"")+'" aria-label="'+ch.c+'">'+ch.c+'</button>';});$("charGrid").innerHTML=h;
  each($("charGrid").querySelectorAll("button"),function(b){b.addEventListener("click",function(){showChar(C.charBy(b.getAttribute("data-c")),true);});});}
function showChar(ch,tap){cur=ch;
  if(tap&&!store.seen[ch.c]){store.seen[ch.c]=1;save();if(Object.keys(store.seen).length===C.CHARS.length)addStars(3,$("charGrid"));}
  var bsf=ch.bf&&ch.bf!==ch.bs?"（在這個字裡寫成「"+ch.bf+"」）":"";
  var h='<div class="bigc">'+ch.c+'</div><div class="zy">'+ch.zy+'</div><div class="cinfo">'+
   '<div>🧩 部首：<b>'+ch.bs+'</b>'+bsf+'</div><div>✏️ 筆畫：部首外 <b>'+ch.ex+'</b> 畫／總共 <b>'+ch.tot+'</b> 畫</div>'+
   '<div>📝 造詞：'+ch.words.map(function(w){return '<span class="chip">'+w+'</span>';}).join("")+'</div>'+
   '<div>📖 課文裡：<span class="quote">'+ch.tx+'</span></div>'+
   (ch.poly?'<div>🔤 多音字：「不禁、禁不住」念 ㄐㄧㄣ；「禁止、嚴禁」念 ㄐㄧㄣˋ（課本第 71 頁）</div>':"")+
   (ch.look?'<div>👀 小心形近字：「'+ch.c+'」和「'+ch.look+'」長得很像</div>':"")+
   (ch.idiom?'<div>💡 延伸成語：<span class="chip id">'+ch.idiom+'</span><span class="small">'+C.IDIOMS[ch.idiom]+'</span></div>':"")+
   '<div class="btns"><button class="btn white small" id="sayC">🔊 念一念</button><a class="btn teal small ext" style="color:#fff;text-decoration:none;display:inline-flex;align-items:center" href="'+moeLink(ch.c)+'" target="_blank" rel="noopener">🎬 看筆順動畫</a></div></div>';
  $("charDet").innerHTML=h;$("sayC").addEventListener("click",function(){say(ch.c+"，"+ch.words.join("，"));});
  $("ghost").textContent=ch.c;clearPad();renderGrid();}
/* 描寫板 */
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
  f.className="fb show good";f.innerHTML="👍 寫好了「"+cur.c+"」！"+(first?"得到 1 顆星。":"")+" 已練習 "+Object.keys(store.wrote).length+" / "+C.CHARS.length+" 個字。";});
showChar(cur,false);
var cqType="bs",cq;
function makeCQ(){return C.pick(C.CHARS,8).map(function(ch){return C.charQ(cqType,ch);});}
cq=runQuiz("charQ",makeCQ,{type:"bs"});
each(document.querySelectorAll("#cqSeg button"),function(b){b.addEventListener("click",function(){cqType=b.getAttribute("data-t");each(document.querySelectorAll("#cqSeg button"),function(x){x.classList.toggle("on",x===b);});cq.restart();});});
runQuiz("polyQ",function(){return C.shuffle(C.POLY).map(function(p){return C.polyQ(p);});},{type:"poly"});
runQuiz("lookQ",function(){return C.pick(C.LOOK,8).map(function(l){return C.lookQ(l);});},{type:"look"});

/* ---------- 語詞 ---------- */
var wh="";C.WORDS.forEach(function(w){wh+='<div class="wcard"><b>'+w.w+'</b>'+w.m+'</div>';});$("wordList").innerHTML=wh;
var nh="";C.NOTES.forEach(function(w){nh+='<div class="wcard"><b>'+w.w+'</b>'+w.m+' <small>（課本第 '+w.p+' 頁）</small></div>';});$("noteList").innerHTML=nh;
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
runQuiz("fillQ",function(){return C.pick(C.FILL,8).map(function(f){return C.fillQ(f);});},{type:"fill"});

/* ---------- 句型：遊記怎麼寫 ---------- */
var moodList=C.MOODS.map(function(m){return '<div class="wcard"><b>'+m.w+'</b>'+m.m+'</div>';}).join("");
var INTRO={
 sense:'<h3>👀 用感官收集材料</h3><div class="formula"><span class="f1">視覺：眼睛看</span><span class="f2">聽覺：耳朵聽</span><span class="f3">觸覺：皮膚感覺</span></div><p class="lead">課本第 89 頁：寫遊記時，先用<b>感官</b>收集材料。<br>課本的例子：<span class="quote">金黃的落羽松</span>是視覺，<span class="quote">清涼的風</span>是觸覺，<span class="quote">同學的驚呼聲</span>是聽覺。</p><p class="small">前四題是課本第 89 頁的例子，第五到七題從課文找的，最後一題自編。</p>',
 feel:'<h3>💗 加入想法或感受</h3><div class="formula"><span class="f1">看到的：琉璃閃著七彩光芒</span><span class="f3">感受：讓我流連忘返</span></div><p class="lead">課本第 89 頁：用感官收集材料以後，還要<b>加入想法或感受</b>。<br>先寫看到、聽到什麼，再寫心裡覺得怎麼樣。</p><p class="small">「看到的」和「感受」都出自課文，錯的選項是自編的。</p>',
 color:'<h3>🎨 用顏色描寫</h3><div class="formula"><span class="f3">深綠色的河水</span><span class="f1">金黃的落羽松</span><span class="f2">白色的水鳥</span></div><p class="lead">課本第 71 頁「跟著文字去旅行」：描寫事物外觀時，可以運用<b>顏色</b>，讓事物更鮮明。</p><p class="small">前四題是課本第 71 頁的例子，後四題從課文找的。</p>',
 mood:'<h3>😊 表達感受的語詞</h3><p class="lead">課本第 71 頁「認識表達感受的語詞」列了這七個。其中<b>眼睛為之一亮、流連忘返、滿心喜悅</b>在課文裡出現過。</p><div class="wlist">'+moodList+'</div><p class="small">語詞出自課本，意思和練習的句子是自編的。</p>'};
var patK="sense",pq;
function makePat(){
  if(patK==="sense")return C.shuffle(C.SENSES).map(function(s){return C.senseQ(s);});
  if(patK==="feel")return C.shuffle(C.FEEL).map(function(f){return C.feelQ(f);});
  if(patK==="color")return C.shuffle(C.COLOR).map(function(c){return C.colorQ(c);});
  return C.shuffle(C.MOOD).map(function(m){return C.moodQ(m);});
}
function patIntro(){$("patIntro").innerHTML=INTRO[patK]+(store.pat[patK]?'<p class="small">✅ 這個練習已完成過</p>':"");}
pq=runQuiz("patQ",makePat,{type:"sense",onDone:function(){store.pat[patK]=1;save();patIntro();}});
patIntro();
each(document.querySelectorAll("#patSeg button"),function(b){b.addEventListener("click",function(){patK=b.getAttribute("data-k");each(document.querySelectorAll("#patSeg button"),function(x){x.classList.toggle("on",x===b);});patIntro();pq.restart();});});

/* ---------- 挑戰：地點分類 ---------- */
function startSort(){
  /* 每一站各抽 2 句，共 10 題，五站都會出現 */
  var items=[],i=0,errs=0,box=$("sortBox"),placed={};
  C.LOCS.forEach(function(l){placed[l.k]=[];C.pick(C.SORT.filter(function(x){return x.s===l.k;}),2).forEach(function(x){items.push({t:x.t,s:x.s});});});
  items=C.shuffle(items);
  function draw(){
    var h='<div class="prog">';for(var k=0;k<items.length;k++)h+='<i class="'+(k<i?(items[k].ok?"ok":"no"):k===i?"cur":"")+'"></i>';
    h+='</div>';
    if(i<items.length){h+='<div class="q">「'+items[i].t+'」</div><div class="locbtns">';C.LOCS.forEach(function(l){h+='<button class="btn white" data-s="'+l.k+'">'+l.e+'<br>'+l.n+'</button>';});h+='</div><div class="fb" id="sFb"></div>';}
    h+='<div class="bins">';C.LOCS.forEach(function(l){h+='<div class="bin"><b>'+l.e+" "+l.n+'</b>'+placed[l.k].join("<br>")+'</div>';});h+='</div>';
    if(i>=items.length){var st=errs===0?4:errs<=2?2:1;addStars(st,box);if(errs===0){store.locPerfect=(store.locPerfect||0)+1;save();}
      h+='<div class="done">🎉 分類完成！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"全對，你是地點分類王！":"")+'</div><div class="btns cen"><button class="btn pink" id="sAgain">🔄 再玩一次</button></div>';}
    box.innerHTML=h;
    if(i>=items.length){$("sAgain").addEventListener("click",startSort);return;}
    each(box.querySelectorAll(".locbtns .btn"),function(b){b.addEventListener("click",function(){var sk=b.getAttribute("data-s"),it=items[i];
      if(C.sortCheck(it.t,sk)){beep(true);if(it.ok!==false)it.ok=true;placed[sk].push(it.t);i++;draw();}
      else{beep(false);errs++;it.ok=false;miss("loc");var f=$("sFb");f.className="fb show bad";f.textContent="不是這一站喔！想一想：作者是在哪裡看到的？";}});});
  }
  draw();
}
startSort();
/* ---------- 挑戰：綜合 ---------- */
runQuiz("chBox",function(){return C.makeChallenge();},{type:"read",onDone:function(r){store.chBest=Math.max(store.chBest||0,r);save();}});

/* ---------- 紀錄 ---------- */
function renderRec(){
  var s=store,g=C.badges(s),n=C.CHARS.length;
  var pd=C.PATS.filter(function(k){return s.pat&&s.pat[k];}).length;
  $("stats").innerHTML='<div class="stat"><b>'+s.stars+'</b>⭐ 星星</div><div class="stat"><b>'+(s.readBest||0)+'/'+C.READ.length+'</b>閱讀理解最佳</div><div class="stat"><b>'+Object.keys(s.seen).length+'/'+n+'</b>看過的生字</div><div class="stat"><b>'+Object.keys(s.wrote).length+'/'+n+'</b>描寫過的字</div><div class="stat"><b>'+(s.chBest||0)+'/10</b>挑戰最佳</div><div class="stat"><b>'+pd+'/'+C.PATS.length+'</b>寫作練習完成</div><div class="stat"><b>'+(s.stepDone||0)+'</b>排參觀順序次數</div>';
  $("badges").innerHTML=C.BADGES.map(function(b){return '<div class="bdg'+(g[b.id]?" got":"")+'">'+b.n+'<small>'+b.d+'</small></div>';}).join("");
  var ks=Object.keys(s.bad).sort(function(a,b){return s.bad[b]-s.bad[a];});
  $("mist").innerHTML=ks.length?'<table class="rec">'+ks.map(function(k){return "<tr><td>"+(TN[k]||k)+"</td><td>錯 "+s.bad[k]+" 次</td></tr>";}).join("")+"</table>":'<p class="small">還沒有錯題，繼續加油！</p>';
}
$("resetBtn").addEventListener("click",function(){if(!confirm("確定要清除這一課的所有紀錄嗎？"))return;store=fresh();save();renderScore();renderGrid();patIntro();renderRec();});
renderScore();
})();
