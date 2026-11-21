/* 國語第十二課 戴斗笠的地藏：互動程式
   題目資料在 index.html 的 Core（依南一版課本第 94、114～125、131 頁整理）。 */
(function(){
"use strict";
if(typeof document==="undefined")return;
var $=function(id){return document.getElementById(id);};
var C=Core,KEY="zhJizoHatsV1";
function each(list,fn){Array.prototype.forEach.call(list,fn);}
function fresh(){return {stars:0,readBest:0,seen:{},wrote:{},matchDone:0,pat:{},stepDone:0,stepPerfect:0,whoPerfect:0,sortPerfect:0,chBest:0,bad:{},best:{}};}
var store=fresh();
/* 鍵名和舊版一樣，星星、看過和寫過的字都會留著。舊版的閱讀理解只有 2 題，題目換過了，所以最佳成績重新算。 */
try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);if(o&&typeof o==="object"){for(var k in o)store[k]=o[k];if(!o.v){store.readBest=0;store.best={};}}}}catch(e){}
store.v=2;
if(typeof store.stars!=="number"||!isFinite(store.stars)||store.stars<0)store.stars=0;
["seen","wrote","pat","bad","best"].forEach(function(f){if(!store[f]||typeof store[f]!=="object")store[f]={};});
/* 只留這一課的 15 個字 */
["seen","wrote"].forEach(function(f){for(var c in store[f])if(!C.charBy(c))delete store[f][c];});
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
var TN={read:"🔍 閱讀理解",bs:"🧩 部首",tot:"✏️ 筆畫",zy:"🔤 注音",look:"👀 形近字",word:"📚 語詞意思",fill:"📝 選詞填空",conn:"🪄 不但沒有……反而……",turn:"🔀 故事大轉彎",tell:"💬 說故事的方法",who:"🙋 這是誰",sort:"🗂️ 故事五步分類",step:"🧩 故事五步的順序",pattern:"🪄 句型（舊版的題目）"};
function miss(t){store.bad[t]=(store.bad[t]||0)+1;save();}
function renderScore(){$("score").textContent="⭐ "+store.stars;}
function addStars(n,el){if(n<=0)return;store.stars+=n;save();renderScore();var sc=$("score");sc.classList.remove("pop");void sc.offsetWidth;sc.classList.add("pop");
  if(el&&el.getBoundingClientRect){var r=el.getBoundingClientRect();for(var i=0;i<6;i++){var s=document.createElement("div");s.className="burst";s.textContent=["⭐","✨","🌟"][i%3];
    s.style.left=Math.min(window.innerWidth-40,Math.max(4,r.left+r.width/2))+"px";s.style.top=(r.top+20)+"px";s.style.setProperty("--dx",(Math.random()*120-60)+"px");s.style.setProperty("--dy",(-60-Math.random()*120)+"px");
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
    if(answered)return;answered=true;var it=items[i],ok=C.check(it,op),f=box.querySelector(".fb");it.ok=ok;
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
/* 念的是自己寫的導讀，不是課文原文 */
var SAY=["背景，第一段。很久以前，日本的深山裡住著一對老夫妻。他們的日子很貧苦。平常除了種田，還做斗笠，拿到山下賣。",
 "起因，第二段和第三段。新年的前一天，老婆婆說，她很想吃年糕。可是家裡沒有錢。老爺爺想，要先把斗笠賣掉，才買得起年糕。他背著斗笠出門了。外面下著大雪，到處白茫茫的。",
 "經過，第四段和第五段。老爺爺打算先去山下的村子試試看。走到半路，路邊有六座大大小小的地藏菩薩石像。他向地藏祈求好運，再繼續往前走。到了村子，他一路叫賣，說斗笠便宜又耐用，卻沒有人來問。年糕店飄來香味，他想起老婆婆的心願，想拿斗笠換年糕，也沒有換成。他只好失望的離開。到了傍晚，一頂斗笠也沒賣掉。",
 "轉折，第六段和第七段。回家的路上，一團雪掉了下來。老爺爺這才發現，六座地藏的頭上都是雪。他怕祂們凍壞，就把斗笠一頂一頂戴到地藏頭上。斗笠少了一頂，他把自己的頭巾解下來，包在小地藏的頭上。回家以後，老婆婆沒有怪他，還覺得他做了好事。",
 "結果，第八段和第九段。除夕夜裡，奇怪的歌聲把老夫妻吵醒了。他們隱約聽到有人說，託老爺爺的福，頭頂暖了，全身也暖了，門外的東西請笑納。老爺爺打開門，看到門外放了好多東西，有白米、青菜、魚，還有老婆婆最想吃的年糕。遠遠的，有幾個身影漸漸走遠了，看起來很像戴著斗笠的地藏。"];
each(document.querySelectorAll("[data-say]"),function(b){b.addEventListener("click",function(){say(SAY[+b.getAttribute("data-say")]);});});

/* 故事五步排一排：照故事發生的順序點 */
function startSteps(){
  var box=$("stepBox"),done=0,errs=0,items=C.shuffle(C.STEPS),N=C.STEPS.length;
  function draw(){
    var h='<ol class="stepdone">';for(var k=0;k<done;k++)h+='<li><b>'+C.STEPS[k].w+'</b>'+C.STEPS[k].e+' '+C.STEPS[k].t+'</li>';h+='</ol>';
    if(done<N){h+='<div class="q">'+(done===0?"故事一開始，先說了什麼？":"接下來發生什麼事？（第 "+(done+1)+" 步）")+'</div><div class="steps">';
      items.forEach(function(s){if(s.n>done)h+='<button class="btn white" data-n="'+s.n+'">'+s.e+' '+s.t+'</button>';});h+='</div><div class="fb" id="stFb"></div>';}
    else{var st=errs===0?3:errs<=2?2:1;addStars(st,box);store.stepDone=(store.stepDone||0)+1;if(errs===0)store.stepPerfect=(store.stepPerfect||0)+1;save();
      h+='<div class="done">🔀 順序排好了！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"一次就排對，太厲害了！":"")+'</div>'+
       '<div class="route"><span>背景</span>➜<span>起因</span>➜<span>經過</span>➜<span>轉折</span>➜<span>結果</span></div>'+
       '<p class="small">因為有「轉折」，老婆婆才從吃不到年糕，變成收到禮物和年糕。</p>'+
       '<div class="btns cen"><button class="btn pink" id="stAgain">🔄 再排一次</button></div>';}
    box.innerHTML=h;
    if(done>=N){$("stAgain").addEventListener("click",startSteps);return;}
    each(box.querySelectorAll(".steps .btn"),function(b){b.addEventListener("click",function(){var n=+b.getAttribute("data-n");if(n<=done)return;
      if(C.stepCheck(done,n)){beep(true);done++;say(C.STEPS[n-1].w+"，"+C.STEPS[n-1].t);draw();}
      else{beep(false);errs++;miss("step");var f=$("stFb");f.className="fb show bad";f.textContent="還不是這一件喔！想一想：哪一件事要先發生，後面的事才會發生？";}});});
  }
  draw();
}
startSteps();
runQuiz("readQ",function(){return C.READ.map(function(r){return C.readQ(r);});},{type:"read",best:"read",onDone:function(r){store.readBest=Math.max(store.readBest||0,r);save();}});

/* ---------- 生字 ---------- */
var cur=C.CHARS[0];
function moeLink(c){return "https://stroke-order.learningweb.moe.edu.tw/searchW.jsp?WORD="+encodeURIComponent(c);}
function renderGrid(){var h="";C.CHARS.forEach(function(ch){h+='<button data-c="'+ch.c+'" class="'+(store.seen[ch.c]?"seen ":"")+(ch.c===cur.c?"on":"")+'" aria-label="'+ch.c+'">'+ch.c+'</button>';});$("charGrid").innerHTML=h;
  each($("charGrid").querySelectorAll("button"),function(b){b.addEventListener("click",function(){showChar(C.charBy(b.getAttribute("data-c")),true);});});}
/* 直式注音：一個符號排一行，聲調放在最後一個符號的右上角（不靠字型的直排功能，各種平板都排得整齊） */
function zyHTML(zy){var m=zy.match(/[ˊˇˋ]$/),tone=m?m[0]:"",body=m?zy.slice(0,-1):zy,syms=body.split("");
  return syms.map(function(x,i){return '<span class="zs">'+x+(i===syms.length-1&&tone?"<i>"+tone+"</i>":"")+"</span>";}).join("");}
function showChar(ch,tap){cur=ch;
  if(tap&&!store.seen[ch.c]){store.seen[ch.c]=1;save();if(Object.keys(store.seen).length===C.CHARS.length)addStars(3,$("charGrid"));}
  var bsf=ch.bf&&ch.bf!==ch.bs?"（在這個字裡寫成「"+ch.bf+"」）":(ch.bnote||"");
  var h='<div class="bigc">'+ch.c+'</div><div class="zy'+(ch.poly?" red":"")+'" aria-label="注音 '+ch.zy+'">'+zyHTML(ch.zy)+'</div><div class="cinfo">'+
   '<div>🧩 部首：<b>'+ch.bs+'</b>'+bsf+'</div><div>✏️ 筆畫：部首外 <b>'+ch.ex+'</b> 畫／總共 <b>'+ch.tot+'</b> 畫</div>'+
   '<div>📝 造詞：'+ch.words.map(function(w){return '<span class="chip">'+w+'</span>';}).join("")+'</div>'+
   '<div>📖 課文裡：<span class="quote">'+ch.tx+'</span></div>'+
   (ch.poly?'<div>🔤 多音字：'+ch.poly.src+'這一課念 <b>'+ch.poly.now+'</b>，例如「'+ch.poly.eg+'」。'+(ch.poly.more?'<br><span class="small">🔎 延伸：'+ch.poly.more+'。</span>':"")+'</div>':"")+
   (ch.look?'<div>👀 小心形近字：「'+ch.c+'」和「'+ch.look+'」長得很像</div>':"")+
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
runQuiz("lookQ",function(){return C.pick(C.LOOK,8).map(function(l){return C.lookQ(l);});},{type:"look"});

/* ---------- 語詞 ---------- */
function cards(list,fn){return list.map(function(w){return '<div class="wcard"><b>'+w.w+'</b>'+w.m+(fn?fn(w):"")+'</div>';}).join("");}
$("wordList").innerHTML=cards(C.WORDS,function(w){return (w.k==="b"?' <small>（藍色語詞）</small>':w.k==="g"?' <small>（綠色語詞）</small>':"")+(w.note?'<br><small>'+w.note+'</small>':"");});
$("moreList").innerHTML=cards(C.MORE);
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

/* ---------- 句型和故事 ---------- */
var INTRO={
 conn:'<h3>🪄 不但沒有……反而……</h3><div class="formula"><span class="f1">不但沒有</span><span class="f2">大家以為會做的事</span><span class="f1">反而</span><span class="f3">相反的事</span></div><p class="lead">課本第 121 頁「句子練習」：在句子中，使用不同的<b>連接詞</b>，傳達的意思就會不一樣。<br>課本拿兩個句子來比：<br>① 老婆婆聽了這件事，<b>就</b>怪罪老爺爺。<br>② 老婆婆聽了這件事，<b>不但</b>沒有怪老爺爺，<b>反而</b>認為他做了好事。<br>課文寫的是第 ② 種。</p><p class="small">兩個句子出自課本第 121 頁。上面色塊裡的解說和第五題以後的句子是自編的。</p>',
 turn:'<h3>🔀 故事大轉彎</h3><div class="formula"><span class="f2">事件</span><span class="f1">轉折</span><span class="f3">結果</span></div><p class="lead">課本第 121 頁「找一找：故事大轉彎」：找一找，發生了什麼事，讓故事有這樣的結果。<br>課本第 123 頁說：故事有時會安排令人意外的<b>轉折</b>，把讀者帶到意料之外的結果。它把這個故事分成<b>背景、起因、經過、轉折、結果</b>。</p><p class="small">題目是自編的，答案依課本第 119、121、123 頁。後五題的句子是用自己的話寫的。</p>',
 tell:'<h3>💬 說故事的方法</h3><div class="formula"><span class="f2">敘述方式：簡潔的說明事件</span><span class="f3">對話方式：彷彿身在現場</span></div><p class="lead">課本第 124～125 頁（語文天地四）比了兩種說故事的方法。<br><b>敘述方式</b>：能夠簡潔的說明事件，讓讀者用旁觀者的角度看故事。<br><b>對話方式</b>：寫出角色說的話，讓人彷彿身在現場。</p><p class="small">課本的例子是第十一課〈豆粥婆婆〉。第三題以後，是拿第十二課課文裡的短句來練習（自編）。</p>'};
var patK="conn",pq;
function makePat(){
  if(patK==="conn")return C.CONN.slice(0,4).concat(C.shuffle(C.CONN.slice(4))).map(function(x){return C.connQ(x);});
  if(patK==="turn")return C.TURN.map(function(x){return C.turnQ(x);}).concat(C.shuffle(C.STEPS).map(function(s){return C.partQ(s);}));
  return C.TELL.slice(0,2).concat(C.shuffle(C.TELL.slice(2))).map(function(x){return C.tellQ(x);});
}
function patIntro(){$("patIntro").innerHTML=INTRO[patK]+(store.pat[patK]?'<p class="small">✅ 這個練習已完成過</p>':"");}
pq=runQuiz("patQ",makePat,{type:"conn",onDone:function(){store.pat[patK]=1;save();patIntro();}});
patIntro();
each(document.querySelectorAll("#patSeg button"),function(b){b.addEventListener("click",function(){patK=b.getAttribute("data-k");each(document.querySelectorAll("#patSeg button"),function(x){x.classList.toggle("on",x===b);});patIntro();pq.restart();});});

/* ---------- 挑戰：這是誰 ---------- */
runQuiz("whoBox",function(){return C.pick(C.WHO,8).map(function(x){return C.whoQ(x);});},{type:"who",onDone:function(r,n){if(r===n){store.whoPerfect=(store.whoPerfect||0)+1;save();}}});

/* ---------- 挑戰：故事五步分一分 ---------- */
function startSort(){
  /* 每個部分各抽 2 句，共 10 題，五個部分都會出現 */
  var items=[],i=0,errs=0,box=$("sortBox"),placed={};
  C.STEPS.forEach(function(l){placed[l.k]=[];C.pick(C.SORT.filter(function(x){return x.s===l.k;}),2).forEach(function(x){items.push({t:x.t,s:x.s});});});
  items=C.shuffle(items);
  function draw(){
    var h='<div class="prog">';for(var k=0;k<items.length;k++)h+='<i class="'+(k<i?(items[k].ok?"ok":"no"):k===i?"cur":"")+'"></i>';
    h+='</div>';
    if(i<items.length){h+='<div class="q">「'+items[i].t+'」</div><div class="locbtns">';C.STEPS.forEach(function(l){h+='<button class="btn white" data-s="'+l.k+'">'+l.e+'<br>'+l.w+'</button>';});h+='</div><div class="fb" id="sFb"></div>';}
    h+='<div class="bins">';C.STEPS.forEach(function(l){h+='<div class="bin"><b>'+l.e+" "+l.w+'</b>'+placed[l.k].join("<br>")+'</div>';});h+='</div>';
    if(i>=items.length){var st=errs===0?4:errs<=2?2:1;addStars(st,box);if(errs===0){store.sortPerfect=(store.sortPerfect||0)+1;save();}
      h+='<div class="done">🎉 分類完成！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"全對，你是轉折小偵探！":"")+'</div><div class="btns cen"><button class="btn pink" id="sAgain">🔄 再玩一次</button></div>';}
    box.innerHTML=h;
    if(i>=items.length){$("sAgain").addEventListener("click",startSort);return;}
    each(box.querySelectorAll(".locbtns .btn"),function(b){b.addEventListener("click",function(){var sk=b.getAttribute("data-s"),it=items[i];
      if(C.sortCheck(it.t,sk)){beep(true);if(it.ok!==false)it.ok=true;placed[sk].push(it.t);i++;draw();}
      else{beep(false);errs++;it.ok=false;miss("sort");var f=$("sFb");f.className="fb show bad";f.textContent="再想想！背景是人物和地方，起因是事情怎麼開始，經過是老爺爺賣斗笠，轉折是幫地藏戴斗笠，結果是最後收到什麼。";}});});
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
  $("stats").innerHTML='<div class="stat"><b>'+s.stars+'</b>⭐ 星星</div><div class="stat"><b>'+(s.readBest||0)+'/'+C.READ.length+'</b>閱讀理解最佳</div><div class="stat"><b>'+Object.keys(s.seen).length+'/'+n+'</b>看過的生字</div><div class="stat"><b>'+Object.keys(s.wrote).length+'/'+n+'</b>描寫過的字</div><div class="stat"><b>'+(s.chBest||0)+'/10</b>挑戰最佳</div><div class="stat"><b>'+pd+'/'+C.PATS.length+'</b>句型練習完成</div><div class="stat"><b>'+(s.stepDone||0)+'</b>排順序次數</div>';
  $("badges").innerHTML=C.BADGES.map(function(b){return '<div class="bdg'+(g[b.id]?" got":"")+'">'+b.n+'<small>'+b.d+'</small></div>';}).join("");
  var ks=Object.keys(s.bad).sort(function(a,b){return s.bad[b]-s.bad[a];});
  $("mist").innerHTML=ks.length?'<table class="rec">'+ks.map(function(k){return "<tr><td>"+(TN[k]||k)+"</td><td>錯 "+s.bad[k]+" 次</td></tr>";}).join("")+"</table>":'<p class="small">還沒有錯題，繼續加油！</p>';
}
$("resetBtn").addEventListener("click",function(){if(!confirm("確定要清除這一課的所有紀錄嗎？"))return;store=fresh();store.v=2;save();renderScore();renderGrid();patIntro();renderRec();});
renderScore();
})();
