import path from 'path';
import { fileURLToPath } from 'url';
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import defaultConfig from "@wordpress/scripts/config/webpack.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createConfig({ srcDir, outDir, sourceFiles },fileMinimize = false, minimize = false, generateAssets = false, ext = '.js', styleLoader = false) {
    const entry = {};
    sourceFiles.forEach(filename => {
        const entryName = fileMinimize ? `${filename}.min` : filename;
        entry[entryName] = `./${srcDir}/${filename}${ext}`;
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

    let conditionalRules = [];

    if (styleLoader) {
        plugins.push(...defaultConfig.plugins);
        
        const styleLoaderRule = {
            test: /\.css$/i,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  importLoaders: 1,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [["postcss-preset-env"]],
                  },
                },
              },
            ],
          };

        conditionalRules.push(styleLoaderRule);
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
                ...conditionalRules,
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
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
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
            'user'
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

const machineTranslationConfigs = [
    {
        srcDir: 'modules/inline-translation/src/elementor',
        outDir: 'Admin/Assets/elementor-inline-translate',
        sourceFiles: [
            'index'
        ],
        styleLoader: true,
        generateAssets: false
    },
    {
        srcDir: 'modules/inline-translation/src/gutenberg/editorAssets',
        outDir: 'Admin/Assets/gutenberg-inline-translate',
        sourceFiles: [
            'index'
        ],
        styleLoader: true,
        generateAssets: false,
        ext: '.ts'
    }
];

export default (env, options) => {

    if(env && env.configType === 'default'){
        return defaultConfig;
    }

    if (env && env.type === 'inlineTranslate') {
        return machineTranslationConfigs.map(cfg => createConfig(cfg, false, true, cfg.generateAssets, cfg.ext, cfg.styleLoader));
    }

    // Only first config (output1) gets both regular and minified (no assets)
    const mainBuilds = [
        createConfig(configs[0], false, false), // regular .js, no assets
        createConfig(configs[0], true, false)   // minified .min.js, no assets
    ];
    // Other configs get only regular (non-minified) .js with assets
    const assetBuilds = configs.slice(1).map(cfg => createConfig(cfg, false, false, true));

    return [...mainBuilds, ...assetBuilds];
};