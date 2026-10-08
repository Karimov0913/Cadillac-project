// Студийная сцена: glTF, физические материалы, bloom и доступные ракурсы.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gsap } from 'gsap';

export class Configurator {
 constructor(element,{paint,interior,onReady,onError,onRotation}){
  this.element=element;this.paint=paint;this.interior=interior;this.onReady=onReady;this.onError=onError;this.onRotation=onRotation;
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.lastInteraction=performance.now();this.rotationPaused=false;this.shakeUntil=0;this.pointer=new THREE.Vector2();this.previousOffset=new THREE.Vector3();this.visible=true;this.paintMaterials=[];this.leatherMaterials=[];this.ready=false;this.disposed=false;
 }
 async init(){
  try{
   this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
   this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;
   this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
   this.element.append(this.renderer.domElement);
   this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.onError(new Error('WebGL context lost'));});
   this.renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
   this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(33,1,.1,150);
   this.camera.position.set(-7.3,3.3,7.5);
   this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,1,0);this.controls.enableDamping=true;this.controls.dampingFactor=.065;this.controls.enablePan=false;this.controls.minDistance=3;this.controls.maxDistance=14;this.controls.maxPolarAngle=Math.PI*.48;this.controls.minPolarAngle=.2;this.controls.autoRotateSpeed=.45;
   this.controls.addEventListener('start',()=>this.interact());this.controls.addEventListener('end',()=>this.interact());
   const pmrem=new THREE.PMREMGenerator(this.renderer);const room=new RoomEnvironment();this.envTarget=pmrem.fromScene(room,.04);this.scene.environment=this.envTarget.texture;room.dispose();pmrem.dispose();
   const key=new THREE.DirectionalLight(0xe0efff,2.7);key.position.set(-4,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.bias=-.001;this.scene.add(key);
   const fill=new THREE.DirectionalLight(0x8ecae6,1.3);fill.position.set(4,5,-4);this.scene.add(fill);
   this.scene.add(new THREE.HemisphereLight(0xecf5ff,0x273246,1.5));
   const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshBasicMaterial({color:0x1d1f29}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;this.scene.add(floor);this.floor=floor;
   // Мягкая контактная тень, дополняющая динамическую shadow map.
   const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,.65)');gradient.addColorStop(.55,'rgba(0,0,0,.35)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
   const shadow=new THREE.Mesh(new THREE.PlaneGeometry(8,4.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.006;this.scene.add(shadow);
   const ring=new THREE.Mesh(new THREE.RingGeometry(3.86,3.872,120),new THREE.MeshBasicMaterial({color:0x8ecae6,transparent:true,opacity:.055,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.008;this.scene.add(ring);
   // Мелкие спокойные частицы студии, не отвлекающие от автомобиля.
   const positions=new Float32Array(130*3);let seed=97;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};for(let i=0;i<130;i++){positions[i*3]=(random()-.5)*24;positions[i*3+1]=random()*9;positions[i*3+2]=(random()-.5)*18;}
   const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));this.particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x8ecae6,size:.018,transparent:true,opacity:.35,depthWrite:false}));this.scene.add(this.particles);
   this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));this.bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.28,.5,1.15);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
   this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.element);this.resize();
   this.intersectionObserver=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;},{rootMargin:'120px'});this.intersectionObserver.observe(this.element);
   this.element.addEventListener('pointermove',this.handlePointer=e=>{if(e.pointerType==='touch')return;const r=this.element.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);this.interact();});
   this.element.addEventListener('pointerleave',this.handleLeave=()=>{this.pointer.set(0,0);});
   this.element.addEventListener('wheel',this.handleWheel=()=>this.interact(),{passive:true});
   const gltf=await new GLTFLoader().loadAsync(new URL('../assets/models/escalade-esv.glb',import.meta.url).href);
   if(this.disposed)return;this.car=gltf.scene;
   const paints=new Set(),leathers=new Set();this.car.traverse(mesh=>{if(!mesh.isMesh)return;mesh.castShadow=!mesh.name.startsWith('Grille_Mesh');mesh.receiveShadow=true;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];for(const material of materials){if(material.name==='BodyPaint'){paints.add(material);material.metalness=.8;material.roughness=.23;}if(material.name==='Leather')leathers.add(material);}});
   this.paintMaterials=[...paints];this.leatherMaterials=[...leathers];this.scene.add(this.car);
   this.setPaint(this.paint,false);this.setInterior(this.interior,false);this.ready=true;this.onReady();this.applyTheme();this.animate();
  }catch(error){this.onError(error);this.dispose();}
 }
 resize(){if(!this.renderer)return;const w=this.element.clientWidth,h=this.element.clientHeight;if(!w||!h)return;this.camera.aspect=w/h;this.camera.fov=w<600?43:33;this.camera.setViewOffset(w,h,w<760?0:-w*.11,w<760?0:-h*.035,w,h);this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);this.composer.setSize(w,h);}
 interact(){this.lastInteraction=performance.now();if(this.controls)this.controls.autoRotate=false;this.onRotation?.(false);}
 setPaint(hex,animate=true){this.paint=hex;for(const m of this.paintMaterials){gsap.killTweensOf(m.color);const target=new THREE.Color(hex);if(animate&&!this.reduced)gsap.to(m.color,{r:target.r,g:target.g,b:target.b,duration:.5,ease:'power2.inOut'});else m.color.copy(target);}}
 setInterior(hex,animate=true){this.interior=hex;for(const m of this.leatherMaterials){gsap.killTweensOf(m.color);const target=new THREE.Color(hex);if(animate&&!this.reduced)gsap.to(m.color,{r:target.r,g:target.g,b:target.b,duration:.5});else m.color.copy(target);}}
 setView(view){if(!this.ready)return;this.car.traverse(mesh=>{if(['Roof','Sunroof','Roof_Rail'].includes(mesh.name))mesh.visible=view!=='interior';if(mesh.material?.name==='Glass')mesh.material.opacity=view==='interior'?.22:.85;});this.interact();this.rotationPaused=true;this.controls.autoRotate=false;const poses={front:{pos:[-8,2.8,6.5],target:[0,1,0]},side:{pos:[0,2.5,9.8],target:[0,1,0]},interior:{pos:[-1.7,2.7,3.4],target:[-.3,1.3,0]},reset:{pos:[-7.3,3.3,7.5],target:[0,1,0]}};const pose=poses[view]||poses.reset;gsap.killTweensOf(this.camera.position);gsap.killTweensOf(this.controls.target);const duration=this.reduced?0:1;gsap.to(this.camera.position,{x:pose.pos[0],y:pose.pos[1],z:pose.pos[2],duration,ease:'power2.inOut',onComplete:()=>{this.rotationPaused=false;this.lastInteraction=performance.now();}});gsap.to(this.controls.target,{x:pose.target[0],y:pose.target[1],z:pose.target[2],duration});}
 toggleRotation(){this.rotationPaused=!this.rotationPaused;if(!this.rotationPaused)this.lastInteraction=0;else this.controls.autoRotate=false;return!this.rotationPaused;}
 shake(strength=.018,duration=.8){if(this.reduced)return;this.shakeStrength=strength;this.shakeUntil=performance.now()+duration*1000;}
 applyTheme(){if(!this.scene)return;const light=document.documentElement.dataset.theme==='light';this.scene.background=new THREE.Color(light?0xffffff:0x1d1f29);this.floor.material.color.set(light?0xffffff:0x1d1f29);}
 animate(){if(this.disposed)return;this.raf=requestAnimationFrame(()=>this.animate());if(!this.visible||document.hidden)return;const now=performance.now();const auto=!this.reduced&&!this.rotationPaused&&now-this.lastInteraction>5000;
  if(this.controls.autoRotate!==auto){this.controls.autoRotate=auto;this.onRotation?.(auto);}
  this.camera.position.sub(this.previousOffset);this.controls.update();const shake=now<this.shakeUntil?this.shakeStrength:0;const desired=new THREE.Vector3(this.reduced?0:this.pointer.x*.035+Math.sin(now*.06)*shake,Math.sin(now*.079)*shake,0);this.previousOffset.lerp(desired,.1);this.camera.position.add(this.previousOffset);this.camera.lookAt(this.controls.target);
  if(!this.reduced)this.particles.rotation.y=this.pointer.x*.02+now*.000007;this.composer.render();
 }
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();this.intersectionObserver?.disconnect();this.element.removeEventListener('pointermove',this.handlePointer);this.element.removeEventListener('pointerleave',this.handleLeave);this.element.removeEventListener('wheel',this.handleWheel);this.controls?.dispose();this.scene?.traverse(o=>{o.geometry?.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{m?.map?.dispose();m?.dispose();});});this.envTarget?.dispose();this.composer?.dispose();this.renderer?.dispose();this.renderer?.domElement.remove();}
}
