import type {Plugin, ViteDevServer} from 'vite'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import {viteSingleFile} from 'vite-plugin-singlefile'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, __dirname, '')
    const mdFilePath = path.resolve(__dirname, env.VITE_MD_FILE_PATH)
    const assetsDir = path.resolve(__dirname, env.VITE_ASSETS_PATH || '../assets')

    function serveAssetsMiddleware(server: ViteDevServer) {
        server.middlewares.use('/assets', (req, res, next) => {
            const decodedUrl = decodeURIComponent(req.url || '')
            const filePath = path.join(assetsDir, decodedUrl)
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase()
                const mime: Record<string, string> = {
                    '.mp4': 'video/mp4',
                    '.webm': 'video/webm',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml',
                    '.webp': 'image/webp',
                }
                res.setHeader('Content-Type', mime[ext] || 'application/octet-stream')
                fs.createReadStream(filePath).pipe(res)
            } else {
                next()
            }
        })
    }

    function copyAssetsPlugin(): Plugin {
        return {
            name: 'copy-assets-plugin',
            closeBundle() {
                const distRoot = path.resolve(__dirname, 'dist')
                const assetsDir = path.join(distRoot, 'assets')
                if (!fs.existsSync(assetsDir)) {
                    fs.mkdirSync(assetsDir, {recursive: true})
                }

                // 移动 index.html 到 dist/assets/
                const distHtml = path.join(distRoot, 'index.html')
                if (fs.existsSync(distHtml)) {
                    fs.renameSync(distHtml, path.join(assetsDir, 'index.html'))
                }

                // 复制项目资源文件到 dist/assets/
                const sourceAssetsDir = path.resolve(__dirname, env.VITE_ASSETS_PATH)
                if (fs.existsSync(sourceAssetsDir)) {
                    const files = fs.readdirSync(sourceAssetsDir)
                    for (const file of files) {
                        const srcFile = path.join(sourceAssetsDir, file)
                        const destFile = path.join(assetsDir, file)
                        if (fs.statSync(srcFile).isFile() && !fs.existsSync(destFile)) {
                            fs.copyFileSync(srcFile, destFile)
                        }
                    }
                }

                // 补充复制 public/ 资源到 dist/assets/（不覆盖已有的）
                const publicDir = path.resolve(__dirname, 'public')
                if (fs.existsSync(publicDir)) {
                    const files = fs.readdirSync(publicDir)
                    for (const file of files) {
                        const dest = path.join(assetsDir, file)
                        if (!fs.existsSync(dest)) {
                            fs.copyFileSync(path.join(publicDir, file), dest)
                        }
                    }
                }

                // 复制 MD 到 dist/ 根目录
                const mdFileName = path.basename(mdFilePath)
                fs.copyFileSync(mdFilePath, path.join(distRoot, mdFileName))

                // 清理 Vite 自动复制的 public/favicon.png（已在 assets/ 中）
                for (const name of ['favicon.png']) {
                    const f = path.join(distRoot, name)
                    if (fs.existsSync(f)) fs.unlinkSync(f)
                }

                // 复制 serve.ps1 到 dist/assets/
                const ps1Src = path.resolve(__dirname, 'scripts/serve.ps1')
                if (fs.existsSync(ps1Src)) {
                    fs.copyFileSync(ps1Src, path.join(assetsDir, 'serve.ps1'))
                }

                // 复制 start.bat 到 dist/
                const batSrc = path.resolve(__dirname, 'scripts/start.bat')
                if (fs.existsSync(batSrc)) {
                    fs.copyFileSync(batSrc, path.join(distRoot, 'start.bat'))
                }
            },
        }
    }

    function mdSlidesPlugin(): Plugin {
        const virtualModuleId = 'virtual:slides'
        const resolvedId = '\0' + virtualModuleId

        return {
            name: 'md-slides-plugin',
            resolveId(id) {
                if (id === virtualModuleId) return resolvedId
            },
            load(id) {
                if (id === resolvedId) {
                    let content = fs.readFileSync(mdFilePath, 'utf-8')
                    // Markdown 中的资源路径保持为 ./assets/
                    return `export default ${JSON.stringify(content)}`
                }
            },
            transformIndexHtml(html, ctx) {
                // 构建后 index.html 在 assets/ 子目录，favicon 路径需调整
                if (ctx.bundle) {
                    html = html.replace('./favicon.png', './assets/favicon.png')
                }
                // 标题去掉 .md 后缀
                return html.replace(
                    /<title>.*?<\/title>/,
                    `<title>${path.basename(mdFilePath, '.md')}</title>`,
                )
            },
            configureServer(server: ViteDevServer) {
                // 直接提供 MD 原始文件（dev 模式下 polling fetch 需要）
                const mdFileName = path.basename(mdFilePath)
                server.middlewares.use(`/${mdFileName}`, (_req, res) => {
                    const content = fs.readFileSync(mdFilePath, 'utf-8')
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                    res.end(content)
                })
                serveAssetsMiddleware(server)
                server.watcher.add(mdFilePath)
                const reloadModule = () => {
                    const mod = server.moduleGraph.getModuleById(resolvedId)
                    if (mod) {
                        server.moduleGraph.invalidateModule(mod)
                    }
                    server.ws.send({type: 'full-reload'})
                }
                server.watcher.on('change', (file) => {
                    if (file === mdFilePath) reloadModule()
                })
            },
            configurePreviewServer(server) {
                serveAssetsMiddleware(server as ViteDevServer)
            },
        }
    }

    return {
        base: './', // 使用相对路径
        plugins: [
            vue(),
            tailwindcss(),
            AutoImport({
                imports: ['vue'],
                dts: 'auto-imports.d.ts',
            }),
            Components({
                dts: 'components.d.ts',
                dirs: ['src/components', 'src/layouts'],
            }),
            mdSlidesPlugin(),
            copyAssetsPlugin(),
            viteSingleFile(), // 将所有资源内联到 HTML 中
        ],
        server: {
            open: true,
            fs: {
                allow: ['..'],
            },
        },
        build: {
            outDir: 'dist', // 构建产物输出到 dist
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    inlineDynamicImports: true,
                    manualChunks: undefined,
                },
            },
        },
    }
})
