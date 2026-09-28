import {mkdir,readFile,writeFile} from 'node:fs/promises';
// Real route entrypoints avoid a 404/redirect on refresh in static hosting.
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
for(const route of ['about','internship','projects','contact','projects/amazon','projects/cct','projects/goodwill']){
 const directory=new URL(`../dist/${route}/`,import.meta.url);
 await mkdir(directory,{recursive:true});
 await writeFile(new URL('index.html',directory),html);
}
await writeFile(new URL('../dist/404.html',import.meta.url),html);
await writeFile(new URL('../dist/.nojekyll',import.meta.url),'');
