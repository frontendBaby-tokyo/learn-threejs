# Three.js main.ts 解説ガイド
## 初心者とベテランの対話で学ぶ 3D Web グラフィックス

---

## 登場人物
- **田中さん（新人エンジニア）**: Web開発経験はあるが、3Dグラフィックスは初心者
- **佐藤先輩（ベテランエンジニア）**: Three.jsやWebGLに詳しい経験豊富なエンジニア

---

## 第1章：3Dグラフィックスの世界へようこそ

**田中さん**: 佐藤先輩、main.tsを見てみたんですが、正直何をやっているのかさっぱりわからなくて...

**佐藤先輩**: そうだね、いきなりコードを見ても分からないと思う。まずは3Dグラフィックスの基本概念から説明しよう。

**田中さん**: はい、お願いします！

**佐藤先輩**: まず、3Dの世界を作るには3つの要素が必要なんだ：
1. **シーン（Scene）**: 3Dオブジェクトを配置する「舞台」
2. **カメラ（Camera）**: その舞台を「どこから見るか」を決める視点
3. **レンダラー（Renderer）**: 3Dの世界を2Dの画面に「描画する」エンジン

**田中さん**: なるほど！映画撮影みたいなものですね。

**佐藤先輩**: その通り！では実際にコードを見てみよう。

```typescript
// シーン、カメラ、レンダラーの初期化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
```

**田中さん**: この3行で舞台、カメラ、描画エンジンを作っているんですね！

---

## 第2章：WebGLとThree.jsの関係

**田中さん**: ところで、WebGLとThree.jsって何が違うんですか？

**佐藤先輩**: いい質問だね。WebGLは低レベルな3D描画API（Application Programming Interface）で、直接使うのはとても複雑なんだ。Three.jsはそのWebGLを使いやすくしてくれるライブラリだよ。

**田中さん**: つまり、Three.jsがWebGLの難しい部分を隠してくれているということですか？

**佐藤先輩**: まさにその通り！例えば、WebGLで立方体を一つ表示するだけでも数百行のコードが必要だけど、Three.jsなら数行で済むんだ。

```typescript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**田中さん**: importしているものが3つありますね。

**佐藤先輩**: そうだね：
- `THREE`: Three.jsのメインライブラリ
- `GLTFLoader`: 3Dモデルファイル（GLB/GLTF形式）を読み込むためのツール
- `OrbitControls`: マウスでカメラを操作するためのツール

---

## 第3章：カメラの設定を理解する

**田中さん**: カメラの設定で、数字がたくさん出てきますが...

```typescript
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
```

**佐藤先輩**: PerspectiveCameraの引数は4つあるんだ：
1. **75**: 視野角（Field of View）- 人間の目に近い自然な見え方
2. **window.innerWidth / window.innerHeight**: アスペクト比（縦横比）
3. **0.1**: 近クリップ面 - これより近いものは描画されない
4. **1000**: 遠クリップ面 - これより遠いものは描画されない

**田中さん**: 視野角が大きいとどうなるんですか？

**佐藤先輩**: 視野角が大きいと広角レンズのように広い範囲が見えるけど、歪みが出る。小さいと望遠レンズのように狭い範囲だけど、歪みが少なくなるよ。

---

## 第4章：レンダラーの初期設定

```typescript
// レンダラーの設定
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

**田中さん**: この設定は何をしているんですか？

**佐藤先輩**: 一つずつ説明しよう：

1. `setSize()`: 描画する画面のサイズを設定
2. `setClearColor(0x222222)`: 背景色を設定（濃いグレー）
3. `outputColorSpace`: 色の表現方式を設定（より正確な色表示のため）

**田中さん**: 0x222222って何ですか？

**佐藤先輩**: 16進数でのカラーコードだよ。CSSの#222222と同じ意味。0xは16進数を表すプレフィックスなんだ。

---

## 第5章：DOM要素への描画

```typescript
// コンテナに追加
const container = document.getElementById('container');
if (container) {
    container.appendChild(renderer.domElement);
}
```

