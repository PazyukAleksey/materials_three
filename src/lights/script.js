import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5)
// directionalLight.position.set(1, 0.25, 0)
// scene.add(directionalLight)
// gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01)

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
// scene.add(hemisphereLight)
// gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01)  

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1.2)
scene.add(pointLight)   
gui.add(pointLight, 'intensity').min(0).max(1).step(0.01)
const pointLightColor = {
    color: '#ff9000'
}
gui.addColor(pointLightColor, 'color').name('lightColor').onChange(() =>
{
    pointLight.color.set(pointLightColor.color)
})
gui.add(pointLight.position, 'y').min(-3).max(3).step(0.01)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}
const pointLightParams = {
    range: 3,       // наскільки далеко світло рухається вліво/вправо
    rangeZ: 3,      // наскільки далеко світло рухається вперед/назад
    smoothing: 0.1  // плавність руху (0 - стоїть, 1 - миттєво)
}
gui.add(pointLightParams, 'range').min(0).max(5).step(0.01).name('lightRangeX')
gui.add(pointLightParams, 'rangeZ').min(0).max(5).step(0.01).name('lightRangeZ')
gui.add(pointLightParams, 'smoothing').min(0.01).max(1).step(0.01).name('lightSmoothing')

window.addEventListener('mousemove', (event) =>
{
    // Від -0.5 (лівий край) до 0.5 (правий край)
    cursor.x = event.clientX / sizes.width - 0.5
    // Від -0.5 (верх) до 0.5 (низ)
    cursor.y = event.clientY / sizes.height - 0.5
})

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
camera.lookAt(scene.position)
scene.add(camera)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update point light (по осях X і Z)
    const targetX = cursor.x * 2 * pointLightParams.range
    const targetZ = cursor.y * 2 * pointLightParams.rangeZ
    pointLight.position.x += (targetX - pointLight.position.x) * pointLightParams.smoothing
    pointLight.position.z += (targetZ - pointLight.position.z) * pointLightParams.smoothing

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()