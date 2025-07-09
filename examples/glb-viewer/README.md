# Three.js GLBビューア解説ドキュメント

このドキュメントでは、`main.ts`の3Dモデル読み込みとアニメーション機能について、Three.js初心者向けに詳しく解説します。

## 🌟 Three.jsとは？

**Three.js**は、Webブラウザで3Dグラフィックスを簡単に作成できるJavaScriptライブラリです。

### 3Dグラフィックスの基本要素
3D表示には以下の3つの要素が必要です：
1. **シーン（Scene）**: 3Dオブジェクトを配置する「舞台」
2. **カメラ（Camera）**: その舞台を「どこから見るか」を決める視点  
3. **レンダラー（Renderer）**: 3Dの世界を2Dの画面に「描画する」エンジン

これは映画撮影と同じ構造です。舞台にセットや俳優を配置し、カメラで撮影し、フィルムに記録するのと同じです。

### WebGLとThree.jsの関係
- **WebGL**: ブラウザで3D描画を行う低レベルなAPI（とても複雑）
- **Three.js**: WebGLを使いやすくしてくれるライブラリ

WebGLで立方体を一つ表示するだけでも数百行必要ですが、Three.jsなら数行で済みます。

## main.ts

```typescript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 🎬 基本セットアップ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// 🎨 レンダラー設定
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 📺 DOM連携
const container = document.getElementById('container');
if (container) {
    container.appendChild(renderer.domElement);
}

// 📷 カメラとコントロール
camera.position.set(0, 1, 3);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 💡 ライティングシステム
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 📁 3Dモデル読み込み
const loader = new GLTFLoader();
let mixer: THREE.AnimationMixer | null = null;

loader.load(
    '/models/885_sofa_1seat.glb',
    (gltf) => {
        // 成功時の処理
        const model = gltf.scene;
        scene.add(model);
        
        // 自動サイズ調整
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.sub(center);
        camera.position.set(size / 2, size / 5, size / 2);
        camera.lookAt(0, 0, 0);
        
        // アニメーション設定
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer!.clipAction(clip).play();
            });
        }
    },
    (progress) => {
        // 進行状況
        const percentage = (progress.loaded / progress.total) * 100;
        console.log(`読み込み進行状況: ${percentage.toFixed(2)}%`);
    },
    (error) => {
        // エラー処理
        console.error('GLBファイルの読み込みエラー:', error);
    }
);

// 📱 レスポンシブ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 🎞️ アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    if (mixer) {
        mixer.update(0.016);
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate();
```

## 🎬 基本セットアップの詳細解説

### 1. ライブラリのインポート
```typescript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**各ライブラリの役割**
- `THREE`: Three.jsのメインライブラリ（シーン、カメラ、レンダラーなど）
- `GLTFLoader`: 3Dモデルファイル（GLB/GLTF形式）を読み込むためのツール
- `OrbitControls`: マウスでカメラを操作するためのツール

### 2. 基本的な3要素の作成
```typescript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
```

**Scene（シーン）**
- 3Dオブジェクトを配置する空間
- 映画のセットのようなもの
- ここに追加されたオブジェクトのみが画面に表示されます

**PerspectiveCamera（透視投影カメラ）**
- 人間の目と同じような見え方をするカメラ
- 遠くのものは小さく、近くのものは大きく見えます
- 引数の意味：
  - `75`: 視野角（広角レンズか望遠レンズかを決める）
  - `window.innerWidth / window.innerHeight`: 画面の縦横比
  - `0.1`: 近クリップ面（これより近いものは見えない）
  - `1000`: 遠クリップ面（これより遠いものは見えない）

**WebGLRenderer（レンダラー）**
- 3D空間を2D画面に描画するエンジン
- `antialias: true`: 画像の縁をなめらかにする（ジャギー除去）

## 🎨 レンダラー設定の詳細解説

### 1. 画面サイズの設定
```typescript
renderer.setSize(window.innerWidth, window.innerHeight);
```

**なぜ画面サイズを設定するのか？**
- レンダラーが何ピクセルで描画するかを指定
- ブラウザのウィンドウサイズに合わせることで、全画面表示になります
- この設定なしでは、小さな描画領域しか得られません

### 2. 背景色の設定
```typescript
renderer.setClearColor(0x222222);
```

**背景色の重要性**
- `0x222222`: 16進数カラーコード（CSS の #222222 と同じ）
- 暗めのグレー色で、3Dモデルのシルエットが見やすくなります
- 明るすぎる背景は目が疲れやすく、暗すぎると詳細が見えにくくなります

### 3. 色空間の設定
```typescript
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

