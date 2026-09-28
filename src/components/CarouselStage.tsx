import {useEffect,useImperativeHandle,useRef,type Ref,type PointerEvent} from 'react';
import {characters} from '../data/characters';
import {useReducedMotion} from '../hooks/useMediaQuery';
import {preloadDestination} from '../motion/preload';
export type CarouselHandle={select:(index:number)=>void;step:(direction:number)=>void};
const modulo=(n:number)=>((n%4)+4)%4;
const clamp=(n:number,a:number,b:number)=>Math.min(b,Math.max(a,n));
export default function CarouselStage({active,onActive,onEnter,busy,controlRef}:{active:number;onActive:(index:number)=>void;onEnter:(index:number)=>void;busy:boolean;controlRef:Ref<CarouselHandle>}){
 const reduced=useReducedMotion(),stage=useRef<HTMLDivElement>(null),nodes=useRef<(HTMLDivElement|null)[]>([]);
 const callbacks=useRef({onActive,onEnter,busy});callbacks.current={onActive,onEnter,busy};
 const motion=useRef({position:active,velocity:0,target:null as number|null,active,width:1440,height:900,dragging:false,moved:false,startX:0,startY:0,lastX:0,lastTime:0,mouseX:NaN,mouseTime:0,interacted:performance.now(),focus:false});
 const select=(index:number)=>{const m=motion.current;if(callbacks.current.busy)return;const delta=modulo(index-modulo(Math.round(m.position))+2)-2;m.target=Math.round(m.position)+delta;m.velocity=0;m.interacted=performance.now();if(reduced)m.position=m.target;};
 useImperativeHandle(controlRef,()=>({select,step(direction){const m=motion.current;if(callbacks.current.busy)return;m.target=Math.round(m.target??m.position)+direction;m.velocity=0;m.interacted=performance.now();if(reduced)m.position=m.target;}}),[reduced]);
 useEffect(()=>{
  const el=stage.current;if(!el)return;const m=motion.current;let raf=0,last=0;
  const measure=()=>{m.width=el.clientWidth;m.height=el.clientHeight;};const observer=new ResizeObserver(measure);observer.observe(el);measure();
  const draw=()=>{
   const mobile=m.width<=640,tablet=m.width<=1050,short=m.height<=720&&!mobile;
   const baseHeight=mobile?.61:short?.79:tablet?.77:.82;
   const sideHeight=mobile?.19:tablet?.25:.29,backHeight=mobile?.15:.21;
   const sideScale=sideHeight/baseHeight,backScale=backHeight/baseHeight;
   const exponent=Math.log((sideScale-backScale)/(1-backScale))/Math.log(.5);
   const spread=mobile?.35:tablet?.29:.27;
   nodes.current.forEach((node,i)=>{if(!node)return;
    // A closed orbit: sine/cosine never jump when the phase crosses 0 or 4.
    const angle=(i-m.position)*Math.PI/2,depth=(1+Math.cos(angle))/2;
    const scale=backScale+(1-backScale)*Math.pow(depth,exponent);
    const x=Math.sin(angle)*m.width*spread+.08*m.width*Math.pow(1-depth,4);
    const y=-(1-scale)*m.height*(mobile?.29:tablet?.34:.34);
    node.style.transform=`translate3d(calc(-50% + ${x.toFixed(2)}px),${y.toFixed(2)}px,0) scale(${scale.toFixed(4)}) rotateY(${(reduced?0:-Math.sin(angle)*4).toFixed(2)}deg)`;
    node.style.opacity=String(.68+.32*depth);
    node.style.filter=reduced||mobile?'none':`blur(${((1-depth)*2.1).toFixed(2)}px)`;
    node.style.zIndex=String(Math.round(depth*100));
    node.dataset.active=String(i===m.active);
    const caption=node.querySelector<HTMLElement>('.satellite-caption');if(caption)caption.style.opacity=String(clamp((1-depth)*4,0,1));
   });
  };
  const tick=(now:number)=>{
   const dt=last?Math.min((now-last)/1000,.04):0;last=now;
   if(!callbacks.current.busy&&!m.dragging){
    if(m.target!==null){m.position+=(m.target-m.position)*(1-Math.exp(-dt*8));if(Math.abs(m.target-m.position)<.0005){m.position=m.target;m.target=null;}}
    else if(Math.abs(m.velocity)>.015){m.position+=m.velocity*dt;m.velocity*=Math.exp(-dt*4.5);}
    else if(now-m.interacted<5500||m.focus||reduced){m.position+=(Math.round(m.position)-m.position)*(1-Math.exp(-dt*6));}
    else m.position+=dt*4/(m.width*(m.width<=640?.35:.27)*Math.PI/2);
   }
   const next=modulo(Math.round(m.position));if(next!==m.active){m.active=next;callbacks.current.onActive(next);preloadDestination(next);}
   // Keep a bounded phase without changing any rendered position.
   if(Math.abs(m.position)>400){const turns=Math.trunc(m.position/4)*4;m.position-=turns;if(m.target!==null)m.target-=turns;}
   draw();raf=requestAnimationFrame(tick);
  };
  const wheel=(e:WheelEvent)=>{if(callbacks.current.busy||Math.abs(e.deltaX)<Math.abs(e.deltaY)&&!e.shiftKey)return;e.preventDefault();m.interacted=performance.now();m.target=null;const delta=(e.deltaX||e.deltaY)*(e.deltaMode===1?16:1);m.position+=delta/Math.max(300,m.width*.45);m.velocity=clamp(delta*.013,-1.6,1.6);};
  const visibility=()=>{cancelAnimationFrame(raf);last=0;m.velocity=0;m.dragging=false;if(!document.hidden)raf=requestAnimationFrame(tick);};
  el.addEventListener('wheel',wheel,{passive:false});document.addEventListener('visibilitychange',visibility);draw();if(!document.hidden)raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();el.removeEventListener('wheel',wheel);document.removeEventListener('visibilitychange',visibility);};
 },[reduced]);
 const down=(e:PointerEvent<HTMLDivElement>)=>{if(e.button!==0||callbacks.current.busy)return;const m=motion.current;m.dragging=true;m.moved=false;m.startX=m.lastX=e.clientX;m.startY=e.clientY;m.lastTime=e.timeStamp;m.velocity=0;m.target=null;m.interacted=performance.now();};
 const move=(e:PointerEvent<HTMLDivElement>)=>{const m=motion.current;if(callbacks.current.busy)return;
  if(m.dragging){const dx=e.clientX-m.lastX;if(Math.hypot(e.clientX-m.startX,e.clientY-m.startY)>7)m.moved=true;if(m.moved){e.currentTarget.setPointerCapture(e.pointerId);const delta=-dx/Math.max(250,m.width*.4);m.position+=delta;m.velocity=clamp(m.velocity*.55+delta/Math.max(.008,(e.timeStamp-m.lastTime)/1000)*.45,-3,3);e.preventDefault();}m.lastX=e.clientX;m.lastTime=e.timeStamp;m.interacted=performance.now();}
  else if(e.pointerType==='mouse'&&!reduced&&!m.focus){if(Number.isFinite(m.mouseX)&&e.timeStamp-m.mouseTime<120){const dx=e.clientX-m.mouseX;if(Math.abs(dx)>1){m.target=null;m.velocity=clamp(m.velocity*.7+dx*.024,-1.5,1.5);m.interacted=performance.now();}}m.mouseX=e.clientX;m.mouseTime=e.timeStamp;}
 };
 const up=(e:PointerEvent<HTMLDivElement>)=>{const m=motion.current;m.dragging=false;m.mouseX=NaN;if(e.timeStamp-m.lastTime>120)m.velocity=0;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
 return <div ref={stage} className="carousel-stage continuous-stage" aria-label="Choose a side of Clare" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={e=>{up(e);motion.current.velocity=0;motion.current.moved=true;}} onPointerLeave={()=>{motion.current.mouseX=NaN;}} onClickCapture={e=>{if(motion.current.moved){e.preventDefault();e.stopPropagation();motion.current.moved=false;}}}>
  {characters.map((c,i)=><div key={c.id} ref={node=>{nodes.current[i]=node;}} className="figurine-position orbit-figure" data-active={active===i}>
   <div className="figure-presence"><div className="figure-shadow"/><button className="figure-control" aria-label={`Explore ${c.label}`} disabled={busy} onFocus={e=>{if(e.currentTarget.matches(':focus-visible')){motion.current.focus=true;select(i);}}} onBlur={()=>{motion.current.focus=false;motion.current.interacted=performance.now();}} onPointerEnter={()=>preloadDestination(i)} onClick={e=>{if(e.detail===0||motion.current.active===i)onEnter(i);else select(i);}}>
    <img className="character-image" src={c.image} alt={`${c.label} — Clare figurine`} draggable={false} fetchPriority={i===active?'high':'low'} decoding="async"/>
   </button><span className="satellite-caption">{c.number} / {c.nav}</span></div>
  </div>)}
 </div>;
}
