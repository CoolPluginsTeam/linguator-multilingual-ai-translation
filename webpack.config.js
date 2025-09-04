import path from 'path';
import { fileURLToPath } from 'url';
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createConfig({ srcDir, outDir, sourceFiles }, minimize = false, generateAssets = false) {
    const entry = {};
    sourceFiles.forEach(filename => {
        const entryName = minimize ? `${filename}.min` : filename;
        entry[entryName] = `./${srcDir}/${filename}.js`;
    });

    const plugins = [];
    if (generateAssets) {
        plugins.push(
            new DependencyExtractionWebpackPlugin({
                injectPolyfill: true,
                combineAssets: false,
            })
        );
    }

    return {
        mode: minimize ? 'production' : 'development',
        entry,
        output: {
            path: path.resolve(__dirname, outDir),
            filename: '[name].js',
            clean: false,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
                                    }
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }
                }
            ]
        },
        externals: {
            'jquery': 'jQuery',
            'wp': 'wp',
            'lodash': 'lodash'
        },
        optimization: {
            minimize: minimize,
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [
                path.resolve(__dirname, srcDir),
                'node_modules'
            ]
        },
        plugins: plugins,
        stats: {
            assets: true,
            modules: false,
            children: false
        }
    };
}

const configs = [
	{
		srcDir: 'js/src',
		outDir: 'Admin/Assets/js/build',
		sourceFiles: [
			'admin',
			'block-editor',
			'classic-editor',
			'media',
			'nav-menu',
			'post',
			'settings',
			'term',
			'widgets',
			'user',
			'blocks'
			
		]
	},
	// Editors builds: post editor, site editor and widgets editor
	{
		srcDir: 'js/src/editors',
		outDir: 'Admin/Assets/js/build/editors',
		sourceFiles: [
			'post',
			'site',
			'widget'
		]
	},
	{
		srcDir: 'Settings/Views/src',
		outDir: 'Admin/Assets/frontend/settings',
		sourceFiles: [
			'settings'
		]
	},
	{
		srcDir: 'modules/wizard/src',
		outDir: 'Admin/Assets/frontend/setup',
		sourceFiles: [
			'setup'
		]
	}
];

export default (env, options) => {
	// Admin JS gets both regular and minified (no assets)
	const mainBuilds = [
		createConfig(configs[0], false, false), // admin: regular .js, no assets
		createConfig(configs[0], true, false)   // admin: minified .min.js, no assets
	];

	// Editors builds (post/site/widget) need WP externals (react, wp.*), so enable dependency extraction
	const editorBuilds = [
		createConfig(configs[1], false, true), // editors: regular .js, with assets (deps extraction)
		createConfig(configs[1], true, true)   // editors: minified .min.js, with assets (deps extraction)
	];

	// Other configs get only regular (non-minified) .js with assets
	const assetBuilds = configs.slice(2).map(cfg => createConfig(cfg, false, true));

	return [...mainBuilds, ...editorBuilds, ...assetBuilds];
};
