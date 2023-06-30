const { build } = require('vite');
const path = require('path');

const entries = [
    { entry: 'src/index.ts', name: 'scdb-eventviewer' }
];

const profiles = entries.flatMap(({ entry, name }) =>
    [false, true].map((minify) => ({
        build: {
            emptyOutDir: false,
            minify: minify && 'terser',
            lib: {
                formats: minify ? ['umd'] : ['umd', 'es'],
                entry: path.resolve(entry),
                fileName: (format) => `${name}${format === 'umd' ? (minify ? '.min' : '') : '.' + format}.js`,
            },
        },
    }))
);

async function main() {
    for (const profile of profiles) {
        console.log('\n' + `Building profile: ${profile.build.lib.fileName('umd')}`);

        await build(profile);
    }
}

main();