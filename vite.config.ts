import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const mdFilePath = path.resolve(__dirname, env.VITE_MD_FILE_PATH)
  const assetsDir = path.resolve(__dirname, env.VITE_ASSETS_PATH || '../assets')

  function serveAssetsMiddleware(server: ViteDevServer) {
    server.middlewares.use('/assets', (req, res, next) => {
      const filePath = path.join(assetsDir, req.url || '')
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
        
        // 复制所有资源文件到 dist/assets（包括 favicon.png）
        const assetsDir = path.join(distRoot, 'assets')
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true })
        }
        const sourceAssetsDir = path.resolve(__dirname, env.VITE_ASSETS_PATH || '../assets')
        const files = fs.readdirSync(sourceAssetsDir)
        for (const file of files) {
          const srcFile = path.join(sourceAssetsDir, file)
          const destFile = path.join(assetsDir, file)
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile)
          }
        }
        
        // 复制 public/favicon.png 到 dist/assets/
        const faviconSrc = path.resolve(__dirname, 'public/favicon.png')
        const faviconDest = path.join(assetsDir, 'favicon.png')
        if (fs.existsSync(faviconSrc)) {
          fs.copyFileSync(faviconSrc, faviconDest)
        }
        
        // 复制 Markdown 文件到 dist 根目录（供 File API 重新加载使用）
        const mdFileName = path.basename(mdFilePath)
        const destMdFile = path.join(distRoot, mdFileName)
        fs.copyFileSync(mdFilePath, destMdFile)

        // 删除 Vite 自动复制到 dist 根目录的 favicon.png
        const rootFavicon = path.join(distRoot, 'favicon.png')
        if (fs.existsSync(rootFavicon)) {
          fs.unlinkSync(rootFavicon)
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
      configureServer(server: ViteDevServer) {
        serveAssetsMiddleware(server)
        server.watcher.add(mdFilePath)
        const reloadModule = () => {
          const mod = server.moduleGraph.getModuleById(resolvedId)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
          }
          server.ws.send({ type: 'full-reload' })
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
      }),
      mdSlidesPlugin(),
      copyAssetsPlugin(),
      viteSingleFile(), // 将所有资源内联到 HTML 中
    ],
    server: {
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
