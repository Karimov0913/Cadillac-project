// Одна команда публикации после клонирования репозитория и настройки Git.
import {spawnSync} from'node:child_process';
function run(cmd,args){const r=spawnSync(cmd,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
run('npm',['test']);run('npm',['run','build']);run('git',['add','index.html','css','js','assets','scripts','tests','package.json','package-lock.json','.github','.gitignore','README.md','SOURCES.md','LICENSE']);
const diff=spawnSync('git',['diff','--cached','--quiet']);if(diff.status===1)run('git',['commit','-m','Update Escalade V Studio']);else if(diff.status!==0)process.exit(diff.status||1);run('git',['push','origin','main']);
