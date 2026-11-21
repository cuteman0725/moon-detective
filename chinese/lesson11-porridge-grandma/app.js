/* 國語第十一課 豆粥婆婆：互動程式
   題目資料在 index.html 的 Core（依南一版課本第 94、106～113、122、124～125、131 頁整理）。 */
(function(){
"use strict";
if(typeof document==="undefined")return;
var $=function(id){return document.getElementById(id);};
var C=Core,KEY="zhPorridgeV2",OLD_KEY="zhPorridgeV1";
function each(list,fn){Array.prototype.forEach.call(list,fn);}
function fresh(){return {stars:0,readBest:0,seen:{},wrote:{},matchDone:0,pat:{},stepDone:0,stepPerfect:0,whoPerfect:0,actPerfect:0,chBest:0,bad:{},best:{}};}
var store=fresh();
try{
  var raw=localStorage.getItem(KEY),o,k;
  if(raw){o=JSON.parse(raw);for(k in o)store[k]=o[k];}
  else{
    /* 舊版頁面的題目寫的是另一個故事，所以換一個新的鍵。
       第一次打開新版時，只把星星、看過和寫過的字、配對次數接過來；舊的測驗成績不接，舊的鍵不動。 */
    var old=JSON.parse(localStorage.getItem(OLD_KEY)||"null");
    if(old&&typeof old==="object"){
      if(old.stars>0)store.stars=Math.floor(old.stars);
      ["seen","wrote"].forEach(function(f){if(old[f]&&typeof old[f]==="object")for(var c in old[f])if(C.charBy(c))store[f][c]=1;});
      if(old.matchDone>0)store.matchDone=Math.floor(old.matchDone);
    }
  }
}catch(e){}
if(typeof store.stars!=="number"||!isFinite(store.stars)||store.stars<0)store.stars=0;
["seen","wrote","pat","bad","best"].forEach(function(f){if(!store[f]||typeof store[f]!=="object")store[f]={};});
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
var TN={read:"🔍 閱讀理解",bs:"🧩 部首",tot:"✏️ 筆畫",zy:"🔤 注音",look:"👀 形近字",word:"📚 語詞意思",fill:"📝 選詞填空",hukou:"📖 語詞辨別：虎口",seq:"🪄 先……接著……最後……",tone:"💬 對話的語氣",tell:"📚 說故事的方法",who:"🎭 這是誰",act:"🗂️ 三段分類",step:"🔗 趕老虎的順序"};
function miss(t){store.bad[t]=(store.bad[t]||0)+1;save();}
function renderScore(){$("score").textContent="⭐ "+store.stars;}
function addStars(n,el){if(n<=0)return;store.stars+=n;save();renderScore();var sc=$("score");sc.classList.remove("pop");void sc.offsetWidth;sc.classList.add("pop");
  if(el&&el.getBoundingClientRect){var r=el.getBoundingClientRect();for(var i=0;i<6;i++){var s=document.createElement("div");s.className="burst";s.textContent=["⭐","✨","🌟"][i%3];
    s.style.left=Math.min(window.innerWidth-110,Math.max(70,r.left+r.width/2))+"px";s.style.top=Math.max(80,r.top+20)+"px";s.style.setProperty("--dx",(Math.random()*120-60)+"px");s.style.setProperty("--dy",(-60-Math.random()*120)+"px");
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
var SAY=["有一天，在田裡。故事發生在韓國。有位婆婆種紅豆，也很會煮豆粥。她的粥好吃得不得了，大家給她取了一個名字，叫豆粥婆婆。某一天，她在田裡工作，回頭一看，一隻大老虎站在面前！婆婆嚇得臉色發白。她一直求老虎：能不能等冬至到了，讓她先喝一碗豆粥？老虎也想嘗嘗豆粥的味道，就點頭了。",
 "冬至這一天，在婆婆家。豆粥煮好了，婆婆卻在草蓆上哭個不停。蛋和栗子、木背架、藍蟹、白年糕和泡菜缸，還有草蓆，一個一個過來關心。知道老虎要來吃婆婆，大家都很生氣，也都說有辦法。婆婆不哭了，開心的把粥分給大家喝。大夥兒想好了辦法，就各自躲好，等老虎上門。",
 "天才黑，在婆婆家。老虎來了，屋子裡又黑又安靜。栗子、蛋和熱年糕輪流出手，害老虎滿臉黏黏的。老虎把頭伸進水缸，鼻子卻被藍蟹夾得好痛。牠才跳了幾下，又被草蓆整個捲住，只好拚命往外衝。木背架在門口絆了牠一腳，牠一頭栽進泡菜缸。缸子滾啊滾，把老虎帶到好遠的地方。後來，老虎不敢再來找婆婆了。"];
each(document.querySelectorAll("[data-say]"),function(b){b.addEventListener("click",function(){say(SAY[+b.getAttribute("data-say")]);});});

/* 趕老虎排一排：依課文（課本第 110 頁）的順序點 */
function startSteps(){
  var box=$("stepBox"),done=0,errs=0,items=C.shuffle(C.STEPS),N=C.STEPS.length;
  function draw(){
    var h='<ol class="stepdone">';for(var k=0;k<done;k++)h+='<li><b>第 '+(k+1)+' 個</b>'+C.STEPS[k].e+' '+C.STEPS[k].w+'：'+C.STEPS[k].t+'</li>';h+='</ol>';
    if(done<N){h+='<div class="q">第 '+(done+1)+' 個對付老虎的是誰？</div><div class="steps">';
      items.forEach(function(s){h+='<button class="btn white'+(s.n<=done?" ok":"")+'" data-n="'+s.n+'"'+(s.n<=done?" disabled":"")+'>'+s.e+' '+s.w+'</button>';});h+='</div><div class="fb" id="stFb"></div>';}
    else{var st=errs===0?3:errs<=2?2:1;addStars(st,box);store.stepDone=(store.stepDone||0)+1;if(errs===0)store.stepPerfect=(store.stepPerfect||0)+1;save();
      h+='<div class="done">🔗 順序排好了！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"一次就排對，太厲害了！":"")+'</div>'+
       '<div class="route">'+C.STEPS.map(function(s){return "<span>"+s.e+" "+s.w+"</span>";}).join("➜")+'</div>'+
       '<p class="small">單獨一個打不過老虎，可是一個接一個出手，就把老虎趕跑了。</p>'+
       '<div class="btns cen"><button class="btn pink" id="stAgain">🔄 再排一次</button></div>';}
    box.innerHTML=h;
    if(done>=N){$("stAgain").addEventListener("click",startSteps);return;}
    each(box.querySelectorAll(".steps .btn"),function(b){b.addEventListener("click",function(){var n=+b.getAttribute("data-n");if(n<=done)return;
      if(C.stepCheck(done,n)){beep(true);done++;say(C.STEPS[n-1].w+"，"+C.STEPS[n-1].t);draw();}
      else{beep(false);errs++;miss("step");var f=$("stFb");f.className="fb show bad";f.textContent="還不是這一個喔！想一想："+C.STEPS[done].hint;}});});
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
  var bsf=ch.bf&&ch.bf!==ch.bs?"（在這個字裡寫成「"+ch.bf+"」）":"";
  var h='<div class="bigc">'+ch.c+'</div><div class="zy" aria-label="注音 '+ch.zy+'">'+zyHTML(ch.zy)+'</div><div class="cinfo">'+
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
$("wordList").innerHTML=cards(C.WORDS,function(w){return w.note?'<br><small>'+w.note+'</small>':"";});
$("moreList").innerHTML=cards(C.MORE);
$("idiomList").innerHTML=cards(C.IDIOMS);
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
runQuiz("hukouQ",function(){return C.HUKOU.slice(0,3).concat(C.shuffle(C.HUKOU.slice(3))).map(function(x){return C.hukouQ(x);});},{type:"hukou"});

/* ---------- 句型和寫作重點 ---------- */
var INTRO={
 seq:'<h3>🪄 先……接著……最後……</h3><div class="formula"><span class="f1">先</span><span class="f2">接著</span><span class="f3">最後</span></div><p class="lead">課本第 113 頁「句子練習」有一個例句，寫栗子、蛋和熱年糕怎麼一個接一個對付老虎（原句請看課本）。<br>課本把「<b>先</b>」「<b>接著</b>」「<b>最後</b>」印成紅色，旁邊還有三格圖，畫出這三件事。</p><p class="lead">自編例句：<span class="own">我先穿襪子。接著，穿鞋子。最後，走出門。</span></p><div class="tip more">🔎 用自己的話說（課本沒有寫說明）：有好幾件事要說的時候，用「先……接著……最後……」，就能照先後順序說清楚。</div><p class="small">前三題問課本例句的內容，其他句子是自編的。</p>',
 tone:'<h3>💬 對話的語氣</h3><p class="lead">課本第 113 頁「對話的語氣」用課文裡的兩句話當例子（原句請看課本）：</p><div class="rd"><b>難過、悲傷</b><span>婆婆流著眼淚，說老虎要來吃她。<br>從人物的<b>表情、動作</b>知道。</span><b>溫柔、堅定</b><span>泡菜缸和白年糕要婆婆放心，說他們有辦法。<br>從<b>對話內容</b>知道。</span></div><div class="tip">課本的提醒：由說話時的情境或所說的話，可以更精準的掌握人物說話時的語氣。</div><p class="lead">自編例句：<span class="own">「太好了，明天要去動物園！」妹妹高興得跳起來。</span><br>從動作知道，這是開心、興奮的語氣。</p><p class="small">前四題依課本。第五、六題只引用課文的語詞，最後兩題是自編的。念課文時，試著用這些語氣念念看！</p>',
 tell:'<h3>📚 說故事的方法</h3><p class="lead">課本第 124～125 頁（語文天地四）用這一課當例子，比了兩種說故事的方法：</p><div class="rd"><b>敘述方式</b><span>例子（第 124 頁）：只用一兩句話，說大家聽到老虎要吃婆婆，都搶著發表意見。<br>特色：能夠<b>簡潔的說明事件</b>，讓讀者用<b>旁觀者</b>的角度看故事。</span><b>對話方式</b><span>例子（第 125 頁）：把每個角色說的話一句一句寫出來，就像課文第 108 頁那樣。<br>特色：<b>彷彿身在現場</b>，能感受每樣物品都急著想幫忙的熱情。</span></div><p class="small">前五題依課本。後兩題的句子是自編的。</p>'};
var patK="seq",pq;
function makePat(){
  if(patK==="seq")return C.SEQ.slice(0,3).concat(C.shuffle(C.SEQ.slice(3))).map(function(x){return C.seqQ(x);});
  if(patK==="tone")return C.TONE.slice(0,4).concat(C.shuffle(C.TONE.slice(4))).map(function(x){return C.toneQ(x);});
  return C.TELL.slice(0,5).concat(C.shuffle(C.TELL.slice(5))).map(function(x){return C.tellQ(x);});
}
function patIntro(){$("patIntro").innerHTML=INTRO[patK]+(store.pat[patK]?'<p class="small">✅ 這個練習已完成過</p>':"");}
pq=runQuiz("patQ",makePat,{type:"seq",onDone:function(){store.pat[patK]=1;save();patIntro();}});
patIntro();
each(document.querySelectorAll("#patSeg button"),function(b){b.addEventListener("click",function(){patK=b.getAttribute("data-k");each(document.querySelectorAll("#patSeg button"),function(x){x.classList.toggle("on",x===b);});patIntro();pq.restart();});});

/* ---------- 挑戰：這句話是誰說的 ---------- */
runQuiz("whoBox",function(){return C.pick(C.WHO,8).map(function(x){return C.whoQ(x);});},{type:"who",onDone:function(r,n){if(r===n){store.whoPerfect=(store.whoPerfect||0)+1;save();}}});

/* ---------- 挑戰：三段分一分 ---------- */
function startSort(){
  /* 每一段各抽 3 句，共 9 題，三段都會出現 */
  var items=[],i=0,errs=0,box=$("sortBox"),placed={};
  C.ACTS.forEach(function(l){placed[l.k]=[];C.pick(C.SORT.filter(function(x){return x.s===l.k;}),3).forEach(function(x){items.push({t:x.t,s:x.s});});});
  items=C.shuffle(items);
  function draw(){
    var h='<div class="prog">';for(var k=0;k<items.length;k++)h+='<i class="'+(k<i?(items[k].ok?"ok":"no"):k===i?"cur":"")+'"></i>';
    h+='</div>';
    if(i<items.length){h+='<div class="q">「'+items[i].t+'」</div><div class="locbtns">';C.ACTS.forEach(function(l){h+='<button class="btn white" data-s="'+l.k+'">'+l.e+'<br>'+l.w+'</button>';});h+='</div><div class="fb" id="sFb"></div>';}
    h+='<div class="bins">';C.ACTS.forEach(function(l){h+='<div class="bin"><b>'+l.e+" "+l.w+'</b><small>'+l.time+'・'+l.place+'</small><br>'+placed[l.k].join("<br>")+'</div>';});h+='</div>';
    if(i>=items.length){var st=errs===0?4:errs<=2?2:1;addStars(st,box);if(errs===0){store.actPerfect=(store.actPerfect||0)+1;save();}
      h+='<div class="done">🎉 分類完成！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"全對，你是故事小導演！":"")+'</div><div class="btns cen"><button class="btn pink" id="sAgain">🔄 再玩一次</button></div>';}
    box.innerHTML=h;
    if(i>=items.length){$("sAgain").addEventListener("click",startSort);return;}
    each(box.querySelectorAll(".locbtns .btn"),function(b){b.addEventListener("click",function(){var sk=b.getAttribute("data-s"),it=items[i];
      if(C.sortCheck(it.t,sk)){beep(true);if(it.ok!==false)it.ok=true;placed[sk].push(it.t);i++;draw();}
      else{beep(false);errs++;it.ok=false;miss("act");var f=$("sFb");f.className="fb show bad";f.textContent="不是這一段喔！想一想：第一段是在田裡遇到老虎，第二段是冬至那天大家商量，第三段是天黑後趕走老虎。";}});});
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
$("resetBtn").addEventListener("click",function(){if(!confirm("確定要清除這一課的所有紀錄嗎？"))return;store=fresh();save();renderScore();renderGrid();patIntro();renderRec();});
renderScore();
})();
