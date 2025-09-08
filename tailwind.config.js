import withTW from "@bsf/force-ui/withTW";

/** @type {import('tailwindcss').Config} */
export default withTW({
    mode: 'jit',
	content: [ 
		'./Admin/Settings/Views/src/**/*.{js,jsx}',
		'./modules/wizard/src/**/*.{js,jsx}',
		'node_modules/@bsf/force-ui/dist/force-ui.js'  // Include force-ui content explicitly
	],
	theme: {
		extend: {
			colors: {
                                // Override @bsf/force-ui library colors.
				'button-primary': '#6B21A8',
				'button-primary-hover': '#7E22CE',
				'brand-800': '#6B21A8',
				'brand-50': '#FAF5FF',
				'border-interactive': '#6B21A8',
				focus: '#9333EA',
				'focus-border': '#D8B4FE',
				'toggle-on': '#6B21A8',
				'toggle-on-border': '#C084FC',
				'toggle-on-hover': '#A855F7',
                'deactivated': '#EDEDED',
				'installed': '#CFD5D1'
			},
			fontSize: {
				xxs: '0.6875rem', // 11px
			},
			lineHeight: {
				2.6: '0.6875rem', // 11px
			},
			boxShadow: {
				'content-wrapper':
					'0px 1px 1px 0px #0000000F, 0px 1px 2px 0px #0000001A',
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
	important: '.lmat-styles',
} );

