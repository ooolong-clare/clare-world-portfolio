import {Link} from 'react-router-dom';
import {useEffect,useRef,useState,type CSSProperties,type PointerEvent as ReactPointerEvent} from 'react';
import {projects,type ProjectId} from '../data/projects';
import {characters} from '../data/characters';
import {useMediaQuery,useReducedMotion} from '../hooks/useMediaQuery';
import {CharacterModel} from './three/CharacterModel';
import '../styles/project-lab.css';
// Only the three supplied project covers remain on the closed cylinder.
const cards=[{project:0},{project:1},{project:2}] as const;
type Opening={id:ProjectId;rect:DOMRect;expanded:boolean};
export default function ProjectLab({onOpen,returnProject}:{onOpen:(id:ProjectId)=>void;returnProject?:ProjectId}){
 const mobile=useMediaQuery('(max-width: 767px)'),reduced=useReducedMotion(),native=mobile||reduced;
 const stage=useRef<HTMLDivElement>(null),nodes=useRef<(HTMLElement|null)[]>([]);
 const [opening,setOpening]=useState<Opening|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),onOpenRef=useRef(onOpen);onOpenRef.current=onOpen;
 const motion=useRef({progress:0,speed:0,impulse:0,height:300,sceneHeight:600,hover:false,keyboard:false,dragging:false,moved:false,lastY:0,startY:0,lastTime:0,velocity:0,tx:0,ty:0,x:0,y:0,opening:false});
 useEffect(()=>{
  const el=stage.current;if(!el)return;const m=motion.current;let frame=0,last=0,elapsed=0;
  m.progress=0;m.speed=0;m.impulse=0;m.dragging=false;m.opening=false;
  const measure=()=>{m.height=nodes.current[0]?.offsetHeight||300;m.sceneHeight=el.clientHeight;};
  const observer=new ResizeObserver(measure);observer.observe(el);if(nodes.current[0])observer.observe(nodes.current[0]);measure();
  const draw=()=>{
   const rounded=Math.round(m.progress),diff=m.progress-rounded;
   // The reference's magnetic easing gives each front card a moment of stillness.
   const active=rounded+Math.sign(diff)*Math.pow(Math.abs(diff)*2,4.2)/2;
   nodes.current.forEach((node,i)=>{
    if(!node)return;let offset=((i-active+cards.length*1.5)%cards.length)-cards.length/2;
    const distance=Math.abs(offset),sign=Math.sign(offset);
    const angle=offset*Math.PI*2/cards.length;
    const y=-Math.sin(angle)*(m.height*.86+42),z=130+270*Math.cos(angle),rotation=Math.abs(Math.sin(angle))*32;
    const front=Math.max(0,1-distance),project='project'in cards[i];
    node.style.transform=`translate3d(0,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${(-sign*rotation+(project?-m.y*8*front:0)).toFixed(2)}deg) rotateY(${(project?m.x*10*front:0).toFixed(2)}deg) rotateZ(-3deg)`;
    node.style.zIndex=String(Math.round(z+300));node.style.opacity=String(.45+.55*(1+Math.cos(angle))/2);
    node.style.pointerEvents=distance<.8?'auto':'none';
   });
  };
  const tick=(now:number)=>{
   const dt=last?Math.min((now-last)/1000,.05):0;last=now;elapsed+=dt;
   const target=m.hover||m.keyboard||m.dragging||m.opening||elapsed<.9?0:.18;
   m.speed+=(target-m.speed)*(1-Math.exp(-dt*6));m.impulse*=Math.exp(-dt*3.5);
   if(!m.dragging&&!m.opening)m.progress+=(m.speed+m.impulse)*dt;
   m.progress=((m.progress%cards.length)+cards.length)%cards.length;
   const follow=1-Math.pow(.9,dt*60);m.x+=(m.tx-m.x)*follow;m.y+=(m.ty-m.y)*follow;
   draw();frame=requestAnimationFrame(tick);
  };
  const wheel=(e:WheelEvent)=>{if(native||m.opening)return;e.preventDefault();m.impulse=Math.max(-4,Math.min(4,m.impulse+(e.deltaY||e.deltaX)*(e.deltaMode===1?.05:.004)));};
  const visibility=()=>{cancelAnimationFrame(frame);last=0;if(!native&&!document.hidden)frame=requestAnimationFrame(tick)};
  el.addEventListener('wheel',wheel,{passive:false});document.addEventListener('visibilitychange',visibility);
  if(!native){draw();if(!document.hidden)frame=requestAnimationFrame(tick)}
  else nodes.current.forEach(n=>{if(n){n.style.transform='';n.style.opacity='1';n.style.pointerEvents='auto';n.style.zIndex='';}});
  return()=>{cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener('wheel',wheel);document.removeEventListener('visibilitychange',visibility)};
 },[native]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 useEffect(()=>{if(returnProject)document.getElementById(`lab-${returnProject}`)?.focus({preventScroll:true})},[returnProject]);
 useEffect(()=>{if(!opening?.expanded)return;timer.current=setTimeout(()=>onOpenRef.current(opening.id),620);return()=>{if(timer.current)clearTimeout(timer.current)}},[opening?.expanded]);
 const open=(id:ProjectId,node:HTMLElement)=>{const m=motion.current;if(m.moved||m.opening)return;if(native){onOpen(id);return;}m.opening=true;m.speed=0;m.impulse=0;setOpening({id,rect:node.getBoundingClientRect(),expanded:false});timer.current=setTimeout(()=>setOpening(o=>o?{...o,expanded:true}:o),24)};
 const down=(e:ReactPointerEvent)=>{if(native||e.button!==0||motion.current.opening)return;const m=motion.current;m.dragging=true;m.keyboard=false;m.moved=false;m.startY=m.lastY=e.clientY;m.lastTime=e.timeStamp;m.velocity=0;m.impulse=0;};
 const move=(e:ReactPointerEvent)=>{const m=motion.current;if(native)return;const r=e.currentTarget.getBoundingClientRect();m.tx=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));m.ty=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));if(!m.dragging)return;const dy=e.clientY-m.lastY;if(Math.abs(e.clientY-m.startY)>6){m.moved=true;e.currentTarget.setPointerCapture(e.pointerId);e.preventDefault();}if(m.moved){m.progress+=dy/Math.max(180,m.height);m.velocity=m.velocity*.5+(dy/Math.max(180,m.height)/Math.max(8,e.timeStamp-m.lastTime)*1000)*.5;}m.lastY=e.clientY;m.lastTime=e.timeStamp;};
 const up=(e:ReactPointerEvent)=>{const m=motion.current;if(!m.dragging)return;m.dragging=false;m.impulse=m.moved?Math.max(-3,Math.min(3,m.velocity)):0;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
 const selected=opening?projects.find(p=>p.id===opening.id):undefined;
 return <main className={`project-flow-page ${native?'cylinder-native':''} ${reduced?'cylinder-reduced':''} ${opening?'cylinder-opening':''}`}>
  <div className="flow-character"><span className="flow-orbit"/><CharacterModel character={characters[2]}/></div>
  <header className="flow-heading"><h1>PROJECT LAB</h1></header>
  <div className="cylinder-stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={()=>{motion.current.tx=0;motion.current.ty=0;motion.current.hover=false}} onClickCapture={e=>{if(motion.current.moved){e.preventDefault();e.stopPropagation();motion.current.moved=false}}}>
   <div className="cylinder-space">
    {cards.map((card,i)=>{const p=projects[card.project];const color=p.coverColor;const style={'--card-color':color} as CSSProperties;
     const faces=<><span className="card-thickness"/><span className="cylinder-face cylinder-back"/><span className="cylinder-face cylinder-front">{p&&<img src={p.cover} alt="" draggable={false}/>}</span></>;
     return p?<Link key={i} ref={node=>{nodes.current[i]=node}} id={`lab-${p.id}`} className="cylinder-card cylinder-project" style={style} to={`/projects/${p.id}`} aria-label={`Open project: ${p.title}`} onPointerEnter={()=>{motion.current.hover=true}} onPointerLeave={()=>{motion.current.hover=false}} onFocus={e=>{motion.current.keyboard=e.currentTarget.matches(':focus-visible');if(!native&&motion.current.keyboard){motion.current.moved=false;motion.current.progress=i;motion.current.speed=0;motion.current.impulse=0;stage.current!.scrollTop=0;}}} onBlur={()=>{motion.current.keyboard=false}} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();open(p.id,e.currentTarget)}}>{faces}</Link>:<div key={i} ref={node=>{nodes.current[i]=node}} className="cylinder-card cylinder-blank" style={style} aria-hidden="true" onPointerEnter={()=>{motion.current.hover=true}} onPointerLeave={()=>{motion.current.hover=false}}>{faces}</div>;
    })}
   </div>
  </div>
  <span className="flow-index">03 / SELECTED WORK</span>
  {opening&&selected&&<div className={`flow-transition ${opening.expanded?'is-expanded':''}`} style={{background:selected.coverColor,transform:opening.expanded?'translate3d(0,0,0) scale(1,1)':`translate3d(${opening.rect.left}px,${opening.rect.top}px,0) scale(${opening.rect.width/window.innerWidth},${opening.rect.height/window.innerHeight})`}} aria-hidden="true"><img src={selected.cover} alt=""/></div>}
 </main>;
}
