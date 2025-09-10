// webpack.config.js (corrected)

import path from 'path';
import { fileURLToPath } from 'url';
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import defaultConfig from '@wordpress/scripts/config/webpack.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * createConfig
 * @param {Object} cfg
 * @param {string} cfg.srcDir
 * @param {string} cfg.outDir
 * @param {string[]} cfg.sourceFiles
 * @param {Object} [opts]
 * @param {boolean} [opts.fileMinimize=false]  // only affects filename suffix ".min"
 * @param {boolean} [opts.minimize=false]      // controls actual minification + production mode
 * @param {boolean} [opts.generateAssets=false]// enable DependencyExtractionWebpackPlugin
 * @param {'.js'|'.ts'|string} [opts.ext='.js']
 * @param {boolean} [opts.styleLoader=false]   // add CSS pipeline for inline translation UIs
 */
function createConfig({ srcDir, outDir, sourceFiles }, opts = {}) {
  const {
    fileMinimize = false,
    minimize = false,
    generateAssets = false,
    ext = '.js',
    styleLoader = false,
  } = opts;

  const entry = {};
  sourceFiles.forEach((filename) => {
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

  const rules = [];

  if (styleLoader) {
    // Optional: reuse any plugins Gutenberg tooling expects (non-breaking if empty)
    if (Array.isArray(defaultConfig?.plugins)) {
      plugins.push(...defaultConfig.plugins);
    }

    rules.push({
      test: /\.css$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { modules: true, importLoaders: 1 },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: { plugins: [['postcss-preset-env']] },
          },
        },
      ],
    });
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
        ...rules,
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
                    },
                  },
                ],
                '@babel/preset-react',
              ],
            },
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    externals: {
      jquery: 'jQuery',
      wp: 'wp',
      lodash: 'lodash',
    },
    optimization: {
      minimize,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [path.resolve(__dirname, srcDir), 'node_modules'],
      alias: {
        '@linguator-icon.svg': path.resolve(__dirname, 'Assets/logo/linguator-icon.svg'),
        '@linguator-menu-icon.svg': path.resolve(__dirname, 'Assets/logo/lmat_menu_icon.svg'),
      },
    },
    plugins,
    stats: {
      assets: true,
      modules: false,
      children: false,
    },
  };
}

/** Base groups **/
const configs = [
  {
    srcDir: 'Assets/js/src',
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
      'blocks',
    ],
  },
  // Editors builds: post editor, site editor and widgets editor
  {
    srcDir: 'Assets/js/src/editors',
    outDir: 'Admin/Assets/js/build/editors',
    sourceFiles: ['post', 'site', 'widget'],
  },
  {
    srcDir: 'Admin/Settings/Views/src',
    outDir: 'Admin/Assets/frontend/settings',
    sourceFiles: ['settings'],
  },
  {
    srcDir: 'Modules/wizard/src',
    outDir: 'Admin/Assets/frontend/setup',
    sourceFiles: ['setup'],
  },
];

/** Inline translation builds **/
const machineTranslationConfigs = [
  {
    srcDir: 'Modules/inline-translation/src/elementor',
    outDir: 'Admin/Assets/elementor-inline-translate',
    sourceFiles: ['index'],
    styleLoader: true,
    generateAssets: false,
    ext: '.js',
  },
  {
    srcDir: 'Modules/inline-translation/src/gutenberg/editorAssets',
    outDir: 'Admin/Assets/gutenberg-inline-translate',
    sourceFiles: ['index'],
    styleLoader: true,
    generateAssets: false,
    ext: '.ts',
  },
];

export default (env, options) => {
  // Allow full handoff to @wordpress/scripts when explicitly requested
  if (env && env.configType === 'default') {
    return defaultConfig;
  }

  // Inline translation bundles (Elementor & Gutenberg editor assets)
  if (env && env.type === 'inlineTranslate') {
    return machineTranslationConfigs.map((cfg) =>
      createConfig(cfg, {
        fileMinimize: false,
        minimize: true, // production build for these UIs
        generateAssets: cfg.generateAssets ?? false,
        ext: cfg.ext ?? '.js',
        styleLoader: !!cfg.styleLoader,
      })
    );
  }

  // --- Admin JS (js/src): want both .js (dev) and .min.js (prod, actually minified), no assets
  const mainBuilds = [
    createConfig(configs[0], {
      fileMinimize: false, // "admin.js"
      minimize: false, // development
      generateAssets: false,
      ext: '.js',
    }),
    createConfig(configs[0], {
      fileMinimize: true, // "admin.min.js"
      minimize: true, // <-- ACTUALLY MINIFY
      generateAssets: false,
      ext: '.js',
    }),
  ];

  // --- Editors (post/site/widget): need WP externals mapping via dependency extraction
  const editorBuilds = [
    createConfig(configs[1], {
      fileMinimize: false,
      minimize: false,
      generateAssets: true, // asset/deps extraction
      ext: '.js',
    }),
    createConfig(configs[1], {
      fileMinimize: true,
      minimize: true,
      generateAssets: true, // asset/deps extraction
      ext: '.js',
    }),
  ];

  // --- Other frontend assets: single regular .js with dependency extraction
  const assetBuilds = configs.slice(2).map((cfg) =>
    createConfig(cfg, {
      fileMinimize: false,
      minimize: false,
      generateAssets: true,
      ext: '.js', // <-- important: pass a real extension, not boolean
    })
  );

  return [...mainBuilds, ...editorBuilds, ...assetBuilds];
};
