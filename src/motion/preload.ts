import {characters} from '../data/characters';
import {projects} from '../data/projects';
export const pageImports=[()=>import('../pages/About'),()=>import('../pages/Internship'),()=>import('../pages/Projects'),()=>import('../pages/Contact')];
const images=new Map<string,Promise<void>>();
export function preloadImage(src:string){
 if(!images.has(src))images.set(src,new Promise<void>(resolve=>{const image=new Image();image.onload=()=>{image.decode().catch(()=>{}).then(resolve)};image.onerror=()=>resolve();image.src=src;}));
 return images.get(src)!;
}
export function preloadDestination(index:number){void pageImports[index]().catch(()=>{});void preloadImage(characters[index].image);if(index===2)projects.forEach(p=>void preloadImage(p.cover));}