**色空間とは？**
- 色の表現方法の規格
- sRGB: 現代のモニターで標準的に使われる色空間
- この設定により、デザイナーが意図した色合いが正確に表示されます

## 📺 DOM連携の仕組み

### 1. HTML要素への追加
```typescript
const container = document.getElementById('container');
if (container) {
    container.appendChild(renderer.domElement);
}
```

**renderer.domElementとは？**
- レンダラーが内部で作成するcanvas要素
- Three.jsはこのcanvas上に3D映像を描画します
- HTML上の指定した場所に配置することで、Webページに3D表示が可能になります

**なぜif文でチェックするのか？**
- HTML側で'container'というIDの要素が存在しない場合のエラーを防ぐため
- 安全なコーディングの基本です

## 📷 カメラとコントロールの詳細解説

### 1. カメラの初期位置
```typescript
camera.position.set(0, 1, 3);
```

**3D座標系の理解**
- **X軸**: 左右（右がプラス）
- **Y軸**: 上下（上がプラス）  
- **Z軸**: 奥行き（手前がプラス）
- `(0, 1, 3)`: 中央、やや上、手前から見る位置

### 2. マウス操作の設定
```typescript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

**OrbitControlsとは？**
- マウスで3Dオブジェクトを自由に回転・拡大・移動できるツール
- 左クリック + ドラッグ: 回転
- 右クリック + ドラッグ: 移動
- マウスホイール: 拡大・縮小

**Damping（減衰）の効果**
- マウス操作に慣性を加える機能
- 急な動きを滑らかにし、より自然な操作感を実現
- `dampingFactor: 0.05`: 適度な滑らかさの設定

## 💡 ライティングシステムの基礎

### 1. 環境光（AmbientLight）
```typescript
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);
```

**環境光とは？**
- 全体を均等に照らす基本的な明るさ
- 影のない、やわらかい光
- `0x404040`: 暗めのグレー（強すぎると立体感がなくなる）
- `0.6`: 光の強さ（0～1の間で設定）

### 2. 指向性ライト（DirectionalLight）
```typescript
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
```

**指向性ライトとは？**
- 太陽のように一方向から照らす光
- はっきりとした影を作り、立体感を演出
- `0xffffff`: 白色の光
- `0.8`: やや強めの光の強さ
- `position.set(1, 1, 1)`: 右上手前から照らす

**なぜ2種類の光が必要なのか？**
- 環境光のみ: 影がなく、のっぺりした見た目
- 指向性ライトのみ: 影が濃すぎて暗い部分が見えない
- 両方組み合わせることで、自然で美しい照明効果を得られます

## 📁 GLTFLoader詳細解説

### 1. GLTFLoaderの初期化
```typescript
const loader = new GLTFLoader();
```

**GLTFとは？**
- Graphics Language Transmission Format の略
- Khronos Groupが開発した3Dシーンとモデルの標準形式
- `.gltf`（JSON + 外部ファイル）と `.glb`（バイナリ形式）の2つの形式があります

**なぜGLTFなのか？**
- Web向けに最適化された軽量形式
- アニメーション、マテリアル、テクスチャを一つのファイルに含められる
- Three.jsでの読み込みが高速で安定している

### 2. 非同期読み込みの仕組み
```typescript
loader.load(
    '/models/arm_light.glb',  // ファイルパス
    (gltf) => { /* 成功 */ },
    (progress) => { /* 進行状況 */ },
    (error) => { /* エラー */ }
);
```

**コールバック関数パターン**
- **成功コールバック**: ファイル読み込み完了時に実行
- **進行状況コールバック**: 読み込み進行度を監視
- **エラーコールバック**: 読み込み失敗時の処理

**非同期処理の利点**
- ファイル読み込み中もUIがブロックされない
- 大きなファイルでも段階的に処理できる
- ユーザーに適切なフィードバックを提供できる

## 📐 自動サイズ調整システム

### 1. バウンディングボックスの計算
```typescript
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3()).length();
const center = box.getCenter(new THREE.Vector3());
```

**Box3クラスの役割**
- `Box3`: 3D空間での立方体領域を表現するクラス
- `setFromObject(model)`: モデル全体を囲む最小の箱を計算
- オブジェクトのすべての頂点を調べて境界を決定します

**サイズと中心の取得**
- `getSize()`: 箱の縦・横・奥行きのサイズを取得
- `length()`: 対角線の長さを計算（モデルの「大きさ」の指標）
- `getCenter()`: 箱の中心点を計算

### 2. モデルの中央配置
```typescript
model.position.sub(center);
```

**position.sub()の仕組み**
- `sub()`: ベクトルの減算を行うメソッド
- モデルの現在位置から中心点を引くことで、原点(0,0,0)中心に配置
- どんな位置にあるモデルでも画面中央に表示されます

### 3. カメラ位置の動的調整
```typescript
camera.position.set(size / 2, size / 5, size / 2);
camera.lookAt(0, 0, 0);
```

**サイズに基づく配置**
- `size / 2`: モデルサイズの半分の距離に配置
- `size / 5`: やや上から見下ろす角度
- どんなサイズのモデルでも適切な距離で表示されます

**lookAt()の重要性**
- カメラが原点(0,0,0)を向くように調整
- モデルが画面中央に来るように視線を設定

## 🎭 アニメーションシステム詳細

### 1. AnimationMixerの初期化
```typescript
if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        mixer!.clipAction(clip).play();
    });
}
```

**AnimationMixerとは？**
- 複数のアニメーションを同時に管理するシステム
- アニメーションの再生、停止、ブレンドを制御
- Blenderなどで作成したアニメーションを再生できます

**AnimationClipの概念**
- 一つの動作（歩く、回転する等）を表現するデータ
- キーフレームベースのアニメーション情報
- 複数のクリップを組み合わせて複雑な動作を作成可能

### 2. アニメーションの更新
```typescript
function animate() {
    requestAnimationFrame(animate);
    
    if (mixer) {
        mixer.update(0.016);  // 60FPS想定
    }
    
    controls.update();
    renderer.render(scene, camera);
}
```

**0.016の意味**
- 1フレームの時間（1/60秒 ≈ 0.016秒）
- 60FPSでアニメーションが滑らかに再生されます
- この値を変更することでアニメーション速度を調整可能

**更新の順序**
1. アニメーションの更新（mixer.update）
2. カメラコントロールの更新（controls.update）
3. 画面への描画（renderer.render）

## 🎨 高度なレンダリング設定

### 1. アンチエイリアス
```typescript
const renderer = new THREE.WebGLRenderer({ antialias: true });
```

**アンチエイリアスとは？**
- 画像の縁のギザギザ（ジャギー）を滑らかにする技術
- より美しい3D描画を実現
- パフォーマンスと品質のトレードオフがあります

### 2. 色空間の設定
```typescript
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

