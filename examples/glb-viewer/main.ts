import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// シーン、カメラ、レンダラーの初期化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// レンダラーの設定
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// コンテナに追加
const container = document.getElementById('container');
if (container) {
    container.appendChild(renderer.domElement);
}

// カメラの初期位置
camera.position.set(0, 1, 3);

// OrbitControls（マウス操作）
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ライティング
const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // 環境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// GLBファイルを読み込み
const loader = new GLTFLoader();
let mixer: THREE.AnimationMixer | null = null;

loader.load(
    '/models/885_sofa_1seat.glb', // GLBファイルのパス（public/modelsフォルダに配置）
    (gltf) => {
        console.log('GLBファイルの読み込み完了:', gltf);
        
        const model = gltf.scene;
        scene.add(model);

        // モデルのサイズを取得して調整
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        // モデルを中央に配置
        model.position.sub(center);

        // カメラの位置を調整
        camera.position.set(size / 2, size / 5, size / 2);
        camera.lookAt(0, 0, 0);

        // OrbitControlsのターゲットを設定
        controls.target.set(0, 0, 0);
        controls.update();

        // アニメーションがある場合は再生
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer!.clipAction(clip).play();
            });
        }

        // 読み込み完了メッセージを非表示
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    },
    (progress) => {
        // 読み込み進行状況
        const percentage = (progress.loaded / progress.total) * 100;
        console.log(`読み込み進行状況: ${percentage.toFixed(2)}%`);
    },
    (error) => {
        // 読み込みエラー
        console.error('GLBファイルの読み込みエラー:', error);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = 'エラー: GLBファイルが見つかりません';
            loadingElement.style.color = '#ff6b6b';
        }
    }
);

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    // アニメーションの更新
    if (mixer) {
        mixer.update(0.016); // 60FPS想定
    }
    
    // OrbitControlsの更新
    controls.update();
    
    // レンダリング
    renderer.render(scene, camera);
}

// アニメーション開始
animate();
