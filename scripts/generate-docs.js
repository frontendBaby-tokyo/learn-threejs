import { marked } from 'marked';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Markedの設定
marked.setOptions({
    breaks: true,
    gfm: true
});

/**
 * READMEファイルをHTMLに変換する関数
 * @param {string} readmePath - README.mdファイルのパス
 * @param {string} outputPath - 出力HTMLファイルのパス
 * @param {string} title - ページタイトル
 */
function convertReadmeToHtml(readmePath, outputPath, title) {
    try {
        // README.mdを読み込み
        const markdownContent = readFileSync(readmePath, 'utf-8');
        
        // MarkdownをHTMLに変換
        const htmlContent = marked(markdownContent);
        
        // HTMLテンプレートを読み込み
        const templatePath = join(__dirname, '..', 'docs', 'template.html');
        let template = readFileSync(templatePath, 'utf-8');
        
        // テンプレートの置換
        template = template
            .replace(/{{TITLE}}/g, title)
            .replace('{{CONTENT}}', htmlContent);
        
        // HTMLファイルを出力
        writeFileSync(outputPath, template);
        
        console.log(`✅ ${title} の解説ページを生成しました: ${outputPath}`);
    } catch (error) {
        console.error(`❌ ${title} の変換でエラーが発生しました:`, error.message);
    }
}

// メイン処理
function main() {
    console.log('📚 README ファイルを HTML に変換中...\n');
    
    const rootDir = join(__dirname, '..');
    
    const conversions = [
        {
            readmePath: join(rootDir, 'examples', 'basic-scene', 'README.md'),
            outputPath: join(rootDir, 'docs', 'basic-scene.html'),
            title: 'Basic Scene - 基本的な3Dシーン'
        },
        {
            readmePath: join(rootDir, 'examples', 'glb-viewer', 'README.md'),
            outputPath: join(rootDir, 'docs', 'glb-viewer.html'),
            title: 'GLB Viewer - 3Dモデルビューア'
        }
    ];
    
    conversions.forEach(({ readmePath, outputPath, title }) => {
        convertReadmeToHtml(readmePath, outputPath, title);
    });
    
    console.log('\n🎉 全ての変換が完了しました！');
    console.log('📖 生成されたドキュメント:');
    conversions.forEach(({ outputPath, title }) => {
        console.log(`   - ${title}: ${outputPath}`);
    });
}

// スクリプトが直接実行された場合のみmain関数を実行
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { convertReadmeToHtml };
