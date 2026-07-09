import puppeteer from 'puppeteer-core';
const EXEC='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:EXEC,headless:true,args:['--no-sandbox']});

// --- MOBILE: menu tap on home ---
const m=await b.newPage();
await m.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await m.goto('http://localhost:5173/',{waitUntil:'networkidle2'});
await sleep(4000); // past loader
const comeInfo=await m.evaluate(()=>{
  const come=document.querySelector('.come');
  if(!come) return {found:false};
  const r=come.getBoundingClientRect();
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  const top=document.elementFromPoint(cx,cy);
  return {found:true, rect:{x:r.x,y:r.y,w:r.width,h:r.height},
    display:getComputedStyle(come).display,
    topElement: top? top.className+' <'+top.tagName+'>':'none',
    isCome: top===come||come.contains(top)};
});
console.log('MOBILE .come:', JSON.stringify(comeInfo));
// try tapping it
await m.evaluate(()=>{const c=document.querySelector('.come'); c&&c.click();});
await sleep(1200);
const fullTop=await m.evaluate(()=>{const f=document.querySelector('.full');return f?getComputedStyle(f).top:'no .full';});
console.log('MOBILE .full top after click:', fullTop);

// --- PLAYGROUND scroll state ---
const p=await b.newPage();
await p.setViewport({width:1366,height:800});
await p.goto('http://localhost:5173/playground',{waitUntil:'networkidle2'});
await sleep(4000);
const pg=await p.evaluate(()=>({
  scrollHeight:document.documentElement.scrollHeight,
  innerHeight:window.innerHeight,
  bodyOverflow:getComputedStyle(document.body).overflow,
  htmlClass:document.documentElement.className,
  hasScrollTrigger: !!(window.ScrollTrigger),
  page2Height: document.querySelector('.page2')?.getBoundingClientRect().height,
}));
console.log('PLAYGROUND:', JSON.stringify(pg));

// --- HOME hero anim: sample boundingelem transform over time ---
const h=await b.newPage();
await h.setViewport({width:1366,height:800});
await h.goto('http://localhost:5173/',{waitUntil:'networkidle2'});
const samples=[];
for(const t of [2600,3000,3600,4200]){
  await sleep(t-(samples.length?[2600,3000,3600,4200][samples.length-1]:0));
  const tr=await h.evaluate(()=>{const e=document.querySelector('.boundingelem');return e?getComputedStyle(e).transform:'none';});
  samples.push(t+'ms='+tr);
}
console.log('HOME boundingelem:', samples.join(' | '));

await b.close();
