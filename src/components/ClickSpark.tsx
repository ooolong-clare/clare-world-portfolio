import {useEffect,useRef} from 'react';
export default function ClickSpark(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;
  let frame=0;let points:{x:number;y:number;start:number}[]=[];let down:{x:number;y:number;moved:boolean}|null=null;let genuine=false;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);el.width=innerWidth*dpr;el.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};resize();
  const draw=(now:number)=>{ctx.clearRect(0,0,innerWidth,innerHeight);points=points.filter(p=>now-p.start<420);for(const p of points){const t=(now-p.start)/420;ctx.strokeStyle=`rgba(249,246,239,${(1-t)*.85})`;ctx.lineWidth=1.5;ctx.lineCap='round';const count=reduced.matches?4:7;for(let i=0;i<count;i++){const angle=i*Math.PI*2/count;const radius=reduced.matches?3:3+19*(1-Math.pow(1-t,3));const length=reduced.matches?2:6*(1-t);ctx.beginPath();ctx.moveTo(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius);ctx.lineTo(p.x+Math.cos(angle)*(radius+length),p.y+Math.sin(angle)*(radius+length));ctx.stroke();}}frame=points.length?requestAnimationFrame(draw):0;};
  const start=(e:PointerEvent)=>{genuine=false;down=e.isPrimary&&e.button===0?{x:e.clientX,y:e.clientY,moved:false}:null;};
  const move=(e:PointerEvent)=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)down.moved=true;};
  const end=()=>{genuine=!!down&&!down.moved;down=null;};const cancel=()=>{down=null;genuine=false;};
  const click=(e:MouseEvent)=>{if(!genuine||e.detail===0)return;genuine=false;points.push({x:e.clientX,y:e.clientY,start:performance.now()});points=points.slice(-8);if(!frame)frame=requestAnimationFrame(draw);};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;points=[];ctx.clearRect(0,0,innerWidth,innerHeight);cancel();}};
  window.addEventListener('resize',resize);window.addEventListener('pointerdown',start,true);window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',end,true);window.addEventListener('pointercancel',cancel,true);window.addEventListener('click',click);document.addEventListener('visibilitychange',visibility);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('pointerdown',start,true);window.removeEventListener('pointermove',move,true);window.removeEventListener('pointerup',end,true);window.removeEventListener('pointercancel',cancel,true);window.removeEventListener('click',click);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 return <canvas ref={canvas} className="click-spark-layer" aria-hidden="true"/>;
}
