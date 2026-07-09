import puppeteer from 'puppeteer-core';
const EXEC='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:EXEC,headless:true,args:['--no-sandbox']});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:5174/stack',{waitUntil:'networkidle2'}); await sleep(2500);
await p.screenshot({path:'shot-desktop.png'});
// measure pill left edges per row to check alignment
const align=await p.evaluate(()=>{
  const grids=[...document.querySelectorAll('.cat-grid')];
  return grids.map(g=>{
    const pills=[...g.querySelectorAll('.tech')];
    const lefts=pills.map(t=>Math.round(t.getBoundingClientRect().left));
    const tops=pills.map(t=>Math.round(t.getBoundingClientRect().top));
    const heights=pills.map(t=>Math.round(t.getBoundingClientRect().height));
    return {minLeft:Math.min(...lefts), heights:[...new Set(heights)]};
  });
});
console.log('grid align:', JSON.stringify(align));
const heroLeft=await p.evaluate(()=>Math.round(document.querySelector('.stack-hero h1').getBoundingClientRect().left));
console.log('heroLeft:', heroLeft);
const m=await b.newPage(); await m.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await m.goto('http://localhost:5174/stack',{waitUntil:'networkidle2'}); await sleep(2500);
await m.screenshot({path:'shot-mobile.png'});
const overflow=await m.evaluate(()=>({
  h1Width:Math.round(document.querySelector('.stack-hero h1').getBoundingClientRect().width),
  innerW:window.innerWidth,
  docScrollW:document.documentElement.scrollWidth,
}));
console.log('mobile overflow:', JSON.stringify(overflow));
await b.close();
