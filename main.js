import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
console.log("Modules loaded");

const velocity_default = 0.003  ;


// Constants and settings
const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

const params = {
    threshold: 0,
    strength: 1,
    radius: 0.5,
    exposure: 1
};




// CSS2DRenderer setup
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';

const sphere_positions = {
    "electronic": [-0.051, 0.178, 0.065],

};



const spheres_description = {
    "electronic": {desc : "The electronic part of the project is composed of many elements :\n\
     - an ESP32\n\
     - an amplification circuit with a speaker\n\
     - an electronical filter to capture the touch interaction with the cask\n\
     Click on the sphere to reach the github repository.",
                        link: "https://github.com/timotheepopesco"},
};

// --------01 DEFINITION DE LA SCENE-------------------

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 100);
const canvas = document.getElementById('canvas');
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const loader_texture = new THREE.TextureLoader();
const background_texture = loader_texture.load("assets/img/image.png");
background_texture.mapping = THREE.EquirectangularReflectionMapping;
background_texture.colorSpace = THREE.SRGBColorSpace;
scene.background = background_texture;

// Lumière
const lumiere = new THREE.AmbientLight(0xa3a3a3a3, 4);
scene.add(lumiere);

// Ajuster emplacement de départ de la caméra
function camStart(x, y, z) {
    camera.position.set(x, y, z);
}
camStart(-2.5,  0.5, 1);

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5,0.4, 0.85);
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        defines: {}
    }), 'baseTexture'
);
mixPass.needsSwap = true;

const outputPass = new OutputPass();
const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(mixPass);
finalComposer.addPass(outputPass);

// Bloom effect handling
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const materials = {};

function darkenNonBloomed(obj) {
    if (obj.isMesh && !obj.layers.test(bloomLayer)) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
    }
}

function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
    }
}



// Render function
function render() {
    scene.background = null;
    scene.traverse(darkenNonBloomed);

    bloomComposer.render();
    scene.background = background_texture;


    scene.traverse(restoreMaterial);
    finalComposer.render();
    labelRenderer.render(scene, camera);

}
// Spheres setup
class ClickableSphere{
    constructor(x,y,z, radius, color, name){
        this.name = name
        this.geometry = new THREE.SphereGeometry(radius, 10, 10);
        this.material = new THREE.MeshBasicMaterial({color: color,
            wireframe: true,
            opacity: 0.5,
            transparent: true});
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        this.create2DLabel();
        this.mesh.layers.enable(BLOOM_SCENE);
        console.log(this.mesh.position);
        console.log(x, y, z);

    }
    create2DLabel() {
        this.description_div = document.createElement('div');
        this.description_div.className = 'labels';
        this.description_div.innerText = spheres_description[this.name]["desc"];


    
        this.description_label = new CSS2DObject(this.description_div);
        // Set the label's position based on the sphere's coordinates
        this.description_label.position.set(0.1, 0.1, 0); // Relative to the sphere
        this.description_label.scale.set(1, 1, 1);
        // Hide the label by default
        this.description_label.element.style.visibility = "hidden";
        this.description_label.name = this.name;
        this.mesh.add(this.description_label);
    }

    onClick(){
        console.log("Clicked : " + this.name);
        // Open the link in a new tab
        let link = document.createElement('a');
        link.href = spheres_description[this.name]["link"];
        link.target = "_blank";
        link.click();

    }
    onHover(){
        console.log("Hovered : " + this.name);
        this.material.color.setHex(0x00ff00);
        this.description_label.element.style.visibility = "visible";
        // $('html,body').css('cursor', 'pointer');
        document.body.style.cursor = "pointer";
        // Add text in description box
        // let description_box = document.getElementsByClassName("description");
        // description_box[0].innerHTML = spheres_description[this.name];
    }
    defaultState(){
        this.material.color.setHex(0x99C1F1);
        this.description_label.element.style.visibility = "hidden";
        document.body.style.cursor = "default";
        // let description_box = document.getElementsByClassName("description");
        // description_box[0].innerHTML = "";
    }

}
let main_group = new THREE.Group();
let spheres_group = new THREE.Group();
main_group.add(spheres_group);



// Generate spheres
let spheres = {};
for (let key in sphere_positions){
    // Add sphere with uuid as key

    let new_sphere = new ClickableSphere(sphere_positions[key][0], sphere_positions[key][1], sphere_positions[key][2], 0.15, 0x99C1F1, key);
    spheres[key] = new_sphere;
    spheres_group.add(spheres[key].mesh);
}

let loader = new GLTFLoader();
let loaded = false;
// ----------------------START CONNERIES------------------------------------


let currentModel = "cask.glb"; // Modèle initial
let caskModel;

// Boutons
const switchModelButton = document.getElementById("switch-model-button");
const shakeButton = document.getElementById("shake-button");
let graphContainer = document.getElementById('graph-container');
let graphCanvas = document.getElementById('shock-graph');
let shockChart;