**田中さん**: renderer.domElementって何ですか？

**佐藤先輩**: レンダラーが作成したcanvas要素のことだよ。Three.jsは内部でcanvas要素を作って、そこに3Dグラフィックスを描画するんだ。

**田中さん**: なるほど！それをHTMLの'container'要素の中に追加しているんですね。

**佐藤先輩**: その通り！これでWebページ上に3D描画領域が表示されるようになる。

---

## 第6章：カメラの位置とコントロール

```typescript
// カメラの初期位置
camera.position.set(0, 1, 3);

// OrbitControls（マウス操作）
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

**田中さん**: カメラの位置の(0, 1, 3)って何を意味するんですか？

**佐藤先輩**: 3D空間の座標だよ：
- **X軸**: 左右（0 = 中央）
- **Y軸**: 上下（1 = 少し上）
- **Z軸**: 前後（3 = 手前側）

**田中さん**: OrbitControlsは何をするんですか？

**佐藤先輩**: マウスで3Dオブジェクトを回転、拡大縮小、移動できるようにするツールだよ。dampingは動きを滑らかにする設定なんだ。

---

## 第7章：光と影の世界

```typescript
// ライティング
const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // 環境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
```

**田中さん**: なぜ光が必要なんですか？

**佐藤先輩**: 現実世界と同じで、光がないと何も見えないんだ。3Dグラフィックスでは2種類の光を使うことが多い：

1. **環境光（AmbientLight）**: 全体を均等に照らす基本的な明るさ
2. **指向性ライト（DirectionalLight）**: 太陽のように一方向から照らす光

**田中さん**: 0x404040と0xffffffは色ですね？

**佐藤先輩**: そう！0x404040は暗いグレー、0xffffffは白色。後ろの数字（0.6、0.8）は光の強さを表しているよ。

---

## 第8章：3Dモデルの読み込み

```typescript
// GLBファイルを読み込み
const loader = new GLTFLoader();
let mixer: THREE.AnimationMixer | null = null;

loader.load(
    '/arm_light.glb', // GLBファイルのパス
    (gltf) => {
        // 読み込み成功時の処理
    },
    (progress) => {
        // 読み込み進行状況
    },
    (error) => {
        // 読み込みエラー時の処理
    }
);
```

**田中さん**: GLBファイルって何ですか？

**佐藤先輩**: 3Dモデルのファイル形式の一つだよ。Blenderなどの3Dソフトで作成したモデルを、Webブラウザで表示できる形式にしたものなんだ。

**田中さん**: loader.loadの引数が4つもありますね。

**佐藤先輩**: コールバック関数という仕組みを使っているんだ：
1. ファイルパス
2. 成功時に実行する関数
3. 進行状況を報告する関数
4. エラー時に実行する関数

---

## 第9章：モデルの配置と調整

```typescript
// 読み込み成功時の処理
(gltf) => {
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
}
```

**田中さん**: この部分が一番複雑に見えますが...

**佐藤先輩**: やっていることは意外とシンプルだよ：

1. **Box3**: モデル全体を囲む見えない箱を作る
2. **size**: その箱の大きさを測る
3. **center**: その箱の中心点を見つける
4. **position.sub(center)**: モデルを画面の中央に移動
5. **camera.position.set()**: モデルのサイズに応じてカメラの位置を調整

**田中さん**: なるほど！どんなサイズのモデルでも適切に表示されるようにしているんですね。

---

## 第10章：アニメーションシステム

```typescript
// アニメーションがある場合は再生
if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        mixer!.clipAction(clip).play();
    });
}
```

**田中さん**: AnimationMixerって何ですか？

**佐藤先輩**: 3Dモデルのアニメーション（動き）を管理するシステムだよ。例えば、ロボットの腕が動いたり、キャラクターが歩いたりするアニメーションを再生できるんだ。

**田中さん**: forEach文でclip.playしているのは？

**佐藤先輩**: 一つのモデルに複数のアニメーション（歩く、走る、ジャンプなど）が含まれている場合があるから、全部再生しているんだ。

---

## 第11章：レスポンシブ対応

```typescript
// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**田中さん**: なぜウィンドウリサイズに対応する必要があるんですか？

