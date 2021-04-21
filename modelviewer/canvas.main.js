
const rendererobject = {
    antialias: true,
    alpha: true
}
const cameraobj = {
    fov: 75,
    width: 800,
    height: 600,
    closest: 0.1,
    renderDistance: 100,
    zoom: 0.2
}
const scene = new THREE.Scene()
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1.4 );

scene.add(light)

const camera = new THREE.PerspectiveCamera(
    cameraobj.fov,
    cameraobj.width / cameraobj.height,
    cameraobj.closest,
    cameraobj.renderDistance
)
camera.position.set(0,0,4)
camera.rotation.order = 'YXZ'
camera.rotation.set(0, 0, 0)
camera.updateProjectionMatrix()

const renderer = new THREE.WebGLRenderer(rendererobject)
renderer.setSize(cameraobj.width, cameraobj.height)
renderer.setClearAlpha(0)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.getElementById('app').appendChild(renderer.domElement)


let ismousepressed = false
const mouse = {
    x: 0,
    y: 0
}
const mousecurrentRotation = {
    x: 0,
    y: 0
}

const GLTFoader = new THREE.GLTFLoader()

let orbitctrl = new THREE.OrbitControls(camera, renderer.domElement)
orbitctrl.update()
const clock = new THREE.Clock()

let selectedmesh = null

const renderscene = () => {
    renderer.render(scene, camera)
    orbitctrl.update()
    if(selectedmesh)
        selectedmesh.update(clock.getDelta())

    window.requestAnimationFrame(renderscene)
}

renderscene()

class MeshObject {
    constructor(mesh, animations) {
        this.mesh = mesh
        this.mixer = new THREE.AnimationMixer(mesh)
        this.animations = animations
    }
    update(deltatime) {
        this.mixer.update(deltatime)
    }
    startAnimation(index) {
        this.mixer.stopAllAction()
        let clip = this.mixer.clipAction(this.animations[index])
        clip.play()
    }
}
const selectMesh = filename => {
    while(scene.children.length > 1) {
        scene.children.splice(1, 1)
    }

    GLTFoader.load("./premodels/"+filename, gltf => {
        let obj = gltf.scene.children[0]
        obj.rotation.order = 'YXZ'
        obj.position.set(0, -obj.scale.y/2, 0)
        camera.position.set(0,0,obj.scale.y*4)
        camera.rotation.set(0, 0, 0)
        let animations = gltf.animations
        scene.add(obj)
        selectedmesh = new MeshObject(obj, animations)
        const abox = document.getElementById('animations');
        while(abox.firstChild)
            abox.removeChild(abox.firstChild)
        for(let i = 0; i < selectedmesh.animations.length; i++) {
            let anim = selectedmesh.animations[i]
            let abtn = document.createElement('button')
            abtn.innerText = anim.name
            abtn.addEventListener('click', () => {
                selectedmesh.startAnimation(i)
            })
            abox.appendChild(abtn)
        }
    })
}

