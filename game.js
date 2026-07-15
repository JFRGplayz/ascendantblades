import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ===============================
// SCENE SETUP
// ===============================


const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x75c9ff);


scene.fog =
new THREE.Fog(
0x75c9ff,
30,
150
);




// CAMERA

const camera =
new THREE.PerspectiveCamera(
70,
innerWidth / innerHeight,
0.1,
1000
);




// RENDERER

const renderer =
new THREE.WebGLRenderer({
antialias:true
});


renderer.setSize(
innerWidth,
innerHeight
);


renderer.shadowMap.enabled = true;


document.body.appendChild(
renderer.domElement
);




// ===============================
// LIGHTING
// ===============================


const sun =
new THREE.DirectionalLight(
0xffffff,
2
);


sun.position.set(
30,
50,
20
);


sun.castShadow=true;


scene.add(
sun
);



scene.add(
new THREE.AmbientLight(
0xffffff,
0.5
)
);





// ===============================
// OCEAN
// ===============================


const ocean =
new THREE.Mesh(

new THREE.PlaneGeometry(
500,
500
),

new THREE.MeshStandardMaterial({

color:0x1685c7,

roughness:0.3

})

);



ocean.rotation.x =
-Math.PI/2;


ocean.position.y=-2;


scene.add(
ocean
);





// ===============================
// ISLAND
// ===============================


const island =
new THREE.Mesh(

new THREE.CylinderGeometry(
18,
24,
5,
64
),

new THREE.MeshStandardMaterial({

color:0x4caf50,

roughness:1

})

);



island.position.y=-1;


island.receiveShadow=true;


scene.add(
island
);





// ===============================
// ENVIRONMENT
// ===============================



function createTree(x,z){


const trunk =
new THREE.Mesh(

new THREE.CylinderGeometry(
0.3,
0.5,
3,
8
),

new THREE.MeshStandardMaterial({
color:0x8b4513
})

);


trunk.position.set(
x,
1.5,
z
);



const leaves =
new THREE.Mesh(

new THREE.SphereGeometry(
1.8,
12,
12
),

new THREE.MeshStandardMaterial({
color:0x228b22
})

);



leaves.position.set(
x,
4,
z
);



scene.add(trunk);
scene.add(leaves);


}




function createRock(x,z){


const rock =
new THREE.Mesh(

new THREE.DodecahedronGeometry(
1.2
),

new THREE.MeshStandardMaterial({
color:0x777777
})

);



rock.position.set(
x,
0,
z
);


scene.add(rock);


}





for(let i=0;i<15;i++){


let angle =
Math.random()*Math.PI*2;


let radius =
8+Math.random()*8;


createTree(

Math.cos(angle)*radius,

Math.sin(angle)*radius

);



}



for(let i=0;i<8;i++){


createRock(

Math.random()*20-10,

Math.random()*20-10

);

}





// ===============================
// PLAYER
// ===============================


class Player{


constructor(){



this.mesh =
new THREE.Mesh(

new THREE.CapsuleGeometry(
0.6,
1.5,
8,
16
),

new THREE.MeshStandardMaterial({

color:0x2266ff

})

);



this.mesh.position.set(
0,
2,
0
);



scene.add(
this.mesh
);



this.health=100;


this.maxHealth=100;


this.strength=10;


this.defense=0;


this.coins=0;



this.realm=1;



this.blade={

name:"Fists",

rarity:"Common",

damage:10

};



this.shield=null;



}



getDamage(){


return this.strength+
this.blade.damage;


}


takeDamage(amount){


let damage =
Math.max(
1,
amount-this.defense
);


this.health-=damage;


}





}


const player =
new Player();





// ===============================
// CONTROLS
// ===============================


const keys={};



window.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()]=true;

}
);



window.addEventListener(
"keyup",
e=>{

keys[e.key.toLowerCase()]=false;

}
);





function updatePlayer(){


let speed=0.15;



if(keys.w)
player.mesh.position.z-=speed;


if(keys.s)
player.mesh.position.z+=speed;


if(keys.a)
player.mesh.position.x-=speed;


if(keys.d)
player.mesh.position.x+=speed;



}






// ===============================
// THIRD PERSON CAMERA
// ===============================


const cameraOffset =
new THREE.Vector3(
0,
6,
10
);



function updateCamera(){



camera.position.copy(

player.mesh.position
.clone()
.add(cameraOffset)

);



camera.lookAt(
player.mesh.position
);


}







// ===============================
// UI UPDATE
// ===============================



function updateUI(){


document
.getElementById("health")
.textContent =
Math.max(
0,
Math.floor(player.health)
);



document
.getElementById("strength")
.textContent =
player.strength;



document
.getElementById("defense")
.textContent =
player.defense;



document
.getElementById("coins")
.textContent =
player.coins;



}






// ===============================
// RESIZE
// ===============================


window.addEventListener(
"resize",
()=>{


camera.aspect =
innerWidth/innerHeight;


camera.updateProjectionMatrix();



renderer.setSize(
innerWidth,
innerHeight
);



});

// ===============================
// ITEMS
// ===============================


const rarities = {


Common:{
multiplier:1,
chance:60
},


Uncommon:{
multiplier:1.5,
chance:25
},


Rare:{
multiplier:2.2,
chance:10
},


Epic:{
multiplier:3.5,
chance:4
},


Legendary:{
multiplier:6,
chance:1
}


};





