import {Canvas} from '@react-three/fiber';
import {Bounds,OrbitControls,useGLTF} from '@react-three/drei';
import {useEffect,useState} from 'react';
function Model({url}:{url:string}){const {scene}=useGLTF(url);return <primitive object={scene}/>}
export default function CharacterCanvas({url}:{url:string}){const [visible,setVisible]=useState(!document.hidden);useEffect(()=>{const f=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',f);return()=>document.removeEventListener('visibilitychange',f)},[]);return <Canvas dpr={[1,1.5]} frameloop={visible?'always':'never'} camera={{position:[0,1,6],fov:32}} gl={{alpha:true,antialias:true}}><ambientLight intensity={1.7}/><directionalLight position={[3,5,4]} intensity={3}/><Bounds fit clip observe margin={1.1}><Model url={url}/></Bounds><OrbitControls enablePan={false} minAzimuthAngle={-.61} maxAzimuthAngle={.61} minPolarAngle={1.43} maxPolarAngle={1.71} minDistance={4} maxDistance={6} enableDamping/></Canvas>}