**sRGB色空間の利点**
- モニターでの色再現がより正確
- 現代のWebブラウザとの互換性が良好
- デザイナーが意図した色合いを正確に表示

### 3. 背景色の設定
```typescript
renderer.setClearColor(0x222222);
```

**暗めの背景を選ぶ理由**
- 3Dモデルのシルエットが見やすくなる
- 目に優しく、長時間の作業に適している
- プロフェッショナルな印象を与える

## 🕹️ OrbitControls詳細

### 1. Dampingシステム
```typescript
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

**Dampingとは？**
- マウス操作を滑らかに減衰させる機能
- リアルな慣性を再現
- 急激な動きを抑制し、使いやすさを向上

**dampingFactorの調整**
- 0.05: 適度な滑らかさ
- 値を小さくすると、より滑らかに
- 値を大きくすると、よりダイレクトに

### 2. コントロールの更新
```typescript
controls.update();
```

**毎フレーム更新の必要性**
- マウス入力の変化を反映
- Dampingエフェクトの計算
- カメラ位置の自動調整

## 📱 レスポンシブ対応の詳細

### 1. リサイズイベントの処理
```typescript
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**アスペクト比の重要性**
- `camera.aspect`: カメラの縦横比を更新
- ウィンドウサイズ変更時に歪みを防止
- モバイルデバイスでの表示も適切に

