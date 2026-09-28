import {useEffect} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {projects} from '../data/projects';
import ProjectDetail from './ProjectDetail';
import ProjectLab from '../components/ProjectLab';
export default function Projects(){
 const location=useLocation(),navigate=useNavigate();
 const id=location.pathname.split('/')[2]||new URLSearchParams(location.search).get('project');
 const selected=projects.find(p=>p.id===id);
 const close=()=>navigate('/projects',{state:{returnProject:selected?.id}});
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'&&selected)close()};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[selected]);
 if(selected)return <ProjectDetail project={selected} onClose={close}/>;
 return <ProjectLab returnProject={location.state?.returnProject} onOpen={id=>navigate(`/projects/${id}`)}/>;
}
