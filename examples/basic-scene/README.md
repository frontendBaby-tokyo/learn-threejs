# Three.js 基本シーン解説ドキュメント

このドキュメントでは、`main.js`の光源追加以降の処理について、初心者向けに詳しく解説します。

## main.js

```javascript
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
```

## 📦 立方体作成の詳細解説

### 1. ジオメトリの作成
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1)  // 1x1x1の立方体
```

**ジオメトリとは？**
- ジオメトリは3Dオブジェクトの「形」を定義します
- `BoxGeometry`は立方体の形を作るためのクラスです
- 引数の`(1, 1, 1)`は幅、高さ、奥行きを表します
- Three.jsの世界では1単位 = 約1メートルとして考えるのが一般的です

**なぜこのサイズなのか？**
- 1x1x1という小さめのサイズにすることで、画面上で見やすくなります
- カメラから適度な距離に配置されているため、このサイズが最適です

### 2. マテリアルの作成
```javascript
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })  // 緑色
```

**マテリアルとは？**
- マテリアルは3Dオブジェクトの「見た目」を定義します
- 色、質感、光の反射の仕方などを決めます

**MeshLambertMaterialの特徴**
- 光源からの影響を受けるマテリアルです
- リアルな陰影表現ができます
- `color: 0x00ff00`は16進数カラーコードで緑色を表します
  - `0x`は16進数を表す接頭辞
  - `00ff00`は赤=00、緑=ff（最大値）、青=00を意味します

### 3. メッシュの作成とシーンへの追加
```javascript
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

**メッシュとは？**
- メッシュ = ジオメトリ（形） + マテリアル（見た目）
- 実際に画面に表示される3Dオブジェクトです

**scene.add()の役割**
- 作成したオブジェクトをシーンに追加します
- シーンに追加されていないオブジェクトは画面に表示されません

## 🌍 地面作成の詳細解説

### 1. 平面ジオメトリの作成
```javascript
const planeGeometry = new THREE.PlaneGeometry(10, 10)  // 10x10の平面
```

**PlaneGeometryとは？**
- 平面（四角形）の形を作るジオメトリです
- 引数の`(10, 10)`は幅と高さを表します
- 立方体より大きくすることで、地面らしい広がりを表現します

### 2. 地面用マテリアルの作成
```javascript
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 })  // 灰色
```

**なぜ灰色なのか？**
- `0x808080`は中間的な灰色です
- 地面らしい落ち着いた色合いを表現しています
- 緑の立方体との色のコントラストも良好です

### 3. 地面の配置と回転
```javascript
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2  // 90度回転（水平にする）
plane.position.y = -1            // 少し下に配置
scene.add(plane)
```

**回転の仕組み**
- `plane.rotation.x = -Math.PI / 2`
- `Math.PI`は円周率π（約3.14159）
- `Math.PI / 2`は90度を表します（ラジアン単位）
- マイナス符号により、X軸周りに-90度回転します

**なぜ回転が必要なのか？**
- PlaneGeometryは初期状態では縦に立っています
- X軸周りに-90度回転させることで水平（地面のような状態）にします

**位置の調整**
- `plane.position.y = -1`
- Y座標を-1にすることで、立方体の下に配置します
- 立方体は原点(0,0,0)にあるので、地面を下に配置することで立体感が生まれます

## 🎞️ アニメーションループの詳細解説

### 1. アニメーション関数の定義
```javascript
function animate() {
    requestAnimationFrame(animate)
    
    // 立方体を回転させる
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    
    controls.update()
    renderer.render(scene, camera)
}
```

### 2. requestAnimationFrameの仕組み
```javascript
requestAnimationFrame(animate)
```

**requestAnimationFrameとは？**
- ブラウザが画面を更新するタイミングに合わせて関数を実行します
- 通常は1秒間に60回実行されます（60fps）
- 自分自身を再帰的に呼び出すことで無限ループを作ります

**なぜsetIntervalではダメなのか？**
- `setInterval`は固定間隔で実行されるため、ブラウザの描画タイミングとずれる可能性があります
- `requestAnimationFrame`はブラウザの最適化機能を活用できます
- タブが非アクティブな時は自動的に停止し、パフォーマンスが向上します

### 3. オブジェクトの回転
```javascript
cube.rotation.x += 0.01
cube.rotation.y += 0.01
```

**回転の仕組み**
- `rotation.x`はX軸周りの回転角度（ラジアン単位）
- `rotation.y`はY軸周りの回転角度（ラジアン単位）
- `+= 0.01`により、毎フレーム0.01ラジアン回転します

**回転速度の計算**
- 0.01ラジアン ≈ 0.57度
- 60fps × 0.57度 ≈ 34.2度/秒
- 1回転（360度）するのに約10.5秒かかります

### 4. コントロールの更新
```javascript
controls.update()
```

**なぜupdateが必要なのか？**
- OrbitControlsは内部状態を持っています
- マウス操作による変更を反映するために`update()`を呼ぶ必要があります
- 毎フレーム呼ぶことで、滑らかなマウス操作が可能になります

### 5. 画面への描画
```javascript
renderer.render(scene, camera)
```

**renderメソッドの役割**
- シーン内のすべてのオブジェクトを計算します
- カメラの視点から見た映像を生成します
- 生成された映像をCanvasに描画します

**毎フレーム呼ぶ理由**
- オブジェクトの位置や回転が変わるたびに再描画が必要です
- 静止画ではなく動画として表示するためです

### 6. アニメーション開始
```javascript
animate()
```

**最初の呼び出し**
- この1行でアニメーションが開始されます
- 以降は`requestAnimationFrame`による自動的な再帰呼び出しが続きます

## 📐 座標系とポジショニングの理解

### Three.jsの座標系
- **X軸**: 左右方向（右がプラス）
- **Y軸**: 上下方向（上がプラス）
- **Z軸**: 奥行き方向（手前がプラス）

### オブジェクトの初期位置
- **立方体**: 原点(0, 0, 0)に配置
- **地面**: (0, -1, 0)に配置（立方体の下）
- **カメラ**: (5, 5, 5)に配置（斜め上から見下ろす）

### 回転の単位（ラジアン）
- 0 ラジアン = 0度
- π/2 ラジアン = 90度
- π ラジアン = 180度
- 2π ラジアン = 360度

## 🎯 初心者がつまずきやすいポイント

### 1. なぜオブジェクトが見えないのか？
- シーンに追加し忘れ（`scene.add()`）
- カメラの視野外に配置
- マテリアルが透明または黒色
- 光源が不適切

### 2. 回転や移動が反映されないとき
- `renderer.render()`を呼び忘れ
- アニメーションループが動いていない
- 値の変更がアニメーション関数外で行われている

### 3. パフォーマンスの問題
- 複雑すぎるジオメトリ
- 過度なアニメーション処理
- 不要なオブジェクトがシーンに残っている

## 🚀 次のステップ

このコードを理解したら、以下の改造に挑戦してみましょう：

1. 立方体の色を変更する
2. 複数の立方体を配置する
3. 異なる形状（球体、円柱など）を追加する
4. 回転速度を変更する
5. 立方体を上下に移動させる
6. 異なる種類のマテリアルを試す

Three.jsの世界は奥が深いですが、この基本を理解すれば様々な3D表現が可能になります！
