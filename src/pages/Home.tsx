import {useEffect,useRef,useState,type RefObject} from 'react';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import CarouselStage,{type CarouselHandle} from '../components/CarouselStage';
import {characters} from '../data/characters';
import {preloadDestination} from '../motion/preload';
export default function Home({active,onActive,select,enter,busy,exiting,controlRef}:{active:number;onActive:(n:number)=>void;select:(n:number)=>void;enter:(n:number)=>void;busy:boolean;exiting:boolean;controlRef:RefObject<CarouselHandle|null>}){
 const [displayed,setDisplayed]=useState(active),[changing,setChanging]=useState(false);
 const first=useRef(sessionStorage.getItem('clare-intro')!=='yes');
 useEffect(()=>{const timer=setTimeout(()=>{sessionStorage.setItem('clare-intro','yes');},1700);return()=>clearTimeout(timer);},[]);
 useEffect(()=>{if(active===displayed){setChanging(false);return;}setChanging(true);const timer=setTimeout(()=>{setDisplayed(active);setChanging(false);},140);return()=>clearTimeout(timer);},[active,displayed]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement).closest('input,textarea,select'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();controlRef.current?.step(e.key==='ArrowRight'?1:-1);}if(e.key==='Enter'&&!(e.target as HTMLElement).closest('button,a,[role="button"]'))enter(active);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[active,enter,controlRef]);
 const c=characters[displayed];
 return <main className={`home motion-home ${first.current?'hero-first':''} ${exiting?'home-exiting':''}`}>
  <h1 className="hero-title">Hi, I'm Clare.</h1><div className="stage-orbit" aria-hidden="true"/>
  <CarouselStage active={active} onActive={onActive} onEnter={enter} busy={busy} controlRef={controlRef}/>
  <div className="home-bottom"><section className="home-caption" aria-live="polite"><div className={`home-copy-swap ${changing?'is-changing':''}`}><div className="section-index"><span>{c.number}</span><span>/ 04</span><i/></div><h2>{c.label}</h2></div><div className="arrow-controls"><button aria-label="Previous character" disabled={busy} onClick={()=>controlRef.current?.step(-1)}><ArrowLeft/></button><button aria-label="Next character" disabled={busy} onClick={()=>controlRef.current?.step(1)}><ArrowRight/></button></div></section>
  <div className={`home-enter home-copy-swap ${changing?'is-changing':''}`}><button className="display-link" onPointerEnter={()=>{controlRef.current?.select(active);preloadDestination(active);}} onFocus={()=>{controlRef.current?.select(active);preloadDestination(active);}} onClick={()=>enter(displayed)} disabled={busy} aria-label={c.cta}>{c.cta}<ArrowRight/></button></div></div>
  <div className="home-footer"><span>CLARE'S WORLD © 2026</span><div className="carousel-dots">{characters.map((ch,i)=><button key={ch.id} aria-label={`Select ${ch.label}`} aria-pressed={active===i} onClick={()=>select(i)} disabled={busy}><span className={i===active?'selected':''}/></button>)}</div></div>
 </main>;
}
