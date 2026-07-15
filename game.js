import * as THREE from 
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// SCENE

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);


// CAMERA

const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
);


// RENDERER

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    innerWidth,
    innerHeight
);

document.body.appendChild(
    renderer.domElement
);


// LIGHT

const sun = new THREE.DirectionalLight(
    0xffffff,
    3
);

sun.position.set(5,10,5);

scene.add(sun);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        0.5
    )
);


// ISLAND

const island = new THREE.Mesh(
    new THREE.CylinderGeometry(
        15,
        18,
        2,
        32
    ),
    new THREE.MeshStandardMaterial({
        color:0x3cb043
    })
);

island.position.y=-1;

scene.add(island);


// PLAYER

const player = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        .5,
        1.5,
        8,
        16
    ),
    new THREE.MeshStandardMaterial({
        color:0x3366ff
    })
);

player.position.y=1;

scene.add(player);


// ENEMY

const enemy = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        .5,
        1.5,
        8,
        16
    ),
    new THREE.MeshStandardMaterial({
        color:0xff3333
    })
);

enemy.position.set(
    0,
    1,
    -5
);

scene.add(enemy);


// HEALTH

let enemyHP = 100;

const hpText =
document.getElementById("hp");


// CONTROLS

const keys={};

addEventListener(
"keydown",
e=>keys[e.key.toLowerCase()]=true
);

addEventListener(
"keyup",
e=>keys[e.key.toLowerCase()]=false
);


// MOVEMENT

function movePlayer(){

    const speed=0.12;


    if(keys.w)
        player.position.z-=speed;

    if(keys.s)
        player.position.z+=speed;

    if(keys.a)
        player.position.x-=speed;

    if(keys.d)
        player.position.x+=speed;

}


// CAMERA

const cameraOffset =
new THREE.Vector3(
    0,
    5,
    8
);


function updateCamera(){

    camera.position.copy(
        player.position
        .clone()
        .add(cameraOffset)
    );


    camera.lookAt(
        player.position
    );

}


// ATTACK

addEventListener(
"click",
()=>{


    const distance =
    player.position.distanceTo(
        enemy.position
    );


    if(distance < 3){

        enemyHP-=10;

        hpText.textContent =
        enemyHP;


        enemy.material.color
        .set(0xffff00);


        setTimeout(()=>{
            enemy.material.color
            .set(0xff3333);
        },100);

    }


});


// RESIZE

addEventListener(
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


// LOOP

function animate(){

requestAnimationFrame(
animate
);


movePlayer();

updateCamera();


renderer.render(
scene,
camera
);

}


animate();