**佐藤先輩**: ブラウザのサイズが変わったとき、3D表示も適切にリサイズする必要があるんだ。特にアスペクト比（縦横比）が変わると、モデルが歪んで見えてしまうからね。

**田中さん**: updateProjectionMatrix()は何をしているんですか？

**佐藤先輩**: カメラの設定が変わったことをThree.jsに知らせているんだ。これを呼ばないと、変更が反映されないよ。

---

## 第12章：アニメーションループの心臓部

```typescript
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
```

**田中さん**: なぜ関数が自分自身を呼び出しているんですか？

**佐藤先輩**: これが3Dグラフィックスの心臓部なんだ！`requestAnimationFrame`は1秒間に約60回この関数を呼び出すから、滑らかなアニメーションが実現できるんだよ。

**田中さん**: 0.016という数字は？

**佐藤先輩**: 1/60秒のことだね。60FPSで動かすための時間間隔を表している。これでアニメーションの速度を制御しているんだ。

---

## 第13章：エラーハンドリングとユーザビリティ

```typescript
// 読み込みエラー時の処理
(error) => {
    console.error('GLBファイルの読み込みエラー:', error);
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.innerHTML = 'エラー: GLBファイルが見つかりません';
        loadingElement.style.color = '#ff6b6b';
    }
}
```

**田中さん**: エラー処理も重要なんですね。

**佐藤先輩**: そうだね。特に3Dモデルファイルは大きくて読み込みに時間がかかったり、ファイルが見つからなかったりすることがあるから、ユーザーに適切にフィードバックすることが大切なんだ。

---

## まとめ：全体の流れ

**田中さん**: 全体を通して見ると、どんな流れになっているんですか？

**佐藤先輩**: いい質問だね。全体の流れをまとめると：

1. **準備段階**: シーン、カメラ、レンダラーを作成
2. **設定段階**: 画面サイズ、背景色、色空間を設定
3. **配置段階**: カメラ位置、操作方法、照明を設定
4. **読み込み段階**: 3Dモデルを非同期で読み込み
5. **調整段階**: モデルのサイズと位置を画面に合わせて調整
6. **実行段階**: アニメーションループを開始して描画

**田中さん**: なるほど！段階的に3Dの世界を構築していくんですね。

**佐藤先輩**: その通り！最初は複雑に見えるけど、一つ一つの処理は実はシンプルなんだ。

---

## 発展学習：次のステップ

**田中さん**: もっと学習するには何から始めればいいですか？

**佐藤先輩**: いくつかの方向性があるよ：

### 基礎を固める
- Three.jsの公式ドキュメントを読む
- 簡単な3Dオブジェクト（立方体、球体）から始める
- 異なる種類の照明を試してみる

### 実践的なスキル
- 自分で3Dモデルを作成（Blender等）
- テクスチャやマテリアルの設定
- 物理演算の追加

### 高度なテクニック
- シェーダーの作成
- パフォーマンス最適化
- VR/AR対応

**田中さん**: ありがとうございます！まずは公式ドキュメントから始めてみます。

**佐藤先輩**: それが一番だね。分からないことがあったらいつでも聞いてね！

---

## 付録：よく使用されるThree.jsの概念

### ジオメトリ（Geometry）
3Dオブジェクトの形状データ（頂点、面の情報）

### マテリアル（Material）
3Dオブジェクトの表面の見た目（色、質感、反射率など）

### メッシュ（Mesh）
ジオメトリとマテリアルを組み合わせた、実際に表示される3Dオブジェクト

### ベクトル（Vector）
3D空間での位置や方向を表現する数学的概念

---

*このガイドが、あなたのThree.js学習の第一歩になれば幸いです！*