const blades = [


{
name:"Stick",
rarity:"Common",
realm:1,
power:5
},


{
name:"Orc Sword",
rarity:"Uncommon",
realm:1,
power:15
},


{
name:"Spiked Blade",
rarity:"Rare",
realm:1,
power:35
},


{
name:"King's Sword",
rarity:"Epic",
realm:1,
power:80
},



{
name:"Flame Edge",
rarity:"Common",
realm:2,
power:60
},


{
name:"Molten Blade",
rarity:"Uncommon",
realm:2,
power:90
}


];





const shields=[


{
name:"Wood Shield",
rarity:"Common",
realm:1,
defense:5
},


{
name:"Orc Shield",
rarity:"Uncommon",
realm:1,
defense:20
},


{
name:"Royal Shield",
rarity:"Epic",
realm:1,
defense:50
}


];






function randomRarity(){


let roll =
Math.random()*100;


let total=0;


for(let rarity in rarities){


total+=
rarities[rarity].chance;


if(roll<=total)
return rarity;


}


return "Common";


}





function giveLoot(){



let rarity =
randomRarity();



let possible =
blades.filter(
b =>
b.realm <= player.realm
&&
b.rarity===rarity
);



if(possible.length===0)
return;



let item =
possible[
Math.floor(
Math.random()*possible.length
)
];



if(item.power >
player.blade.damage){


player.blade=item;


showPopup(
"⚔ "+item.name+
" ["+item.rarity+"]"
);


}



}







// ===============================
// ENEMIES
// ===============================


let enemies=[];



class Enemy{


constructor(
name,
x,
z,
health,
damage
){



this.name=name;


this.maxHealth=health;


this.health=health;


this.damage=damage;



this.mesh =
new THREE.Mesh(

new THREE.CapsuleGeometry(
0.7,
1.3,
8,
16
),

new THREE.MeshStandardMaterial({

color:0xff3333

})

);



this.mesh.position.set(
x,
2,
z
);



scene.add(
this.mesh
);



this.attackTimer=0;



// HEALTH BAR


this.bar =
document.createElement(
"div"
);


this.bar.className=
"enemy-bar";



this.fill =
document.createElement(
"div"
);


this.fill.className=
"enemy-health";



this.bar.appendChild(
this.fill
);



document
.getElementById(
"enemy-bars"
)
.appendChild(
this.bar
);



enemies.push(this);



}



update(){



let distance =
this.mesh.position.distanceTo(
player.mesh.position
);




// FOLLOW PLAYER


if(distance<20){


let direction =
new THREE.Vector3()
.subVectors(
player.mesh.position,
this.mesh.position
)
.normalize();



this.mesh.position.add(

direction.multiplyScalar(
0.04
)

);



}




// ATTACK


if(distance<3){



if(
Date.now()-this.attackTimer>1000
){


this.attackTimer=
Date.now();



player.takeDamage(
this.damage
);


}


}





this.updateBar();




if(this.health<=0){

this.destroy();

}



}




updateBar(){


let pos =
this.mesh.position.clone();


pos.y+=3;


pos.project(camera);



this.bar.style.left =

(
(pos.x*.5+.5)
*
innerWidth
)
+"px";



this.bar.style.top =

(
(-pos.y*.5+.5)
*
innerHeight
)
+"px";



this.fill.style.width =

(
this.health/
this.maxHealth
*
100
)

+"%";



}







takeDamage(amount){


this.health-=amount;



showDamage(
amount,
this.mesh.position
);


}





destroy(){



scene.remove(
this.mesh
);


this.bar.remove();



enemies.splice(
enemies.indexOf(this),
1
);



player.coins+=10;



giveLoot();



}



}






// SPAWN ENEMIES


new Enemy(
"Goblin",
5,
-8,
50,
5
);



new Enemy(
"Orc",
-7,
-10,
100,
10
);





// ===============================
// COMBAT
// ===============================



let attackCooldown=0;



function combat(){


let closest=null;

let distance=Infinity;



for(let enemy of enemies){


let d =
enemy.mesh.position.distanceTo(
player.mesh.position
);



if(d<distance){

distance=d;

closest=enemy;

}


}



if(
closest &&
distance<4
&&
Date.now()-attackCooldown>800
){



attackCooldown=
Date.now();



closest.takeDamage(
player.getDamage()
);



}

}




// ===============================
// DAMAGE NUMBERS
// ===============================



function showDamage(
amount,
position
){


let text =
document.createElement(
"div"
);


text.className=
"damage-number";


text.textContent=
"-"+amount;



document.body.appendChild(
text
);



let pos =
position.clone();


pos.project(camera);



text.style.left=
(
(pos.x*.5+.5)
*
innerWidth
)
+"px";



text.style.top=
(
(-pos.y*.5+.5)
*
innerHeight
)
+"px";



setTimeout(
()=>text.remove(),
800
);



}






// ===============================
// POPUPS
// ===============================



function showPopup(message){


let popup =
document.createElement(
"div"
);


popup.className=
"item-popup";


popup.textContent=
message;



document.body.appendChild(
popup
);



setTimeout(
()=>popup.remove(),
2000
);



}






// ===============================
// GAME LOOP
// ===============================


function animate(){


requestAnimationFrame(
animate
);



updatePlayer();


updateCamera();


combat();



for(
let enemy of [...enemies]
){

enemy.update();

}



updateUI();



renderer.render(
scene,
camera
);



}



animate();
