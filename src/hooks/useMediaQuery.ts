import {useEffect,useState} from 'react';
export function useMediaQuery(query:string){const [matches,set]=useState(()=>window.matchMedia(query).matches);useEffect(()=>{const m=window.matchMedia(query);const fn=()=>set(m.matches);fn();m.addEventListener('change',fn);return()=>m.removeEventListener('change',fn)},[query]);return matches;}
export function useReducedMotion(){return useMediaQuery('(prefers-reduced-motion: reduce)')}