**updateProjectionMatrix()の役割**
- カメラ設定の変更をGPUに反映
- この呼び出しを忘れると変更が適用されません
- レンダリングパフォーマンスを最適化

## 🔍 エラーハンドリングとデバッグ

### 1. 進行状況の監視
```typescript
(progress) => {
    const percentage = (progress.loaded / progress.total) * 100;
    console.log(`読み込み進行状況: ${percentage.toFixed(2)}%`);
}
```

**progress オブジェクトの構造**
- `loaded`: 既に読み込まれたバイト数
- `total`: ファイルの総バイト数
- ローディングバーの実装に活用可能

### 2. エラーハンドリング
```typescript
(error) => {
    console.error('GLBファイルの読み込みエラー:', error);
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.innerHTML = 'エラー: GLBファイルが見つかりません';
        loadingElement.style.color = '#ff6b6b';
    }
}
```

**一般的なエラーの原因**
- ファイルパスの間違い
- ファイル形式の不適合
- ネットワーク接続の問題
- サーバーのCORS設定

## 🎯 初心者がつまずきやすいポイント

### 1. ファイルパスの問題
```typescript
loader.load('/models/arm_light.glb', ...);
```

**正しいパス設定**
- publicフォルダ基準の絶対パス
- 相対パス（`./models/arm_light.glb`）も使用可能
- サーバー環境での動作確認が重要

### 2. アニメーションが動かない場合
- `mixer.update()` の呼び忘れ
- アニメーションクリップが存在しない
- `requestAnimationFrame` ループが停止している

### 3. モデルが表示されない場合
- ファイル読み込みエラー
- カメラ位置が不適切
- ライティングが不十分
- `scene.add(model)` の呼び忘れ

## 🚀 次のステップと応用

### 1. モデルの改造
- 異なるGLBファイルの読み込み
- マテリアルの動的変更
- テクスチャの追加

### 2. アニメーション制御
- 特定のアニメーションの再生/停止
- アニメーション速度の調整
- 複数アニメーションのブレンド

### 3. インタラクション追加
- マウスクリックでのオブジェクト選択
- オブジェクトの動的移動
- UI要素との連携

### 4. パフォーマンス最適化
- LOD（Level of Detail）の実装
- インスタンシングによる最適化
- 適切なライティング設定

### 5. 高度な機能
- シャドウマッピング
- ポストプロセシング効果
- 物理演算の追加

## 📚 学習リソース

### 公式ドキュメント
- [Three.js 公式ドキュメント](https://threejs.org/docs/)
- [Three.js 例とサンプル](https://threejs.org/examples/)

### 3Dモデル作成
- [Blender](https://www.blender.org/) - 無料の3Dソフトウェア
- [Sketchfab](https://sketchfab.com/) - 3Dモデル共有サイト

### TypeScript
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Three.js + TypeScript の型定義](https://www.npmjs.com/package/@types/three)

---

*このドキュメントが、あなたの3Dモデルビューア開発の助けになれば幸いです！*
