import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 🎬 シーン準備
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2c3e50)  // 濃い青

// 📷 カメラ設定
const camera = new THREE.PerspectiveCamera(
    75,                                    // 視野角
    window.innerWidth / window.innerHeight, // アスペクト比
    0.1,                                   // near
    1000                                   // far
)
camera.position.set(5, 5, 5)  // カメラ位置

// 🎨 レンダラー設定
const canvas = document.getElementById('myCanvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

// 🕹️ マウス操作
const controls = new OrbitControls(camera, renderer.domElement)

// 💡 光源追加
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)  // 環境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)  // 太陽光
directionalLight.position.set(10, 10, 5)
scene.add(ambientLight, directionalLight)

// 📦 立方体作成
const geometry = new THREE.BoxGeometry(1, 1, 1)  // 1x1x1の立方体
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })  // 緑色
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 🌍 地面作成
const planeGeometry = new THREE.PlaneGeometry(10, 10)  // 10x10の平面
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 })  // 灰色
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2  // 90度回転（水平にする）
plane.position.y = -1            // 少し下に配置
scene.add(plane)

// 🎞️ アニメーションループ
function animate() {
    requestAnimationFrame(animate)
    
    // 立方体を回転させる
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    
    controls.update()
    renderer.render(scene, camera)
}

// 🚀 開始！
animate()
