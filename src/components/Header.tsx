import {useState,useEffect} from 'react';import {ArrowLeft,Menu,X} from 'lucide-react';import {characters} from '../data/characters';
export default function Header({home,active,onSelect,onHome}:{home:boolean;active:number;onSelect:(i:number)=>void;onHome:()=>void}){const[open,setOpen]=useState(false);useEffect(()=>setOpen(false),[home,active]);return <header className={`site-header ${home?"home-header":""}`}>
 {!home&&<button className="brand" onClick={onHome} aria-label="Return to Clare's World"><ArrowLeft size={20}/><span>CLARE'S WORLD</span></button>}
 <nav className={open?'site-nav is-open':'site-nav'} aria-label="Main navigation">{characters.map((c,i)=><button key={c.id} className={active===i?'current':''} aria-current={active===i?'page':undefined} onClick={()=>{setOpen(false);onSelect(i)}}><span className="nav-number">{c.number}</span>{c.nav}</button>)}</nav>
 <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>{open?<X/>:<Menu/>}</button>
 </header>}
