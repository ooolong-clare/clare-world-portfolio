import {asset} from '../lib/asset';
export const characters = [
 {id:'about',number:'01',label:'ABOUT ME',nav:'ABOUT',route:'/about',background:'#D97956',secondary:'#E89A7C',cta:'ENTER ABOUT',image:asset('/characters/about.png'),original:asset('/characters/about-original.png'),modelUrl:undefined as string|undefined},
 {id:'internship',number:'02',label:'INTERNSHIP',nav:'INTERNSHIP',route:'/internship',background:'#353537',secondary:'#555559',cta:'ENTER INTERNSHIP',image:asset('/characters/internship.png'),original:asset('/characters/internship-original.png'),modelUrl:undefined as string|undefined},
 {id:'projects',number:'03',label:'PROJECTS',nav:'PROJECTS',route:'/projects',background:'#496783',secondary:'#7089A0',cta:'VIEW PROJECTS',image:asset('/characters/projects.png'),original:asset('/characters/projects-original.png'),modelUrl:undefined as string|undefined},
 {id:'contact',number:'04',label:'CONTACT',nav:'CONTACT',route:'/contact',background:'#A66F7F',secondary:'#BF8998',cta:'CONTACT ME',image:asset('/characters/contact.png'),original:asset('/characters/contact-original.png'),modelUrl:undefined as string|undefined},
];
export type Character = typeof characters[number];
