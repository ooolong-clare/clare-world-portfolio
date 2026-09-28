import {ArrowLeft,ArrowRight} from 'lucide-react';
import {useEffect,useRef} from 'react';
import {projects} from '../data/projects';
import {CharacterModel} from '../components/three/CharacterModel';
import {characters} from '../data/characters';
export default function ProjectDetail({project:p,onClose}:{project:typeof projects[number];onClose:()=>void}){
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>heading.current?.focus(),[p.id]);
 const hasWork=p.images.length>0;
 return <main className={`project-detail detail-${p.id}`}>
  <button className="back-to-lab" onClick={onClose}><ArrowLeft size={19}/> BACK TO PROJECT LAB <span>ESC</span></button>
  <header className="case-header"><div><p className="eyebrow">{p.number} / {p.type}</p><h1 ref={heading} tabIndex={-1}>{p.title}</h1><p lang="zh-CN">{p.subtitle}</p><span className="small-meta">{p.period}</span></div><div className="case-character"><CharacterModel character={characters[2]}/></div></header>
  <div className="case-content">
   <section className="case-section"><div className="case-label"><span>01</span><h2>THE CHALLENGE</h2></div><p className="case-lead" lang="zh-CN">{p.challenge}</p></section>
   <section className="case-section"><div className="case-label"><span>02</span><h2>WHAT I DID</h2></div><div><p className="role-summary" lang="zh-CN">{p.role}</p>{p.contributions.map((c,i)=><article className="contribution" key={c.title}><span>0{i+1}</span><div><h3>{c.title}</h3><p lang="zh-CN">{c.body}</p></div></article>)}</div></section>
   {/* An empty images array temporarily hides THE WORK; add approved assets to restore it. */}
   {hasWork&&<section className="case-section case-work"><div className="case-label"><span>03</span><h2>THE WORK</h2></div><div className="case-work-images">{p.images.map(image=><a key={image.src} href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`查看原图：${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy"/></a>)}</div></section>}
   <section className="case-section"><div className="case-label"><span>{hasWork?'04':'03'}</span><h2>OUTCOME</h2></div><p lang="zh-CN">{p.outcomes}</p></section>
   <div className="case-end"><div className="text-tags">{p.tools.map(t=><span key={t}>{t}</span>)}</div><button className="display-link" onClick={onClose}>BACK TO THE LAB <ArrowRight/></button></div>
  </div>
 </main>;
}
