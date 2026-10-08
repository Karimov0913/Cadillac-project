// Авторская 3D-интерпретация длиннобазного Escalade. Не заводская CAD-модель.
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
globalThis.FileReader=class { readAsArrayBuffer(blob){blob.arrayBuffer().then(r=>{this.result=r;this.onloadend?.()})} readAsDataURL(blob){blob.arrayBuffer().then(r=>{this.result='data:application/octet-stream;base64,'+Buffer.from(r).toString('base64');this.onloadend?.()})} };
const car=new T.Group(); car.name='ESV_Design_Study';
const mat=(name,color,metalness=0,roughness=.4)=>Object.assign(new T.MeshStandardMaterial({color,metalness,roughness}),{name});
const paint=mat('BodyPaint',0x9aa4ac,.82,.22),chrome=mat('Chrome',0xc1c7cc,1,.17),black=mat('Trim',0x111317,.25,.36),rubber=mat('Tire',0x090a0c,0,.87),leather=mat('Leather',0x2b2522,0,.65),glass=mat('Glass',0x18323e,.18,.12),brake=mat('Brake',0xb3292d,.5,.35);
glass.transparent=true;glass.opacity=.85;glass.depthWrite=false;glass.side=T.DoubleSide;
const light=mat('LightEmission',0xe7f6ff,.1,.16);light.emissive.set(0x8ecae6);light.emissiveIntensity=4;
const red=mat('RearLight',0x8d1626,.1,.2);red.emissive.set(0xaa1520);red.emissiveIntensity=2;
const geometryCache=new Map();
function box(name,x,y,z,w,h,d,m=paint,r=.035){const key=[w,h,d,r].join('/');if(!geometryCache.has(key))geometryCache.set(key,new RoundedBoxGeometry(w,h,d,2,r));const mesh=new T.Mesh(geometryCache.get(key),m);mesh.name=name;mesh.position.set(x,y,z);car.add(mesh);return mesh;}
function cyl(name,x,y,z,ra,rb,h,m,segments=40){const key=[ra,rb,h,segments].join('_');if(!geometryCache.has(key))geometryCache.set(key,new T.CylinderGeometry(ra,rb,h,segments));const o=new T.Mesh(geometryCache.get(key),m);o.name=name;o.rotation.x=Math.PI/2;o.position.set(x,y,z);car.add(o);return o;}
function sidePanel(name,points,z,m){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const mesh=new T.Mesh(new T.ShapeGeometry(s),m);mesh.name=name;mesh.position.z=z;car.add(mesh);return mesh;}
function sheet(name,vertices,m){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();const o=new T.Mesh(g,m);o.name=name;car.add(o);return o;}
// Нижний профиль с настоящими вырезами колёсных арок.
const body=new T.Shape();body.moveTo(-2.88,.7);body.lineTo(-2.88,1.14);body.quadraticCurveTo(-2.8,1.38,-2.5,1.4);body.lineTo(-1.3,1.42);body.lineTo(2.66,1.4);body.quadraticCurveTo(2.88,1.38,2.88,1.17);body.lineTo(2.88,.64);body.lineTo(2.23,.64);body.absarc(1.67,.55,.57,.15,Math.PI-.15,false);body.lineTo(-1.16,.64);body.absarc(-1.72,.55,.57,.15,Math.PI-.15,false);body.lineTo(-2.88,.7);
const bgeo=new T.ExtrudeGeometry(body,{depth:.065,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015,curveSegments:20});for(const z of [-1.015,.95]){const shell=new T.Mesh(bgeo,paint);shell.name='Body_Shell';shell.position.z=z;car.add(shell);}
box('Cabin_Floor',.55,.76,0,3.98,.11,1.82,black,.02);
box('Tailgate',2.82,1.075,0,.12,.66,1.95,paint,.025);
box('Chassis',0,.51,0,5.25,.15,1.75,black);
box('Roof',.55,1.96,0,4.14,.105,1.84,paint,.05);
box('Hood',-2.12,1.42,0,1.41,.1,1.96,paint,.045);
box('Sunroof',.58,2.02,0,2.24,.015,1.36,glass,.005);
// Остекление и стойки. Перед автомобиля находится по оси -X.
sheet('Windshield',[[-1.5,1.49,-.94],[-1.08,1.915,-.88],[-1.08,1.915,.88],[-1.5,1.49,.94]],glass);
sheet('Rear_Window',[[2.64,1.45,.93],[2.55,1.925,.89],[2.55,1.925,-.89],[2.64,1.45,-.93]],glass);
for(const sign of [-1,1]){
 const z=sign*1.014;
 sidePanel('Front_Window',[[-1.39,1.49],[-1.03,1.91],[-.15,1.91],[-.15,1.49]],z,glass);
 sidePanel('Middle_Window',[[-.06,1.49],[-.06,1.91],[1.15,1.91],[1.15,1.49]],z,glass);
 sidePanel('Cargo_Window',[[1.25,1.49],[1.25,1.91],[2.5,1.91],[2.6,1.49]],z,glass);
 box('B_Pillar',-.1,1.7,z,.09,.51,.05,black,.006);
 box('C_Pillar',1.2,1.7,z,.1,.5,.055,paint,.006);
 const ap=box('A_Pillar',-1.27,1.71,sign*.97,.075,.62,.075,paint,.02);ap.rotation.z=-.62;
 const dp=box('D_Pillar',2.58,1.71,sign*.97,.1,.57,.075,paint,.02);dp.rotation.z=.18;
 box('Window_Chrome',.48,1.466,sign*1.04,4.22,.026,.03,chrome,.009);
 box('Running_Board',.02,.4,sign*1.04,3.7,.075,.18,black,.018);
 box('Door_Handle',-.35,1.34,sign*1.055,.24,.048,.04,chrome,.014);
 box('Door_Handle',.94,1.34,sign*1.055,.24,.048,.04,chrome,.014);
 for(const x of [-1.47,-.09,1.23])box('Door_Seam',x,1.11,sign*1.04,.013,.45,.01,black,.001);
 const mirror=box('Mirror',-1.22,1.55,sign*1.17,.3,.17,.26,paint,.048);mirror.rotation.y=sign*.15;
 box('Mirror_Glass',-1.07,1.55,sign*1.18,.016,.11,.19,chrome,.005);
 box('LED_Vertical',-2.85,1.015,sign*.91,.04,.52,.065,light,.018);
 box('LED_Horizontal',-2.892,1.29,sign*.78,.029,.045,.35,light,.01);
 box('Rear_LED',2.868,1.47,sign*.95,.04,.76,.047,red,.012);
 box('Roof_Rail',.6,2.042,sign*.76,3.7,.045,.055,chrome,.012);
 box('Lower_Chrome',.03,.7,sign*1.04,2.4,.026,.024,chrome,.006);
 // Геометрия капитанских кресел: меняется материал Leather.
 for(const [x,y] of [[-.66,.96],[.65,.96],[1.89,.96]]){
  box('Leather_Seat_Base',x,y,sign*.49,.54,.16,.53,leather,.055);
  const back=box('Leather_Seat_Back',x+.21,y+.32,sign*.49,.16,.55,.5,leather,.048);back.rotation.z=-.1;
  box('Leather_Headrest',x+.24,y+.66,sign*.49,.17,.2,.29,leather,.045);
 }
 for(const x of [-1.72,1.67]){
  cyl('Tire',x,.55,sign*1.025,.5,.5,.29,rubber,48);
  cyl('Rim_Barrel',x,.55,sign*1.181,.378,.378,.018,chrome,48);
  cyl('Rim_Inset',x,.55,sign*1.196,.332,.332,.012,black,40);
  cyl('Brake_Disc',x,.55,sign*1.207,.285,.285,.012,chrome,40);
  cyl('Rim_Hub',x,.55,sign*1.235,.083,.083,.042,chrome,24);
  box('Caliper',x+.19,.58,sign*1.219,.085,.23,.042,brake,.018);
  for(let j=0;j<12;j++){
   const a=j*Math.PI/6;const sp=box('Wheel_Spoke',x+Math.sin(a)*.205,.55+Math.cos(a)*.205,sign*1.235,.041,.29,.023,chrome,.006);sp.rotation.z=-a+.13;
  }
  // Несколько радиальных канавок делают резину визуально объёмной.
  const torusGeo=new T.TorusGeometry(.46,.01,4,48);
  for(const zz of [-.08,.08]){const t=new T.Mesh(torusGeo,black);t.name='Tire_Sidewall';t.position.set(x,.55,sign*1.025+zz);car.add(t);}
 }
}
box('Grille_Frame',-2.926,1.075,0,.05,.59,1.44,chrome,.048);
box('Grille',-2.96,1.075,0,.025,.54,1.37,black,.03);
// Мелкая геометрическая решётка без текстур и внешних зависимостей.
for(let row=0;row<9;row++)for(let col=0;col<22;col++){
 const z=-.66+col*.062+(row%2)*.031;if(z>.67)continue;
 const diamond=box('Grille_Mesh',-2.984,.83+row*.06,z,.014,.022,.022,black,.002);diamond.rotation.x=Math.PI/4;
}
box('Grille_Emblem',-3.005,1.14,0,.025,.09,.16,chrome,.015);
box('Front_Splitter',-2.83,.56,0,.24,.09,1.96,black,.035);
box('Lower_Intake',-2.95,.69,0,.015,.14,1.34,black,.014);
box('Rear_Bumper',2.84,.57,0,.21,.13,1.97,black,.045);
box('Tailgate_Chrome',2.927,1.19,0,.025,.033,1.51,chrome,.008);
box('Rear_Numberplate',2.935,.91,0,.02,.14,.39,black,.008);
box('Dashboard',-1.09,1.43,0,.25,.13,1.77,black,.028);
box('OLED_Display',-1.055,1.54,0,.02,.13,1.43,glass,.01);
for(const z of [-.68,-.47,.47,.68])cyl('Exhaust',2.91,.42,z,.072,.072,.15,chrome,20).rotation.z=Math.PI/2;
const result=await new GLTFExporter().parseAsync(car,{binary:true});
fs.mkdirSync('assets/models',{recursive:true});fs.writeFileSync('assets/models/escalade-esv.glb',Buffer.from(result));
fs.writeFileSync('assets/models/escalade-esv.glb.gz.b64',gzipSync(Buffer.from(result)).toString('base64'));
console.log('GLB:',result.byteLength,'bytes; compressed base64:',fs.statSync('assets/models/escalade-esv.glb.gz.b64').size,'bytes');
