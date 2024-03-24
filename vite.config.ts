// import { resolve } from 'path'
import path from 'path';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import banner from 'vite-plugin-banner'
import pkg from './package.json'

export default defineConfig({
    define: {
        __VERSION__: JSON.stringify(require('./package.json').version),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        open: '/playground/index.html',
    },
    build: {
        target: 'es6',
        minify: false,
        lib: {
            // entry: path.resolve(__dirname, 'src/index.ts'),
            entry : '',
            name : 'SCDB',
            // formats: ['umd', 'es'],
            // fileName: 'viewer',
        },
        rollupOptions: {
            external(id, parentId, isResolved) {
                return id.startsWith('@pixi/');
            },
            output: {
                extend: true,
                globals(id: string) {
                    if (id.startsWith('@pixi/')) {
                        return require(`./node_modules/${id}/package.json`).namespace ?? 'PIXI';
                    }
                },
            },
        }
    },
    plugins: [
        dts({
            insertTypesEntry : true,
            // rollupTypes: true
        }),
        banner(
            `/**\n * name: ${pkg.name}\n * version: ${pkg.version}\n * author: ${pkg.author}\n */`
        )
    ],
})