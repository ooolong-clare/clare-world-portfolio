import {lazy,Suspense,useCallback,useEffect,useRef,useState} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import Header from './components/Header';import Home from './pages/Home';import ClickSpark from './components/ClickSpark';
import type {CarouselHandle} from './components/CarouselStage';
import {characters} from './data/characters';import {useReducedMotion} from './hooks/useMediaQuery';
import {pageImports,preloadDestination,preloadImage} from './motion/preload';
const About=lazy(pageImports[0]),Internship=lazy(pageImports[1]),Projects=lazy(pageImports[2]),Contact=lazy(pageImports[3]);
const validRoutes=['/','/about','/internship','/projects','/contact'];
export default function App(){
 const location=useLocation(),navigate=useNavigate(),pathname=location.pathname.replace(/\/+$/, '')||'/',home=pathname==='/',reduced=useReducedMotion();
 const [active,setActive]=useState(()=>{const saved=Number(sessionStorage.getItem('clare-active'));return Number.isInteger(saved)&&saved>=0&&saved<4?saved:0;});
 const [outgoing,setOutgoing]=useState(false);const carousel=useRef<CarouselHandle|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),lock=useRef(false);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 useEffect(()=>{let alive=true;let timer:ReturnType<typeof setTimeout>;const index=Number(sessionStorage.getItem('clare-active'))||0;
  // Critical image first, then decode upcoming worlds without blocking rendering.
  void preloadImage(characters[index].image).then(()=>{if(!alive)return;preloadDestination(index);timer=setTimeout(()=>{characters.forEach((_,i)=>preloadDestination(i));},300);});return()=>{alive=false;clearTimeout(timer);};
 },[]);
 useEffect(()=>{const idx=characters.findIndex(c=>c.route===pathname||(c.id==='projects'&&pathname.startsWith('/projects/')));if(idx>=0)setActive(idx);if(home){if(timer.current)clearTimeout(timer.current);setOutgoing(false);lock.current=false;}window.scrollTo(0,0);document.title=idx>=0?`${characters[idx].label} — Clare Zou`:'Clare Zou — Portfolio';},[pathname,home]);
 useEffect(()=>{sessionStorage.setItem('clare-active',String(active));preloadDestination(active);},[active]);
 const select=useCallback((n:number)=>{carousel.current?.select(n);},[]);
 const enter=useCallback((n:number)=>{if(lock.current||characters[n].route===pathname)return;preloadDestination(n);setActive(n);
  if(home&&!reduced){lock.current=true;setOutgoing(true);timer.current=setTimeout(()=>{setOutgoing(false);lock.current=false;},720);}
  // Mount the destination immediately underneath the retained outgoing home.
  navigate(characters[n].route);
 },[home,reduced,pathname,navigate]);
 const goHome=()=>{if(timer.current)clearTimeout(timer.current);lock.current=false;setOutgoing(false);if(home)select(0);else navigate('/');};
 const page=pathname==='/about'?<About/>:pathname==='/internship'?<Internship/>:(pathname==='/projects'||pathname.startsWith('/projects/'))?<Projects/>:pathname==='/contact'?<Contact/>:<div className="not-found"><h1>Lost in my world?</h1><button onClick={goHome}>Back to home</button></div>;
 return <div className={`app theme-${home?'home':characters[active].id} ${outgoing?'route-overlap':''} ${reduced?'motion-reduced':''}`} style={{backgroundColor:home?characters[active].background:undefined}}>
  <div className="grain" aria-hidden="true"/><Header home={home} active={active} onSelect={home?select:enter} onHome={goHome}/>
  {(home||outgoing)&&<div className={outgoing?'home-retained':''} inert={outgoing||undefined}><Home active={active} onActive={setActive} select={select} enter={enter} busy={outgoing} exiting={outgoing} controlRef={carousel}/></div>}
  {!home&&<Suspense fallback={<div className="route-placeholder" aria-busy="true"/>}><div className="page-enter" key={pathname.startsWith('/projects')?'projects':pathname}>{page}</div></Suspense>}
  {!home&&(validRoutes.includes(pathname)||pathname.startsWith('/projects/'))&&!(pathname==='/projects'&&!location.search)&&<footer className="page-footer"><button onClick={goHome}>CLARE'S WORLD</button><span>© 2026</span><button onClick={()=>enter((active+1)%4)}>NEXT / {characters[(active+1)%4].label} ↗</button></footer>}
  <ClickSpark/>
 </div>;
}