function initializeGraph() {
    const ctx = graphCanvas.getContext('2d');
    shockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 50}, (_, i) => i),
            datasets: [{
                data: Array(50).fill(0),
                borderColor: 'blue',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    display: false
                },
                x: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateGraph(isShaking = false) {
    if (!shockChart) return;

    // Générer des données aléatoires
    const newData = isShaking 
        ? Array.from({length: 50}, () => Math.random() * 0.8) 
        : Array(50).fill(0);

    shockChart.data.datasets[0].data = newData;
    shockChart.data.datasets[0].borderColor = isShaking ? 'red' : 'blue';
    
    graphContainer.style.backgroundColor = isShaking ? 'rgba(255,0,0,0.2)' : 'white';
    
    shockChart.update();
}

// Fonction pour charger un modèle
function loadModel(modelPath) {
    loader.load(
        `assets/img/${modelPath}`,
        function (gltf) {
            // Si un modèle précédent existe, le retirer
            if (caskModel) {
                main_group.remove(caskModel);
            }

            // Charger le nouveau modèle
            caskModel = gltf.scene;
            caskModel.position.set(0, 0, 0);
            caskModel.scale.set(1, 1, 1);
            caskModel.rotation.set(0, 0, 0);

            main_group.add(caskModel);
            loaded = true;

            // Mettre à jour l'interface en fonction du modèle
            updateUI();

            // Cacher le chargement
            document.getElementById("loading").style.display = "none";
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
            console.error("An error occurred while loading the model:", error);
        }
    );
}

// Fonction pour mettre à jour l'interface selon le modèle
function updateUI() {
    if (currentModel === "caskun.glb") {
        // Afficher les infobulles et les sphères
        for (let key in spheres) {
            spheres[key].description_label.element.style.visibility = "visible";
            spheres[key].mesh.visible = true;
        }
        shakeButton.style.display = "none";
        graphContainer.style.display = "none";
    } else if (currentModel === "cask.glb") {
        // Cacher les infobulles et les sphères
        for (let key in spheres) {
            spheres[key].description_label.element.style.visibility = "hidden";
            spheres[key].mesh.visible = false;
        }
        shakeButton.style.display = "block";
        graphContainer.style.display = "block";
        
        // Initialiser le graphique si ce n'est pas déjà fait
        if (!shockChart) {
            initializeGraph();
        }
        updateGraph(); // Réinitialiser le graphique
    }
}


// Charger le modèle initial
loadModel(currentModel);

// Gestion du bouton Switch Model
switchModelButton.addEventListener("click", () => {
    // Alterner entre "cask.glb" et "caskun.glb"
    currentModel = currentModel === "cask.glb" ? "caskun.glb" : "cask.glb";
    loadModel(currentModel);
});

// Gestion du bouton Shake
shakeButton.addEventListener("click", () => {
    console.log("Shake button clicked!");
    if (caskModel) {
        // Animation de secouement
        gsap.to(caskModel.position, {
            x: 0.1,
            y: 0.1,
            z: 0.1,
            yoyo: true,
            repeat: 5,
            duration: 0.1,
            onStart: () => updateGraph(true), // Mettre à jour le graphique avec des données de secousse
            onComplete: () => updateGraph(false) // Réinitialiser le graphique
        });
    }
});


// -------------------------------------END CONNERIES-------------------------------------

main_group.position.set(0, -0.5, 0);
scene.add(main_group);

let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2(2,1);
let intersected_objects = [];

function getIntersectedSphere(event){
    pointer.x  = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    intersected_objects = raycaster.intersectObjects(main_group.children, true);


    if (intersected_objects.length > 0){
        // let intersected_object = intersected_objects[0].object;
        // Get the class of the intersected object
        let intersected_object = intersected_objects[0].object;
        let clickedSphere = Object.values(spheres).find(sphere => sphere.mesh === intersected_object);
        return clickedSphere;
    }
    return false;
}

let target_velocity = velocity_default;

function pointerMove(event){
    let clickedSphere = getIntersectedSphere(event);
    if (clickedSphere){
        clickedSphere.onHover();
        target_velocity = 0;
    }else{
        // Put all spheres back to default state
        for (let key in spheres){
            spheres[key].defaultState();
            target_velocity = velocity_default;
        }
    }
        
    
    if (clickedSphere === false){
    for (let key in spheres){
        spheres[key].defaultState();
        target_velocity = velocity_default;
    }
}

}
document.addEventListener('pointermove', pointerMove);

// boolean to check if the mouse is down
let mouseDown = false;
function pointerDown(event){
    mouseDown = true;

    let clickedSphere = getIntersectedSphere(event);
    if (clickedSphere){
        clickedSphere.onClick();
    }

    
}
document.addEventListener('pointerdown', pointerDown);

function pointerUp(event){
    mouseDown = false;
}
document.addEventListener('pointerup', pointerUp);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});
let strength = 0;
let rotate = 0;
// Animation loop

document.getElementById("labels-container").appendChild(labelRenderer.domElement);


let velocity = velocity_default;


const animate = () => {
    // console.log(loaded)
    requestAnimationFrame(animate);
    if (loaded){
        const time = Date.now() * 0.1;
        // main_group.rotation.x = time;
        if (!mouseDown){
            main_group.rotation.y = rotate;
    
            velocity = THREE.MathUtils.lerp(velocity, target_velocity, 0.2);
    
            rotate += velocity;
    
        }





        strength += 0.05;
        bloomPass.strength = Math.abs(Math.sin(strength) * 0.5 +0.5);
    
        controls.update();
        render();        
    }

}


animate();
