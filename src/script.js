import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Gui from 'lil-gui' 

const gui = new Gui() 

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textqures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg') 
const matcapTexture3 = textureLoader.load('/textures/matcaps/6.png')
matcapTexture3.colorSpace = THREE.SRGBColorSpace

/**
 * Environment map (HDR)
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
})

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace


// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

/**
 * objects
 */
//MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// // material.color = new THREE.Color(0xff0000)
// // material.wireframe = true
// // material.transparent = true
// // material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture3 })
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
// material.map = doorColorTexture     

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    matcapMaterial
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5

scene.add(sphere, cube, torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)

/**
 * Debug GUI
 */
const lightsFolder = gui.addFolder('Lights')

const ambientFolder = lightsFolder.addFolder('Ambient light')
ambientFolder.add(ambientLight, 'visible').name('enabled')
ambientFolder.add(ambientLight, 'intensity').min(0).max(3).step(0.01)
ambientFolder.addColor(ambientLight, 'color')
ambientFolder.close()

const pointFolder = lightsFolder.addFolder('Point light')
pointFolder.add(pointLight, 'visible').name('enabled')
pointFolder.add(pointLight, 'intensity').min(0).max(200).step(0.1)
pointFolder.addColor(pointLight, 'color')
pointFolder.add(pointLight, 'distance').min(0).max(50).step(0.1)
pointFolder.add(pointLight, 'decay').min(0).max(5).step(0.01)
pointFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.01)
pointFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.01)
pointFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.01)
pointFolder.add(pointLightHelper, 'visible').name('helper')
pointFolder.close()

const envFolder = gui.addFolder('Environment')
envFolder.add(scene, 'environmentIntensity').min(0).max(3).step(0.01)
envFolder.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.01)
envFolder.add(scene, 'backgroundIntensity').min(0).max(3).step(0.01)
envFolder.close()

const materialFolder = gui.addFolder('Standard material')
materialFolder.add(material, 'metalness').min(0).max(1).step(0.001)
materialFolder.add(material, 'roughness').min(0).max(1).step(0.001)
materialFolder.close()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()