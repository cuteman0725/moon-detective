/* 國語第九課 阿白觀察記：互動程式
   題目資料在 index.html 的 Core（依南一版課本第 62～63、80～87、90～91、130 頁整理）。 */
(function(){
"use strict";
if(typeof document==="undefined")return;
var $=function(id){return document.getElementById(id);};
var C=Core,KEY="zhBirdingV1",OLD_KEY="lesson9-birding";
function each(list,fn){Array.prototype.forEach.call(list,fn);}
function fresh(){return {stars:0,readBest:0,seen:{},wrote:{},matchDone:0,pat:{},stepDone:0,stepPerfect:0,stagePerfect:0,chBest:0,bad:{},best:{}};}
var store=fresh();
try{
  var raw=localStorage.getItem(KEY),o,k;
  if(raw){o=JSON.parse(raw);for(k in o)store[k]=o[k];}
  else{
    /* 舊版頁面把紀錄存在另一個鍵。第一次打開新版時，把星星、看過和寫過的字接過來，舊的鍵不動。 */
    var old=JSON.parse(localStorage.getItem(OLD_KEY)||"null");
    if(old&&typeof old==="object"){
      if(old.score>0)store.stars=Math.floor(old.score);
      ["seen","wrote"].forEach(function(f){if(old[f]&&typeof old[f]==="object")for(var c in old[f])if(C.charBy(c))store[f][c]=1;});
      if(old.matchDone>0)store.matchDone=old.matchDone;
    }
  }
}catch(e){}
if(typeof store.stars!=="number"||!isFinite(store.stars)||store.stars<0)store.stars=0;
if(!store.seen||typeof store.seen!=="object")store.seen={};
if(!store.wrote||typeof store.wrote!=="object")store.wrote={};
if(!store.pat||typeof store.pat!=="object")store.pat={};
if(!store.bad||typeof store.bad!=="object")store.bad={};
if(!store.best||typeof store.best!=="object")store.best={};
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
var TN={read:"🔍 閱讀理解",bs:"🧩 部首",tot:"✏️ 筆畫",zy:"🔤 注音",look:"👀 形近字",word:"📚 語詞意思",fill:"📝 選詞填空",bdb:"✏️ 不得不",desc:"🎬 靜態和動態描寫",cause:"🧭 因果式",stage:"🐦 阿白分類",step:"🗓️ 事情的順序"};
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
/* 念的是自己寫的導讀，不是課文原文 */
var SAY=["起因，第一段。春天的清晨，五點半一到，阿白就飛來陽臺唱歌。叫聲清亮而急促，我只好起床。作者把阿白的羽毛寫成衣服：身上是灰色和灰綠色，頭上像戴了一頂白色毛帽。牠的歌聽起來像，不理不理。我很好奇，決定看看牠在做什麼。",
 "經過，第二、三段。我看了好幾天，發現阿白還很會跳舞！牠站在細細的樹枝上，壓低身體，張開尾羽，翅膀快速振動，腳踩著碎步。牠像林間的舞者，也像戰鬥機。我查了動物百科才知道：白頭翁的求偶季節是三月到五月。公鳥這麼努力表演，是想吸引母鳥。",
 "經過，第四、五段。過了兩個多月，阿白有伴了。兩隻鳥忙著用嘴咬乾草，在樹枝間穿來穿去。原來，牠們在陽臺的樹上做了一個黃褐色的鳥巢。有一天，趁阿白不在，我拿望遠鏡看，巢裡有三顆蛋，蛋上有巧克力色斑點。巢外面的樹枝，還夾著一條細細長長的塑膠碎片，我覺得怪怪的。",
 "經過，第六段。有了幼鳥，阿白的脾氣不一樣了，變得很凶。我才走近一點，牠就馬上飛起來，在空中繞圈，還大聲叫，好像要衝下來啄人。我嚇得不敢越雷池一步。",
 "結果，第七段。夏天快結束了。阿白又唱起牠的招牌歌，一共三個音，聽起來像，巧克力，和求偶的時候不一樣。幼鳥的羽毛長得豐滿以後，很快就飛走了。阿白也沒有說再見就離開。少了擾人的鬧鐘，我卻很想念牠們，也想念觀察的樂趣。"];
each(document.querySelectorAll("[data-say]"),function(b){b.addEventListener("click",function(){say(SAY[+b.getAttribute("data-say")]);});});

/* 事情的順序排一排：依課文的順序點 */
function startSteps(){
  var box=$("stepBox"),done=0,errs=0,items=C.shuffle(C.STEPS),N=C.STEPS.length;
  function draw(){
    var h='<ol class="stepdone">';for(var k=0;k<done;k++){var d=C.STEPS[k];h+='<li><b>'+C.GROUPS[d.g]+'</b>'+d.e+' '+d.t+'</li>';}h+='</ol>';
    if(done<N){h+='<div class="q">'+(done===0?"最先發生的是哪一件事？":"接下來是哪一件事？")+'</div><div class="steps">';
      items.forEach(function(s){h+='<button class="btn white'+(s.n<=done?" ok":"")+'" data-n="'+s.n+'"'+(s.n<=done?" disabled":"")+'>'+s.e+' '+s.t+'<small>'+s.d+'</small></button>';});h+='</div><div class="fb" id="stFb"></div>';}
    else{var st=errs===0?3:errs<=2?2:1;addStars(st,box);store.stepDone=(store.stepDone||0)+1;if(errs===0)store.stepPerfect=(store.stepPerfect||0)+1;save();
      h+='<div class="done">🗓️ 順序排好了！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"一次就排對，你是順序小偵探！":"")+'</div>'+
       '<div class="route"><span>起因</span>➜<span>經過</span>➜<span>結果</span></div>'+
       '<p class="small">課本第 90 頁：起因是作者被叫聲吵醒，因為好奇，開始觀察。經過是觀察的過程。結果是白頭翁離開了，作者很想念。</p>'+
       '<div class="btns cen"><button class="btn pink" id="stAgain">🔄 再排一次</button></div>';}
    box.innerHTML=h;
    if(done>=N){$("stAgain").addEventListener("click",startSteps);return;}
    each(box.querySelectorAll(".steps .btn"),function(b){b.addEventListener("click",function(){var n=+b.getAttribute("data-n");if(n<=done)return;
      if(C.stepCheck(done,n)){beep(true);done++;say(C.STEPS[n-1].t);draw();}
      else{beep(false);errs++;miss("step");var f=$("stFb");f.className="fb show bad";f.textContent="還不是這一件喔！想一想：這件事發生以前，阿白先做了什麼？";}});});
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
   (ch.poly?'<div>🔤 多音字：課本第 '+ch.poly.p+' 頁的注音是紅色的。這一課念 <b>'+ch.poly.now+'</b>，例如「'+ch.poly.eg+'」。<br><span class="small">🔎 延伸：'+ch.poly.more+'。</span></div>':"")+
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
var wh="";C.WORDS.forEach(function(w){wh+='<div class="wcard"><b>'+w.w+'</b>'+w.m+'</div>';});$("wordList").innerHTML=wh;
var ph="";C.PHRASES.forEach(function(w){ph+='<div class="wcard"><b>'+w.w+'</b>'+w.m+' <small>（課本第 '+w.p+' 頁）</small></div>';});$("phraseList").innerHTML=ph;
var ih="";C.IDIOMS.forEach(function(w){ih+='<div class="wcard"><b>'+w.w+'</b>'+w.m+'</div>';});$("idiomList").innerHTML=ih;
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

/* ---------- 句型和描寫 ---------- */
var INTRO={
 bdb:'<h3>✏️ 句子練習：不得不</h3><div class="formula"><span class="f1">情況</span><span class="f2">不得不</span><span class="f3">必須做的事</span></div><p class="lead">課本第 87 頁「句子練習」的句子：<br>・在安靜的清晨，阿白的叫聲特別響亮，讓我<b>不得不</b>起床。<br>・突如其來的大雨，讓運動會<b>不得不</b>提早結束。<br>課本問：在這樣的情況下，必須怎麼做？</p><p class="small">小提示（自編）：「不得不」是沒有別的辦法，只好這樣做。前兩題是課本的句子，後面的句子是自編的。</p>',
 desc:'<h3>🎬 靜態描寫和動態描寫</h3><div class="formula"><span class="f2">靜態：靜止的狀態</span><span class="f1">動態：活動變化</span></div><p class="lead">課本第 87 頁：<br><b>靜態描寫</b>：描寫景物靜止的狀態。例子是巢裡的蛋、夾在樹枝上的塑膠碎片。<br><b>動態描寫</b>：捕捉物體的活動變化。例子是阿白壓低身體、張開尾羽、振動翅膀、踩碎步。<br>兩種一起用，讀的人腦中會出現畫面，更能感受文章。</p><p class="small">說明和前三句是依課本第 87 頁，用自己的話改寫的。其他句子是自編的。</p>',
 cause:'<h3>🧭 因果式：起因、經過、結果</h3><div class="formula"><span class="f1">起因</span><span class="f2">經過</span><span class="f3">結果</span></div><p class="lead">課本第 90 頁「安排段落」：用因果順序安排段落，能清楚掌握事情的來龍去脈。例子就是〈阿白觀察記〉：<br><b>起因</b>：作者被白頭翁的叫聲吵醒，因為好奇，開始觀察牠。<br><b>經過</b>：作者觀察白頭翁的過程。<br><b>結果</b>：白頭翁離開了，作者想念觀察牠們的樂趣。</p><p class="small">起因、經過、結果的說明出自課本第 90 頁。後三題哪一件事屬於哪一部分，是自己對照的。</p>'};
var patK="bdb",pq;
function half(arr,a,n){return C.pick(arr.filter(function(x){return x.a===a;}),n);}
function makePat(){
  if(patK==="bdb")return C.BDB.slice(0,3).concat(C.shuffle(C.BDB.slice(3))).map(function(x){return C.bdbQ(x);});
  /* 靜態、動態各抽 3 句，前面加兩題課本的說明 */
  if(patK==="desc")return C.DESC_C.concat(C.shuffle(half(C.DESC,0,3).concat(half(C.DESC,1,3)))).map(function(x){return C.descQ(x);});
  return C.CAUSE_C.slice(0,2).concat(C.shuffle(C.CAUSE)).map(function(x){return C.causeQ(x);});
}
function patIntro(){$("patIntro").innerHTML=INTRO[patK]+(store.pat[patK]?'<p class="small">✅ 這個練習已完成過</p>':"");}
pq=runQuiz("patQ",makePat,{type:"bdb",onDone:function(){store.pat[patK]=1;save();patIntro();}});
patIntro();
each(document.querySelectorAll("#patSeg button"),function(b){b.addEventListener("click",function(){patK=b.getAttribute("data-k");each(document.querySelectorAll("#patSeg button"),function(x){x.classList.toggle("on",x===b);});patIntro();pq.restart();});});

/* ---------- 挑戰：阿白分類 ---------- */
function startSort(){
  /* 每個時候各抽 2 句，共 8 題，四個時候都會出現 */
  var items=[],i=0,errs=0,box=$("sortBox"),placed={};
  C.STAGES.forEach(function(l){placed[l.k]=[];C.pick(C.SORT.filter(function(x){return x.s===l.k;}),2).forEach(function(x){items.push({t:x.t,s:x.s});});});
  items=C.shuffle(items);
  function draw(){
    var h='<div class="prog">';for(var k=0;k<items.length;k++)h+='<i class="'+(k<i?(items[k].ok?"ok":"no"):k===i?"cur":"")+'"></i>';
    h+='</div>';
    if(i<items.length){h+='<div class="q">「'+items[i].t+'」</div><div class="locbtns">';C.STAGES.forEach(function(l){h+='<button class="btn white" data-s="'+l.k+'">'+l.e+'<br>'+l.w+'</button>';});h+='</div><div class="fb" id="sFb"></div>';}
    h+='<div class="bins">';C.STAGES.forEach(function(l){h+='<div class="bin"><b>'+l.e+" "+l.w+'</b>'+placed[l.k].join("<br>")+'</div>';});h+='</div>';
    if(i>=items.length){var st=errs===0?4:errs<=2?2:1;addStars(st,box);if(errs===0){store.stagePerfect=(store.stagePerfect||0)+1;save();}
      h+='<div class="done">🎉 分類完成！錯 '+errs+' 次，得到 '+st+' 顆星。'+(errs===0?"全對，你是阿白分類王！":"")+'</div><div class="btns cen"><button class="btn pink" id="sAgain">🔄 再玩一次</button></div>';}
    box.innerHTML=h;
    if(i>=items.length){$("sAgain").addEventListener("click",startSort);return;}
    each(box.querySelectorAll(".locbtns .btn"),function(b){b.addEventListener("click",function(){var sk=b.getAttribute("data-s"),it=items[i];
      if(C.sortCheck(it.t,sk)){beep(true);if(it.ok!==false)it.ok=true;placed[sk].push(it.t);i++;draw();}
      else{beep(false);errs++;it.ok=false;miss("stage");var f=$("sFb");f.className="fb show bad";f.textContent="不是這個時候喔！想一想：阿白先唱歌，再跳舞求偶，然後築巢下蛋，最後有了幼鳥。";}});});
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
